import { EntryPass } from '../types';

/**
 * Calculates the next official pass number starting from NMDC/C&IT/15.
 * Scans all existing passes, extracts sequence numbers, and returns the next sequential number.
 */
export function getNextPassNumber(existingPasses: EntryPass[] = []): string {
  let highest = 14;

  for (const p of existingPasses) {
    if (!p.passNumber) continue;

    // Matches 'NMDC/C&IT/15', 'NMDC/C&IT/ 15', 'NMDC-C&IT-15'
    const nmdcMatch = p.passNumber.match(/NMDC[/-]C&IT[/-]\s*(\d+)/i);
    if (nmdcMatch && nmdcMatch[1]) {
      const val = parseInt(nmdcMatch[1], 10);
      if (!isNaN(val) && val > highest) {
        highest = val;
      }
      continue;
    }

    // Matches any trailing number e.g. /15, -15
    const trailingMatch = p.passNumber.match(/(\d+)$/);
    if (trailingMatch && trailingMatch[1]) {
      const val = parseInt(trailingMatch[1], 10);
      if (!isNaN(val) && val >= 15 && val > highest) {
        highest = val;
      }
    }
  }

  return `NMDC/C&IT/${highest + 1}`;
}

/**
 * Formats a pass number for official printouts and displays, ensuring it starts with NMDC/C&IT/
 */
export function formatGatePassNumber(passNumber?: string): string {
  if (!passNumber || !passNumber.trim()) {
    return 'NMDC/C&IT/15';
  }

  const trimmed = passNumber.trim();

  // Already starts with NMDC/C&IT/
  if (/^NMDC\/C&IT\//i.test(trimmed)) {
    return trimmed;
  }

  // Handle NMDC-C&IT-15 or similar
  if (/^NMDC-C&IT-/i.test(trimmed)) {
    return trimmed.replace(/^NMDC-C&IT-/i, 'NMDC/C&IT/');
  }

  // Handle legacy AMN-NMDC- prefixes
  if (/^AMN-NMDC-/i.test(trimmed)) {
    const clean = trimmed.replace(/^AMN-NMDC-(?:EMP|CON|VEH|MAT)-?/i, '');
    return `NMDC/C&IT/${clean || '15'}`;
  }

  // If pure number e.g. '15'
  if (/^\d+$/.test(trimmed)) {
    return `NMDC/C&IT/${trimmed}`;
  }

  return trimmed;
}
