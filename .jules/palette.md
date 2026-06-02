## 2024-06-01 - Accessible Hover-Revealed Window Controls
**Learning:** Icon-only controls that are revealed on hover (like panel dock/close buttons) are a double accessibility risk: they lack semantic text for screen readers, and their purpose isn't immediately obvious to sighted users who discover them via hover or focus.
**Action:** Always pair `aria-label` (with descriptive context, e.g. "Dock [Panel Name] panel") and `title` (for sighted users) on hover-revealed window/panel controls.
