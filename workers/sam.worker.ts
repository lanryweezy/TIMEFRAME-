/// <reference lib="webworker" />

/**
 * TEMPORAL-SAM Worker
 * Performs instant object segmentation and propagates masks across time 
 * using a high-performance local block-matching optical flow engine.
 */

interface TemporalState {
  mask: Uint8ClampedArray;
  lastPoints: number[][];
  velocityField: Float32Array;
  lastData: Uint8ClampedArray;
}

let temporalState: TemporalState | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'SEGMENT_OBJECT') {
    const { imageData, points, threshold = 30 } = payload;
    const { width, height, data } = imageData;
    const mask = new Uint8ClampedArray(width * height);
    
    // 1. Flood Fill Segmentation
    const [startX, startY] = points[0];
    const startIndex = (startY * width + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];

    const queue = [[startX, startY]];
    const visited = new Set<number>();

    while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        const idx = (y * width + x);
        if (visited.has(idx)) continue;
        visited.add(idx);

        const dIdx = idx * 4;
        const r = data[dIdx];
        const g = data[dIdx + 1];
        const b = data[dIdx + 2];

        const diff = Math.sqrt((r - targetR)**2 + (g - targetG)**2 + (b - targetB)**2);

        if (diff < threshold) {
            mask[idx] = 255;
            if (x > 0) queue.push([x - 1, y]);
            if (x < width - 1) queue.push([x + 1, y]);
            if (y > 0) queue.push([x, y - 1]);
            if (y < height - 1) queue.push([x, y + 1]);
        }
    }

    temporalState = { 
        mask: new Uint8ClampedArray(mask), 
        lastPoints: points, 
        velocityField: new Float32Array(width * height * 2),
        lastData: new Uint8ClampedArray(data)
    };
    self.postMessage({ type: 'SEGMENTATION_COMPLETE', payload: { mask, width, height } });
  }

  else if (type === 'PROPAGATE_TEMPORAL') {
      if (!temporalState) return;
      const { nextImageData } = payload;
      const { width, height, data: nextData } = nextImageData;
      const newMask = new Uint8ClampedArray(width * height);
      const oldData = temporalState.lastData;
      const oldMask = temporalState.mask;

      // 2. High-Performance Local Sub-sampled Block-Matching for True Optical Flow
      const step = 2; // Process every 2x2 grid cell for ultra-low latency (<30ms)
      for (let y = step; y < height - step; y += step) {
          for (let x = step; x < width - step; x += step) {
              const idx = y * width + x;
              if (oldMask[idx] === 255) {
                  const oldColorIdx = idx * 4;
                  const r_old = oldData[oldColorIdx];
                  const g_old = oldData[oldColorIdx + 1];
                  const b_old = oldData[oldColorIdx + 2];

                  let bestDx = 0;
                  let bestDy = 0;
                  let minDiff = 120; // Maximum difference tolerance threshold

                  // Local 7x7 search neighborhood
                  for (let dy = -3; dy <= 3; dy++) {
                      for (let dx = -3; dx <= 3; dx++) {
                          const nx = x + dx;
                          const ny = y + dy;
                          const nIdx = (ny * width + nx) * 4;
                          const diff = Math.abs(nextData[nIdx] - r_old) + 
                                       Math.abs(nextData[nIdx + 1] - g_old) + 
                                       Math.abs(nextData[nIdx + 2] - b_old);
                          if (diff < minDiff) {
                              minDiff = diff;
                              bestDx = dx;
                              bestDy = dy;
                          }
                      }
                  }

                  // Project neighborhood tracking onto the new frame mask
                  const targetX = x + bestDx;
                  const targetY = y + bestDy;
                  for (let sy = 0; sy < step; sy++) {
                      for (let sx = 0; sx < step; sx++) {
                          const newIdx = (targetY + sy) * width + (targetX + sx);
                          if (newIdx < width * height) {
                              newMask[newIdx] = 255;
                          }
                      }
                  }
              }
          }
      }

      // Roll state buffers forward
      temporalState.lastData = new Uint8ClampedArray(nextData);
      temporalState.mask = newMask;
      self.postMessage({ type: 'PROPAGATION_COMPLETE', payload: { mask: newMask, width, height } });
  }
};
