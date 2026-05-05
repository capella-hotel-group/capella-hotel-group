## Context

The `highlights-carousel` block provides a complete, tested carousel engine (drag, arrow nav, snap, resize). The `awards-carousel` block files exist but are empty. The two carousels share the same interaction model; only card dimensions, image treatment, and typography differ.

## Goals / Non-Goals

**Goals:**
- Implement `awards-carousel.js` by reusing the same carousel engine pattern (constants, `initCarousel`, `decorate`)
- Implement `awards-carousel.css` with award-specific card styles, scoped under `.ac-card-wrapper`
- Preserve rich HTML in body cells (clone children, not `textContent`)
- Card is a non-clickable `div` (not an `<a>`)

**Non-Goals:**
- Modifying the highlights-carousel
- Extracting a shared carousel module (not requested)
- Adding animations or interactions beyond what highlights-carousel provides

## Decisions

**Reuse engine pattern, not shared module**
Copy the carousel engine constants and `initCarousel` function into `awards-carousel.js` rather than importing from highlights-carousel. Reason: blocks are independently deployable in AEM Franklin; shared imports across blocks introduce coupling risk.

**CSS class prefix `.ac-`**
Awards carousel uses `.ac-card-wrapper` and `.ac-card-*` classes so styles are scoped and don't conflict with `.hc-card-wrapper` from highlights-carousel. Shared `.cc-` classes (slider, track, arrows, drag cursor) are defined in highlights-carousel.css and already available globally once that block loads — however, since we can't depend on load order, all `.cc-` styles will be duplicated in awards-carousel.css for safety.

Actually — awards-carousel.css should be self-contained. The `.cc-` classes (slider infrastructure) will be redeclared. This avoids any dependency on highlights-carousel being on the same page.

**Image treatment**
`object-fit: contain` + `object-position: left center` to left-align logos of varying aspect ratios within a fixed 138px tall container.

**Rich HTML body**
Clone cell children (not `textContent`) to preserve `<p>`, `<strong>`, etc.

## Risks / Trade-offs

- **Duplicated `.cc-` CSS**: If the carousel engine styles ever change in highlights-carousel, awards-carousel won't inherit them automatically. Acceptable trade-off for independence.
- **Cell count variance**: Slide 1 has 4 cells (img + title + subtitle + body); others have 3. Using `cells.slice(2)` handles both uniformly — extra cells become additional body content.

