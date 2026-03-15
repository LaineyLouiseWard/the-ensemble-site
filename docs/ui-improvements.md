# UI Improvement Proposals

Reviewed 2026-03-15. Core concept: playful pixel-art blog for postgrads, welcoming and low-pressure.

## Hero height

The hero is currently `min-h-[60vh] sm:min-h-[68vh] lg:min-h-[70vh]` — too tall on desktop, pushing Featured cards fully below the fold.

**Goal:** Trim the top of the sky so Featured card images are fully visible above the fold, without making the hero feel tiny. The title position (`pt-36`) must not change. The cloud and tree layers are bottom-anchored so they won't be clipped — only the empty sky gradient shortens.

**Suggested starting point:** `min-h-[50vh] sm:min-h-[52vh] lg:min-h-[55vh]` — tune by eye to hit the sweet spot where Featured images peek in full.

## Calls to contribute (high priority)

The site's purpose is inviting postgrads to write, but there's no visible entry point for that anywhere.

### E. "Contribute" link in nav
Add a nav link styled slightly differently (pixel-bordered button or accent colour) to signal it's an action, not a page. Links to the contribution guide or `instructions-for-authors` post.

### F. "Join the Ensemble" card on authors page
Add a final grid item on `/authors/` — dashed border, blank avatar silhouette or `+` icon, inviting text. Links to contribution guide. Turns a sparse 3-person grid into a deliberate invitation.

### A. "Write with us" prompt on homepage
A small pixel-art character (from the avatar set) with a one-line invitation between the category strip and Featured. Not a banner — in the pixel-art voice.

## Pixel aesthetic consistency (medium priority)

Pixel art appears in hero, avatars, weather icons, sun/moon, calendar icons — but not in navigation, dividers, buttons, or cards.

### D. Pixel logo/icon in nav
Small 24x24 sprite to the left of the nav pill. Anchors the pixel identity in persistent UI.

### B. Pixel icons on category strip
Small pixel-art icons per track (mortar board, calendar, speech bubble, microscope) alongside the text labels. Brings the aesthetic into the IA layer.

### K. Pixel-art section dividers
Thin repeating sprite strip (grass, clouds, geometric tile) as horizontal rules between homepage sections. `image-rendering: pixelated`.

### L. Pixel-flavoured blog card hover
Blocky border on hover (`border-radius: 0`, visible pixel-width border) instead of the current subtle transition.

## Visual hierarchy and tone (medium priority)

### C. Soften section headers
`FEATURED` / `LATEST` in all-caps Inter tracking reads as formal editorial. Lowercase them, use the display serif, or pair with a small decorative pixel element.

### J. Elevate Converge/Diverge display
Currently a single line of grey text. Give it pixel-art buttons/icons, colour (green/amber), or at minimum a bordered container. This is one of the site's most distinctive features.

### N. Label the weather widget
Change footer heading from "UCD" to something that makes the liveness obvious: "Right now at UCD" or "Outside the office."

## Content and copy (lower priority)

### G. Rewrite authors page intro
Replace "Meet the ensemble of researchers behind The Ensemble Edit" (self-referential) with something warmer and shorter.

### H. CTA at end of About page
After the final paragraph: "Interested in writing? Here's how to get started." with a link. The about page is where potential contributors land.

### I. Decorative break on About page
Pixel-art divider between the philosophical framing (paragraphs 1-3) and practical description (paragraphs 4-5).

### M. Pixel-art 404 page
Full-screen pixel-art moment — lost character in the parallax landscape, "You've wandered off the path."