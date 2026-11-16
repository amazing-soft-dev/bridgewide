/**
 * Motion for the background dust in the Astra field: a slow drift, a gentle
 * twinkle and a small scroll parallax. Pure functions of time and per-star
 * seeds, so they can be tested without WebGL.
 *
 * Positions are in NDC of the stage (-1 to 1 on both axes), the space the dust
 * band is laid out in.
 */

const TAU = Math.PI * 2;

/** Drift speed in radians per second: far dust is slower than near dust. */
export const DRIFT_SPEED = { far: 0.4, near: 0.8 } as const;
/** Drift reach in NDC: far dust moves less than near dust. */
export const DRIFT_REACH = { far: 0.006, near: 0.02 } as const;

export type Offset = { x: number; y: number };

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function fract(value: number): number {
  return value - Math.floor(value);
}

/**
 * Where a grain of dust has drifted to, relative to where it rests. Each grain
 * traces a small loop (a sine on x, a slower cosine on y) from its own phase.
 * The offset is exactly zero at time 0 and bounded by twice the reach, so the
 * dust shimmers around its place instead of wandering off.
 *
 * `seed` is a per-star number in [0, 1), `depth` is 0 (far) to 1 (near) and
 * `strength` is 0 to 1 (0 holds the dust still).
 */
export function dustDrift(time: number, seed: number, depth: number, strength = 1): Offset {
  const near = clamp01(depth);
  const speed = lerp(DRIFT_SPEED.far, DRIFT_SPEED.near, near);
  const reach = lerp(DRIFT_REACH.far, DRIFT_REACH.near, near) * clamp01(strength);
  if (reach === 0) return { x: 0, y: 0 };
  const phaseX = fract(seed) * TAU;
  const phaseY = fract(seed * 7.31) * TAU;
  return {
    x: (Math.sin(phaseX + time * speed) - Math.sin(phaseX)) * reach,
    y: (Math.cos(phaseY + time * speed * 0.73) - Math.cos(phaseY)) * reach,
  };
}

/** How deep the dust twinkle goes: brightness swings between 1 - depth and 1. */
export const TWINKLE_DEPTH = 0.2;

/**
 * A brightness factor for one grain, between 1 - TWINKLE_DEPTH and 1. It is
 * always on, unlike the ribbon's twinkle that waits for the scroll, so the sky
 * is alive from the first frame. `phase` and `rate` are per-star; `strength`
 * is 0 to 1 (0 gives exactly 1, a steady star).
 */
export function dustTwinkle(time: number, phase: number, rate: number, strength = 1): number {
  const wave = 0.5 + 0.5 * Math.sin(time * rate + phase);
  return 1 - TWINKLE_DEPTH * clamp01(strength) * wave;
}
