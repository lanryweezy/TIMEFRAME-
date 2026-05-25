/**
 * Temporal Index (1D Spatial Hash)
 * Optimizes time-based lookups from O(N) to O(1) or O(log N).
 * Used for high-performance timeline scrubbing with 10,000+ clips.
 */

export interface TemporalItem {
  id: string;
  startTime: number;
  duration: number;
  [key: string]: any;
}

export class TemporalIndex<T extends TemporalItem> {
  private buckets: Map<number, T[]> = new Map();
  private bucketSize: number;

  constructor(bucketSize: number = 10) {
    this.bucketSize = bucketSize;
  }

  /**
   * Rebuilds the entire index from a flat array.
   * Call this whenever the project state changes significantly.
   */
  rebuild(items: T[]) {
    this.buckets.clear();
    for (const item of items) {
      this.addItem(item);
    }
  }

  private addItem(item: T) {
    const startBucket = Math.floor(item.startTime / this.bucketSize);
    const endBucket = Math.floor((item.startTime + item.duration) / this.bucketSize);

    for (let i = startBucket; i <= endBucket; i++) {
      if (!this.buckets.has(i)) {
        this.buckets.set(i, []);
      }
      this.buckets.get(i)!.push(item);
    }
  }

  /**
   * Retrieves all items that intersect with a specific point in time.
   */
  getActiveItems(time: number): T[] {
    const bucketIdx = Math.floor(time / this.bucketSize);
    const potentialItems = this.buckets.get(bucketIdx) || [];
    
    // Narrow filter within the small bucket list
    return potentialItems.filter(
      (item) => time >= item.startTime && time <= item.startTime + item.duration
    );
  }

  /**
   * Retrieves all items that intersect with a time range.
   */
  getRangeItems(startTime: number, endTime: number): T[] {
    const startBucket = Math.floor(startTime / this.bucketSize);
    const endBucket = Math.floor(endTime / this.bucketSize);
    const result = new Set<T>();

    for (let i = startBucket; i <= endBucket; i++) {
      const bucket = this.buckets.get(i);
      if (bucket) {
        for (const item of bucket) {
          if (item.startTime <= endTime && (item.startTime + item.duration) >= startTime) {
            result.add(item);
          }
        }
      }
    }

    return Array.from(result);
  }
}
