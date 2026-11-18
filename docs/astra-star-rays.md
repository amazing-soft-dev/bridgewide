# Astra star field: openai.com's star model

The stars in the star field after the footer (`src/components/home/AstraField.tsx`) are drawn with the star model openai.com ships for its Astra hero, read from its shader chunk and scene config (#432). The looks live in `src/lib/astra-star-look.ts`, the shader maths in `src/lib/astra-star-shader-math.ts` and the GLSL in `src/lib/astra-star-shaders.ts`. All three are tested without WebGL. The findings behind it are in `audit/astra-openai-findings.md`.

## What you see

- **Mostly specks, a few hero stars.** An ordinary star is `0.35 + unit * 7.79` px with `unit = 0.12 + rand^2.4 * 0.68`, so most stars are 1-3 px and a tail reaches about 6.5 px. About 2.8% of ribbon stars are hero stars, 7-17 px.
- **Brightness is HDR.** Ordinary stars run at 0.56-1.34 and hero stars at 2-3.5. Brightness is its own attribute (`bright`), next to a pure palette colour. Nothing is tone mapped, so a hero core clips to white, and bloom (strength 0.85, radius 0.55, threshold 0.12) spreads only the hot stars into big soft halos.
- **The palette.** `#6DCBF4` cyan 36%, `#7AB1FE` blue 16%, `#F87915` orange 12%, `#FA994C` light orange 10%, `#F5F6FB` near-white 26%, picked at openai.com's cumulative thresholds.
- **The core.** A resolved star is `pow(1 - smoothstep(0.08, 1, r), 2.2)`. Under 2 device px a star is a cubic-filtered point instead, so small stars do not shimmer as they move. Each star is drawn on its own diameter, with a 4 px minimum quad.
- **Rays.** Stars hotter than brightness 1.45 grow a thin four-point cross, `exp(-|axis| * 28) * 0.28`, fading toward the edge. They reach full strength at 2.8, so only hero stars carry them.
- **A white-hot centre.** The colour is mixed toward white by `smoothstep(0.9, 2.8, brightness) * 0.82` at the core. Saturated colours get up to 42% more energy (`1 + (1 - min(rgb)) * 0.42`), so cyan and orange read as bright as white.
- **Twinkle and opacity.** Ribbon stars twinkle all the time by `0.86 + 0.14 * sin(phase + t * 0.62 * rate)`, rate 0.65-1.35. Every star has a fixed 0.82-0.98 opacity. Reduced motion keeps them steady.
- **The sky.** A linear near-black `#03040a`, with 200 dust stars a side drawn as ordinary stars at 80% brightness.

## Constants

All in `astra-star-shader-math.ts`. The shader source is built from them, so the two cannot drift apart.

| Constant | Value | Meaning |
| --- | --- | --- |
| `CORE_EDGE`, `CORE_POWER` | 0.08, 2.2 | Flat centre radius and falloff of the core. |
| `RAY_FALLOFF` | 28 | How quickly a ray thins away from its axis. |
| `RAY_FADE_FROM` | 0.18 | Where a ray starts to fade along its length (it is gone at the edge). |
| `RAY_GAIN` | 0.28 | Peak ray coverage. |
| `RAY_BRIGHTNESS` | 1.45-2.8 | Brightness over which rays grow in. |
| `WHITE_CORE` | 0.9-2.8, gain 0.82 | Brightness over which the centre goes white. |
| `UNRESOLVED_CORE` | 0.59228 | White-core weight for a star too small to resolve. |
| `COLOR_ENERGY_GAIN` | 0.42 | Lift for saturated colours. |
| `RESOLVE` | 2-4 px | Diameter over which a filtered point becomes a disc. |
| `FILTERED_AREA` | 0.150904 | Coverage scale of a filtered point. |
| `MIN_QUAD_PX` | 4 | Smallest quad a star is drawn on. |

## What is different from openai.com

- The shape is the BridgeWide mark's own ribbons, not openai.com's five spiral paths, and the scroll-driven gather and flow are this field's own.
- openai.com places 220 or 170 stars per arm and picks hero stars along each arm by `lerp(0.22, 1, sin(progress * PI)) * 0.085`. The mark's ribbons are shorter and denser, so this field uses 5.5 stars per mark unit and a flat 2.8% hero share, which gives a similar count of halos on screen.
- openai.com adds a lens flare, a dirty-glass texture and a pointer lens after the stars. Those are not here.

## Tests

- `src/lib/astra-star-look.test.ts`: the palette colours and thresholds, the ordinary and hero size and brightness ranges, the fine and ambient split, the hero share, and dust being ordinary and dimmer.
- `src/lib/astra-star-shader-math.test.ts`: the core, the filtered coverage, the resolve blend, ray strength by brightness, the ray shape (symmetry, thinness, fade), the white core and colour energy.
- `src/lib/astra-star-shaders.test.ts`: the shaders have a `main`, read `size`, `bright` and `alpha`, agree on varyings, and are built from the shared constants.
