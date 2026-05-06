## Context

The footer is loaded via EDS fragment pattern (`footer.js` → `loadFragment('/footer')`). The `/footer` Google Doc produces two sections:
- **Section 1**: `default-content-wrapper` with two `<p><picture>` logo elements (Capella, Patina)
- **Section 2**: `default-content-wrapper` with a `<ul>` of nav links + copyright as last `<li>`

No JS changes are needed. All work is pure CSS targeting the existing DOM structure.

## Goals / Non-Goals

**Goals:**
- Dark `#242f3a` background across full footer width
- Desktop (≥900px): two-column flex layout — logos left, nav links right
- Mobile: single-column stack — logos row on top, nav links below
- Two logos side-by-side with a vertical divider between them
- Nav links: uppercase, spaced, light text color
- Copyright `<li>` styled smaller/subtler
- Padding aligned with site container standard (40px sides on desktop, 14.427vw at ≥1440px)

**Non-Goals:**
- Modifying `footer.js`
- Adding social icons (not in current fragment)
- Accordion mobile nav
- Any JS interaction

## Decisions

**CSS-only, no JS parser**
The fragment DOM is stable and predictable. Targeting `.footer > div:nth-child(1)` (logos) and `.footer > div:nth-child(2)` (nav) is sufficient. Avoids unnecessary complexity.

**Logos divider via CSS `::before` on second `<p>`**
Rather than injecting DOM, use `p + p::before` or a CSS border on the second logo `<p>` as a left border to simulate the vertical divider. Clean, no markup changes needed.

**Vertical divider approach**: `border-left: 1px solid rgba(255,255,255,0.3)` + `padding-left` on second logo `<p>`.

**Container padding consistent with site standard**
- 900px+: `padding: 0 40px`
- 1440px+: `padding: 0 14.427vw`

## Risks / Trade-offs

- [Fragment structure dependency] → If the Google Doc `/footer` structure changes (e.g. adds a third section), selectors break. Mitigation: selectors use positional nth-child which is robust to minor content changes within sections.
- [Logo sizing] → SVG logos need explicit sizing otherwise they collapse. Mitigation: set `width`/`height` on `img` in CSS.
