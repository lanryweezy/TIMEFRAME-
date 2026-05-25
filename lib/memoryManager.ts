/**
 * Global GPU Memory Manager
 * Prevents WebGL context loss and browser crashes by monitoring and limiting VRAM usage.
 */

export class GPUMemoryManager {
  private totalUsage = 0;
  private readonly maxVRAM: number;
  private resources: Map<string, { size: number; lastUsed: number; dispose: () => void }> = new Map();

  constructor() {
    // ELITE DYNAMIC SCALING: Use 25% of system memory for VRAM limit, capped at 4GB
    const deviceMemoryGB = (navigator as any).deviceMemory || 8;
    const calculatedLimitMB = Math.min(4096, (deviceMemoryGB * 1024) * 0.25);
    
    this.maxVRAM = calculatedLimitMB * 1024 * 1024;
    console.log(`GPU: 🛡️ Memory Manager Online (System: ${deviceMemoryGB}GB, VRAM Limit: ${calculatedLimitMB}MB)`);
  }

  register(id: string, size: number, dispose: () => void) {
    if (this.totalUsage + size > this.maxVRAM) {
      this.evict(size);
    }
    this.resources.set(id, { size, lastUsed: Date.now(), dispose });
    this.totalUsage += size;
    console.debug(`GPU: Registered ${id} (${(size / 1024 / 1024).toFixed(2)}MB). Total: ${(this.totalUsage / 1024 / 1024).toFixed(2)}MB`);
  }

  touch(id: string) {
    const resource = this.resources.get(id);
    if (resource) {
      resource.lastUsed = Date.now();
    }
  }

  unregister(id: string) {
    const resource = this.resources.get(id);
    if (resource) {
      this.totalUsage -= resource.size;
      this.resources.delete(id);
    }
  }

  private evict(neededSize: number) {
    console.warn(`GPU: ⚠️ VRAM Limit Reached. Evicting resources...`);
    const sorted = Array.from(this.resources.entries()).sort((a, b) => a[1].lastUsed - b[1].lastUsed);

    let reclaimed = 0;
    for (const [id, resource] of sorted) {
      if (reclaimed >= neededSize) break;
      console.debug(`GPU: Evicting ${id}`);
      resource.dispose();
      reclaimed += resource.size;
      this.totalUsage -= resource.size;
      this.resources.delete(id);
    }
  }

  getUsage() {
    return {
      used: this.totalUsage,
      max: this.maxVRAM,
      percent: (this.totalUsage / this.maxVRAM) * 100
    };
  }
}

export const gpuMemory = new GPUMemoryManager();

/**
 * BLOB URL GARBAGE COLLECTOR
 * Prevents "Aw, Snap!" crashes on 2-hour timelines by actively revoking unused URLs.
 */
export class BlobURLManager {
  private refs: Map<string, number> = new Map();
  private timestamps: Map<string, number> = new Map();

  /**
   * Registers a Blob URL. Call this when a clip is added to the timeline.
   */
  retain(url: string) {
    if (!url.startsWith('blob:')) return;
    const current = this.refs.get(url) || 0;
    this.refs.set(url, current + 1);
    this.timestamps.set(url, Date.now());
  }

  /**
   * Decrements the reference count. If 0, the URL is revoked from memory.
   */
  release(url: string) {
    if (!url.startsWith('blob:')) return;
    const current = this.refs.get(url) || 0;
    
    if (current <= 1) {
      URL.revokeObjectURL(url);
      this.refs.delete(url);
      this.timestamps.delete(url);
      console.debug(`Memory: 🗑️ Revoked Blob URL (GC)`);
    } else {
      this.refs.set(url, current - 1);
    }
  }

  /**
   * Aggressively purges URLs that haven't been touched in a long time (e.g., 60 seconds).
   * Useful for background cleanup during long sessions.
   */
  collectGarbage(timeoutMs = 60000) {
    const now = Date.now();
    let count = 0;
    for (const [url, timestamp] of this.timestamps.entries()) {
      if (now - timestamp > timeoutMs && (this.refs.get(url) || 0) === 0) {
        URL.revokeObjectURL(url);
        this.refs.delete(url);
        this.timestamps.delete(url);
        count++;
      }
    }
    if (count > 0) {
        console.log(`Memory: 🧹 Auto-GC cleared ${count} stagnant Blob URLs.`);
    }
  }
}

export const blobManager = new BlobURLManager();

// Run background GC every 30 seconds
if (typeof window !== 'undefined') {
    setInterval(() => blobManager.collectGarbage(), 30000);
}
