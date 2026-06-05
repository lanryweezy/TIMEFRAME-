# TIMEFRAME STUDIO: Desktop-Class Browser-Native Architecture Review

## Finding

Problem:
Severe main-thread blocking and UI stuttering during playback, scrolling, and dragging caused by global state updates triggering cascading React renders.

Current Implementation:
Global events (like `mousemove` and playback time progression) are either attached to window/document listeners setting React state, or the `currentTime` is passed down the component tree. For example, `Timeline` updates on every mouse movement when dragging, and components like `Waveform` receive `currentTime` as a prop leading to excessive rendering.

Performance Cost:
High (O(N) rendering where N is the number of UI elements/clips). Dropped frames during playback and high input latency during interaction.

Evidence:
- `components/Timeline.tsx` attaches global `mousemove` events that trigger updates.
- Memories logged in `.jules/bolt.md` highlight O(N) re-renders caused by shared `dragState` and `currentTime` prop drilling.
- Missing custom comparators for `React.memo` where dynamically generated `children` defeat memoization.

Proposed Solution:
Implement Bypassed React Render Cycle pattern:
1. Isolate high-frequency state updates from React render cycles.
2. Read continuous states (like `currentTime`) from lock-free `SharedArrayBuffer` directly in leaf nodes.
3. Mutate DOM node inline styles via `useRef` and `requestAnimationFrame`.
4. Fix `React.memo` comparators to explicitly skip dynamically generated `children` and accurately compare targeted derived state (e.g. `dragState?.id === item.id`).

Complexity:
Medium

Expected Gain:
Stable 60–120 FPS timeline interaction and smooth scrubbing with minimal main-thread overhead.

Risk:
Low. Safely isolates rendering logic; won't corrupt project data.

Implementation Plan:
- Refactor `TimelineClip.tsx` and `TimecodeDisplay.tsx` to read shared time using `useRef` and `requestAnimationFrame`.
- Ensure all custom `React.memo` checks (like in `TimelineClip`) bypass the `children` prop.

---

## Finding

Problem:
Memory leaks and high JS heap pressure from persistent `blob:` URLs used for media assets and cache.

Current Implementation:
The application uses traditional Blob URLs (e.g., in `proxyService.ts` and `thumbnailService.ts`) to serve media. Large projects holding many 4K video assets via blobs cause the browser to exhaust RAM and crash.

Performance Cost:
Extreme memory usage, garbage collection pauses, and browser instability on large projects.

Evidence:
- `services/proxyService.ts` calls `URL.createObjectURL(finalBlob)`.
- `services/opfsService.ts` shows an ongoing transition to "Quantum OPFS" but `blob:` URLs are still used as fallbacks.
- Mentioned in `ARCHITECTURAL_AUDIT.md` under "Blob URL Lifetime Management".

Proposed Solution:
Zero-blob OPFS-First Architecture. Migrate all persistent storage (videos, audio, proxies, waveforms, and AI caches) to Origin Private File System (`opfs://`).

Complexity:
Medium

Expected Gain:
Massive reduction in JS heap size. Support for infinite-feeling timeline scalability and extremely large projects.

Risk:
Medium. OPFS API has some browser consistency edge cases, but standard SyncAccessHandles are reliable in Workers.

Implementation Plan:
- Enforce strict `opfs://` usage in `opfsService.ts` and remove `URL.createObjectURL` fallbacks.
- Update `proxyService` and `indexedDbService` to store asset URIs instead of Blob objects.
- Ensure all File/Blob ingestion immediately transfers data to OPFS via `WritableStream` and accesses it via `SyncAccessHandle` in Web Workers.

---

## Finding

Problem:
Object cloning overhead between Main Thread and Web Workers for real-time state synchronization.

Current Implementation:
Workers (Pixi, Decoder, Audio) communicate state via `postMessage()`. While structured cloning is generally optimized, passing continuous state (playhead position, active track state) over messages causes serialization latency and GC pressure.

