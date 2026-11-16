# Astra star field: dust motion

The background dust in the star field after the footer (`src/components/home/AstraField.tsx`) moves in three small ways. The maths lives in `src/lib/astra-dust-motion.ts`, where it is tested without WebGL. Only the dust moves this way: the ribbon stars that trace the BridgeWide mark are not touched.

## What moves

| Motion | What it does | Constants |
| --- | --- | --- |
| Drift | Each grain traces a small loop around its resting place (sine on x, a slower cosine on y) from its own seed. Far dust drifts slowly and little, near dust faster and further. | `DRIFT_SPEED` 0.4 to 0.8 rad/s, `DRIFT_REACH` 0.006 to 0.02 NDC |
| Parallax | A vertical offset that grows with scroll and with the square of the grain's depth, so near dust slides past and far dust barely moves. Zero in the middle of the scroll. | `PARALLAX_REACH` 0.12 NDC across the whole scroll |
| Twinkle | A brightness factor between 0.8 and 1, on from the first frame. | `TWINKLE_DEPTH` 0.2 |

Positions are in NDC of the stage (-1 to 1 on both axes), the space the dust band is laid out in. At 1000 px wide, 0.02 NDC is about 10 px, so the motion is a shimmer, not a wander.

## One call per grain

`dustMotion(input, still)` returns `{ dx, dy, alpha }` for one grain: the drift offset, the drift plus parallax on y, and the twinkle. The draw loop adds `dx` and `dy` to the grain's band position before projecting it, and multiplies its alpha by `alpha`.

Each dust star carries two per-star fields: `drift` (a seed in [0, 1) so grains do not move together) and `depth` (0 far, 1 near).

## Reduced motion

When the visitor prefers reduced motion, `still` is true and the dust holds exactly at rest: an offset of plain zeros and an alpha of exactly 1. The component already reads `prefers-reduced-motion` every frame, so the dust follows a change without a reload. A test sweeps seeds, times and scroll positions to check this.

## Tuning

Change the constants at the top of `astra-dust-motion.ts`. Keep `DRIFT_REACH` small: past about 0.03 NDC the dust starts to read as floating instead of shimmering. The clear zone around the words "Bridge" and "Wide" is applied to the final, drifted position, so it still holds as the dust moves.

## Tests

`src/lib/astra-dust-motion.test.ts`: zero offset at time 0, bounded reach, depth weighting, looping, determinism, strength 0 and input clamping for each function, and the reduced-motion freeze for `dustMotion`.
