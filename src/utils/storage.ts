import { EntryPass, ProcedureStage, DESIGNATED_GATES } from '../types';
import { INITIAL_PASSES } from '../data/initialPasses';
import { idbSavePasses, idbLoadPasses } from './idbStorage';

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
 * Asynchronously writes to IndexedDB, localStorage (with quota handling), and Cloud Database
 */
export async function saveStoredPasses(passes: EntryPass[]): Promise<boolean> {
  // 1. Always save full records (including attached JPEGs and docs) to IndexedDB
  try {
    await idbSavePasses(passes);
  } catch (err) {
    console.warn('IndexedDB persistence warning:', err);
  }

  // 2. Try writing to localStorage with graceful quota fallback
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
  } catch (err) {
    console.warn('localStorage quota exceeded. Saving lightweight metadata to localStorage while full JPEGs remain safe in IndexedDB & Database:', err);
    try {
      // Store compact version in localStorage if payload is too large
      const compactPasses = passes.map(p => ({
        ...p,
        approvedDocument: p.approvedDocument ? {
          fileName: p.approvedDocument.fileName,
          fileSize: p.approvedDocument.fileSize,
          fileType: p.approvedDocument.fileType,
          uploadedAt: p.approvedDocument.uploadedAt,
          uploadedBy: p.approvedDocument.uploadedBy,
          fileUrl: p.approvedDocument.fileUrl.length > 500 ? '[Stored In Database/IndexedDB]' : p.approvedDocument.fileUrl
        } : undefined,
        billDocument: p.billDocument ? {
          fileName: p.billDocument.fileName,
          fileSize: p.billDocument.fileSize,
          fileType: p.billDocument.fileType,
          uploadedAt: p.billDocument.uploadedAt,
          uploadedBy: p.billDocument.uploadedBy,
          fileUrl: p.billDocument.fileUrl.length > 500 ? '[Stored In Database/IndexedDB]' : p.billDocument.fileUrl
        } : undefined
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compactPasses));
    } catch (compactErr) {
      // Ignore localStorage failure as IndexedDB & backend store the true state
    }
  }

  // 3. Push to server database endpoint
  return syncPassesToCloud(passes);
}

export interface CloudFetchResult {
  source: 'server_database' | 'indexeddb' | 'vercel_postgres' | 'vercel_kv' | 'local_fallback' | 'error';
  passes: EntryPass[];
  connected: boolean;
  message?: string;
}

/**
 * Fetch latest passes from Cloud / Server Database / IndexedDB
 */
export async function fetchPassesFromCloud(): Promise<CloudFetchResult> {
  // 1. Try server endpoint
  try {
    const response = await fetch('/api/passes', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.passes) && data.passes.length > 0) {
        const normalized = normalizePasses(data.passes);
        // Sync to IndexedDB & localStorage
        await idbSavePasses(normalized).catch(() => {});
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch (e) {
          // ignore localStorage quota
        }
        return {
          source: data.source || 'server_database',
          passes: normalized,
          connected: true,
          message: data.message || 'Connected to persistent database'
        };
      }
    }
  } catch (err: any) {
    console.warn('Backend server /api/passes not reachable yet, checking local databases:', err);
  }

  // 2. Check IndexedDB (has full resolution JPEGs from previous sessions)
  try {
    const idbPasses = await idbLoadPasses();
    if (idbPasses && idbPasses.length > 0) {
      const normalized = normalizePasses(idbPasses);
      // Try to seed server database with existing IndexedDB passes in background
      syncPassesToCloud(normalized).catch(() => {});
      return {
        source: 'indexeddb',
        passes: normalized,
        connected: true,
        message: 'Loaded from local persistent database with JPEGs'
      };
    }
  } catch (idbErr) {
    console.warn('IndexedDB check failed:', idbErr);
  }

  // 3. Fallback to localStorage / initial passes
  return {
    source: 'local_fallback',
    passes: loadStoredPasses(),
    connected: false,
    message: 'Local browser storage active'
  };
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
      console.warn(`Database sync responded with HTTP ${response.status}`);
      return false;
    }
    const res = await response.json();
    return res.status === 'success';
  } catch (err) {
    console.warn('Database sync could not reach /api/passes:', err);
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
