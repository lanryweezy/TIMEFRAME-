import { openDB, IDBPDatabase } from 'idb';

/**
 * NEURAL CREATIVE MEMORY SERVICE
 * Implements a high-performance "Creative Manifold" storage system.
 * Allows the AI Director to remember aesthetic choices and narrative logic 
 * across feature-length projects (Long-Term Project Memory).
 */

const MEMORY_DB = 'timeframe_neural_memory';
const MEMORY_STORE = 'creative_manifolds';
const DB_VERSION = 1;

interface CreativeManifold {
  id: string;
  projectId: string;
  timestamp: number;
  type: 'aesthetic' | 'narrative' | 'structural' | 'technical';
  content: string; // The creative reasoning or decision
  metadata: any;    // Associated project state deltas
  embedding?: number[]; // Semantic vector for retrieval
}

export class MemoryService {
  private static db: IDBPDatabase | null = null;

  private static async getDB() {
    if (this.db) return this.db;
    this.db = await openDB(MEMORY_DB, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(MEMORY_STORE)) {
          const store = db.createObjectStore(MEMORY_STORE, { keyPath: 'id' });
          store.createIndex('projectId', 'projectId', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      },
    });
    return this.db;
  }

  /**
   * Commit a new creative decision to long-term memory.
   */
  static async commitDecision(projectId: string, manifold: Omit<CreativeManifold, 'id' | 'timestamp' | 'projectId'>) {
    const db = await this.getDB();
    const id = `${projectId}_${crypto.randomUUID()}`;
    const entry: CreativeManifold = {
      ...manifold,
      id,
      projectId,
      timestamp: Date.now(),
    };

    // Note: This implementation uses structured tokenization for retrieval.
    // Future neural upgrades will integrate real vector embeddings.
    
    await db.add(MEMORY_STORE, entry);
    console.log(`Neural Memory: 🧠 Decision committed to project manifold (${manifold.type})`);
    return id;
  }

  /**
   * Retrieve relevant creative history based on semantic query.
   */
  static async recallRelevant(projectId: string, query: string, limit = 5): Promise<CreativeManifold[]> {
    const db = await this.getDB();
    const all = await db.getAllFromIndex(MEMORY_STORE, 'projectId', projectId);
    
    // Perform "Pseudo-Vector" Search: 
    // Keyword and Type matching based on the query string.
    const tokens = query.toLowerCase().split(' ');
    
    return all
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter(m => {
          const content = m.content.toLowerCase();
          return tokens.some(t => content.includes(t));
      })
      .slice(0, limit);
  }

  /**
   * Get the "Directorial Summary" of the project's evolution.
   */
  static async getDirectorialSummary(projectId: string): Promise<string> {
    const db = await this.getDB();
    const history = await db.getAllFromIndex(MEMORY_STORE, 'projectId', projectId);
    
    if (history.length === 0) return "Project vision is currently empty.";
    
    return history
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(m => `[${m.type.toUpperCase()}] ${m.content}`)
      .join('\n');
  }

  static async clearMemory(projectId: string) {
    const db = await this.getDB();
    const tx = db.transaction(MEMORY_STORE, 'readwrite');
    const index = tx.store.index('projectId');
    let cursor = await index.openCursor(IDBKeyRange.only(projectId));
    
    while (cursor) {
      await cursor.delete();
      cursor = await cursor.continue();
    }
  }
}
