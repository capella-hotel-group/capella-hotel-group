## ADDED Requirements

### Requirement: Award cards render from block rows
The block SHALL transform each child row of `.awards-carousel` into a card in the carousel track. Each row's first cell SHALL provide a `<picture>` element, second cell SHALL provide the award title, and all subsequent cells SHALL provide rich HTML body content.

#### Scenario: Row with three cells
- **WHEN** a row has cells: picture | title | body
- **THEN** the card renders a logo image, an h3 title, a divider, and the body content as cloned HTML

#### Scenario: Row with four cells
- **WHEN** a row has cells: picture | title | subtitle | body
- **THEN** all cells from index 2 onward are rendered as body content sections separated by dividers

#### Scenario: Row with empty title
- **WHEN** the title cell is empty
- **THEN** an empty h3 is rendered (no error thrown)

### Requirement: Logo image is contained and left-aligned
The award logo image SHALL be displayed at a fixed height of 138px with `object-fit: contain` and `object-position: left center`, so logos of varying aspect ratios align to the left edge.

#### Scenario: Portrait logo
- **WHEN** the image has a portrait aspect ratio (taller than wide)
- **THEN** the image fits within 138px height, left-aligned, with no cropping

#### Scenario: Landscape logo
- **WHEN** the image has a landscape aspect ratio (wider than tall)
- **THEN** the image fits within 138px height, contained, left-aligned

### Requirement: Card is not interactive
Award cards SHALL be non-clickable `div` elements (not `<a>` anchors). No pointer cursor, no hover link behavior.

#### Scenario: User clicks a card
- **WHEN** the user clicks anywhere on an award card
- **THEN** no navigation occurs and no click handler fires

### Requirement: Carousel navigation
The block SHALL support arrow button navigation and mouse drag to scroll through cards. Cards SHALL snap to the nearest card on release.

#### Scenario: Arrow navigation
- **WHEN** the user clicks the next or previous arrow
- **THEN** the carousel advances or retreats by one card with animation

#### Scenario: Drag to scroll
- **WHEN** the user drags horizontally within the carousel
- **THEN** the track follows the pointer and snaps to the nearest card on release

#### Scenario: No scrolling needed
- **WHEN** all cards fit within the visible slider width
- **THEN** arrow buttons are hidden and drag is disabled
