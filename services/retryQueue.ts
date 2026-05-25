export interface SerializableOperation {
  id: string;
  type: string;
  payload: any;
  retries: number;
  maxRetries: number;
  lastAttemptTimestamp?: number;
}

export type OperationHandler = (payload: any) => Promise<void>;

class RetryQueue {
  private queue: SerializableOperation[] = [];
  private handlers: Record<string, OperationHandler> = {};
  private isProcessing = false;

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.resumeProcessing());
    }
  }

  /**
   * Registers a specific executor callback for a serializable operation type.
   */
  registerHandler(type: string, handler: OperationHandler) {
    this.handlers[type] = handler;
  }

  /**
   * Enqueues a new serializable operation to local storage and begins execution loop.
   */
  async add(type: string, payload: any, maxRetries = 5) {
    const operation: SerializableOperation = {
      id: `${type}_${crypto.randomUUID()}`,
      type,
      payload,
      retries: 0,
      maxRetries,
    };
    
    this.queue.push(operation);
    this.saveToStorage();
    this.process();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('TIMEFRAME_RETRY_QUEUE');
      if (data) {
        this.queue = JSON.parse(data);
      }
    } catch (e) {
      console.warn('[RetryQueue] Failed to load retry queue from storage:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('TIMEFRAME_RETRY_QUEUE', JSON.stringify(this.queue));
    } catch (e) {
      console.warn('[RetryQueue] Failed to save retry queue to storage:', e);
    }
  }

  private resumeProcessing() {
    console.log('[RetryQueue] Network online. Resuming background operations...');
    this.process();
  }

  private async process() {
    if (this.isProcessing) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[RetryQueue] Workspace is offline. Suspending execution loop.');
      return;
    }

    this.isProcessing = true;

    try {
      const activeQueue = [...this.queue];
      for (const op of activeQueue) {
        const handler = this.handlers[op.type];
        if (!handler) {
          console.warn(`[RetryQueue] No handler registered for operation type: ${op.type}. Skipping.`);
          continue;
        }

        // Apply Exponential Backoff: delay increases by 2^retries seconds
        if (op.retries > 0 && op.lastAttemptTimestamp) {
          const backoffDelay = Math.pow(2, op.retries) * 1000;
          const timeElapsed = Date.now() - op.lastAttemptTimestamp;
          if (timeElapsed < backoffDelay) {
            continue; // Keep waiting for exponential backoff window
          }
        }

        try {
          await handler(op.payload);
          
          // Successful execution: remove from queue
          this.queue = this.queue.filter(item => item.id !== op.id);
          this.saveToStorage();
          console.log(`[RetryQueue] Successfully processed operation: ${op.id} (${op.type})`);
        } catch (error) {
          op.retries++;
          op.lastAttemptTimestamp = Date.now();

          if (op.retries >= op.maxRetries) {
            console.error(`[RetryQueue] Operation ${op.id} failed permanently after ${op.maxRetries} attempts.`);
            this.queue = this.queue.filter(item => item.id !== op.id);
          } else {
            console.log(`[RetryQueue] Attempt ${op.retries} failed for ${op.id}. Scheduled for backoff retry.`);
            const index = this.queue.findIndex(item => item.id === op.id);
            if (index !== -1) {
              this.queue[index] = op;
            }
          }
          this.saveToStorage();
        }
      }
    } finally {
      this.isProcessing = false;
      
      // If operations are still pending, re-trigger the scheduler in 5 seconds
      if (this.queue.length > 0) {
        setTimeout(() => this.process(), 5000);
      }
    }
  }
}

export const retryQueue = new RetryQueue();
