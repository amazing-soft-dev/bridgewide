/**
 * The maths behind the star shader, in plain TypeScript: openai.com's Astra
 * fragment shader (read from its shipped chunk). The shader
 * (src/lib/astra-star-shaders.ts) is built from the same constants, and the
 * functions here mirror its formulas so they can be tested without WebGL.
 *
 * Point coordinates run from -1 to 1 across the star's diameter: (0, 0) is its
 * centre and a distance of 1 is its edge.
 */

/** The core is flat to this distance from the centre, then falls to 0 at the edge. */
export const CORE_EDGE = 0.08;
/** The core's falloff power: higher is a tighter, harder point. */
export const CORE_POWER = 2.2;
/** How quickly a ray thins away from its axis. Higher is thinner. */
export const RAY_FALLOFF = 28;
/** Distance where a ray starts to fade along its axis; it is gone at the edge (1). */
export const RAY_FADE_FROM = 0.18;
/** Peak ray coverage before the star's ray strength. */
export const RAY_GAIN = 0.28;
/** Brightness over which rays grow in: none below `from`, full from `to`. */
export const RAY_BRIGHTNESS = { from: 1.45, to: 2.8 } as const;
/** Brightness over which the centre goes white, and how white it gets. */
export const WHITE_CORE = { from: 0.9, to: 2.8, gain: 0.82 } as const;
/** The white-core weight a star too small to resolve uses in place of its core. */
export const UNRESOLVED_CORE = 0.59228;
/** A colourful star is lifted by up to this much, so cyan and orange read as bright as white. */
export const COLOR_ENERGY_GAIN = 0.42;
/** Diameter (device px) over which a star moves from a filtered point to a resolved disc. */
export const RESOLVE = { from: 2, to: 4 } as const;
/** Coverage scale for a filtered point, so its total light matches a resolved disc. */
export const FILTERED_AREA = 0.150904;
/** The smallest quad (device px) a star is drawn on, so a filtered point has room. */
export const MIN_QUAD_PX = 4;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mix(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** The quad the star is drawn on: its diameter, but never under MIN_QUAD_PX. */
export function pointQuad(diameter: number): number {
  return Math.max(diameter, MIN_QUAD_PX);
}

/** The cubic B-spline a filtered point's coverage follows along one axis (pixels from centre). */
export function cubicCoverage(coordinate: number): number {
  const x = Math.abs(coordinate);
  if (x < 1) return (4 - 6 * x * x + 3 * x * x * x) / 6;
  const tail = Math.max(2 - x, 0);
  return (tail * tail * tail) / 6;
}

/** The coverage of a filtered (sub-2px) star at a pixel offset from its centre. */
export function filteredCoverage(px: number, py: number, diameter: number): number {
  return cubicCoverage(px) * cubicCoverage(py) * FILTERED_AREA * diameter * diameter;
}

/** The resolved core's coverage at a distance from the centre (0 centre, 1 edge). */
export function core(distance: number): number {
  return (1 - smoothstep(CORE_EDGE, 1, distance)) ** CORE_POWER;
}

/** 0 for a star under 2 device px (a filtered point), 1 from 4px (a resolved disc). */
export function resolved(diameter: number): number {
  return smoothstep(RESOLVE.from, RESOLVE.to, diameter);
}

/** How strong a star's rays are, 0 to 1, from its brightness. Only hot stars have rays. */
export function rayStrength(brightness: number): number {
  return smoothstep(RAY_BRIGHTNESS.from, RAY_BRIGHTNESS.to, brightness);
}

/**
 * The ray cross at a point, 0 to 1, before the gain and the star's strength:
 * full on an axis, thinning fast away from it, and fading out toward the edge.
 */
export function rayShape(x: number, y: number): number {
  const horizontal = Math.exp(-Math.abs(y) * RAY_FALLOFF) * (1 - smoothstep(RAY_FADE_FROM, 1, Math.abs(x)));
  const vertical = Math.exp(-Math.abs(x) * RAY_FALLOFF) * (1 - smoothstep(RAY_FADE_FROM, 1, Math.abs(y)));
  return Math.max(horizontal, vertical);
}

/** The ray coverage the shader draws at a point for a star of the given brightness. */
export function rayIntensity(x: number, y: number, brightness: number): number {
  return rayShape(x, y) * RAY_GAIN * rayStrength(brightness);
}

/**
 * How far the colour is mixed toward white at a point: none for a dim star,
 * up to WHITE_CORE.gain at the centre of a hot one.
 */
export function whiteCore(coreValue: number, diameter: number, brightness: number): number {
  return (
    mix(UNRESOLVED_CORE, coreValue, resolved(diameter)) *
    smoothstep(WHITE_CORE.from, WHITE_CORE.to, brightness) *
    WHITE_CORE.gain
  );
}

/** The lift a colour gets from how saturated it is: 1 for white, up to 1 + COLOR_ENERGY_GAIN. */
export function colorEnergy(r: number, g: number, b: number): number {
  return 1 + (1 - Math.min(r, g, b)) * COLOR_ENERGY_GAIN;
}
