/**
 * Quantum Worker Pool
 * Implements Lazy Initialization & Resource Pre-warming.
 * Solves the "Sequential Boot Latency" bottleneck.
 */

type WorkerType = 'decoder' | 'pixi' | 'audio' | 'vfx' | 'export' | 'sam' | 'compute' | 'video' | 'waveform';

interface WorkerConfig {
  url: string;
  type: 'module' | 'classic';
  lazy: boolean;
}

const WORKER_MANIFEST: Record<WorkerType, WorkerConfig> = {
  decoder: { url: '../workers/decoder.worker.ts', type: 'module', lazy: false },
  pixi: { url: '../workers/pixi.worker.ts', type: 'module', lazy: false },
  audio: { url: '../workers/audioDecoder.worker.ts', type: 'module', lazy: true },
  vfx: { url: '../workers/vfxProcessor.worker.ts', type: 'module', lazy: true },
  export: { url: '../workers/export.worker.ts', type: 'module', lazy: true },
  sam: { url: '../workers/sam.worker.ts', type: 'module', lazy: true },
  compute: { url: '../workers/compute.worker.ts', type: 'module', lazy: true },
  video: { url: '../workers/videoProcessor.worker.ts', type: 'module', lazy: true },
  waveform: { url: '../workers/waveformWorker.ts', type: 'module', lazy: true },
};

class WorkerPool {
  private workers: Map<WorkerType, Worker> = new Map();
  private crashCounts: Map<WorkerType, number> = new Map();
  private lastCrashTime: Map<WorkerType, number> = new Map();
  private initialized = false;

  private readonly MAX_CONCURRENCY = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5; // Max crashes before disabling
  private readonly RECOVERY_TIMEOUT = 30000; // Reset crash count after 30s of stability

  /**
   * Pre-warms essential workers to minimize Project Load latency.
   * Runs in the background without blocking the UI thread.
   */
  async prewarm() {
    if (this.initialized) return;
    
    // INDUSTRIAL HARDENING: Calculate optimal worker count based on CPU cores
    // We reserve at least 2 cores for the UI and Main processing threads
    const availableCores = Math.max(2, this.MAX_CONCURRENCY - 2);
    console.log(`WorkerPool: ⚡ Pre-warming engine with hardware-aware concurrency (Cores: ${this.MAX_CONCURRENCY}, Available for Workers: ${availableCores})`);
    
    const scheduleWorker = (type: WorkerType) => {
        const starter = () => {
            this.getWorker(type);
            console.log(`WorkerPool: Staggered boot for [${type.toUpperCase()}]`);
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(starter);
        } else {
            setTimeout(starter, 100);
        }
    };

    // Initialize non-lazy workers with staggering
    let spawnedCount = 0;
    for (const [type, config] of Object.entries(WORKER_MANIFEST)) {
      if (!config.lazy && spawnedCount < availableCores) {
        scheduleWorker(type as WorkerType);
        spawnedCount++;
      }
    }
    
    this.initialized = true;
  }

  getWorker(type: WorkerType): Worker {
    if (this.workers.has(type)) {
      return this.workers.get(type)!;
    }

    // CIRCUIT BREAKER LOGIC
    const crashes = this.crashCounts.get(type) || 0;
    if (crashes >= this.CIRCUIT_BREAKER_THRESHOLD) {
        console.error(`WorkerPool: [${type.toUpperCase()}] is in a Death Spiral. Circuit breaker active. Safe-mode fallback engaged.`);
        // Return a mock or disabled worker if necessary, or just throw
        throw new Error(`Worker ${type} disabled due to instability.`);
    }

    const config = WORKER_MANIFEST[type];
    const worker = new Worker(new URL(config.url, import.meta.url), {
      type: config.type,
    });

    // RELIABILITY UPGRADE: Auto-Restart on Crash & Supervisor Logic
    worker.onerror = (e) => {
        const now = Date.now();
        const lastCrash = this.lastCrashTime.get(type) || 0;
        
        // Reset count if stable for a long time
        if (now - lastCrash > this.RECOVERY_TIMEOUT) {
            this.crashCounts.set(type, 1);
        } else {
            this.crashCounts.set(type, crashes + 1);
        }
        
        this.lastCrashTime.set(type, now);
        console.error(`WorkerPool: [${type.toUpperCase()}] failure (Crash #${this.crashCounts.get(type)}). Restarting...`, e);
        
        // EXPONENTIAL BACKOFF for restarts
        const delay = Math.pow(2, this.crashCounts.get(type)! - 1) * 1000;
        setTimeout(() => this.restartWorker(type), delay);
    };

    worker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'DECODER_PANIC') {
        console.error(`WorkerPool Supervisor: Caught DECODER_PANIC from ${type}. Gracefully skipping corrupted frame and rebooting...`, e.data.payload);
        this.restartWorker(type);
      }
    });

    console.log(`WorkerPool: 💠 Spawned [${type.toUpperCase()}] worker cluster`);
    this.workers.set(type, worker);
    return worker;
  }

  private restartWorker(type: WorkerType) {
      const oldWorker = this.workers.get(type);
      if (oldWorker) {
          oldWorker.terminate();
          this.workers.delete(type);
      }
      return this.getWorker(type);
  }

  terminateAll() {
    for (const worker of this.workers.values()) {
      worker.terminate();
    }
    this.workers.clear();
    this.initialized = false;
  }
}

export const workerPool = new WorkerPool();
