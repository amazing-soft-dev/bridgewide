# Astra star field: diffraction rays and white-hot cores

The brightest stars in the star field after the footer (`src/components/home/AstraField.tsx`) carry thin cross-shaped rays, and their cores are whiter. The maths lives in `src/lib/astra-star-shader-math.ts`, the shaders in `src/lib/astra-star-shaders.ts`, and both are tested without WebGL.

## What you see

- **Rays.** One thin spike along each axis, full brightness on the axis, thinning quickly away from it and fading out along its length. They are measured in star radii, so a bigger star has longer rays.
- **Hero stars first.** `rayStrength(tier, glow)` gives a hero flare (glow 1) full strength and an ordinary flare (glow 0.9) 30%, so the biggest stars have the longest, brightest spikes. Fine and ambient stars have no rays.
- **A hotter core.** A star with rays has its core mixed further toward white (`0.18 + 0.4 * strength`).

## How the shader keeps everything else unchanged

Rays are gated by a per-star `ray` attribute (0 to 1):

- It is filled every frame by the component: the star's landing progress times `rayStrength`. A ribbon flare grows its rays as it lands on the mark. Dust and the fine and ambient ribbon stars stay at 0.
- The ray term and the extra whiteness are both scaled by `vRay`, so for a star with `ray = 0` they add exactly 0 and the star draws as it always did.
- A star with rays gets a larger point quad (`RAY_REACH` radii each way) so the rays are not clipped. The halo is measured against its own quad (`vHaloQuad`), so it keeps its size. A star without rays keeps exactly its old quad: `pointQuad` mirrors this in TypeScript and a test checks it across sizes, glows and pixel ratios.

## Constants

All in `astra-star-shader-math.ts`; the shader source is built from them, so the two cannot drift apart.

| Constant | Meaning |
| --- | --- |
| `RAY_FALLOFF` 3 | How quickly a ray thins away from its axis. Higher is thinner. |
| `RAY_FADE_FROM` 0.6 | Distance (star radii) where a ray starts to fade along its length. |
| `RAY_REACH` 5 | Distance (star radii) where a ray has faded out. Also sizes the quad. |
| `RAY_GAIN` 0.34 | Peak ray brightness as a share of the star's colour. |
| `WHITE_CORE_BASE` 0.18 | The core whiteness every star always had. |
| `WHITE_CORE_EXTRA` 0.4 | Extra whiteness for a star with full rays. |

## What is not here

The ribbon's bloom, tone mapping, geometry, flow and the dust are not changed by this work. A filtered coverage for stars under about 2 px was considered and left out: an energy-conserving coverage would dim the smallest dust (which is drawn at a one-pixel floor) and thin out the sky, and the existing Gaussian core is already at least one device pixel wide. It can be revisited as a separate change with a look test.

## Tests

- `src/lib/astra-star-shader-math.test.ts`: the strength per tier and glow, the ray shape (symmetry, thinness, fade to the reach, bounds), zero rays at strength 0, the white-core mix, and the quad mirrors.
- `src/lib/astra-star-shaders.test.ts`: the shaders have a `main`, the attributes and varyings agree, the generated source uses the shared constants, and the core and halo terms are unchanged.
