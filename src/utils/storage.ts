import { EntryPass, ProcedureStage, DESIGNATED_GATES } from '../types';
import { INITIAL_PASSES } from '../data/initialPasses';

const STORAGE_KEY = 'amnex_nmdc_entry_passes_v3_clean';

export function normalizePasses(parsed: any[]): EntryPass[] {
  if (!Array.isArray(parsed) || parsed.length === 0) return [];
  const today = new Date().toISOString().split('T')[0];

  return parsed.map((p: any) => {
    // Normalize designated gate
    let gateNumber = p.gateNumber || 'DIOM';
    if (gateNumber.includes('Gate No. 1') || gateNumber.includes('Admin')) {
      gateNumber = 'Admin Building';
    } else if (gateNumber.includes('Gate No. 2') || gateNumber.includes('Workforce')) {
      gateNumber = 'DIOM';
    } else if (gateNumber.includes('Gate No. 3') || gateNumber.includes('Logistics')) {
      gateNumber = 'PPT';
    } else if (gateNumber.includes('Gate No. 4') || gateNumber.includes('Plant')) {
      gateNumber = 'KIOM';
    }
    if (!DESIGNATED_GATES.includes(gateNumber as any)) {
      gateNumber = 'DIOM';
    }

    // Normalize department default
    const departmentOrProject = p.departmentOrProject || 'C&IT';

    // Normalize procedureStage
    let procedureStage: ProcedureStage = p.procedureStage;
    if (!procedureStage) {
      if (p.approvedDocument || p.cisfVerified) {
        procedureStage = 'Pass Obtained';
      } else if (p.status === 'Approved') {
        procedureStage = 'Submitted to CISF';
      } else if (p.status === 'Pending Approval') {
        procedureStage = 'Submitted to C&IT';
      } else {
        procedureStage = 'Pass Prepared';
      }
    }

    let validityStatus: 'Active' | 'Expiring Soon' | 'Expired' = p.validityStatus || 'Active';
    if (p.validTo) {
      const diffDays = Math.ceil((new Date(p.validTo).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        validityStatus = 'Expired';
      } else if (diffDays <= 5) {
        validityStatus = 'Expiring Soon';
      } else {
        validityStatus = 'Active';
      }
    }

    return {
      ...p,
      gateNumber,
      departmentOrProject,
      procedureStage,
      validityStatus
    };
  });
}

/**
 * Synchronous local storage read for instant initial UI render
 */
export function loadStoredPasses(): EntryPass[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      saveStoredPasses([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    return normalizePasses(parsed);
  } catch (err) {
    console.error('Failed to read passes from localStorage', err);
    return [];
  }
}

/**
 * Synchronously writes to localStorage and asynchronously syncs to Vercel KV cloud
 */
export function saveStoredPasses(passes: EntryPass[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
  } catch (err) {
    console.error('Failed to save passes to localStorage', err);
  }

  // Asynchronously push to Vercel KV endpoint
  syncPassesToCloud(passes).catch((err) => {
    // Non-blocking: will retry next time or stay cached in browser
    console.debug('Cloud sync queued', err);
  });
}

/**
 * Fetch latest passes from Vercel KV
 */
export async function fetchPassesFromCloud(): Promise<{ source: string; passes: EntryPass[] } | null> {
  try {
    const response = await fetch('/api/passes', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.passes && Array.isArray(data.passes)) {
      const normalized = normalizePasses(data.passes);
      // Update local storage cache
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (e) {
        // ignore
      }
      return { source: data.source || 'vercel_kv', passes: normalized };
    }
    return null;
  } catch (err) {
    console.debug('No serverless KV active, keeping local cache', err);
    return null;
  }
}

/**
 * Asynchronously sends passes array to /api/passes
 */
export async function syncPassesToCloud(passes: EntryPass[]): Promise<boolean> {
  try {
    const response = await fetch('/api/passes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ passes })
    });

    if (!response.ok) return false;
    const res = await response.json();
    return res.status === 'success';
  } catch (err) {
    return false;
  }
}

export function clearAllPasses(): EntryPass[] {
  saveStoredPasses([]);
  return [];
}

export function resetToDefaultPasses(): EntryPass[] {
  saveStoredPasses([]);
  return [];
}
