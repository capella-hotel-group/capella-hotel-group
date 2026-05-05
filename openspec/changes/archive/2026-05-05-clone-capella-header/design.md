## Context

The EDS header block (`blocks/header/`) uses the standard AEM Franklin boilerplate: a `/nav` fragment loaded at runtime, split into three sections (`nav-brand`, `nav-sections`, `nav-tools`) via DOM order, with click-based dropdowns rendered as small absolute boxes.

The production site (capellahotelgroup.com) is a Nuxt/Vue app with a bespoke header design:
- SVG compass-star logo (~16×26px)
- `position: sticky` (not fixed) header with white background
- Nav links in Calibre Light, 12px, uppercase, 0.8px letter-spacing
- "Hotels" triggers a full-width dark mega menu bar (not a floated box)
- Mobile: text "MENU" toggle, nav slides down from header, dimming overlay

The current EDS approach is fragment-based (content from `/nav` AEM document), which we keep — only JS decoration and CSS change.

## Goals / Non-Goals

**Goals:**
- Match capellahotelgroup.com header visual design in the EDS block
- Sticky header (white, always visible)
- SVG logo in brand area
- Full-width dark mega menu bar for Hotels (hover on desktop, expand on mobile)
- Mobile slide-down panel with overlay
- Text "MENU" / "CLOSE" toggle on mobile
- Calibre Light font styling on nav links (font already exists in `styles/fonts.css`)

**Non-Goals:**
- Replicating the Nuxt/Vue animation timings exactly (approximation is fine)
- Adding search functionality (existing `search.svg` icon; out of scope here)
- Changing the `/nav` document authoring schema (Hotels sub-links remain a nested `<ul>` in the document)
- Supporting more than one mega-menu item (only Hotels has sub-links today)

## Decisions

### D1: Keep fragment-based nav loading
**Decision**: No change to how content is fetched (`loadFragment('/nav')`).  
**Rationale**: Authoring flow stays intact; only the JS decoration and CSS presentation change. Changing content delivery would require AEM config changes.

### D2: Mega menu via full-width `position: fixed` child `<ul>`
**Decision**: When `[aria-expanded="true"]` on the Hotels `li`, its child `<ul>` is rendered as `position: fixed; left: 0; width: 100%; top: var(--nav-height)` — escaping the nav container entirely.  
**Alternatives considered**:
- `position: absolute` on `nav-wrapper` — would require `overflow: visible` all the way up the stack; fragile
- CSS `width: 100vw; left: calc(-1 * ...)` trick — brittle with changing padding  
**Rationale**: `position: fixed` on the dropdown is clean and reliable given the header itself is `position: sticky` (no containing block for `fixed` descendants to snap to, so it anchors to viewport).

### D3: Hover on desktop, click on mobile
**Decision**: Desktop mega menu opens on `mouseenter`/closes on `mouseleave`. Mobile uses click.  
**Rationale**: Matches live site behaviour confirmed in exploration. Hover is added/removed based on `isDesktop` media query listener (same pattern already used in the boilerplate for `tabindex`).

### D4: "MENU" / "CLOSE" text toggle — no hamburger icon
**Decision**: Replace the `nav-hamburger-icon` span (3-line CSS icon) with a `<span class="nav-hamburger-label">` that reads "MENU" / "CLOSE".  
**Rationale**: Live site uses text. Removes the CSS pseudo-element hamburger entirely.

### D5: Overlay as a sibling div, toggled via class
**Decision**: Append a `<div class="nav-overlay">` as a sibling of `<nav>` inside `nav-wrapper`. Toggle class `is-visible` on menu open/close.  
**Rationale**: Simple, no extra DOM depth. Overlay click closes the menu (same UX as live site).

### D6: SVG logo extracted from live site
**Decision**: Save the Capella compass-star SVG as `icons/capella-star.svg`. Reference it via `<img src="/icons/capella-star.svg">` in the `/nav` document brand section.  
**Rationale**: EDS convention for icons. The existing logo path in boilerplate already renders an `<img>` from whatever is in the nav brand section.

## Risks / Trade-offs

- **`position: fixed` mega menu + sticky header**: If a parent element ever gets `transform`, `perspective`, or `filter` CSS applied, `position: fixed` children will snap to that parent instead of the viewport. → Mitigation: keep header and nav-wrapper free of these properties. Document this constraint.
- **Hover on desktop**: Touch devices that are desktop-width (e.g., iPad Pro landscape) will not trigger `mouseenter`. → Accepted trade-off; click fallback is not added to keep scope tight.
- **Font loading**: Calibre Light is loaded via `fonts.css` with `font-display: swap`. Nav text may flash with system font on first load. → Already present project-wide; no regression.
- **AEM nav document update**: Authors must restructure the `/nav` document to include the Hotels sub-links and the SVG logo. This is a manual authoring step outside code scope. → Document in tasks.

## Open Questions

- Should the header background become transparent when the page hero is directly below it, reverting to white on scroll? (Confirmed: not needed — sticky white always.)
- Should "Home" link be hidden on desktop? (Confirmed: yes, Home is in the nav doc but hidden on desktop via CSS.)
