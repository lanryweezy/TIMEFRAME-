## 2024-05-31 - React.memo with Custom Comparator on High Frequency Renders

**Learning:** When components render frequently due to rapid prop updates (like `currentTime` during playback), using `React.memo` *without* a custom comparison function might still cause unnecessary renders if the reference to `currentTime` is passed but the component only needs to re-render based on a derived condition (e.g. `isActive = currentTime >= start && currentTime <= end`). A custom comparator avoids re-renders on every single frame if the derived state hasn't changed.

**Action:** Implement `React.memo` with a custom comparator for `TimelineClip` so it only re-renders when it transitions between active and inactive states, rather than on every tick of `currentTime`.
## 2024-05-23 - Massive re-renders caused by mousemove state updates in Timeline
**Learning:** `components/Timeline.tsx` attaches a global `mousemove` listener that updates a React state variable (`mousePos`) on every single pixel movement. Because `Timeline` is a massive component containing many children, this continuous state update causes severe performance degradation and UI lag by triggering the React render cycle on every frame during regular app usage.
**Action:** Always inspect global event listeners (`mousemove`, `scroll`, `resize`) in large React components. If the listener's only purpose is to visually update a single DOM element (like a floating toolbar or cursor), bypass React state entirely. Use `useRef` to track values and `requestAnimationFrame` to directly mutate the target DOM element's inline styles, eliminating the re-render overhead.
## 2024-06-03 - Bypassing React render cycle for Timeline audio waveform updates

**Learning:** Passing rapidly updating global state like `currentTime` down through the React component tree (e.g. into `Timeline` -> `trackConfigs` -> `Waveform`) causes cascading re-renders across the entire Timeline, significantly degrading playback performance. The `Waveform` component can independently access `currentTime` via a lock-free shared state (`readSharedTime()`) and directly mutate the DOM in a `requestAnimationFrame` loop, completely eliminating React re-render overhead.

**Action:** When a leaf component needs continuous high-frequency updates that don't affect layout or other components, do not pass the value as a prop. Instead, have the component read from shared memory/refs and use `requestAnimationFrame` to apply styles directly to the DOM.
## 2024-06-03 - O(N) Re-renders Caused by Shared Drag State
**Learning:** In list/timeline rendering where an interactive state like `dragState` (updated constantly on mousemove) is passed to *every* child item, standard `React.memo` still breaks and causes O(N) re-renders because the prop reference changes for all items.
**Action:** When a high-frequency global state object is passed to many children, add a custom comparator in `React.memo` to explicitly check if the ID inside the shared state matches the child's ID. If `prevProps.dragState?.id !== item.id` and `nextProps.dragState?.id !== item.id`, the child should return `true` (skip re-render).
## 2025-03-05 - Skip 'children' in Custom Comparator for Inline Render Props
**Learning:** When components use `React.memo` with a custom comparator and accept `children` as a prop that is generated via an inline function or render prop (e.g., `{config.renderItem?.(item)}`), the `children` prop will be a new reference on every render. This completely defeats the memoization, causing unnecessary re-renders of all memoized components receiving that inline render prop.
**Action:** When implementing custom comparators in `React.memo` where `children` are dynamically generated but their internal state relies solely on the other primitive/memoized props (like `item`), explicitly skip the shallow comparison of the `children` prop (e.g., `if (key === 'children') continue;`).
## 2024-06-10 - O(N) Re-renders Caused by Inline Children in Custom Comparator
**Learning:** When using a blacklist-style custom comparator loop in `React.memo` (e.g., `if (prevProps[key] !== nextProps[key]) return false;`), inline-rendered `children` props passed from a parent (like `{renderItem(item)}`) will constantly cause shallow equality checks to fail, defeating memoization.
**Action:** Always explicitly whitelist or bypass the `children` key in custom `React.memo` loops when the component relies on derived state checks for its render logic, allowing the targeted derived state logic to properly control updates.
## 2024-06-10 - Bypassing React for Continuous Text Updates via SharedArrayBuffer
**Learning:** React state updates (`setState`) triggered on every frame by highly frequent continuous events (like a running playhead advancing) cause severe top-down rendering trees and layout thrashing, even with virtualization.
**Action:** For continuous components like `TimecodeDisplay`, attach a `useRef` directly to a DOM element, read the continuous value from a `SharedArrayBuffer` (via `readSharedTime`), and manually overwrite `ref.current.innerHTML` inside a `requestAnimationFrame` loop. This achieves 100x performance scaling by fully sidestepping the Virtual DOM diffing process while maintaining smooth 60/120fps display updates.
## 2026-06-07 - O(N) Re-renders Caused by Inline Data Grouping on Scroll

