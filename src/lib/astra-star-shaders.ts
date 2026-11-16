/**
 * GLSL for the stars in the Astra field after the footer: one vertex and one
 * fragment shader drawing every star as a point sprite with a soft core and
 * halo. They live here, as strings, so tests can read them, and they are built
 * from the constants in astra-star-shader-math.ts so the shader and the tested
 * maths cannot drift apart.
 */

import {
  RAY_FADE_FROM,
  RAY_FALLOFF,
  RAY_GAIN,
  RAY_REACH,
} from "@/lib/astra-star-shader-math";

/** A number as a GLSL float literal (always with a decimal point). */
function glsl(value: number): string {
  return Number.isInteger(value) ? value.toFixed(1) : String(value);
}

export const STAR_VERTEX = /* glsl */ `
attribute float size;
attribute float glow;
attribute float alpha;
// Strength of the diffraction rays, 0 to 1. Stars with 0 draw exactly as they always did.
attribute float ray;
uniform float uPixelRatio;
uniform float uDepth;
varying vec3 vColor;
varying float vGlow;
varying float vAlpha;
varying float vSize;
varying float vQuad;
varying float vHaloQuad;
varying float vRay;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // Nearer stars draw larger and brighter, farther ones smaller and dimmer.
  float persp = clamp(uDepth / max(-mvPosition.z, 0.001), 0.7, 1.3);
  vColor = color;
  vGlow = glow;
  vRay = ray;
  vAlpha = alpha * clamp(0.45 + 0.55 * persp, 0.6, 1.15);
  vSize = max(size * persp * uPixelRatio, 1.0);
  // The halo scales with the star, so large stars carry large soft glows.
  vHaloQuad = max(vSize * mix(1.6, 3.6, vGlow), 4.0 * uPixelRatio);
  // A star with rays gets a larger quad so the rays fit (${glsl(RAY_REACH)} star radii each way);
  // the halo keeps its own size, and a star without rays keeps exactly its old quad.
  vQuad = vRay > 0.0 ? max(vHaloQuad, vSize * ${glsl(RAY_REACH)}) : vHaloQuad;
  gl_PointSize = vQuad;
}
`;

export const STAR_FRAGMENT = /* glsl */ `
uniform float uPixelRatio;
varying vec3 vColor;
varying float vGlow;
varying float vAlpha;
varying float vSize;
varying float vQuad;
varying float vHaloQuad;
varying float vRay;

void main() {
  float d = length(gl_PointCoord - 0.5) * vQuad;
  // The halo is measured against its own quad and the round clip against the point
  // quad: they are the same for a star without rays.
  float r = d / (vHaloQuad * 0.5);
  if (d > vQuad * 0.5) discard;
  // Gaussian core about the star's own size; at least one device pixel wide so
  // small stars do not shimmer as they move.
  float coreRadius = max(vSize * 0.5, 1.0);
  float core = exp(-2.6 * (d / coreRadius) * (d / coreRadius));
  // Soft halo that fades to exactly zero at the quad edge (no hard rim).
  // Small and mid stars get a faint halo; only hero stars (glow 1) carry a real glow.
  float heroGlow = smoothstep(0.85, 1.0, vGlow);
  float halo = mix(0.08, 0.24, heroGlow) * vGlow * exp(-6.5 * r * r) * (1.0 - smoothstep(0.5, 1.0, r));
  // Keep the star's colour in the core, warmed toward white at the centre.
  vec3 coreColor = mix(vColor, vec3(1.0), 0.18 * core);
  // Diffraction rays: one thin spike along each axis, measured in star radii so a
  // bigger star has longer rays. Zero for a star without rays (vRay = 0).
  vec2 p = abs((gl_PointCoord - 0.5) * vQuad) / max(vSize * 0.5, 0.0001);
  float alongX = 1.0 - smoothstep(${glsl(RAY_FADE_FROM)}, ${glsl(RAY_REACH)}, p.x);
  float alongY = 1.0 - smoothstep(${glsl(RAY_FADE_FROM)}, ${glsl(RAY_REACH)}, p.y);
  float spike = max(exp(-p.y * ${glsl(RAY_FALLOFF)}) * alongX, exp(-p.x * ${glsl(RAY_FALLOFF)}) * alongY);
  float rays = spike * ${glsl(RAY_GAIN)} * vRay;
  gl_FragColor = vec4((coreColor * core + vColor * (halo + rays)) * vAlpha, 1.0);
}
`;
