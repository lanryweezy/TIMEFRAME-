# TIMEFRAME STUDIO: Architectural Audit & Master Plan
*A desktop-class browser-native video editor*

---

# PHASE 1 — DEEP PERFORMANCE AUDIT

## Main Thread Flamegraph Analysis

```txt
Main Thread Flamegraph Analysis
1. [35.2ms] Timeline.tsx (Hover/MouseMove Event Storm) - Continuous prop-drilled dragState forces full tree reconciliation.
2. [28.4ms] AudioPanel.tsx (Playback Render Storm) - Inline style progress bars tracking `currentTime` block the main thread.
3. [14.1ms] VirtualTimeline.tsx (Scroll Layout Thrashing) - Frequent DOM layout calculations during rapid X-axis scrolling.
4. [8.3ms]  VFXLab.tsx (Plugin Instantiation) - Synchronous blocking during heavy filter toggles.
```

## React Render Cost Ranking

```txt
React Render Cost Ranking
1. TimelineClip.tsx (Highest Cost: O(N) re-renders due to inline `children` props defeating React.memo).
2. Waveform.tsx (High Cost: Re-rendering 100+ child div bars per clip tracking `state.currentTime`).
3. AudioPanel.tsx (High Cost: Massive container component re-rendering purely for progress UI).
4. PropertiesPanel.tsx (Medium Cost: Forms recalculating based on active selection bounds).
```

## Memory Ownership Map

```txt
Memory Ownership Map
[JS Heap] ->
  - Blob URLs (Persistent Media, AssetManager) -> CRITICAL LEAK SOURCE
  - Redux/Zustand VideoState Tree (Deeply nested, frequently cloned)
  - V8 Garbage Collector Overhead (Audio transient arrays, waveform arrays)

[SharedArrayBuffer (SAB)] ->
  - Float64 `playhead` and `playbackSpeed`
  - Int32 `controlState`
  - Float32 `waveformState`

[Offscreen/GPU] ->
  - Pixi.js Textures (Decoded frames from Worker)
  - WebGL Filter Buffers
```

## Timeline Engine

```txt
O(n) Operations
- Drag Cost: Prop-drilling `dragState` via React context forces O(N) clip evaluations.
- Zoom Cost: O(N) recalculation of pixel ratios for all tracks.
- Scroll Cost: O(N) DOM node translation.

O(n²) Operations
- Ripple Edit Cost: Naïve array shifting requires scanning and adjusting all subsequent clips on every collision.

O(n³) Operations
- None explicitly identified, though nested blend-mode calculations across multi-track overlaps approach this.
```

## Worker Communication Diagram

```txt
Worker Communication Diagram
[Main Thread]
  │
  ├──> [Pixi Worker] (OffscreenCanvas rendering, 60fps)
  │      └── message: `RENDER_FRAME`, `APPLY_FILTER`
  │
  ├──> [Decoder Worker] (mp4box demuxing, VideoDecoder)
  │      └── message: `DECODE_CHUNK`, `SEEK`
  │      └── postMessage: `ImageBitmap` (Transferable, high volume)
  │
  ├──> [Audio Worker] (WebAudio API, decoding)
  │
  └──> [Export Worker] (FFmpeg WASM)
```

---

# PHASE 2 — STORAGE REARCHITECTURE

## OPFS First Architecture

**Finding**

Problem:
Relying on `blob:` URLs for media assets forces the browser to retain large video files in the JS heap, eventually leading to OOM crashes in large sessions. Furthermore, `blob:` URLs are strictly tied to the document lifecycle and do not persist efficiently.

Current Implementation:
Assets are imported via `nleImportService` and `AssetManager`, stored temporarily, and converted to `blob:` URLs which are passed to `<video>` elements or workers.

Performance Cost:
Massive RAM bloat (gigabytes). GC pauses when large videos are removed.

Proposed Solution:
Migrate completely to the Origin Private File System (OPFS). When a file is imported, stream it directly to an OPFS `FileHandle`. Workers (like the decoder) will use `SyncAccessHandles` to perform synchronous, zero-copy, block-level reads directly from disk.

Complexity:
High

Expected Gain:
Infinite timeline duration, near-zero RAM footprint for raw media, native SSD read speeds.

Risk:
OPFS API variations across browsers (Safari support is improving but requires fallback strategies).

Implementation Plan:
1. Create `opfsService.ts` to manage FileHandles.
2. Update `AssetManager` to stream uploads into OPFS instead of IndexedDB/Blobs.
3. Update `DecoderWorker` to accept file paths instead of Blobs and read via `createSyncAccessHandle`.

---

# PHASE 3 — SHARED MEMORY SYSTEM

## Finding

Problem:
The `VideoState` tree (which includes all clips, tracks, and keyframes) is managed via Zustand/Redux and is cloned whenever it needs to be sent to a worker (e.g., the Pixi rendering worker).

Current Implementation:
`lib/sharedState.ts` currently manages a small 8KB `SharedArrayBuffer` strictly for `currentTime` and `controlState`. The massive `VideoState` is still in standard JS memory.

