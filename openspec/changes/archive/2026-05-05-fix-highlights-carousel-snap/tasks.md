## 1. Bug Fix

- [x] 1.1 Update `recalcCardsPerView` in `highlights-carousel.js` to use `Math.floor((slider.offsetWidth + GAP) / stride)`
- [x] 1.2 Update `go()` to snap last card's right edge flush with slider's right edge when at `maxIdx`

## 2. Verification

- [x] 2.1 Verify drag-to-end no longer shows empty space after the last card
- [x] 2.2 Verify resize recalculates correctly and arrows update accordingly
