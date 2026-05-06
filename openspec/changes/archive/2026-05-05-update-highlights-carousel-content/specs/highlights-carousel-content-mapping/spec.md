## ADDED Requirements

### Requirement: Cell index mapping for card content
The highlights carousel block SHALL read card content from each row using the following fixed cell indices:
- `cells[0]`: image (`<picture>` element)
- `cells[1]`: alt text string for the image
- `cells[3]`: card title text
- `cells[4]`: card body text
Cell index 2 SHALL be ignored.

#### Scenario: Image is read from cells[0]
- **WHEN** a card row is processed
- **THEN** the `<picture>` element is sourced from `cells[0]`

#### Scenario: Alt text is read from cells[1] and applied to the image
- **WHEN** a card row is processed and `cells[1]` contains text
- **THEN** the `alt` attribute of the `<img>` inside the cloned `<picture>` SHALL be set to the trimmed text content of `cells[1]`

#### Scenario: Cell index 2 is ignored
- **WHEN** a card row is processed
- **THEN** the content of `cells[2]` SHALL NOT appear in the rendered card

#### Scenario: Title is read from cells[3]
- **WHEN** a card row is processed
- **THEN** the card `<h3>` title text SHALL equal the trimmed text content of `cells[3]`

#### Scenario: Body is read from cells[4]
- **WHEN** a card row is processed
- **THEN** the card body `<p>` text SHALL equal the trimmed text content of `cells[4]`

#### Scenario: Row with fewer than 5 cells degrades gracefully
- **WHEN** a card row has fewer cells than expected
- **THEN** missing fields SHALL default to empty string and the card SHALL still render without throwing an error
