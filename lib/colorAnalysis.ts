/**
 * TIMEFRAME Deterministic Color Analysis Engine
 * ================================================
 * Pure mathematical color analysis — no AI, no guessing.
 *
 * This module provides the numerical foundation for the Hybrid Color Matcher.
 * It computes exact histograms, statistical moments, and delta vectors
 * from raw pixel data. Gemini is used ONLY for semantic intent resolution
 * (e.g., "make it feel warmer" → which mathematical adjustments to apply).
 *
 * All operations are O(n) on pixel count with no allocations in the hot path.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColorHistogram {
  /** 256-bin histogram for red channel */
  red: Uint32Array;
  /** 256-bin histogram for green channel */
  green: Uint32Array;
  /** 256-bin histogram for blue channel */
  blue: Uint32Array;
  /** 256-bin histogram for luma (BT.709 weighted) */
  luma: Uint32Array;
}

export interface ColorStatistics {
  /** Per-channel mean (0–255) */
  mean: { r: number; g: number; b: number; luma: number };
  /** Per-channel standard deviation */
  stddev: { r: number; g: number; b: number; luma: number };
  /** Per-channel median (50th percentile) */
  median: { r: number; g: number; b: number; luma: number };
  /** Shadow region mean (bottom 25% of luma) */
  shadowMean: { r: number; g: number; b: number };
  /** Midtone region mean (25%–75% of luma) */
  midtoneMean: { r: number; g: number; b: number };
  /** Highlight region mean (top 25% of luma) */
  highlightMean: { r: number; g: number; b: number };
  /** Total pixel count */
  pixelCount: number;
}

export interface ColorGradeDelta {
  /** Lift (shadow) adjustment needed: target minus reference, per channel */
  lift: { r: number; g: number; b: number; w: number };
  /** Gamma (midtone) adjustment needed */
  gamma: { r: number; g: number; b: number; w: number };
  /** Gain (highlight) adjustment needed */
  gain: { r: number; g: number; b: number; w: number };
  /** Offset (global) adjustment needed */
  offset: { r: number; g: number; b: number; w: number };
  /** Confidence score 0–1 indicating how reliable the delta is */
  confidence: number;
}

// ─── BT.709 Luma Coefficients ─────────────────────────────────────────────────
const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Compute a 256-bin histogram for each channel from raw RGBA pixel data.
 * O(n) single pass, zero intermediate allocations.
 */
export function computeHistogram(pixels: Uint8ClampedArray | Uint8Array): ColorHistogram {
  const red = new Uint32Array(256);
  const green = new Uint32Array(256);
  const blue = new Uint32Array(256);
  const luma = new Uint32Array(256);

  const len = pixels.length;
  for (let i = 0; i < len; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // Skip fully transparent pixels (alpha = 0)
    if (pixels[i + 3] === 0) continue;

    red[r]++;
    green[g]++;
    blue[b]++;

    // BT.709 luma
    const l = Math.round(r * LUMA_R + g * LUMA_G + b * LUMA_B);
    luma[Math.min(255, Math.max(0, l))]++;
  }

  return { red, green, blue, luma };
}

/**
 * Compute the percentile value from a histogram.
 * @param histogram 256-bin histogram
 * @param percentile 0–1 (e.g., 0.5 for median)
 * @param totalPixels total non-transparent pixel count
 */
function histogramPercentile(histogram: Uint32Array, percentile: number, totalPixels: number): number {
  const target = Math.floor(totalPixels * percentile);
  let cumulative = 0;
  for (let i = 0; i < 256; i++) {
    cumulative += histogram[i];
    if (cumulative >= target) return i;
  }
  return 255;
}

/**
 * Compute full statistical analysis from raw RGBA pixel data.
 * Single pass for sums, second pass (from histograms) for percentiles.
 */