Performance Cost:
Noticeable latency during scrub and play, especially when coordinating audio and video playback across multiple workers.

Evidence:
- `workers/decoder.worker.ts` and `workers/pixi.worker.ts` import `SharedArrayBuffer` for some sync logic.
- `lib/sharedState.ts` uses `SharedArrayBuffer` to mirror a Float64 binary state.

Proposed Solution:
Data-Oriented Architecture via Shared Memory System. Extend the existing `SharedArrayBuffer` state mirror to fully encompass Timeline State, Track State, Clip State, and Playback State.

Complexity:
High

Expected Gain:
Zero-copy, nanosecond-level synchronization between the UI, rendering engine, and workers. Eliminates GC pressure from message cloning.

Risk:
High. Requires careful synchronization (Atomics) to prevent race conditions and data tearing.

Implementation Plan:
- Flatten nested state objects into Clip, Track, Effect, and Keyframe tables (ECS-style arrays).
- Initialize these tables within a `SharedArrayBuffer`.
- Expose typed views (e.g., `Float64Array`) for workers and the main thread to read/write state using Atomics for synchronization.

---

## Finding

Problem:
Inefficient timeline rendering logic that attempts to process or mount all clips, waveforms, and thumbnails in a project simultaneously.

Current Implementation:
`components/timeline/TimelineTrack.tsx` calculates `visibleItems` using a binary search, which is good, but deeper DOM complexity and off-screen resource generation might still be occurring.

Performance Cost:
O(n) mounting and rendering overhead. Stuttering when zooming or scrolling through complex timelines with thousands of clips.

Evidence:
- The UI DOM footprint grows significantly with project size.
- A basic binary search is implemented in `TimelineTrack.tsx`, but large DOM structures persist.

Proposed Solution:
Viewport-Based Timeline Virtualization combined with Spatial Indexing. Render *only* the clips, keyframes, waveforms, and thumbnails currently visible in the active viewport (plus a small buffer).

Complexity:
High

Expected Gain:
Instantaneous zoom, scroll, and drag operations regardless of project size.

Risk:
Medium. Incorrect spatial indexing could cause clips to "pop" in and out improperly.

Implementation Plan:
- Upgrade the spatial indexing algorithm (e.g., using an Interval Tree) for faster viewport querying.
- Ensure that off-screen items are fully unmounted from the DOM.
- Introduce predictive pre-fetching for thumbnails and waveforms based on scroll velocity.

---

## Finding

Problem:
High decoding and scheduling cost during editing of high-resolution (4K/8K) original media files.

Current Implementation:
The application attempts to play source media or uses rudimentary transcoding. A `proxyService.ts` exists but doesn't seem to enforce proxy-first editing rigidly.

Performance Cost:
Skipped frames, high CPU/GPU usage, and poor seek performance when scrubbing high-res media.

Evidence:
- `services/proxyService.ts` handles proxies, but `ARCHITECTURAL_AUDIT.md` notes VRAM saturation on 4K.

Proposed Solution:
Proxy-First Playback Pipeline. All editing, scrubbing, and previewing must exclusively use lower-resolution (e.g., 720p H.264/WebM) proxies. Source media is used strictly for final export.

Complexity:
Medium

Expected Gain:
Fluid 60FPS playback even with multiple stacked video layers. Drastically reduced VRAM usage.

Risk:
Low. Proxies are industry standard.

Implementation Plan:
- Modify the ingestion pipeline (`nleImportService.ts` / `opfsService.ts`) to auto-generate proxies upon asset import.
- Update the playback engine (Pixi/WebGL) to query the `Proxy Cache` (L3) instead of source media during editing mode.

---

## Finding

Problem:
GPU utilization is primarily restricted to WebGL via PixiJS, limiting access to compute shaders for advanced video processing.

Current Implementation:
`workers/vfxProcessor.worker.ts` and `webgpuSpectral.ts` show early WebGPU compute integration, but core timeline compositing relies on older APIs or CPU-bound canvas manipulation.

