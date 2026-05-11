import { openDB, IDBPDatabase } from 'idb';
import { VideoState } from '../types';

const DB_NAME = 'VideoEditorDB';
const STORE_NAME = 'proxyAssets';
const DRAFTS_STORE = 'drafts';

let dbPromise: Promise<IDBPDatabase>;

const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, 2, {
            upgrade(db, oldVersion) {
                if (oldVersion < 1) db.createObjectStore(STORE_NAME);
                if (oldVersion < 2) db.createObjectStore(DRAFTS_STORE);
            },
        });
    }
    return dbPromise;
};

export const getProxyFromCache = async (url: string): Promise<string | null> => {
    const db = await getDB();
    const blob = await db.get(STORE_NAME, url);
    if (blob) {
        return URL.createObjectURL(blob);
    }
    return null;
};

export const saveProxyToCache = async (url: string, blob: Blob) => {
    const db = await getDB();
    await db.put(STORE_NAME, blob, url);
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
