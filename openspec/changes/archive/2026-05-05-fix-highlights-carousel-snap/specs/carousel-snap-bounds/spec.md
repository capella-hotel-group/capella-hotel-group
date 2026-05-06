## ADDED Requirements

### Requirement: Carousel snap respects last-card boundary
The carousel SHALL calculate `cardsPerView` as `Math.floor((sliderWidth + GAP) / stride)` so that `maxIdx` never allows scrolling beyond the last visible card.

#### Scenario: Exact fit — last card fills viewport without trailing gap
- **WHEN** the slider width equals exactly `N * CARD_W + (N-1) * GAP` for some integer N
- **THEN** `cardsPerView` SHALL equal N and `maxIdx` SHALL equal `totalCards - N`

#### Scenario: Drag released past last card
- **WHEN** the user drags the track beyond `maxIdx` position and releases
- **THEN** the carousel SHALL snap back to the last valid index with no empty space visible

#### Scenario: Window resize reduces viewport
- **WHEN** the browser is resized to a narrower width
- **THEN** `recalcCardsPerView` SHALL re-evaluate and clamp `vIdx` so no empty space is shown