Performance Cost:
Effects, color grading, and complex transitions consume excessive CPU or run into WebGL texture limitations.

Evidence:
- `webgpuSpectral.ts` and `compressionService.ts` use WebGPU for specific tasks.
- Core rendering still relies on PixiJS/WebGL (`usePixiRenderer.ts`).

Proposed Solution:
Complete WebGPU rendering pipeline migration for compositing, transitions, and effects.

Complexity:
High

Expected Gain:
Massively parallelized frame processing, lower CPU usage, and support for complex realtime color grading (LUTs) and transitions.

Risk:
High. WebGPU is not universally supported on older browsers, requiring robust WebGL2 fallbacks.

Implementation Plan:
- Design a hybrid rendering graph where WebGPU handles compute-heavy effects and WebGL handles basic compositing if WebGPU is unavailable.
- Move LUT processing and color grading entirely to WebGPU compute shaders.

---

## Finding

Problem:
Main thread is still encumbered by non-UI tasks.

Current Implementation:
While many workers exist (`workerPool.ts` lists several), tasks like file metadata extraction, some AI orchestration (`geminiService.ts`), and cache indexing might still run on the main thread.

Performance Cost:
Main thread lockups leading to dropped frames (jank) during user interaction.

Evidence:
- Initial worker spawn causes a 1.5s freeze (`ARCHITECTURAL_AUDIT.md`).
- File ingestion logic in `opfsService.ts` runs on the main thread before handing off.

Proposed Solution:
Main Thread Elimination. Strictly restrict the main thread to user input and lightweight rendering coordination.

Complexity:
Medium

Expected Gain:
Silky-smooth UI responsiveness at all times, independent of background processing load.

Risk:
Low. Moving logic to workers is generally safe if state synchronization is handled via OPFS/SharedArrayBuffer.

Implementation Plan:
- Implement a Lazy Worker Pool to solve the initial boot freeze.
- Move all AI service orchestration, metadata parsing, and indexing logic into dedicated Web Workers.

---

## Finding

Problem:
Excessive DOM nodes for complex timeline representations.

Current Implementation:
The timeline uses React to render nested DOM nodes for clips, keyframes, waveforms, and tools (`Timeline.tsx`, `TimelineClip.tsx`).

Performance Cost:
Layout thrashing and slow render cycles when dealing with thousands of nodes, even with virtualization.

Evidence:
- Heavy use of `div` tags for `TimelineClip` and its nested handlers.

Proposed Solution:
Canvas Timeline Architecture. Replace the DOM-based timeline track rendering with a 2D Canvas or WebGL implementation.

Complexity:
High

Expected Gain:
Ability to render 10,000+ clips and 100,000+ keyframes effortlessly at 120 FPS.

Risk:
High. Rebuilding the timeline interactions (drag, drop, snap) in Canvas requires writing custom hit-detection and event routing logic.

Implementation Plan:
- Start with a hybrid approach: render waveforms, keyframes, and clip backgrounds on a Canvas, while keeping interactive handles as overlay DOM elements using CSS transforms.

---

## Finding

Problem:
Computational hotspots in TypeScript.

Current Implementation:
Audio processing, waveform generation, and complex timeline algorithms (e.g., ripple edits, snapping logic) are written in TypeScript.

Performance Cost:
Garbage collection pauses and slower execution compared to native code.

Evidence:
- Waveform generation and basic audio decoding occur in `audioDecoder.worker.ts` and `waveformWorker.ts`.

Proposed Solution:
Targeted Rust/WASM implementation for top computational hotspots.

Complexity:
High

Expected Gain:
Near-native speed for media processing and indexing.

Risk:
Medium. Increases build complexity and debugging difficulty.

Implementation Plan:
- Profile the application under heavy load to identify the top 10 hottest TS functions.
- Rewrite the waveform generation algorithm and timeline spatial indexing logic in Rust, compiling to WASM.

---

## Finding

Problem:
Slow startup time and large initial bundle size.

