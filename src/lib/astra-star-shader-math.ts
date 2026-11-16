/**
 * The maths behind the star shader's diffraction rays and white-hot cores, in
 * plain TypeScript. The shader (src/lib/astra-star-shaders.ts) is built from
 * the same constants, and the functions here mirror its formulas so they can be
 * tested without WebGL.
 *
 * Coordinates for the rays are in star radii: (0, 0) is the star's centre and 1
 * is the edge of its core.
 */

/** How quickly a ray thins away from its axis. Higher is thinner. */
export const RAY_FALLOFF = 3;
/** Distance (star radii) where a ray starts to fade along its axis. */
export const RAY_FADE_FROM = 0.6;
/** Distance (star radii) where a ray has faded out. The point quad is sized to hold it. */
export const RAY_REACH = 5;
/** Peak ray brightness as a share of the star's colour, before the per-star strength. */
export const RAY_GAIN = 0.4;
/** How much the core warms toward white on a star without rays. This is what the shader always did. */
export const WHITE_CORE_BASE = 0.18;
/** Extra whiteness a star with full-strength rays gets in its core. */
export const WHITE_CORE_EXTRA = 0.4;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/**
 * How strong a star's rays are, 0 to 1. Only flares have rays: a hero star
 * (glow 1) gets full strength and an ordinary flare (glow 0.9) about half, so
 * the biggest stars have the longest spikes. Fine and ambient stars get none,
 * which keeps them exactly as they were.
 */
export function rayStrength(tier: "fine" | "ambient" | "flare", glow: number): number {
  if (tier !== "flare") return 0;
  return lerp(0.5, 1, smoothstep(0.9, 1, glow));
}

/**
 * The brightness of the ray cross at a point, 0 to 1, before the gain and the
 * star's strength. One ray runs along each axis: full brightness on the axis,
 * thinning quickly away from it, and fading out along its length.
 */
export function rayShape(x: number, y: number): number {
  const along = (distance: number) => 1 - smoothstep(RAY_FADE_FROM, RAY_REACH, Math.abs(distance));
  const horizontal = Math.exp(-Math.abs(y) * RAY_FALLOFF) * along(x);
  const vertical = Math.exp(-Math.abs(x) * RAY_FALLOFF) * along(y);
  return Math.max(horizontal, vertical);
}

/** The ray brightness the shader adds at a point for a star of the given strength. */
export function rayIntensity(x: number, y: number, strength: number): number {
  return rayShape(x, y) * RAY_GAIN * clamp01(strength);
}

/**
 * How much of the core is mixed toward white. Strength 0 gives the base
 * amount every star always had; a star with full rays is whiter at its centre.
 */
export function coreWhite(strength: number): number {
  return WHITE_CORE_BASE + WHITE_CORE_EXTRA * clamp01(strength);
}

/**
 * The halo's quad (the point sprite's side, in device px) for a star: it scales
 * with the star, so large stars carry large soft glows, with a floor of four
 * device pixels. This is the size every star's quad always had.
 */
export function haloQuad(size: number, glow: number, pixelRatio: number): number {
  return Math.max(size * lerp(1.6, 3.6, glow), 4 * pixelRatio);
}

/**
 * The quad the star is actually drawn with. A star with rays gets a larger
 * quad, `RAY_REACH` star radii each way from the centre, so the rays fit; a
 * star without rays keeps exactly its halo quad.
 */
export function pointQuad(size: number, glow: number, pixelRatio: number, ray: number): number {
  const halo = haloQuad(size, glow, pixelRatio);
  return ray > 0 ? Math.max(halo, size * RAY_REACH) : halo;
}
