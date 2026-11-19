import { EntryPass, MaterialItem } from '../types';
import { MASTER_BOQ_ITEMS, MasterBoqItem } from './boqData';
import { extractPassSequenceNumber } from './passUtils';

export interface BoqItemDeliveryBreakdown {
  key: string;
  boqRef: string;
  itemName: string;
  unit: string;
  totalBoqQty: number | null;
  presentDeliveringQty: number;
  alreadyDeliveredQty: number;
  pendingDeliveryQty: number | null;
  overDeliveredQty: number;
  cumulativeDeliveredQty: number;
  percentDelivered: number | null;
  priorPassNumbers: string[];
}

export interface PassBoqSummary {
  totalBoqLineItems: number;
  totalBoqQty: number | null;
  hasUnknownBoqTotal: boolean;
  presentDeliveringQty: number;
  alreadyDeliveredQty: number;
  pendingDeliveryQty: number | null;
  cumulativeDeliveredQty: number;
  overallPercentDelivered: number | null;
  commonUnit: string | null;
  items: BoqItemDeliveryBreakdown[];
}

/**
 * Extract an exact integer Master BOQ item number from strings like:
 * "1", "#1", "Item #1", "Item 1", "BOQ-1", "BOQ 1", "BOQ #1", "BOQ-ITEM-1", "SL 1"
 * Uses strict end-of-string anchoring so "BOQ-10" never matches "1".
 */
export function extractMasterBoqItemNumber(raw?: string): number | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(?:boq[\s_-]*item|item|boq|sl\.?\s*no\.?|sr\.?\s*no\.?)?[\s#:/-]*(\d+)$/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  return Number.isNaN(num) ? null : num;
}

/**
 * Match a MaterialItem to an entry in MASTER_BOQ_ITEMS by exact description or exact BOQ item number.
 */
export function findMasterBoqItem(item: MaterialItem): MasterBoqItem | null {
  const normalizedName = (item.itemName || '').trim().toLowerCase();
  if (normalizedName) {
    const byName = MASTER_BOQ_ITEMS.find(
      (b) => b.description.trim().toLowerCase() === normalizedName
    );
    if (byName) return byName;
  }

  const fromItemNum = extractMasterBoqItemNumber(item.boqItemNumber);
  if (fromItemNum !== null) {
    const byItemNum = MASTER_BOQ_ITEMS.find((b) => b.itemNumber === fromItemNum);
    if (byItemNum) return byItemNum;
  }

  const fromBoqNum = extractMasterBoqItemNumber(item.boqNumber);
  if (fromBoqNum !== null) {
    const byBoqNum = MASTER_BOQ_ITEMS.find((b) => b.itemNumber === fromBoqNum);
    if (byBoqNum) return byBoqNum;
  }

  return null;
}

/**
 * Determine whether a single MaterialItem is a BOQ item.
 */
export function isBoqMaterialItem(item: MaterialItem, pass?: EntryPass): boolean {
  if (!item) return false;
  if (item.isBoq === false) return false;

  if (findMasterBoqItem(item)) return true;

  if (typeof item.boqTotalQuantity === 'number' && item.boqTotalQuantity > 0) {
    return true;
  }

  const hasExplicitBoqRef = Boolean(item.boqItemNumber?.trim() || item.boqNumber?.trim());
  if (item.isBoq === true && hasExplicitBoqRef) {
    return true;
  }

  if (pass && pass.materialCategory === 'Non-Returnable' && item.isBoq === true) {
    return true;
  }

  return false;
}

/**
 * Determine whether an EntryPass is a BOQ pass.
 */
export function isBoqPass(pass: EntryPass): boolean {
  if (!pass || pass.passType !== 'Materials') return false;
  if (!Array.isArray(pass.materialItems) || pass.materialItems.length === 0) return false;
  return pass.materialItems.some((item) => isBoqMaterialItem(item, pass));
}

/**
 * Canonical grouping key for a BOQ MaterialItem so deliveries across passes
 * (and duplicate lines within the same pass) match reliably.
 */
export function getBoqItemKey(item: MaterialItem): string {
  const master = findMasterBoqItem(item);
  if (master) {
    return `master:${master.itemNumber}`;
  }

  const ref = (item.boqItemNumber || item.boqNumber || '').trim().toLowerCase();
  const name = (item.itemName || '').trim().toLowerCase();
  if (ref && name) return `custom:${ref}|${name}`;
  if (ref) return `custom-ref:${ref}`;
  return `custom-name:${name || item.id}`;
}

