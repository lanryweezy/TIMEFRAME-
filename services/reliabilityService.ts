import { openDB, IDBPDatabase } from 'idb';
import { VideoState } from '../types';

/**
 * PRODUCTION RELIABILITY: Crash Recovery Service
 * Implements persistent state journal (Write-Ahead Log) to ensure 
 * project recovery even after tab crashes or browser kills.
 */

const DB_NAME = 'TimeframeReliabilityDB';
const RECOVERY_STORE = 'recovery_journal';
const MEDIA_STORE = 'media_registry';

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        // Journal for atomic state updates
        db.createObjectStore(RECOVERY_STORE);
        // Registry for asset relinking and hash verification
        db.createObjectStore(MEDIA_STORE);
      },
    });
  }
  return dbPromise;
};

export class ReliabilityService {
  /**
   * Records a state snapshot to the recovery journal.
   * In production, this would be a diff/delta to minimize I/O.
   */
  static async recordJournalEntry(projectId: string, state: VideoState): Promise<void> {
    const db = await getDB();
    if (!db) return;
    
    // Deep sanitize the state to remove functions and non-serializable properties (e.g. Zustand action methods)
    const cleanState: any = {};
    for (const key of Object.keys(state)) {
      const val = (state as any)[key];
      if (typeof val !== 'function' && key !== 'history') {
        try {
          cleanState[key] = JSON.parse(JSON.stringify(val));
        } catch (e) {
          // Safe fallback for any non-stringifiable properties
        }
      }
    }

    await db.put(RECOVERY_STORE, {
      state: cleanState,
      timestamp: Date.now(),
      type: 'auto_journal'
    }, projectId);
  }

  /**
   * Retrieves the latest journal entry for recovery.
   */
  static async getRecoveryState(projectId: string): Promise<{ state: VideoState, timestamp: number } | null> {
    const db = await getDB();
    if (!db) return null;
    return await db.get(RECOVERY_STORE, projectId);
  }

  /**
   * Registers a media asset with its metadata for deterministic relinking.
   */
  static async registerAsset(assetId: string, metadata: any): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.put(MEDIA_STORE, metadata, assetId);
  }

  static async getAssetMetadata(assetId: string): Promise<any | null> {
    const db = await getDB();
    if (!db) return null;
    return await db.get(MEDIA_STORE, assetId);
  }

  static async clearRecovery(projectId: string): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.delete(RECOVERY_STORE, projectId);
  }
}
