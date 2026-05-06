## Context

`highlights-carousel` uses a fixed `stride = CARD_W + GAP = 455px` to both lay out cards and calculate how many fit in the viewport. The current formula `Math.floor(sliderWidth / stride)` underestimates by 1 because it assumes each card needs a full stride width — including a trailing gap that doesn't exist after the last card.

**Current state:** `recalcCardsPerView` returns a value 1 too low when the slider is wide enough to show an extra card without its trailing gap. This makes `maxIdx` 1 too high, allowing the track to scroll past the last card.

## Goals / Non-Goals

**Goals:**
- Correct `cardsPerView` so the track never scrolls past the last card
- Keep the fix minimal and local — one arithmetic change

**Non-Goals:**
- Refactoring the carousel engine
- Making stride dynamic or CSS-driven
- Changing responsive breakpoints

## Decisions

**Use `Math.floor((sliderWidth + GAP) / stride)` instead of `Math.floor(sliderWidth / stride)`**

The correct formula derives from: N cards fit when `N*CARD_W + (N-1)*GAP ≤ sliderWidth`, which simplifies to `N ≤ (sliderWidth + GAP) / stride`.

Alternatives considered:
- Measure actual track/card width from the DOM — more accurate but adds complexity and a DOM read on every resize.
- Use CSS scroll-snap — would require significant refactoring of the custom JS engine.

## Risks / Trade-offs

- [GAP value drift] If `GAP` constant is ever changed, both CSS and this formula must stay in sync → Mitigation: constants are co-located at the top of the file.
