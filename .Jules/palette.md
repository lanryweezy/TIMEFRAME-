## 2023-10-27 - Icon-only buttons lacking ARIA labels
**Learning:** Many interactive icon-only buttons across components (e.g., Timeline controls, Asset Universe zoom, Video Player director wheel) lack `aria-label`s, rendering them inaccessible to screen readers.
**Action:** Always add descriptive `aria-label` attributes to icon-only buttons, using dynamic labels (e.g. `aria-label={isPlaying ? 'Pause' : 'Play'}`) where state dictates function.
