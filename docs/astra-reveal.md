# Astra star field: the entrance

The first time the star field after the footer (`src/components/home/AstraField.tsx`) scrolls into view, the stars arrive instead of appearing all at once: each fades in on its own delay and grows out of a point. The maths lives in `src/lib/astra-reveal.ts`, where it is tested without WebGL.

## What it does

- **Fade, staggered.** `revealProgress(t, seed)` is how far one star has appeared (0 to 1). `t` is the progress of the whole reveal and `seed` is the star's own `delay` (a random number in [0, 1) every star already has). A star with seed 0 starts at once and one with a late seed starts as late as it can and still finishes with the reveal. A slow swell over the whole reveal, from 35% to full strength, brightens the sky as it arrives.
- **Grow from a point.** `revealSize(progress)` is the square root of the progress, so a star grows quickly out of a point and then settles.
- **Positions never change.** The reveal only multiplies each star's alpha and point size. It does not move anything, so the mark's shape, flow and gather are untouched.

## The clock

- `firstSight(startedAt, now)` keeps the time the section was first seen. The first call sets it and later calls keep it, so the entrance runs **once**: stopping and starting the render loop (scrolling the section out of view and back) does not replay it.
- `revealClock(now, startedAt, still)` turns that into a progress from 0 to 1 over `REVEAL_SECONDS` (1.6 s). Before the section has been seen the sky is hidden (0).
- `AstraField` sets the start in `start()` (called by the `IntersectionObserver` when the section first intersects) and reads the clock once per frame.

## Guarantees

- **After the reveal the field is exactly as it was.** `revealProgress` and `revealSize` are exactly 1 at the end for every star, so the alpha and size multipliers are 1.
- **Reduced motion has no entrance.** With `prefers-reduced-motion` the clock returns 1 at once, so every star is at full alpha and size on the first frame. The component already reads the preference each frame.
- **Nothing dims.** A frame-by-frame test at 60 fps checks no star's alpha or size ever goes down.

## Tuning

Change the constants at the top of `astra-reveal.ts`:

| Constant | Meaning |
| --- | --- |
| `REVEAL_SECONDS` | How long the whole entrance takes. |
| `REVEAL_WINDOW` | Share of the entrance that one star's own fade takes. Smaller means more stagger and a sharper pop per star; 1 means every star fades together. |
| `REVEAL_SWELL_START` | How dim the whole sky starts, as a share of full strength. |

## Tests

`src/lib/astra-reveal.test.ts`: the end points, monotonic growth, the stagger, the swell and clamping for each function, the first-sight rule, and a timeline test of the whole entrance.
