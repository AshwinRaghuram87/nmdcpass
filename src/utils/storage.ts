import { EntryPass, ProcedureStage, DESIGNATED_GATES } from '../types';
import { INITIAL_PASSES } from '../data/initialPasses';

const STORAGE_KEY = 'amnex_nmdc_entry_passes_v3_clean';

export function normalizePasses(parsed: any[]): EntryPass[] {
  if (!Array.isArray(parsed) || parsed.length === 0) return [];
  const today = new Date().toISOString().split('T')[0];

  return parsed.map((p: any) => {
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

    const departmentOrProject = p.departmentOrProject || 'C&IT';

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
      return normalizePasses(INITIAL_PASSES);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return normalizePasses(INITIAL_PASSES);
    }
    return normalizePasses(parsed);
  } catch (err) {
    console.error('Failed to read passes from localStorage', err);
    return normalizePasses(INITIAL_PASSES);
  }
}

/**
 * Synchronously writes to localStorage and returns a promise for cloud sync
 */
export function saveStoredPasses(passes: EntryPass[]): Promise<boolean> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
  } catch (err) {
    console.error('Failed to save passes to localStorage', err);
  }

  // Push to serverless database endpoint
  return syncPassesToCloud(passes);
}

export interface CloudFetchResult {
  source: 'vercel_postgres' | 'vercel_kv' | 'local_fallback' | 'error';
  passes: EntryPass[];
  connected: boolean;
  message?: string;
}

/**
 * Fetch latest passes from cloud (Postgres / Neon / KV)
 */
export async function fetchPassesFromCloud(): Promise<CloudFetchResult> {
  try {
    const response = await fetch('/api/passes', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return {
        source: 'error',
        passes: loadStoredPasses(),
        connected: false,
        message: `HTTP ${response.status}: Failed to reach /api/passes`
      };
    }

    const data = await response.json();
    const isCloudConnected = data.source === 'vercel_postgres' || data.source === 'vercel_kv';

    if (data && Array.isArray(data.passes)) {
      const normalized = normalizePasses(data.passes);
      // Keep local storage fresh with cloud source
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (e) {
        // ignore
      }
      return {
        source: data.source,
        passes: normalized,
        connected: isCloudConnected,
        message: data.message
      };
    }

    return {
      source: data.source || 'local_fallback',
      passes: loadStoredPasses(),
      connected: isCloudConnected,
      message: data.message
    };
  } catch (err: any) {
    console.warn('API /api/passes not reachable, running locally:', err);
    return {
      source: 'local_fallback',
      passes: loadStoredPasses(),
      connected: false,
      message: err?.message || 'Network error'
    };
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
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ passes })
    });

    if (!response.ok) {
      console.warn(`Cloud sync responded with HTTP ${response.status}`);
      return false;
    }
    const res = await response.json();
    return res.status === 'success';
  } catch (err) {
    console.warn('Cloud sync could not reach /api/passes:', err);
    return false;
  }
}

export function clearAllPasses(): EntryPass[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  syncPassesToCloud([]).catch(() => {});
  return [];
}

export function resetToDefaultPasses(): EntryPass[] {
  return clearAllPasses();
}