export function computeStatistics(pixels: Uint8ClampedArray | Uint8Array): ColorStatistics {
  let sumR = 0, sumG = 0, sumB = 0, sumL = 0;
  let sumR2 = 0, sumG2 = 0, sumB2 = 0, sumL2 = 0;
  let count = 0;

  // Shadow / Midtone / Highlight accumulators
  let shadowR = 0, shadowG = 0, shadowB = 0, shadowCount = 0;
  let midR = 0, midG = 0, midB = 0, midCount = 0;
  let hiR = 0, hiG = 0, hiB = 0, hiCount = 0;

  const len = pixels.length;
  for (let i = 0; i < len; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (pixels[i + 3] === 0) continue;

    const l = r * LUMA_R + g * LUMA_G + b * LUMA_B;

    sumR += r; sumG += g; sumB += b; sumL += l;
    sumR2 += r * r; sumG2 += g * g; sumB2 += b * b; sumL2 += l * l;
    count++;

    // Zone classification based on luma
    if (l < 64) {
      // Shadows (bottom ~25%)
      shadowR += r; shadowG += g; shadowB += b; shadowCount++;
    } else if (l < 192) {
      // Midtones (middle ~50%)
      midR += r; midG += g; midB += b; midCount++;
    } else {
      // Highlights (top ~25%)
      hiR += r; hiG += g; hiB += b; hiCount++;
    }
  }

  if (count === 0) {
    const zero = { r: 0, g: 0, b: 0, luma: 0 };
    const zeroRGB = { r: 0, g: 0, b: 0 };
    return {
      mean: zero,
      stddev: zero,
      median: zero,
      shadowMean: zeroRGB,
      midtoneMean: zeroRGB,
      highlightMean: zeroRGB,
      pixelCount: 0,
    };
  }

  const meanR = sumR / count;
  const meanG = sumG / count;
  const meanB = sumB / count;
  const meanL = sumL / count;

  const stddevR = Math.sqrt(sumR2 / count - meanR * meanR);
  const stddevG = Math.sqrt(sumG2 / count - meanG * meanG);
  const stddevB = Math.sqrt(sumB2 / count - meanB * meanB);
  const stddevL = Math.sqrt(sumL2 / count - meanL * meanL);

  // Compute histograms for percentiles
  const hist = computeHistogram(pixels);

  const safeDiv = (a: number, b: number) => b > 0 ? a / b : 0;

  return {
    mean: { r: meanR, g: meanG, b: meanB, luma: meanL },
    stddev: { r: stddevR, g: stddevG, b: stddevB, luma: stddevL },
    median: {
      r: histogramPercentile(hist.red, 0.5, count),
      g: histogramPercentile(hist.green, 0.5, count),
      b: histogramPercentile(hist.blue, 0.5, count),
      luma: histogramPercentile(hist.luma, 0.5, count),
    },
    shadowMean: {
      r: safeDiv(shadowR, shadowCount),
      g: safeDiv(shadowG, shadowCount),
      b: safeDiv(shadowB, shadowCount),
    },
    midtoneMean: {
      r: safeDiv(midR, midCount),
      g: safeDiv(midG, midCount),
      b: safeDiv(midB, midCount),
    },
    highlightMean: {
      r: safeDiv(hiR, hiCount),
      g: safeDiv(hiG, hiCount),
      b: safeDiv(hiB, hiCount),
    },
    pixelCount: count,
  };
}

/**
 * Downsample an image to a target resolution using a canvas.
 * Used to prepare frames for analysis (and optionally for AI payloads).
 *
 * @param source Source ImageBitmap, HTMLVideoElement, or HTMLCanvasElement
 * @param targetWidth Target width (default 512)
 * @param targetHeight Target height (default 512)
 * @returns Uint8ClampedArray of RGBA pixel data at target resolution
 */
export function downsampleToPixels(
  source: ImageBitmap | HTMLVideoElement | HTMLCanvasElement,
  targetWidth = 512,
  targetHeight = 512
): Uint8ClampedArray {
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d')!;

  let srcWidth: number;
  let srcHeight: number;

  if (source instanceof HTMLVideoElement) {
    srcWidth = source.videoWidth;
    srcHeight = source.videoHeight;
  } else if (source instanceof HTMLCanvasElement) {
    srcWidth = source.width;
    srcHeight = source.height;
  } else {
    srcWidth = source.width;
    srcHeight = source.height;
  }

  // Maintain aspect ratio within the target bounds
  const scale = Math.min(targetWidth / srcWidth, targetHeight / srcHeight);
  const dw = Math.round(srcWidth * scale);
  const dh = Math.round(srcHeight * scale);
  const dx = Math.round((targetWidth - dw) / 2);
  const dy = Math.round((targetHeight - dh) / 2);

  // Clear to black (for letterboxing)
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(source as any, dx, dy, dw, dh);

  return ctx.getImageData(0, 0, targetWidth, targetHeight).data;
}

