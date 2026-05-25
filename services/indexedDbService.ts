import { openDB, IDBPDatabase } from 'idb';
import { VideoState } from '../types';
import { opfsService } from './opfsService';

const DB_NAME = 'VideoEditorDB';
const STORE_NAME = 'proxyAssets'; // This will now store URIs instead of Blobs
const DRAFTS_STORE = 'drafts';

let dbPromise: Promise<IDBPDatabase>;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 3, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) db.createObjectStore(STORE_NAME);
        if (oldVersion < 2) db.createObjectStore(DRAFTS_STORE);
        // Version 3: Clear proxyAssets as we change from Blobs to URIs
        if (oldVersion < 3) {
            db.deleteObjectStore(STORE_NAME);
            db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
};

export const getProxyFromCache = async (url: string): Promise<string | null> => {
  const db = await getDB();
  const cachedUri = await db.get(STORE_NAME, url);
  return cachedUri || null;
};

export const saveProxyToCache = async (url: string, blob: Blob) => {
  const db = await getDB();
  // Quantum OPFS Ingestion
  const opfsUri = await opfsService.ingestFile(blob, `cached_proxy_${crypto.randomUUID().slice(0, 8)}.mp4`);
  await db.put(STORE_NAME, opfsUri, url);
};

export const saveProjectDraft = async (id: string, state: VideoState) => {
  const db = await getDB();
  await db.put(DRAFTS_STORE, { ...state, updatedAt: Date.now() }, id);
};

export const getAllDrafts = async () => {
  const db = await getDB();
  return db.getAll(DRAFTS_STORE);
};

export const deleteDraft = async (id: string) => {
  const db = await getDB();
  await db.delete(DRAFTS_STORE, id);
};
