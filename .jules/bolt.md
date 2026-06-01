## 2024-05-31 - React.memo with Custom Comparator on High Frequency Renders

**Learning:** When components render frequently due to rapid prop updates (like `currentTime` during playback), using `React.memo` *without* a custom comparison function might still cause unnecessary renders if the reference to `currentTime` is passed but the component only needs to re-render based on a derived condition (e.g. `isActive = currentTime >= start && currentTime <= end`). A custom comparator avoids re-renders on every single frame if the derived state hasn't changed.

**Action:** Implement `React.memo` with a custom comparator for `TimelineClip` so it only re-renders when it transitions between active and inactive states, rather than on every tick of `currentTime`.
