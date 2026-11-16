/**
 * GLSL for the stars in the Astra field after the footer: one vertex and one
 * fragment shader drawing every star as a point sprite with a soft core and
 * halo. They live here, as strings, so tests can read them.
 */

export const STAR_VERTEX = /* glsl */ `
attribute float size;
attribute float glow;
attribute float alpha;
uniform float uPixelRatio;
uniform float uDepth;
varying vec3 vColor;
varying float vGlow;
varying float vAlpha;
varying float vSize;
varying float vQuad;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // Nearer stars draw larger and brighter, farther ones smaller and dimmer.
  float persp = clamp(uDepth / max(-mvPosition.z, 0.001), 0.7, 1.3);
  vColor = color;
  vGlow = glow;
  vAlpha = alpha * clamp(0.45 + 0.55 * persp, 0.6, 1.15);
  vSize = max(size * persp * uPixelRatio, 1.0);
  // The halo scales with the star, so large stars carry large soft glows.
  vQuad = max(vSize * mix(1.6, 3.6, vGlow), 4.0 * uPixelRatio);
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

void main() {
  float d = length(gl_PointCoord - 0.5) * vQuad;
  float r = d / (vQuad * 0.5);
  if (r > 1.0) discard;
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
  gl_FragColor = vec4((coreColor * core + vColor * halo) * vAlpha, 1.0);
}
`;
