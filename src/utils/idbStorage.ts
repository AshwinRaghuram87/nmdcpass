import { EntryPass } from '../types';

const DB_NAME = 'NMDC_Gate_Database_v2';
const DB_VERSION = 1;
const STORE_NAME = 'passes_store';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available in current environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save passes array into IndexedDB
 */
export async function idbSavePasses(passes: EntryPass[]): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Clear existing records and write new ones
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        let completed = 0;
        if (passes.length === 0) {
          resolve(true);
          return;
        }

        passes.forEach((p, idx) => {
          const putReq = store.put({ ...p, displayOrder: idx });
          putReq.onsuccess = () => {
            completed++;
            if (completed === passes.length) {
              resolve(true);
            }
          };
          putReq.onerror = (e) => {
            console.error('Failed to put pass into IndexedDB:', e);
          };
        });
      };

      clearReq.onerror = () => {
        resolve(false);
      };

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('IndexedDB save skipped:', err);
    return false;
  }
}

/**
 * Load all passes from IndexedDB
 */
export async function idbLoadPasses(): Promise<EntryPass[] | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const passes = request.result as EntryPass[];
        if (Array.isArray(passes) && passes.length > 0) {
          const sorted = [...passes].sort(
            (a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
          );
          resolve(sorted);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('IndexedDB load failed:', err);
    return null;
  }
}
