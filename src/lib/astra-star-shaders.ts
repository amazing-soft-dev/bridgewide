/**
 * GLSL for the stars in the Astra field after the footer: openai.com's Astra
 * star shader (read from its shipped chunk), drawing every star as a point
 * sprite with a hard core, a four-point cross on hot stars and a white-hot
 * centre. Brightness is an HDR multiplier, so bloom, not the sprite, makes the
 * big soft halos. The strings are built from the constants in
 * astra-star-shader-math.ts, so the shader and the tested maths cannot drift.
 */

import {
  COLOR_ENERGY_GAIN,
  CORE_EDGE,
  CORE_POWER,
  FILTERED_AREA,
  MIN_QUAD_PX,
  RAY_BRIGHTNESS,
  RAY_FADE_FROM,
  RAY_FALLOFF,
  RAY_GAIN,
  RESOLVE,
  UNRESOLVED_CORE,
  WHITE_CORE,
} from "@/lib/astra-star-shader-math";

/** A number as a GLSL float literal (always with a decimal point). */
export function glsl(value: number): string {
  return Number.isInteger(value) ? value.toFixed(1) : String(value);
}

export const STAR_VERTEX = /* glsl */ `
attribute float size;
// HDR brightness: about 0.5-1.3 for an ordinary star, 2-3.5 for a hero star.
attribute float bright;
attribute float alpha;
uniform float uPixelRatio;
uniform float uDepth;
varying vec3 vColor;
varying float vBright;
varying float vAlpha;
varying float vDiameter;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // Nearer stars draw larger and brighter, farther ones smaller and dimmer.
  float persp = clamp(uDepth / max(-mvPosition.z, 0.001), 0.7, 1.3);
  vColor = color;
  vBright = bright;
  vAlpha = alpha * clamp(0.45 + 0.55 * persp, 0.6, 1.15);
  vDiameter = size * persp * uPixelRatio;
  gl_PointSize = max(vDiameter, ${glsl(MIN_QUAD_PX)});
}
`;

export const STAR_FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vBright;
varying float vAlpha;
varying float vDiameter;

float cubicCoverage(float coordinate) {
  float x = abs(coordinate);
  if (x < 1.0) return (4.0 - 6.0 * x * x + 3.0 * x * x * x) / 6.0;
  float tail = max(2.0 - x, 0.0);
  return tail * tail * tail / 6.0;
}

void main() {
  vec2 pixel = (gl_PointCoord - vec2(0.5)) * max(vDiameter, ${glsl(MIN_QUAD_PX)});
  vec2 point = pixel * 2.0 / max(vDiameter, 0.0001);
  float distanceToCenter = length(point);
  float core = pow(1.0 - smoothstep(${glsl(CORE_EDGE)}, 1.0, distanceToCenter), ${glsl(CORE_POWER)});
  // Four-point cross on hot stars only: none below brightness ${glsl(RAY_BRIGHTNESS.from)}.
  float horizontalRay = exp(-abs(point.y) * ${glsl(RAY_FALLOFF)}) * (1.0 - smoothstep(${glsl(RAY_FADE_FROM)}, 1.0, abs(point.x)));
  float verticalRay = exp(-abs(point.x) * ${glsl(RAY_FALLOFF)}) * (1.0 - smoothstep(${glsl(RAY_FADE_FROM)}, 1.0, abs(point.y)));
  float rays = max(horizontalRay, verticalRay) * ${glsl(RAY_GAIN)}
    * smoothstep(${glsl(RAY_BRIGHTNESS.from)}, ${glsl(RAY_BRIGHTNESS.to)}, vBright);
  float resolved = smoothstep(${glsl(RESOLVE.from)}, ${glsl(RESOLVE.to)}, vDiameter);
  // Under 2px the star is a filtered point, so it does not shimmer as it moves.
  float filtered = cubicCoverage(pixel.x) * cubicCoverage(pixel.y) * ${glsl(FILTERED_AREA)} * vDiameter * vDiameter;
  float alpha = mix(filtered, max(core, rays), resolved) * vAlpha;
  if (alpha <= 0.0) discard;
  float whiteCore = mix(${glsl(UNRESOLVED_CORE)}, core, resolved)
    * smoothstep(${glsl(WHITE_CORE.from)}, ${glsl(WHITE_CORE.to)}, vBright) * ${glsl(WHITE_CORE.gain)};
  float colorEnergy = 1.0 - min(vColor.r, min(vColor.g, vColor.b));
  vec3 emission = mix(vColor, vec3(1.0), whiteCore) * vBright * (1.0 + colorEnergy * ${glsl(COLOR_ENERGY_GAIN)});
  gl_FragColor = vec4(emission, alpha);
}
`;
