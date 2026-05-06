## Why

The `highlights-carousel` block miscalculates how many cards fit in the viewport, causing the carousel to over-scroll past the last card and reveal empty space. The fix is a one-line correction to `recalcCardsPerView`.

## What Changes

- Fix `recalcCardsPerView()` in `highlights-carousel.js` to account for the trailing gap being absent after the last card.

## Capabilities

### New Capabilities

- `carousel-snap-bounds`: Correct calculation of cards-per-view so `maxIdx` never allows scrolling beyond the last card.

### Modified Capabilities

<!-- None — no spec-level requirement changes, this is a bug fix. -->

## Impact

- `blocks/highlights-carousel/highlights-carousel.js` — one-line change to `recalcCardsPerView`
- No CSS, no API, no dependency changes
