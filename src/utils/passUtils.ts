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

export const ARCHIVED_PASS_MAX_NUMBER = 37;

/**
 * Extracts the numeric sequence from a pass number such as "NMDC/C&IT/37",
 * "NMDC/C&IT/ 15", "NMDC-C&IT-37", or legacy numeric pass IDs.
 */
export function extractPassSequenceNumber(passNumber?: string): number | null {
  if (!passNumber) return null;
  const trimmed = passNumber.trim();

  // Matches 'NMDC/C&IT/37', 'NMDC/C&IT/ 37', 'NMDC-C&IT-37', 'NMDC/C&IT/037'
  const nmdcMatch = trimmed.match(/NMDC\s*[/-]\s*C&IT\s*[/-]\s*0*(\d+)/i);
  if (nmdcMatch && nmdcMatch[1]) {
    const val = parseInt(nmdcMatch[1], 10);
    return isNaN(val) ? null : val;
  }

  // Matches legacy AMN-NMDC-...-001 style trailing sequence
  const amnMatch = trimmed.match(/^AMN-NMDC-.*?(\d+)$/i);
  if (amnMatch && amnMatch[1]) {
    const val = parseInt(amnMatch[1], 10);
    return isNaN(val) ? null : val;
  }

  // Pure numeric pass number e.g. '37'
  const pureNumMatch = trimmed.match(/^0*(\d+)$/);
  if (pureNumMatch && pureNumMatch[1]) {
    const val = parseInt(pureNumMatch[1], 10);
    return isNaN(val) ? null : val;
  }

  return null;
}

/**
 * Returns true if the pass number is NMDC/C&IT/37 or below (hidden by default until clicked).
 */
export function isPassHiddenByDefault(passNumber?: string): boolean {
  const seq = extractPassSequenceNumber(passNumber);
  return seq !== null && seq <= ARCHIVED_PASS_MAX_NUMBER;
}

/**
 * Checks whether an attached document is a Google Drive link
 */
export function isGoogleDriveDoc(url?: string, fileType?: string): boolean {
  if (fileType === 'google_drive') return true;
  if (!url) return false;
  return /^https?:\/\/(drive|docs)\.google\.com\//i.test(url.trim());
}

/**
 * Checks whether a document URL is an external web link rather than an embedded data URL
 */
export function isExternalDocUrl(url?: string): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url.trim());
}

/**
 * Validates and normalizes a pasted Google Drive (or external) URL for scanned passes
 */
export function validateGoogleDriveLink(rawUrl: string): {
  valid: boolean;
  normalizedUrl: string;
  isGoogleDrive: boolean;
  error?: string;
} {
  let trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: false, normalizedUrl: '', isGoogleDrive: false, error: 'Please paste a Google Drive link.' };
  }

  if (/^(drive|docs)\.google\.com\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        valid: false,
        normalizedUrl: trimmed,
        isGoogleDrive: false,
        error: 'Link must start with https:// or http://'
      };
    }

    const isGoogleDrive = /(^|\.)(drive|docs)\.google\.com$/i.test(parsed.hostname);
    return {
      valid: true,
      normalizedUrl: parsed.toString(),
      isGoogleDrive
    };
  } catch {
    return {
      valid: false,
      normalizedUrl: trimmed,
      isGoogleDrive: false,
      error: 'Please enter a valid URL (e.g. https://drive.google.com/file/d/...)'
    };
  }
}

/**
 * Extracts a direct download URL if the link is a standard Google Drive file share URL
 */
export function getGoogleDriveDirectDownloadUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Matches /file/d/{FILE_ID}/...
  const filePathMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (filePathMatch && filePathMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${filePathMatch[1]}`;
  }

  // Matches ?id={FILE_ID} (excluding folders)
  if (!/\/folders\//i.test(trimmed)) {
    const idParamMatch = trimmed.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/i);
    if (idParamMatch && idParamMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${idParamMatch[1]}`;
    }
  }

  return null;
}