Current Implementation:
`vite.config.ts` has some manual chunking, but the application loads many heavy libraries (FFmpeg, Pixi.js, Gemini API) upfront.

Performance Cost:
Long time-to-interactive (TTI) for users, especially on slower networks.

Evidence:
- "Worker Warm-up Latency" is flagged in `ARCHITECTURAL_AUDIT.md`.

Proposed Solution:
Granular Code Splitting and Cache Hierarchy.

Complexity:
Medium

Expected Gain:
Editor interactive in under 500ms.

Risk:
Low. Standard modern web performance practice.

Implementation Plan:
- Implement aggressive route-level and component-level lazy loading (`React.lazy`).
- Design a Multi-Level Cache Hierarchy:
  - **L1 GPU Cache:** WebGPU Textures (Eviction: LRU).
  - **L2 Decoded Frame Cache:** SharedArrayBuffer ring buffer.
  - **L3 Proxy Cache:** OPFS proxy files.
  - **L4 OPFS Cache:** Original source media in OPFS.
  - **L5 Remote Cache:** Cloud storage/CDN.

## FINAL DELIVERABLE

### Complete Architecture Review
TIMEFRAME Studio is currently operating on a hybrid Desktop-First architecture within a browser environment. It leverages advanced web capabilities like SharedArrayBuffer for zero-latency state synchronization and early integrations of OPFS for persistent storage. However, it still suffers from legacy web patterns—specifically, heavy reliance on React for high-frequency interactive rendering (like Timeline and Waveforms), overuse of main-thread execution, and inefficient asset management via Blob URLs.

To achieve desktop-class performance (comparable to Premiere Pro or DaVinci Resolve), the architecture must fundamentally transition from a "Web App" paradigm to a "Browser-Native OS" paradigm. This involves strict isolation of the React render cycle from continuous events, elimination of all Blob URIs in favor of Quantum OPFS, migrating the data model to an ECS-style Shared Memory structure, and heavily utilizing Workers and WebGPU for all heavy lifting.

### Ranked Bottleneck List
1. **Main-Thread Render Storms:** `mousemove` and `currentTime` prop drilling causing O(N) React re-renders across thousands of DOM nodes.
2. **Blob URL Memory Leaks:** 4K video assets loaded into memory as Blob URLs leading to GC thrashing and VRAM saturation.
3. **Source Media Playback Cost:** Decoding full-resolution H.264/WebM files in the browser instead of lower-resolution proxies.
4. **DOM Timeline Bloat:** Complex hierarchical DOM nodes for clips and keyframes failing to scale past several thousand items despite partial virtualization.
5. **Message Passing Latency:** `postMessage` serialization overhead between the main thread and the 10+ Web Workers.

### Ranked Optimization List
1. **Proxy-First Editing Pipeline:** Transcode all incoming media to 720p proxies automatically; edit on proxies, export on source.
2. **Zero-Blob OPFS Architecture:** Move all media and cache strictly to `opfs://` URIs and SyncAccessHandles.
3. **Bypassed React Render Cycle:** Use `useRef`, `requestAnimationFrame`, and `SharedArrayBuffer` for continuous UI updates (Timecode, Timeline).
4. **Main Thread Isolation:** Shift AI orchestration, metadata parsing, and indexing off the main thread to a Lazy Worker Pool.
5. **SharedArrayBuffer Data Model:** Flatten timeline state into ECS tables accessible to all workers without cloning.
6. **Canvas Timeline Migration:** Render clips, keyframes, and waveforms via 2D Canvas or WebGL instead of DOM nodes.
7. **WebGPU Compute Migration:** Move color grading, LUTs, and transitions entirely to WebGPU compute shaders.
8. **Rust/WASM Waveform Gen:** Rewrite hot path audio processing and waveform indexing in Rust.

