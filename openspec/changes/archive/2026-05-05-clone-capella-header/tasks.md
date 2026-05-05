## 1. Assets

- [x] 1.1 Create `icons/capella-star.svg` with the Capella compass-star SVG extracted from the live site

## 2. Header CSS

- [x] 2.1 Make header sticky: set `position: sticky; top: 0` on `.nav-wrapper`, remove `position: relative` override on desktop
- [x] 2.2 Style nav links: Calibre Light, 12px, uppercase, 0.8px letter-spacing
- [x] 2.3 Hide `.nav-home` (Home link) on desktop (≥900px), show in mobile menu
- [x] 2.4 Style the full-width Hotels mega menu bar: `position: fixed; left: 0; width: 100%; top: var(--nav-height); background: #242f3a; height: 50px; display: flex; align-items: center; gap: 48px; padding: 0 48px`
- [x] 2.5 Style mega menu links (white, Calibre Light, 12px, uppercase)
- [x] 2.6 Replace hamburger icon CSS with "MENU"/"CLOSE" text label styles
- [x] 2.7 Add `.nav-overlay` styles: full-screen semi-transparent dark backdrop, hidden by default, visible when `is-visible`
- [x] 2.8 Add slide-down mobile nav panel animation (`max-height` or `transform` transition)

## 3. Header JS

- [x] 3.1 Replace hamburger icon `<span>` with `<span class="nav-hamburger-label">MENU</span>` and toggle to "CLOSE" on open
- [x] 3.2 Append `<div class="nav-overlay">` inside `nav-wrapper`; wire overlay click to close the menu
- [x] 3.3 Add `nav-home` class to the first nav item (Home) so CSS can hide it on desktop
- [x] 3.4 On desktop: wire `mouseenter`/`mouseleave` on the Hotels `li` and its child `ul` to toggle `aria-expanded`; remove click handler for Hotels on desktop
- [x] 3.5 On mobile: retain click-to-expand for Hotels sub-links
- [x] 3.6 Ensure `isDesktop` change listener adds/removes hover handlers correctly (already has listener — extend it)