/**
 * Resolve total sanctioned BOQ quantity for an item.
 */
export function getItemTotalBoqQty(item: MaterialItem): number | null {
  if (typeof item.boqTotalQuantity === 'number' && item.boqTotalQuantity > 0) {
    return item.boqTotalQuantity;
  }
  const master = findMasterBoqItem(item);
  if (master) {
    return master.totalQuantity;
  }
  return null;
}

/**
 * Chronological comparison: returns true if `candidate` occurred BEFORE `current`.
 * Used so each pass displays an accurate running delivery ledger:
 *   Total BOQ = Already Delivered (prior passes) + Present Delivering (this pass) + Pending Delivery
 */
function isPassChronologicallyBefore(candidate: EntryPass, current: EntryPass): boolean {
  if (candidate.id === current.id) return false;

  const seqA = extractPassSequenceNumber(candidate.passNumber);
  const seqB = extractPassSequenceNumber(current.passNumber);
  if (seqA !== null && seqB !== null && seqA !== seqB) {
    return seqA < seqB;
  }

  const fromA = candidate.validFrom || '';
  const fromB = current.validFrom || '';
  if (fromA && fromB && fromA !== fromB) {
    return fromA < fromB;
  }

  const createdA = candidate.createdAt || '';
  const createdB = current.createdAt || '';
  if (createdA && createdB && createdA !== createdB) {
    return createdA < createdB;
  }

  return candidate.id < current.id;
}

/**
 * Compute already-delivered quantity for a specific Master BOQ item number across all other passes.
 * Used inside PassFormModal when creating/editing a pass.
 */
export function getMasterBoqConsumedQty(
  masterItemNumber: number,
  allPasses: EntryPass[],
  excludePassId?: string
): number {
  const targetKey = `master:${masterItemNumber}`;
  let consumed = 0;

  for (const p of allPasses) {
    if (excludePassId && p.id === excludePassId) continue;
    if (p.passType !== 'Materials' || !Array.isArray(p.materialItems)) continue;

    for (const m of p.materialItems) {
      if (!isBoqMaterialItem(m, p)) continue;
      if (getBoqItemKey(m) === targetKey) {
        consumed += Number(m.quantity) || 0;
      }
    }
  }

  return consumed;
}

/**
 * Compute already-delivered quantity for any BOQ MaterialItem (master or custom) across other passes.
 * If `currentPass` is provided, only counts passes chronologically before `currentPass`;
 * if omitted (e.g. creating a brand-new pass), counts all existing passes.
 */
export function getBoqDeliveredInPriorPasses(
  item: MaterialItem,
  allPasses: EntryPass[],
  currentPass?: EntryPass | null
): { qty: number; passNumbers: string[] } {
  const targetKey = getBoqItemKey(item);
  let qty = 0;
  const passNumbers: string[] = [];

  for (const other of allPasses) {
    if (currentPass) {
      if (other.id === currentPass.id) continue;
      if (!isPassChronologicallyBefore(other, currentPass)) continue;
    }
    if (other.passType !== 'Materials' || !Array.isArray(other.materialItems)) continue;

    let passAdded = 0;
    for (const m of other.materialItems) {
      if (!isBoqMaterialItem(m, other)) continue;
      if (getBoqItemKey(m) === targetKey) {
        passAdded += Number(m.quantity) || 0;
      }
    }

    if (passAdded > 0) {
      qty += passAdded;
      passNumbers.push(other.passNumber);
    }
  }

  return { qty, passNumbers };
}

/**
 * Compute full BOQ delivery summary for a pass (both pass-level totals and item-wise breakdown).
 * Returns null if the pass is not a BOQ pass.
 */
