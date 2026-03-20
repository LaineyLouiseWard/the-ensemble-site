# UI Review — Round 2: Pixel Playfulness & Polish

Small, low-effort tweaks that lean into the pixel aesthetic. Ordered by impact-to-effort ratio.

---

## A. Lainey avatar pixel-jump on hover

**Where:** Footer contribute column, About page bubble avatar, 404 page avatar, author cards
**What:** A 2-frame pixel hop (translate up 4px, back down) on hover. Classic retro "character select" feel.
**How:** Single `@keyframes pixel-hop` in global.css, applied via `.pixel-hop:hover`. ~5 lines of CSS.

```css
@keyframes pixel-hop {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
.pixel-hop:hover { animation: pixel-hop 0.3s steps(2); }
```

---

## B. Speech bubble wiggle on hover

**Where:** About page `.pixel-bubble`
**What:** Slight rotation wiggle (±1.5deg) when hovered — like tapping a speech bubble in a game dialogue.
**How:** `@keyframes wiggle` with `steps()` for a pixel-snapped feel. ~6 lines.

```css
@keyframes pixel-wiggle {
  0%, 100% { transform: rotate(0); }
  25%      { transform: rotate(-1.5deg); }
  75%      { transform: rotate(1.5deg); }
}
.pixel-bubble:hover { animation: pixel-wiggle 0.4s steps(4); }
```

---

## C. Track icons bounce on category strip hover

**Where:** Homepage track nav strip (`/tracks/` links with pixel icons)
**What:** The small track icon does a single bounce when its link is hovered. Reuses `pixel-hop` from (A).
**How:** Add `.pixel-hop` class to the `<img>` inside each track link. Already have the keyframe from (A). ~0 new lines.

---

## D. BlogCard pixel-border highlight

**Where:** BlogCard component
**What:** On hover, the existing transparent border changes to a dashed/pixel-stepped style — like a selection box in a pixel editor. Uses `border-style: dashed` with `border-width: 2px` already in place.
**How:** Change `hover:border-foreground/20` to `hover:border-dashed hover:border-foreground/25`. ~1 class swap.

---

## E. Tag pills hover pop

**Where:** Tag pills on blog listing, track pages, blog post footers
**What:** On hover, pill scales up slightly with a `steps(1)` snap (instant, no easing — feels pixelated).
**How:** Add `hover:scale-105 transition-transform duration-0` to tag `<a>` classes. ~2 extra Tailwind classes.

---

## F. 404 avatar idle animation

**Where:** 404 page lainey avatar
**What:** Gentle idle "breathing" — a slow 2-frame vertical bob on loop, so the page feels alive even when static.
**How:** New `@keyframes pixel-idle` with `steps(2)`, applied unconditionally (not just hover). Wrap in `prefers-reduced-motion` check.

```css
@keyframes pixel-idle {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2px); }
}
```

---

## G. Dark/light sun-moon transition sound cue (stretch)

**Where:** ParallaxHero sun/moon toggle
**What:** Tiny `<audio>` blip (8-bit style, <1s) on theme toggle. Strictly optional — delightful but potentially annoying.
**Verdict:** Skip unless you find a good royalty-free 8-bit chime. Mention as a "maybe later."

---

## H. Scroll-to-top pixel arrow

**Where:** Bottom-right corner, appears after scrolling past the hero
**What:** A small pixel-art up-arrow (▲ or a custom 16×16 PNG) that fades in on scroll and smoothly scrolls to top on click.
**How:** ~15 lines of inline JS + a few Tailwind classes. Use `IntersectionObserver` on hero to toggle visibility.

---

## Priority order

| # | Item | Effort | Impact |
|---|------|--------|--------|
| A | Avatar pixel-hop | ~5 min | High — instantly playful |
| B | Bubble wiggle | ~5 min | Medium — reinforces pixel theme on About |
| C | Track icon bounce | ~1 min | Medium — reuses (A), free win |
| D | BlogCard pixel border | ~2 min | Medium — subtle but cohesive |
| E | Tag pill pop | ~1 min | Low-medium — small detail |
| F | 404 idle animation | ~5 min | Medium — makes 404 memorable |
| H | Scroll-to-top arrow | ~15 min | Medium — utility + aesthetic |
| G | Sound cue | ~30 min | Low — risky UX, skip for now |

---

## Notes

- All CSS animations should use `steps()` easing to maintain the pixel-art feel (no smooth interpolation).
- Wrap looping animations in `@media (prefers-reduced-motion: no-preference)` for accessibility.
- The site currently has **zero `@keyframes`** — adding a small shared set in `global.css` keeps things centralised.
