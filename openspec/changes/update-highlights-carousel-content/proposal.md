## Why

The highlights carousel block currently maps cell[0] to image and cell[1] to title, which no longer matches the document authoring structure used in AEM. The block must be updated to read content from the correct cell positions so authored pages render correctly.

## What Changes

- Update `decorate()` in `highlights-carousel.js` to read card fields from the new cell positions:
  - `cells[0]` → image (`<picture>`)
  - `cells[1]` → alt text for the image
  - `cells[3]` → card title
  - `cells[4]` → card body content
- Apply the alt text from `cells[1]` to the `<img>` element inside the picture
- Remove the old assumption that `cells[1]` is the title and `cells[2+]` is body content

## Capabilities

### New Capabilities

- `highlights-carousel-content-mapping`: Defines the cell-index contract for reading image, alt, title, and body from each card row in the highlights carousel block

### Modified Capabilities

<!-- none -->

## Impact

- `blocks/highlights-carousel/highlights-carousel.js` — `decorate()` function content-parsing logic
- No CSS or carousel behaviour changes
- No breaking changes to the carousel interaction, animations, or markup structure outside of how card data is sourced
