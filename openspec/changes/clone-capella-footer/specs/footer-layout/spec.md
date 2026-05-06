## ADDED Requirements

### Requirement: Footer dark background
The footer SHALL display a dark `#242f3a` background color across the full viewport width with white/light text.

#### Scenario: Background applied
- **WHEN** the footer fragment is loaded
- **THEN** the footer element has background-color `#242f3a` and light-colored text

---

### Requirement: Desktop two-column layout
On viewports ≥900px, the footer SHALL display a two-column flex layout with logos on the left and nav links on the right.

#### Scenario: Desktop layout
- **WHEN** viewport width is ≥900px
- **THEN** logos section and nav section are displayed side by side horizontally
- **THEN** logos section is left-aligned and nav section fills the remaining space

---

### Requirement: Mobile single-column layout
On viewports <900px, the footer SHALL stack logos above nav links in a single column.

#### Scenario: Mobile layout
- **WHEN** viewport width is <900px
- **THEN** logos section appears above nav links section
- **THEN** both sections are full-width

---

### Requirement: Brand logos side-by-side with divider
The two brand logos (Capella and Patina) SHALL be displayed horizontally side-by-side with a vertical divider between them.

#### Scenario: Logos with divider
- **WHEN** the footer logo section renders
- **THEN** Capella logo and Patina logo appear in the same row
- **THEN** a vertical line divider is visible between the two logos

---

### Requirement: Nav links styled
The footer nav `<ul>` SHALL be styled as uppercase, letter-spaced text with no list bullets, light color on dark background.

#### Scenario: Nav link appearance
- **WHEN** footer nav links render
- **THEN** links have no bullet points, are uppercase, letter-spaced, and legible on dark background

---

### Requirement: Copyright line
The copyright `<li>` (last item in the nav list) SHALL be visually distinct — smaller font size and reduced opacity.

#### Scenario: Copyright distinct style
- **WHEN** the last `<li>` in footer nav renders
- **THEN** it appears smaller and less prominent than the nav links above it

---

### Requirement: Container padding alignment
The footer content SHALL be padded to align with the site container (40px sides at ≥900px, `14.427vw` at ≥1440px).

#### Scenario: Padding at 900px+
- **WHEN** viewport ≥900px
- **THEN** footer content has 40px left and right padding

#### Scenario: Padding at 1440px+
- **WHEN** viewport ≥1440px
- **THEN** footer content has `14.427vw` left and right padding
