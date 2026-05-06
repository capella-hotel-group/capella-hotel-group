## Why

The site footer currently has no visual styling — it loads the `/footer` fragment as-is with only minimal padding/max-width. The reference site (capellahotelgroup.com) has a styled footer with brand logos and navigation links on a dark background that needs to be cloned.

## What Changes

- Style `footer.css` to implement the two-column desktop layout (logos left, nav links right) with dark `#242f3a` background
- Mobile: single-column stack (logos row + nav links below)
- 2 brand logos (Capella + Patina) side-by-side with a vertical divider between them
- Nav link list styled as uppercase spaced text on dark background
- Copyright line at the bottom of the nav list
- No changes to `footer.js` — fragment-based approach is retained

## Capabilities

### New Capabilities

- `footer-layout`: Two-column desktop / single-column mobile layout for the footer fragment, including logo section with divider and nav link section styling

### Modified Capabilities

<!-- none -->

## Impact

- `blocks/footer/footer.css`: Full rewrite of footer styles
- No JS changes
- Depends on `/footer` Google Doc fragment structure: section 1 = 2 logo `<p>` tags, section 2 = `<ul>` nav list with copyright as last `<li>`
