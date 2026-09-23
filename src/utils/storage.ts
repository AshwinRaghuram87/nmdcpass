import { EntryPass, ProcedureStage, DESIGNATED_GATES } from '../types';
import { INITIAL_PASSES } from '../data/initialPasses';

const STORAGE_KEY = 'amnex_nmdc_entry_passes_v3_clean';

export function loadStoredPasses(): EntryPass[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // Clean start: initialize with empty list
      saveStoredPasses([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) return [];
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
    return [];
  } catch (err) {
    console.error('Failed to read passes from storage', err);
    return [];
  }
}

export function saveStoredPasses(passes: EntryPass[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
  } catch (err) {
    console.error('Failed to save passes to storage', err);
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