export function computePassBoqSummary(
  pass: EntryPass,
  allPasses: EntryPass[]
): PassBoqSummary | null {
  if (!isBoqPass(pass) || !pass.materialItems) return null;

  const boqItemsOnPass = pass.materialItems.filter((item) => isBoqMaterialItem(item, pass));
  if (boqItemsOnPass.length === 0) return null;

  // Group duplicate BOQ items within the same pass so Total BOQ Qty is never double-counted
  const groupedMap = new Map<
    string,
    {
      sampleItem: MaterialItem;
      boqRef: string;
      itemName: string;
      unit: string;
      totalBoqQty: number | null;
      presentDeliveringQty: number;
    }
  >();

  for (const item of boqItemsOnPass) {
    const key = getBoqItemKey(item);
    const master = findMasterBoqItem(item);
    const itemTotal = getItemTotalBoqQty(item);
    const existing = groupedMap.get(key);

    if (existing) {
      existing.presentDeliveringQty += Number(item.quantity) || 0;
      if (existing.totalBoqQty === null && itemTotal !== null) {
        existing.totalBoqQty = itemTotal;
      }
    } else {
      const boqRef =
        item.boqItemNumber?.trim() ||
        item.boqNumber?.trim() ||
        (master ? `BOQ #${master.itemNumber}` : 'BOQ');

      groupedMap.set(key, {
        sampleItem: item,
        boqRef,
        itemName: item.itemName?.trim() || master?.description || 'BOQ Item',
        unit: item.unit?.trim() || master?.unit || 'Nos',
        totalBoqQty: itemTotal,
        presentDeliveringQty: Number(item.quantity) || 0,
      });
    }
  }

  const items: BoqItemDeliveryBreakdown[] = [];
  let sumTotalBoq = 0;
  let knownTotalCount = 0;
  let hasUnknownBoqTotal = false;
  let sumPresent = 0;
  let sumAlreadyDelivered = 0;
  let sumPending = 0;
  const unitsSet = new Set<string>();

  for (const [key, entry] of groupedMap.entries()) {
    const prior = getBoqDeliveredInPriorPasses(entry.sampleItem, allPasses, pass);
    const alreadyDeliveredQty = prior.qty;
    const presentDeliveringQty = entry.presentDeliveringQty;
    const cumulativeDeliveredQty = alreadyDeliveredQty + presentDeliveringQty;

    let pendingDeliveryQty: number | null = null;
    let overDeliveredQty = 0;
    let percentDelivered: number | null = null;

    if (entry.totalBoqQty !== null && entry.totalBoqQty > 0) {
      pendingDeliveryQty = Math.max(0, entry.totalBoqQty - cumulativeDeliveredQty);
      overDeliveredQty = Math.max(0, cumulativeDeliveredQty - entry.totalBoqQty);
      percentDelivered = Math.min(
        100,
        Math.round((cumulativeDeliveredQty / entry.totalBoqQty) * 100)
      );

      sumTotalBoq += entry.totalBoqQty;
      sumPending += pendingDeliveryQty;
      knownTotalCount += 1;
    } else {
      hasUnknownBoqTotal = true;
    }

    sumPresent += presentDeliveringQty;
    sumAlreadyDelivered += alreadyDeliveredQty;
    if (entry.unit) unitsSet.add(entry.unit);

    items.push({
      key,
      boqRef: entry.boqRef,
      itemName: entry.itemName,
      unit: entry.unit,
      totalBoqQty: entry.totalBoqQty,
      presentDeliveringQty,
      alreadyDeliveredQty,
      pendingDeliveryQty,
      overDeliveredQty,
      cumulativeDeliveredQty,
      percentDelivered,
      priorPassNumbers: prior.passNumbers,
    });
  }

  const totalBoqQty = knownTotalCount > 0 ? sumTotalBoq : null;
  const pendingDeliveryQty = knownTotalCount > 0 ? sumPending : null;
  const cumulativeDeliveredQty = sumAlreadyDelivered + sumPresent;
  const overallPercentDelivered =
    totalBoqQty !== null && totalBoqQty > 0
      ? Math.min(100, Math.round((cumulativeDeliveredQty / totalBoqQty) * 100))
      : null;

  return {
    totalBoqLineItems: items.length,
    totalBoqQty,
    hasUnknownBoqTotal,
    presentDeliveringQty: sumPresent,
    alreadyDeliveredQty: sumAlreadyDelivered,
    pendingDeliveryQty,
    cumulativeDeliveredQty,
    overallPercentDelivered,
    commonUnit: unitsSet.size === 1 ? Array.from(unitsSet)[0] : null,
    items,
  };
}
