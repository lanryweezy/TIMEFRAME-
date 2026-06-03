## 2024-05-31 - React.memo with Custom Comparator on High Frequency Renders

**Learning:** When components render frequently due to rapid prop updates (like `currentTime` during playback), using `React.memo` *without* a custom comparison function might still cause unnecessary renders if the reference to `currentTime` is passed but the component only needs to re-render based on a derived condition (e.g. `isActive = currentTime >= start && currentTime <= end`). A custom comparator avoids re-renders on every single frame if the derived state hasn't changed.

**Action:** Implement `React.memo` with a custom comparator for `TimelineClip` so it only re-renders when it transitions between active and inactive states, rather than on every tick of `currentTime`.
## 2024-05-23 - Massive re-renders caused by mousemove state updates in Timeline
**Learning:** `components/Timeline.tsx` attaches a global `mousemove` listener that updates a React state variable (`mousePos`) on every single pixel movement. Because `Timeline` is a massive component containing many children, this continuous state update causes severe performance degradation and UI lag by triggering the React render cycle on every frame during regular app usage.
**Action:** Always inspect global event listeners (`mousemove`, `scroll`, `resize`) in large React components. If the listener's only purpose is to visually update a single DOM element (like a floating toolbar or cursor), bypass React state entirely. Use `useRef` to track values and `requestAnimationFrame` to directly mutate the target DOM element's inline styles, eliminating the re-render overhead.
## 2024-06-03 - Bypassing React render cycle for Timeline audio waveform updates

**Learning:** Passing rapidly updating global state like `currentTime` down through the React component tree (e.g. into `Timeline` -> `trackConfigs` -> `Waveform`) causes cascading re-renders across the entire Timeline, significantly degrading playback performance. The `Waveform` component can independently access `currentTime` via a lock-free shared state (`readSharedTime()`) and directly mutate the DOM in a `requestAnimationFrame` loop, completely eliminating React re-render overhead.

**Action:** When a leaf component needs continuous high-frequency updates that don't affect layout or other components, do not pass the value as a prop. Instead, have the component read from shared memory/refs and use `requestAnimationFrame` to apply styles directly to the DOM.
