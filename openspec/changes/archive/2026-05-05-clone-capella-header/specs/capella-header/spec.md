## ADDED Requirements

### Requirement: Header is sticky
The header SHALL remain visible at the top of the viewport at all times while scrolling. The background SHALL be solid white.

#### Scenario: Header stays visible on scroll
- **WHEN** the user scrolls the page down
- **THEN** the header remains fixed at the top of the viewport

#### Scenario: Header has white background
- **WHEN** the header is rendered
- **THEN** the background colour is white at all scroll positions

### Requirement: Capella SVG logo in brand area
The nav brand area SHALL display the Capella compass-star SVG logo. The logo SHALL link to the homepage (`/`).

#### Scenario: Logo renders
- **WHEN** the header is loaded
- **THEN** the compass-star SVG is visible in the top-left brand area

#### Scenario: Logo links home
- **WHEN** the user clicks the logo
- **THEN** the browser navigates to `/`

### Requirement: Nav link typography
All top-level navigation links SHALL be rendered in Calibre Light, 12px, uppercase, with 0.8px letter-spacing.

#### Scenario: Nav links styled correctly
- **WHEN** the header is rendered on desktop
- **THEN** nav links appear in Calibre Light at 12px, uppercase, 0.8px letter-spacing

### Requirement: Home link hidden on desktop
The "Home" nav link SHALL be hidden on desktop (≥900px) and visible in the mobile menu.

#### Scenario: Home hidden desktop
- **WHEN** the viewport is ≥900px
- **THEN** the Home link is not visible in the nav bar

#### Scenario: Home visible mobile
- **WHEN** the mobile menu is open
- **THEN** the Home link is visible in the slide-down panel

### Requirement: Hotels mega menu (desktop hover)
On desktop (≥900px), hovering over the "Hotels" nav item SHALL reveal a full-width dark bar below the header containing the Hotels sub-links. The bar SHALL close when the cursor leaves the Hotels item or the mega menu bar.

#### Scenario: Mega menu opens on hover
- **WHEN** the user hovers over "Hotels" on desktop
- **THEN** a full-width dark bar (`#242f3a`, 50px tall) appears immediately below the header with "Capella Hotels and Resorts" and "Patina Hotels & Resorts" links

#### Scenario: Mega menu closes on mouse leave
- **WHEN** the user moves the cursor away from both the Hotels item and the mega menu bar
- **THEN** the mega menu bar is hidden

#### Scenario: Sub-links navigate correctly
- **WHEN** the user clicks "Capella Hotels and Resorts" in the mega menu
- **THEN** the browser navigates to `https://www.capellahotels.com/` (opens in new tab)
- **WHEN** the user clicks "Patina Hotels & Resorts" in the mega menu
- **THEN** the browser navigates to `https://patinahotels.com/` (opens in new tab)

### Requirement: Mobile MENU text toggle
On mobile (<900px) the hamburger icon SHALL be replaced with a text label "MENU". When the menu is open the label SHALL change to "CLOSE".

#### Scenario: MENU label shown mobile
- **WHEN** the viewport is <900px and the nav is closed
- **THEN** a text button reading "MENU" is visible in the header bar

#### Scenario: Label changes on open
- **WHEN** the user taps "MENU"
- **THEN** the label changes to "CLOSE"

### Requirement: Mobile slide-down nav panel
On mobile (<900px), tapping "MENU" SHALL slide the nav panel down from the header. A semi-transparent dark overlay SHALL cover page content below the header. Tapping the overlay or "CLOSE" SHALL close the panel.

#### Scenario: Panel slides down
- **WHEN** the user taps "MENU" on mobile
- **THEN** the nav panel animates sliding down from below the header bar

#### Scenario: Overlay appears
- **WHEN** the mobile nav panel is open
- **THEN** a semi-transparent dark overlay covers the page content below the header

#### Scenario: Overlay tap closes menu
- **WHEN** the user taps the overlay
- **THEN** the nav panel slides back up and the overlay disappears
