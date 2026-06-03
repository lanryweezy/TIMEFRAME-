echo '## 2024-06-03 - Bypassing React render cycle for Timeline audio waveform updates

**Learning:** Passing rapidly updating global state like `currentTime` down through the React component tree (e.g. into `Timeline` -> `trackConfigs` -> `Waveform`) causes cascading re-renders across the entire Timeline, significantly degrading playback performance. The `Waveform` component can independently access `currentTime` via a lock-free shared state (`readSharedTime()`) and directly mutate the DOM in a `requestAnimationFrame` loop, completely eliminating React re-render overhead.

**Action:** When a leaf component needs continuous high-frequency updates that don'\''t affect layout or other components, do not pass the value as a prop. Instead, have the component read from shared memory/refs and use `requestAnimationFrame` to apply styles directly to the DOM.' >> .jules/bolt.md
