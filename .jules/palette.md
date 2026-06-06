## 2024-06-01 - Accessible Hover-Revealed Window Controls
**Learning:** Icon-only controls that are revealed on hover (like panel dock/close buttons) are a double accessibility risk: they lack semantic text for screen readers, and their purpose isn't immediately obvious to sighted users who discover them via hover or focus.
**Action:** Always pair `aria-label` (with descriptive context, e.g. "Dock [Panel Name] panel") and `title` (for sighted users) on hover-revealed window/panel controls.
## 2025-05-31 - Internal Navigation Links
**Learning:** `LandingPage.tsx` handles routing to internal pages like `PricingPage`, `AboutPage`, and `CaseStudyPage` through an `onNavigate` prop (`setCurrentPage`). Using standard anchor tags (`<a href="#">`) in subcomponents like headers and footers prevents users from accessing these mapped pages.
**Action:** When adding links to landing page subcomponents (`LandingHeader`, `LandingFooter`), always use `<button onClick={() => onNavigate('page-name')}>` instead of anchor tags to ensure seamless state-based navigation.
## 2024-06-06 - Accessible Custom Toggle Groups
**Learning:** When building custom two-state toggles (like Monthly/Annual billing) using `button` elements instead of standard radio inputs, screen readers lack context about the relationship between the buttons and their active state.
**Action:** Always wrap custom button-based toggles in a `role="group"` container with an `aria-label`, and use `aria-pressed={true/false}` on the individual buttons to explicitly communicate their selected state. Ensure clear visual focus indicators (e.g., `focus-visible:ring-2`) since custom UI often removes default browser outlines.
