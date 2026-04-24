## 1. Update Content Parsing in highlights-carousel.js

- [ ] 1.1 Replace `cells[1]` title read with `cells[3]` for the card title
- [ ] 1.2 Replace `cells.slice(2)` body content loop with a single read from `cells[4]` for card body text
- [ ] 1.3 Read alt text from `cells[1]` and apply it to the `<img>` element inside the cloned `<picture>`

## 2. Verification

- [ ] 2.1 Confirm cards render image, title, and body correctly with the new cell layout
- [ ] 2.2 Confirm cell index 2 content does not appear in the rendered output
- [ ] 2.3 Confirm rows with fewer than 5 cells do not throw errors and render gracefully
