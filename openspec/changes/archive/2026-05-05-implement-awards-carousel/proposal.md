## Why

The `awards-carousel` block shell exists (HTML/CSS/JS files, block definition) but has no implementation. It needs to display a horizontally scrollable carousel of award items — logos, titles, and rich body text — consistent with the site's existing `highlights-carousel` engine.

## What Changes

- Implement `awards-carousel.js` — decorate function that builds the carousel DOM from block content rows
- Implement `awards-carousel.css` — card styles specific to awards (logo image, typography, dimensions)

## Capabilities

### New Capabilities

- `awards-carousel-block`: Scrollable carousel of award cards, each with a contained logo image (138px tall, left-aligned), a title (20px), a divider, and rich HTML body content (17px). Cards are 200px wide with 80px gap. Reuses the shared carousel engine pattern from highlights-carousel.

### Modified Capabilities

<!-- none -->

## Impact

- `blocks/awards-carousel/awards-carousel.js` — written from empty
- `blocks/awards-carousel/awards-carousel.css` — written from empty
- No changes to shared scripts, styles, or other blocks
