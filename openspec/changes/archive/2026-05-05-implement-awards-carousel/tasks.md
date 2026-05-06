## 1. JavaScript implementation

- [x] 1.1 Copy carousel engine constants (CARD_W, GAP, ANIM_DURATION) with awards-specific values (200px width, 80px gap)
- [x] 1.2 Copy carousel engine helpers (easeOut, evalTween, initCarousel) into awards-carousel.js
- [x] 1.3 Implement decorate() — build slider wrapper, track, arrow container, drag cursor
- [x] 1.4 Map block rows to cards: picture → image div, cell[1] → h3, cells[2+] → cloned HTML body with hr divider
- [x] 1.5 Use div (not a) for card element — no href, no role="presentation"

## 2. CSS implementation

- [x] 2.1 Declare all .cc-* infrastructure styles (slider, track, arrows, drag cursor) — self-contained, no dependency on highlights-carousel.css
- [x] 2.2 Add .ac-card-wrapper with flex: 0 0 200px
- [x] 2.3 Add .ac-card-image: height 138px, object-fit contain, object-position left center
- [x] 2.4 Add .ac-card-body h3: font-size 20px
- [x] 2.5 Add .ac-card-body p: font-size 17px, rich text defaults (no uppercase, normal weight)
