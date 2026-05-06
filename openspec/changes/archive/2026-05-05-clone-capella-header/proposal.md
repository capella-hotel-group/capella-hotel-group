## Why

The current EDS header block uses a generic boilerplate with a document-based logo, basic dropdown boxes, and no brand identity. This change clones the production header from capellahotelgroup.com to establish consistent visual branding across the AEM EDS implementation.

## What Changes

- Replace the generic nav brand placeholder with the Capella compass-star SVG logo
- Replace the standard dropdown with a full-width dark mega menu bar for the "Hotels" nav item (hover-triggered on desktop)
- Replace the hamburger icon toggle with a text "MENU" trigger on mobile
- Add a slide-down mobile nav panel with a dimming overlay
- Make the header sticky (not `position: relative`) on desktop
- Apply Calibre Light font, 12px, uppercase, 0.8px letter-spacing to nav items
- Match the live site's nav link set: Home, About Us, Leadership, Hotels, Residences, Development, Community, People (Hotels has two sub-links: Capella Hotels and Resorts, Patina Hotels & Resorts)

## Capabilities

### New Capabilities
- `capella-header`: The branded header block — SVG logo, sticky positioning, styled nav links, mega menu for Hotels, and slide-down mobile menu with overlay

### Modified Capabilities
<!-- none -->

## Impact

- `blocks/header/header.js` — rewritten decoration logic
- `blocks/header/header.css` — full visual restyle
- `icons/capella-star.svg` — new icon file
- `/nav` document (AEM authored content) — authors must update with correct link structure
- No breaking changes to other blocks