/**
 * Compute the color grading delta between a reference and target frame.
 * This produces deterministic lift/gamma/gain/offset adjustments
 * that would move the target's color profile toward the reference.
 *
 * The math:
 *   - Lift (shadows): delta of shadow zone means, normalized to 0–1
 *   - Gamma (midtones): delta of midtone zone means, normalized to 0–1
 *   - Gain (highlights): delta of highlight zone means, normalized to 0–1
 *   - Offset (global): delta of global means
 *   - W channel: luma-weighted delta for overall brightness
 *
 * Confidence is based on pixel count and variance — low-variance or
 * very few pixels in a zone reduces confidence for that zone.
 */
export function computeGradeDelta(
  referencePixels: Uint8ClampedArray | Uint8Array,
  targetPixels: Uint8ClampedArray | Uint8Array
): ColorGradeDelta {
  const refStats = computeStatistics(referencePixels);
  const tgtStats = computeStatistics(targetPixels);

  // Normalize delta to -1..+1 range (from 0-255 space)
  const norm = (refVal: number, tgtVal: number) => (refVal - tgtVal) / 255;

  // Lift: shadow zone delta
  const lift = {
    r: norm(refStats.shadowMean.r, tgtStats.shadowMean.r),
    g: norm(refStats.shadowMean.g, tgtStats.shadowMean.g),
    b: norm(refStats.shadowMean.b, tgtStats.shadowMean.b),
    w: norm(
      refStats.shadowMean.r * LUMA_R + refStats.shadowMean.g * LUMA_G + refStats.shadowMean.b * LUMA_B,
      tgtStats.shadowMean.r * LUMA_R + tgtStats.shadowMean.g * LUMA_G + tgtStats.shadowMean.b * LUMA_B
    ),
  };

  // Gamma: midtone zone delta
  const gamma = {
    r: norm(refStats.midtoneMean.r, tgtStats.midtoneMean.r),
    g: norm(refStats.midtoneMean.g, tgtStats.midtoneMean.g),
    b: norm(refStats.midtoneMean.b, tgtStats.midtoneMean.b),
    w: norm(
      refStats.midtoneMean.r * LUMA_R + refStats.midtoneMean.g * LUMA_G + refStats.midtoneMean.b * LUMA_B,
      tgtStats.midtoneMean.r * LUMA_R + tgtStats.midtoneMean.g * LUMA_G + tgtStats.midtoneMean.b * LUMA_B
    ),
  };

  // Gain: highlight zone delta
  const gain = {
    r: norm(refStats.highlightMean.r, tgtStats.highlightMean.r),
    g: norm(refStats.highlightMean.g, tgtStats.highlightMean.g),
    b: norm(refStats.highlightMean.b, tgtStats.highlightMean.b),
    w: norm(
      refStats.highlightMean.r * LUMA_R + refStats.highlightMean.g * LUMA_G + refStats.highlightMean.b * LUMA_B,
      tgtStats.highlightMean.r * LUMA_R + tgtStats.highlightMean.g * LUMA_G + tgtStats.highlightMean.b * LUMA_B
    ),
  };

  // Offset: global mean delta
  const offset = {
    r: norm(refStats.mean.r, tgtStats.mean.r),
    g: norm(refStats.mean.g, tgtStats.mean.g),
    b: norm(refStats.mean.b, tgtStats.mean.b),
    w: norm(refStats.mean.luma, tgtStats.mean.luma),
  };

  // Confidence based on variance similarity and pixel count
  const varianceRatio = Math.min(refStats.stddev.luma, tgtStats.stddev.luma) /
    Math.max(refStats.stddev.luma, tgtStats.stddev.luma, 1);
  const pixelConfidence = Math.min(refStats.pixelCount, tgtStats.pixelCount) > 1000 ? 1 : 0.5;
  const confidence = varianceRatio * pixelConfidence;

  return { lift, gamma, gain, offset, confidence };
}

/**
 * Convert RGBA pixel data to a base64-encoded JPEG for API payloads.
 * Uses OffscreenCanvas for off-main-thread compatibility.
 */
export async function pixelsToBase64Jpeg(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  quality = 0.7
): Promise<string> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  const imageData = new ImageData(pixels, width, height);
  ctx.putImageData(imageData, 0, 0);
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip the data:image/jpeg;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