### Quick Wins (<1 day)
- **Fix `React.memo` Comparators:** Explicitly skip `children` in custom comparators for `TimelineClip` and properly memoize derived states (e.g., `dragState.id === item.id`).
- **Isolate Timecode:** Refactor `TimecodeDisplay` to use `useRef` and `requestAnimationFrame` bypassing React.
- **Lazy Worker Boot:** Prevent 1.5s startup freeze by staggering the initialization of heavy workers (like export or AI).

### Medium Wins (<1 week)
- **Bypass Timeline Drag Render:** Remove global `mousemove` React state updates in `Timeline` and mutate DOM handles directly via refs.
- **Enforce OPFS Usage:** Strip out `URL.createObjectURL` fallbacks in `proxyService.ts` and `thumbnailService.ts`.
- **Implement Proxies:** Hook the existing transcoding service up to the NLE import pipeline to auto-generate proxies.

### Major Wins (<1 month)
- **Shared Memory Architecture:** Flatten state objects into Clip/Track/Effect arrays stored in a `SharedArrayBuffer`.
- **Main Thread Elimination:** Move all complex metadata extraction and Gemini AI orchestrations to dedicated Web Workers.
- **Viewport Virtualization & Spatial Indexing:** Implement interval trees for precise O(log n) visible clip calculation and predictive thumbnail prefetching.

### Long-term Architecture Changes
- **Canvas/WebGL Timeline:** Completely replace the DOM-based timeline with a custom graphics rendering engine.
- **WebGPU Compositing:** Build a secondary graphics pipeline using WebGPU compute shaders for heavy transitions and color grades.
- **Rust/WASM Core:** Rewrite the core timeline scheduling and spatial indexing algorithms in Rust.

### Risk Assessment
- **SharedArrayBuffer Security:** Requires strict COOP/COEP headers. Will fail in unsecure contexts or environments blocking these headers.
- **OPFS Cross-Browser Compatibility:** While supported in modern browsers, edge cases exist with file-handle exhaustion.
- **WebGPU Support:** Still rolling out. Fallbacks to WebGL are necessary but increase architectural complexity.

### Migration Strategy
1. **Stabilization Phase (Weeks 1-2):** Apply Quick and Medium Wins to eliminate stutter and jank. Fix React renders and switch exclusively to OPFS and Proxy editing.
2. **Decoupling Phase (Weeks 3-6):** Build the SharedArrayBuffer data model and port state management over. Shift non-UI code to workers.
3. **Graphics Phase (Weeks 7-12):** Build the Canvas Timeline and WebGPU compositing layer in parallel with the main app, using feature flags to gradually swap the UI components.

### Estimated Performance Gain per Change
- Proxy-First Editing: 5x-20x smoother playback and 90% reduced VRAM.
- OPFS Migration: Eliminates out-of-memory crashes on massive projects.
- Bypassed React Renders: ~10x improvement in drag/scrub latency (maintaining steady 60-120 FPS).
- Shared Memory Model: Eliminates 10-50ms GC pauses during continuous playback.
- Canvas Timeline: Allows rendering 10k+ clips without DOM lag.

### Estimated Engineering Cost per Change
- React Optimizations: 2-3 Days.
- Proxy & OPFS Migration: 1.5 Weeks.
- Shared Memory Model: 3-4 Weeks.
- Main Thread Isolation: 2 Weeks.
- Canvas Timeline Migration: 6-8 Weeks.
- WebGPU Compositing: 8-12 Weeks.

### Recommended Implementation Order
1. **React Render cycle bypass & Memoization Fixes** (Immediate relief for drag/scroll)
2. **OPFS-first storage transition** (Stops crashing on large projects)
3. **Proxy-first workflow integration** (Fixes playback stutter)
4. **Worker-first architecture & Main Thread Isolation** (Keeps UI responsive)
5. **Timeline virtualization & Spatial Indexing** (Fixes zoom/pan overhead)
6. **SharedArrayBuffer Data Model** (Eliminates GC pauses)
7. **Canvas timeline rendering** (Scales to infinite project sizes)
8. **WebGPU & Rust/WASM Core** (Ultimate computational speedup)