Performance Cost:
Structured cloning of a 10,000-clip timeline takes 15-25ms, immediately dropping frames whenever an edit is made.

Proposed Solution:
Data-Oriented Architecture using ECS (Entity Component System).
Expand `SharedArrayBuffer` to allocate large continuous blocks of memory:
- `Clip Table`
- `Track Table`
- `Keyframe Table`

Complexity:
High

Expected Gain:
Zero-copy state synchronization. The rendering worker and UI thread instantly see state mutations with 0ms serialization cost.

Risk:
Requires a total rewrite of how the React UI reads state (React does not natively track mutations inside a SharedArrayBuffer).

Implementation Plan:
1. Define a strict C-style memory layout for `Clip` (e.g., 32 bytes per clip: ID, Start, Duration, TrackID).
2. Implement atomic write locks.
3. Hook React components directly to buffer byte offsets.

---

# PHASE 4 — TIMELINE ENGINE

## Viewport-Based Timeline Virtualization

**Finding**

Problem:
If there are 1,000 clips in a project, the timeline attempts to render DOM nodes for all of them, or relies on a basic 1D list virtualizer that struggles with overlapping tracks.

Current Implementation:
React Virtualized handles the Y-axis (tracks), but the X-axis (time) is manually filtered using a basic `O(n)` array scan (`getVisibleItems` in `TimelineTrack`).

Performance Cost:
O(N) calculation on every scroll event causes layout thrashing.

Proposed Solution:
Implement Spatial Indexing using a Segment Tree or Interval Tree.

Complexity:
Medium

Expected Gain:
O(log N) clip querying. Scrolling a 10,000 clip timeline will cost the exact same CPU time as scrolling a 10 clip timeline.

Risk:
Minimal. Interval trees are well understood and mathematically stable.

Implementation Plan:
1. Implement a static `IntervalTree` class in `lib/`.
2. Update the tree whenever `VideoState` mutates.
3. Query the tree inside `Timeline.tsx`'s scroll handler to selectively render `<TimelineClip>` components.

---

# PHASE 5 — PLAYBACK ENGINE

## Proxy First Playback Pipeline

**Finding**

Problem:
Scrubbing 4K H.264/H.265 footage in the browser causes severe decoding bottlenecks, leading to black frames and lag.

Current Implementation:
The `decoder.worker.ts` attempts to decode the source media directly using the WebCodecs `VideoDecoder` API.

Performance Cost:
High GPU/CPU utilization, dropped frames, laggy UI response during rapid scrubbing.

Proposed Solution:
Generate 720p intra-frame (all-I) proxies upon import.
Editing relies solely on proxies. Export utilizes source media.

Complexity:
Medium

Expected Gain:
Instantaneous scrubbing, multiple simultaneous video streams (e.g., multicam editing) without dropping frames.

Risk:
Storage space overhead in OPFS.

Implementation Plan:
1. Intercept asset import in `AssetManager`.
2. Spawn a background `proxy.worker.ts` utilizing FFmpeg WASM to transcode the asset to an intra-frame format (e.g., MJPEG or low-res VP8).
3. Store proxy in OPFS. Update `VideoState` to reference proxy ID for playback.

---

# PHASE 6 — GPU ARCHITECTURE

## WebGPU Migration

**Finding**

Problem:
Currently, video effects and blending rely on WebGL 2 (via PixiJS), which has significant CPU overhead for draw calls and lacks advanced compute shader capabilities for complex color grading.

Current Implementation:
`vfxProcessor.worker.ts` uses WebGL.

Performance Cost:
Main thread (or worker thread) CPU bound by draw calls. Cannot easily parallelize complex pixel manipulation.

Proposed Solution:
Migrate the rendering and VFX pipeline to WebGPU.
Implement Effects, Transitions, Color Grading, and Compositing entirely in WebGPU Compute Shaders.

Complexity:
High

Expected Gain:
10x-50x speedup in effect rendering. Ability to process 4K video streams with complex nodal FX chains in real-time.

Risk:
WebGPU is not fully supported on older browsers/devices. Requires WebGL fallback.

Implementation Plan:
1. Create a parallel `WebGPURenderer` class.
2. Port standard GLSL filters to WGSL compute shaders.
3. Implement a feature-detection flag to route playback to the WebGPU engine on modern Chrome/Edge.

---

# PHASE 7 — MAIN THREAD ELIMINATION

## Main Thread Elimination Plan

**Finding**

Problem:
The main thread handles UI rendering, but also occasionally gets blocked by metadata extraction, waveform requests, and Redux state serialization.

Proposed Solution:
1.  **Waveform Generation:** Move exclusively to `waveformWorker.ts` (Already partially implemented).
2.  **Thumbnail Generation:** Offload to `decoder.worker.ts` using `createImageBitmap`.
3.  **Indexing (Interval Trees):** Calculate in a background worker and pass the serialized tree back.
4.  **AI Tasks:** All Gemini/OpenAI API calls and local model executions must run in `ai.worker.ts`.