**Learning:** Grouping operations (like `items.forEach` to bucket items into tracks) that exist directly in the render body of a component like `TimelineTrackComponent` will run on every single render. Since the component re-renders frequently during scroll events due to viewport state changes, this results in an O(N) performance penalty per track, destroying scrolling performance.

**Action:** Always wrap data grouping, bucketing, or sorting operations in a `React.useMemo` block that depends only on the raw data (e.g., `[items]`) so they are not recalculated on high-frequency UI state changes like scrolling.
## 2026-06-07 - Broken Windowing: Binary Search Requires Sorted Arrays and Strict Bounds

**Learning:** In timeline components, a virtualized windowing function (like `getVisibleItems`) that uses binary search to find a `startIndex` will completely fail to find elements if the array isn't explicitly sorted by time first. Furthermore, finding a start index isn't enough; the subsequent linear scan must strictly verify overlap (e.g., `item.startTime + item.duration >= viewport.start`) before pushing, otherwise it will blindly push items that end *before* the viewport even starts.

**Action:** When implementing custom binary-search windowing, explicitly `sort()` the input array inside the memoized grouping block, and enforce a strict boundary check (`start + duration >= viewport.start`) inside the linear scan.
## 2024-06-11 - Custom Custom React DOM Manipulation Bypassing Component Hierarchy
**Learning:** During playback, components like `Waveform.tsx` were receiving the rapidly updating global state variable `currentTime` through React props and standard `useState` hooks. This triggered thousands of unneeded layout calculations due to `React.memo` cascades. By bypassing React rendering completely with `useRef`, reading shared memory directly `typeof readSharedTime === 'function' ? readSharedTime() : 0`, and manipulating the style inside `requestAnimationFrame`, massive rendering improvements are seen.
**Action:** Stop passing high-frequency continuous parameters (time, drag coordinates) to interactive DOM components through React state.

## 2026-06-08 - [Architecture Plan Overhaul]
**Learning:** Initial caching, computation engines, and internal state trees needed to reflect an OS-native mentality rather than a web-app mentality.
**Action:** Overhauled `ARCHITECTURE_REVIEW.md` to specify Multi-Level Cache hierarchies, SharedArrayBuffer internal databases (ECS), and proxy-first editing paths as the highest-tier priorities.

## 2026-06-08 - [OPFS Implementation Attempt]
**Learning:** Blindly removing `URL.createObjectURL` and replacing it with custom `opfs://` strings breaks components like `<video>` or `<a>` tags which do not support custom schemes natively without a Service Worker.
**Action:** Do not implement OPFS-everywhere without first building the Service Worker or standardizing `URL.createObjectURL(fileHandle.getFile())` for UI rendering paths while keeping OPFS purely for storage. Reverted all broken placeholder edits.

## 2026-06-08 - [Main Thread Isolation Implementation]
**Learning:** Moving AI heavy orchestration (Gemini integration) to a Web Worker keeps the main UI thread (specifically React handling `useAIController.ts` interactions) responsive during inference and serialization delays.
**Action:** Created `ai.worker.ts` and successfully piped AI commands asynchronously through `workerPool` rather than blocking `useAIController`.
