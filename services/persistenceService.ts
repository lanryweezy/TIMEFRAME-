import { VideoState, VideoClip, AudioBlock } from '../types';
import { CONFIG } from '../config';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'timeframe_pro_db';
const DB_VERSION = 3;

const STORES = {
  METADATA: 'metadata',
  CLIPS: 'clips',
  AUDIO: 'audio',
  TRACKS_INFO: 'tracks_info',
  VERSIONING: 'versioning',
};

let dbPromise: Promise<IDBPDatabase> | null = null;

// ... previousStateCache ...

if (typeof window !== 'undefined') {
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (oldVersion < 1) {
        db.createObjectStore(STORES.METADATA);
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(STORES.CLIPS)) db.createObjectStore(STORES.CLIPS, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.AUDIO)) db.createObjectStore(STORES.AUDIO, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.TRACKS_INFO)) db.createObjectStore(STORES.TRACKS_INFO, { keyPath: 'id' });
      }
      // Version 3: High-Performance Indices for Virtualized Project Graph
      if (oldVersion < 3) {
        let clipStore;
        if (!db.objectStoreNames.contains(STORES.CLIPS)) {
          clipStore = db.createObjectStore(STORES.CLIPS, { keyPath: 'id' });
        } else {
          clipStore = transaction.objectStore(STORES.CLIPS);
        }
        
        if (!clipStore.indexNames.contains('startTime')) {
            clipStore.createIndex('startTime', 'startTime');
        }
        
        let audioStore;
        if (!db.objectStoreNames.contains(STORES.AUDIO)) {
          audioStore = db.createObjectStore(STORES.AUDIO, { keyPath: 'id' });
        } else {
          audioStore = transaction.objectStore(STORES.AUDIO);
        }
        
        if (!audioStore.indexNames.contains('startTime')) {
            audioStore.createIndex('startTime', 'startTime');
        }
      }
    },
  });
}

/**
 * TRUE DELTA PERSISTENCE ENGINE
 * Only surgical writes to IndexedDB for modified records.
 */
export const saveProjectData = async (state: VideoState): Promise<void> => {
  if (!dbPromise) return;
  const db = await dbPromise;
  
  try {
    const projectId = state.projectName || 'default_project';
    
    // 1. Save Metadata (Settings, Duration, etc.) - Always overwrite
    const { videoClips, audioTrack, history, ...metadata } = state;
    await db.put(STORES.METADATA, metadata, 'metadata');

    // 2. Surgical Clips Delta
    if (videoClips) {
        const tx = db.transaction(STORES.CLIPS, 'readwrite');
        const currentIds = new Set<string>();
        
        for (const clip of videoClips) {
            currentIds.add(clip.id);
            const cached = previousStateCache.clips.get(clip.id);
            // Simple shallow diff check for performance
            if (!cached || cached.startTime !== clip.startTime || cached.duration !== clip.duration || cached.trackId !== clip.trackId) {
                tx.store.put(clip);
                previousStateCache.clips.set(clip.id, { ...clip });
            }
        }
        
        // Delete removed clips
        for (const id of previousStateCache.clips.keys()) {
            if (!currentIds.has(id)) {
                tx.store.delete(id);
                previousStateCache.clips.delete(id);
            }
        }
        await tx.done;
    }

    // 3. Surgical Audio Delta
    if (audioTrack) {
        const tx = db.transaction(STORES.AUDIO, 'readwrite');
        const currentIds = new Set<string>();
        
        for (const audio of audioTrack) {
            currentIds.add(audio.id);
            const cached = previousStateCache.audio.get(audio.id);
            if (!cached || cached.startTime !== audio.startTime || cached.volume !== audio.volume) {
                tx.store.put(audio);
                previousStateCache.audio.set(audio.id, { ...audio });
            }
        }
        
        for (const id of previousStateCache.audio.keys()) {
            if (!currentIds.has(id)) {
                tx.store.delete(id);
                previousStateCache.audio.delete(id);
            }
        }
        await tx.done;
    }

  } catch (error) {
    console.error('Scale: True Delta Save failed:', error);
  }
};

/**
 * RANGE-BASED PROJECT HYDRATION
 * Only loads clips that are within a specific time window.
 * O(log N) indexed lookup.
 */
export const loadTimelineRange = async (startTime: number, endTime: number): Promise<{ clips: VideoClip[], audio: AudioBlock[] }> => {
    if (!dbPromise) return { clips: [], audio: [] };
    const db = await dbPromise;

    // Use IDB KeyRange for optimized spatial query
    const range = IDBKeyRange.bound(startTime, endTime);
    
    const clips = await db.getAllFromIndex(STORES.CLIPS, 'startTime', range);
    const audio = await db.getAllFromIndex(STORES.AUDIO, 'startTime', range);

    return { clips, audio };
};

/**
 * Scale-Safe Project Loader: "Lazy-First"
 * Now only loads the Project Header (metadata) and initial 5 minutes.
 */
export const loadProjectData = async (): Promise<VideoState | null> => {
  if (!dbPromise) return null;
  const db = await dbPromise;
  
  try {
    const metadata = await db.get(STORES.METADATA, 'metadata');
    if (!metadata) return null;

    // ELITE LOAD: Initial 5-minute window only (300 seconds)
    const { clips, audio } = await loadTimelineRange(0, 300);

    // Seed Delta Cache (only for the loaded set)
    previousStateCache.clips.clear();
    clips.forEach(c => previousStateCache.clips.set(c.id, c));
    
    previousStateCache.audio.clear();
    audio.forEach(a => previousStateCache.audio.set(a.id, a));

    return {
      ...metadata,
      videoClips: clips,
      audioTrack: audio,
      history: { past: [], future: [] },
      isGraphVirtualized: true, // Signal to UI store
    } as VideoState;
  } catch (error) {
    console.error('Scale: Lazy Load failed:', error);
    return null;
  }
};