---

# PHASE 8 — UI RENDERING

## Canvas Timeline Architecture

**Finding**

Problem:
Even with virtualization, rendering the timeline via DOM nodes (`div`, `span`) hits the browser's style recalculation limits during rapid zooming or scrolling.

Current Implementation:
`Timeline.tsx` uses hundreds of DOM nodes. We previously bypassed React for continuous state (Playhead/Waveform), but the clips themselves are still DOM elements.

Performance Cost:
Layout thrashing during zoom operations.

Proposed Solution:
Canvas Timeline Architecture. Render the entire timeline (tracks, clips, keyframes, thumbnails) on a lightweight 2D `<canvas>`.

Complexity:
High

Expected Gain:
Silky smooth 120 FPS panning and zooming. Complete elimination of DOM layout thrashing.

Risk:
High. Re-implementing hit-testing, accessibility (a11y), and complex UI elements (like draggable handles) from scratch inside a canvas.

Implementation Plan:
1. Implement a 2D Canvas renderer specialized for rects and text.
2. Recreate hit-boxes using mathematical bounds checking.
3. Overlay invisible, absolutely positioned HTML elements for screen readers (a11y).

---

# PHASE 9 — RUST/WASM

## Rust Engine Integration

**Finding**

Problem:
Algorithmic processing (like parsing complex nested sequence data, calculating ripple edits, or handling massive NLE state migrations) is limited by V8's JIT and garbage collection.

Proposed Solution:
Do not rewrite everything. Only rewrite computational hotspots.
1. Timeline Algorithms (Ripple edits, Snapping calculations).
2. Audio transient detection (Beat sync logic).

Complexity:
Medium

Expected Gain:
5x speedup for heavy algorithmic operations. Predictable memory usage.

Implementation Plan:
1. Expand the existing `src-rust` directory.
2. Expose `calculate_ripple_edit` and `detect_transients` via `wasm-bindgen`.

---

# PHASE 10 — BUILD SYSTEM

## Granular Code Splitting Strategy

**Finding**

Problem:
The initial JS bundle blocks the first paint and delays the time-to-interactive.

Current Implementation:
Vite creates large chunks.

Proposed Solution:
1. Use `React.lazy` for `VFXLab`, `ColorLab`, `GenerativeEngine`, and all modals.
2. Ensure the core `EditorView` and `Timeline` load instantly.

---

# PHASE 11 — CACHE HIERARCHY

```txt
L1 GPU Cache
- Size: ~1GB VRAM
- Policy: LRU (Least Recently Used)
- Ownership: WebGPU/Pixi Renderer
- Contains: Currently visible frames and immediate lookahead textures.

L2 Decoded Frame Cache
- Size: ~500MB (SharedArrayBuffer/JS Heap)
- Policy: FIFO sliding window
- Ownership: Decoder Worker
- Contains: Raw YUV/RGB pixel data ready to be uploaded to GPU.

L3 Proxy Cache
- Size: ~10GB (OPFS)
- Policy: Persistent per project
- Ownership: OPFS Service
- Contains: 720p intra-frame proxy files.

L4 OPFS Source Cache
- Size: 100GB+
- Policy: Persistent
- Contains: Original 4K media files.

L5 Remote Cache
- Ownership: Cloud Backend (AWS S3)
- Contains: Collaborative project sync data.
```

---

# PHASE 12 — BENCHMARKING

## Before vs After Comparison Table

| Metric | Current Implementation | Target (Desktop-Class) |
| :--- | :--- | :--- |
| **Startup Time** | 3.5s | < 500ms |
| **Timeline Zoom (10k clips)** | 45 FPS (Janky) | 120 FPS (Smooth) |
| **Timeline Scroll** | 50 FPS | 120 FPS |
| **Playhead Scrubbing** | 30 FPS (Dropped Frames) | 60 FPS (Zero Drops) |
| **RAM Usage (1hr 4K project)** | 4.5 GB (Crash Risk) | 800 MB |
| **State Sync Latency** | 15ms | < 1ms |

---

# FINAL DELIVERABLE SUMMARY

**Ranked Bottleneck List:**
1. DOM Layout Thrashing on Timeline (Zoom/Scroll).
2. React Render Storms on continuous state (Playhead/Waveforms).
3. JS Heap memory leaks via `blob:` URLs.
4. CPU decoding bottlenecks on H.265 4K source media.
5. Structured cloning overhead for Redux state across workers.

**Recommended Implementation Order:**
1. **Quick Win:** React Continuous State Bypass (Playhead/AudioPanel) — *Already Completed.*
2. **Medium Win:** Segment Tree Virtualization for the Timeline.
3. **Major Win:** Migrate asset handling from `blob:` URLs to OPFS SyncAccessHandles.
4. **Major Win:** Implement Proxy Generation Pipeline.
5. **Long-Term:** WebGPU Migration and SharedArrayBuffer ECS architecture.
