"use client";

import { useEffect, useRef } from "react";
import { markPaths } from "@/components/brand/mark";

/** Mark units → world. */
const SCALE = 0.0368;
const MARK_WIDTH = 168;
const MARK_HEIGHT = 100;
/** Gathered mark height in CSS px whenever the stage can hold the whole mark. */
const MARK_PX = 600;
const FOV = 30;
const CAMERA_LIFT_X = 0.16;
const CAMERA_LIFT_Y = 0.09;
const REST_YAW = 0.62;
const REST_PITCH = -0.18;
const [upperWing, lowerArch] = markPaths;

/** Flow speed along the route, in mark units per second. */
const FLOW_UNITS = 8.6;
/** Route distance (mark units) over which stars shrink and fade into a crossing. */
const CROSSING_FADE = 11;
/** Depth of the route's wave, in mark units: gives the mark a real 3D body. */
const DEPTH_AMPLITUDE = 15;
const DEPTH_WAVES = 2;
/** A star's offset from the line is spread over a tube: this much of it goes into depth. */
const TUBE_DEPTH = 3;
/** Twinkle never takes a star below 1 - depth of its brightness, so lines never drop out. */
const TWINKLE = 0.22;
const FLARE_TWINKLE = 0.12;
const FINE_TWINKLE = 0.1;
/** Ribbon stars wear the outer-spray look until this far into their gather, then take their ribbon look. */
const LAND_START = 0.75;
const GATHER_STAGGER = 0.22;
const GATHER_SPAN = 0.58;
const FLOW_START = 0.6;
const FLOW_SPAN = 0.32;
const SCROLL_EASE = 7;
const NUDGE_RADIUS_PX = 150;
const NUDGE_GAIN = 0.7;
const NUDGE_MAX_PX = 56;
const NUDGE_RETURN = 3.2;
const SPRING_K = 38;
const SPRING_C = 9;
const DUST_PER_SIDE = 320;
/** Dust settles between these NDC distances from the centre line, on both sides. */
const BAND_INNER = 0.4;
const BAND_OUTER = 0.98;
const BAND_Y = 0.95;
/** NDC distance over which the clear zone around each word fades back in. */
const WORD_FEATHER = 0.06;
const WORD_PAD_PX = 32;
/** Share of fine and ambient stars; the rest are flares. Dust has no flares. */
const DUST_TIERS = [0.85, 0.15] as const;
/**
 * Ribbon: 48% fine, 38% ambient, 14% bright; a quarter of the bright ones are
 * large "hero" stars. A wide size range with no invisible specks is what makes
 * the line read as a glowing ribbon instead of a string of equal beads.
 */
const RIBBON_TIERS = [0.48, 0.38] as const;
const HERO_SHARE = 0.25;
/** Star palette: cool blue-white majority with warm accents. Weights sum to 1. */
const PALETTE = [
  { color: 0xc4dcff, weight: 0.36 }, // blue-white
  { color: 0xf2f6ff, weight: 0.13 }, // white
  { color: 0x8fcdff, weight: 0.28 }, // ice
  { color: 0xffbf8f, weight: 0.13 }, // peach
  { color: 0xff8a45, weight: 0.1 }, // amber
] as const;
const DUST_COLOR = 0xc9dcff;
/** Pre-tone-mapping sky colour. ACES crushes darks, so this lands at about #08101a on screen. */
const BACKGROUND = 0x2d3b4a;
/** Bloom merges neighbouring stars into one glowing ribbon. */
const BLOOM_STRENGTH = 0.45;
const BLOOM_RADIUS = 0.25;
/** Only bright star centres bloom; small stars stay crisp, even over a big star's glow. */
const BLOOM_THRESHOLD = 0.92;
/** Stroke width in mark units. Core is 20% of this; mist reaches 120%. */
const STROKE_WIDTH = 7.5;
const CORE_WIDTH = STROKE_WIDTH * 0.2;
const MIST_WIDTH = STROKE_WIDTH * 1.2;

const STAR_VERTEX = /* glsl */ `
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

const STAR_FRAGMENT = /* glsl */ `
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
  float halo = mix(0.09, 0.4, heroGlow) * vGlow * exp(-6.5 * r * r) * (1.0 - smoothstep(0.5, 1.0, r));
  // Keep the star's colour in the core, warmed toward white at the centre.
  vec3 coreColor = mix(vColor, vec3(1.0), 0.18 * core);
  gl_FragColor = vec4((coreColor * core + vColor * halo) * vAlpha, 1.0);
}
`;

type Sample = { x: number; y: number };
type Spine = Sample[];
/** Per-sample smoothed normal and local radius of curvature (mark units). */
type Frame = { nx: number; ny: number; radius: number };
/**
 * One closed path through the whole mark. It runs around both ribbons and
 * crosses between them at their two closest points. `vis` is 0 at a
 * crossing and on the hidden hop between the ribbons, rising to 1 along the
 * ribbon; `z` is the route's depth.
 */
type Route = { points: Spine; frames: Frame[]; vis: Float32Array; z: Float32Array; length: number };
type Spray = { nx: number; ny: number; z: number };
type Tier = "fine" | "ambient" | "flare";
type Look = {
  tier: Tier;
  /** CSS px on the full 600px mark. */
  size: number;
  glow: number;
  color: number;
  brightness: number;
};
type StarBase = Look & {
  z: number;
  spray: Spray;
  delay: number;
  phase: number;
  rate: number;
};
type RibbonStar = StarBase & {
  kind: "ribbon";
  /** Look while the star is out in the side spray, drawn from the dust split. */
  outer: Look;
  /** Position along the route, 0-1. */
  t: number;
  speed: number;
  offset: number;
  /** Angle of the offset around the line: in-plane at 0, into depth at pi/2. */
  angle: number;
};
type DustStar = StarBase & {
  kind: "dust";
  band: { nx: number; ny: number };
};
type Star = RibbonStar | DustStar;
type Area = { left: number; right: number; top: number; bottom: number };

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function wrapAngle(angle: number) {
  const turn = Math.PI * 2;
  return ((((angle + Math.PI) % turn) + turn) % turn) - Math.PI;
}

function sampleSpine(d: string, steps: number): Spine {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 168 100");
  svg.style.position = "absolute";
  svg.style.left = "-9999px";
  svg.style.width = "168px";
  svg.style.height = "100px";
  path.setAttribute("d", d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const length = path.getTotalLength();
  const samples: Spine = [];
  const count = Math.max(2, steps);
  for (let i = 0; i < count; i++) {
    const point = path.getPointAtLength((i / count) * length);
    samples.push({ x: point.x, y: point.y });
  }
  svg.remove();
  return samples;
}

function spineLength(spine: Spine) {
  let length = 0;
  for (let i = 0; i < spine.length; i++) {
    const a = spine[i];
    const b = spine[(i + 1) % spine.length];
    if (!a || !b) continue;
    length += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return length;
}

/**
 * Normals from a tangent averaged over a window of samples, plus the local
 * radius of curvature. A per-segment normal flips at the mark's sharp folds
 * (the nose beside "Wide"), which flung offset stars off the line and left a
 * faint gap there.
 */
function spineFrames(spine: Spine, window = 6): Frame[] {
  const n = spine.length;
  const at = (i: number) => spine[((i % n) + n) % n] ?? { x: 0, y: 0 };
  return spine.map((_, i) => {
    const prev = at(i - window);
    const here = at(i);
    const next = at(i + window);
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    const ax = here.x - prev.x;
    const ay = here.y - prev.y;
    const bx = next.x - here.x;
    const by = next.y - here.y;
    const turn = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by));
    const chord = Math.hypot(next.x - prev.x, next.y - prev.y);
    const radius = turn > 1e-3 ? chord / (2 * Math.sin(turn / 2)) : Infinity;
    return { nx: -ty / len, ny: tx / len, radius };
  });
}

function pointOnSpine(spine: Spine, frames: Frame[], t: number, offset: number) {
  const n = spine.length;
  const wrapped = ((t % 1) + 1) % 1;
  const f = wrapped * n;
  const i = Math.floor(f) % n;
  const u = f - Math.floor(f);
  const a = spine[i];
  const b = spine[(i + 1) % n];
  const fa = frames[i];
  const fb = frames[(i + 1) % n];
  if (!a || !b || !fa || !fb) return { x: 84, y: 50 };
  let nx = fa.nx + (fb.nx - fa.nx) * u;
  let ny = fa.ny + (fb.ny - fa.ny) * u;
  const nlen = Math.hypot(nx, ny) || 1;
  nx /= nlen;
  ny /= nlen;
  // Tight bends: keep the offset inside the curve radius so stars stay on the line.
  const radius = Math.min(fa.radius, fb.radius);
  const limit = Number.isFinite(radius) ? Math.max(0.35, radius * 0.6) : Infinity;
  const kept = Math.sign(offset) * Math.min(Math.abs(offset), limit);
  return {
    x: a.x + (b.x - a.x) * u + nx * kept,
    y: a.y + (b.y - a.y) * u + ny * kept,
  };
}

/** Index pair (upper, lower) of the closest points, with the upper point inside xRange. */
function closestPair(upper: Spine, lower: Spine, xMin: number, xMax: number) {
  let best = Infinity;
  let pair: [number, number] = [0, 0];
  upper.forEach((a, i) => {
    if (a.x < xMin || a.x > xMax) return;
    lower.forEach((b, j) => {
      const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
      if (d < best) {
        best = d;
        pair = [i, j];
      }
    });
  });
  return pair;
}

/** Samples from index `from` to `to` (inclusive), walking `dir` around a closed spine. */
function arc(spine: Spine, from: number, to: number, dir: 1 | -1): Spine {
  const n = spine.length;
  const out: Spine = [];
  for (let i = from, guard = 0; guard <= n; i = (i + dir + n) % n, guard++) {
    const point = spine[i];
    if (point) out.push(point);
    if (i === to) break;
  }
  return out;
}

/**
 * Figure-eight route: upper arc A->B, hop down at B, lower arc B'->A', hop up
 * at A', the other upper arc A->B, hop down, the other lower arc, hop up.
 * Every ribbon edge is covered once and stars always cross the same way at
 * each joint, so the whole mark flows as one continuous stream.
 */
function buildRoute(upper: Spine, lower: Spine): Route {
  const [ua, la] = closestPair(upper, lower, 70, 135); // middle joint
  const [ub, lb] = closestPair(upper, lower, 140, 168); // right joint, beside "Wide"
  type Piece = { points: Spine; hidden: boolean };
  const hop = (a?: Sample, b?: Sample): Piece => ({ points: a && b ? [a, b] : [], hidden: true });
  const pieces: Piece[] = [
    { points: arc(upper, ua, ub, 1), hidden: false },
    hop(upper[ub], lower[lb]),
    { points: arc(lower, lb, la, 1), hidden: false },
    hop(lower[la], upper[ua]),
    { points: arc(upper, ua, ub, -1), hidden: false },
    hop(upper[ub], lower[lb]),
    { points: arc(lower, lb, la, -1), hidden: false },
    hop(lower[la], upper[ua]),
  ];

  // Flatten, then resample to an even spacing so t maps linearly to distance.
  const raw: { x: number; y: number; hidden: boolean }[] = [];
  for (const piece of pieces) for (const p of piece.points) raw.push({ ...p, hidden: piece.hidden });
  const cumulative = [0];
  for (let i = 1; i < raw.length; i++) {
    const a = raw[i - 1];
    const b = raw[i];
    cumulative.push((cumulative[i - 1] ?? 0) + (a && b ? Math.hypot(b.x - a.x, b.y - a.y) : 0));
  }
  const first = raw[0];
  const last = raw[raw.length - 1];
  const length = (cumulative[cumulative.length - 1] ?? 0) + (first && last ? Math.hypot(first.x - last.x, first.y - last.y) : 0);
  const count = Math.max(64, Math.round(length / 0.4));
  const points: Spine = [];
  const hidden: boolean[] = [];
  let k = 0;
  for (let i = 0; i < count; i++) {
    const s = (i / count) * length;
    while (k < raw.length - 2 && (cumulative[k + 1] ?? 0) < s) k++;
    const a = raw[k];
    const b = raw[k + 1] ?? first;
    if (!a || !b) continue;
    const span = (cumulative[k + 1] ?? length) - (cumulative[k] ?? 0) || 1;
    const u = clamp01((s - (cumulative[k] ?? 0)) / span);
    points.push({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u });
    hidden.push(a.hidden && b.hidden ? true : a.hidden || b.hidden ? u < 0.5 ? a.hidden : b.hidden : false);
  }

  // Distance along the route to the nearest hidden sample, both directions.
  const n = points.length;
  const step = length / n;
  const near = new Float32Array(n).fill(Infinity);
  for (let pass = 0; pass < 2; pass++) {
    let since = Infinity;
    for (let c = 0; c < 2 * n; c++) {
      const i = pass === 0 ? c % n : (2 * n - 1 - c) % n;
      since = hidden[i] ? 0 : since + step;
      near[i] = Math.min(near[i] ?? Infinity, since);
    }
  }
  const vis = new Float32Array(n);
  const z = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    vis[i] = hidden[i] ? 0 : smoothstep((near[i] ?? 0) / CROSSING_FADE);
    z[i] = DEPTH_AMPLITUDE * Math.sin((i / n) * Math.PI * 2 * DEPTH_WAVES);
  }
  return { points, frames: spineFrames(points), vis, z, length };
}

/** Value of a per-sample array at route position t (0-1), linearly interpolated. */
function sampleAt(values: Float32Array, t: number) {
  const n = values.length;
  const f = (((t % 1) + 1) % 1) * n;
  const i = Math.floor(f) % n;
  const u = f - Math.floor(f);
  return (values[i] ?? 0) * (1 - u) + (values[(i + 1) % n] ?? 0) * u;
}

function toWorld(x: number, y: number, z: number) {
  return [(x - 84) * SCALE, (50 - y) * SCALE, z * SCALE] as const;
}

function between(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** 0 inside the word's padded box, rising to 1 across the feather. */
function wordMask(area: Area | null, nx: number, ny: number) {
  if (!area) return 1;
  const dx = Math.max(area.left - nx, nx - area.right, 0);
  const dy = Math.max(area.bottom - ny, ny - area.top, 0);
  return smoothstep(Math.hypot(dx, dy) / WORD_FEATHER);
}

/** A point anywhere in the left (-1) or right (1) half of the stage, in NDC. */
function sprayPoint(side: -1 | 1): Spray {
  return {
    nx: side * between(0.02, 0.98),
    ny: between(-0.98, 0.98),
    z: (Math.random() - 0.5) * 0.5,
  };
}

function bandPoint(side: -1 | 1) {
  return { nx: side * between(BAND_INNER, BAND_OUTER), ny: between(-BAND_Y, BAND_Y) };
}

function gaussian(sigma: number) {
  let u = 0;
  while (u === 0) u = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * Math.random());
}

function paletteColor() {
  let roll = Math.random();
  for (const entry of PALETTE) {
    roll -= entry.weight;
    if (roll <= 0) return entry.color;
  }
  return PALETTE[0].color;
}

function starLook(kind: "ribbon" | "dust"): Look {
  if (kind === "dust") {
    const [fine] = DUST_TIERS;
    if (Math.random() < fine) {
      return {
        tier: "fine",
        size: between(0.9, 1.6),
        glow: 0.15,
        color: DUST_COLOR,
        brightness: between(0.3, 0.6),
      };
    }
    return {
      tier: "ambient",
      size: between(1.8, 2.6),
      glow: 0.35,
      color: Math.random() < 0.2 ? 0xffd2b0 : DUST_COLOR,
      brightness: between(0.45, 0.7),
    };
  }
  const [fine, ambient] = RIBBON_TIERS;
  const roll = Math.random();
  if (roll < fine) {
    // Small, but bright enough to stay visible next to the big stars.
    return { tier: "fine", size: between(1.3, 2), glow: 0.3, color: paletteColor(), brightness: between(0.55, 0.8) };
  }
  if (roll < fine + ambient) {
    return { tier: "ambient", size: between(2.4, 3.8), glow: 0.55, color: paletteColor(), brightness: between(0.65, 0.9) };
  }
  const warm = Math.random() < 0.2;
  if (Math.random() < HERO_SHARE) {
    return { tier: "flare", size: between(9, 13), glow: 1, color: warm ? 0xffc9a0 : 0xcfe4ff, brightness: 1.05 };
  }
  return { tier: "flare", size: between(5, 7.5), glow: 0.9, color: warm ? 0xffbb8a : 0xbcdcff, brightness: 0.95 };
}

/** Mist stars fade with distance from the centre line, but never below 35%. */
function spineFade(offset: number) {
  return 0.35 + 0.65 * clamp01(1 - Math.abs(offset) / MIST_WIDTH) ** 1.35;
}

function signedWidth(max: number, sigma: number) {
  const side = Math.random() < 0.5 ? -1 : 1;
  return side * Math.min(max, Math.abs(gaussian(sigma)));
}

/** Gaussian scatter: ~65% on the core (0–20% width), 35% of dust/ice out to 120%. */
function ribbonSpread(tier: Tier) {
  const mist = tier === "fine" ? Math.random() < 0.45 : tier === "ambient" && Math.random() < 0.2;
  if (mist) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const span = MIST_WIDTH - CORE_WIDTH;
    const reach = CORE_WIDTH + Math.min(span, Math.abs(gaussian(span * 0.55)));
    return { offset: side * reach, z: gaussian(3.5), angle: Math.random() * Math.PI * 2 };
  }
  return { offset: signedWidth(CORE_WIDTH, CORE_WIDTH * 0.5), z: gaussian(1.8), angle: Math.random() * Math.PI * 2 };
}

function starBase(kind: "ribbon" | "dust", spray: Spray): StarBase {
  return {
    z: 0,
    ...starLook(kind),
    spray,
    delay: Math.random(),
    phase: Math.random() * Math.PI * 2,
    rate: 0.5 + Math.random() * 1.1,
  };
}

function makeRibbon(routeLength: number): RibbonStar {
  const look = starLook("ribbon");
  return {
    ...starBase("ribbon", sprayPoint(Math.random() < 0.5 ? -1 : 1)),
    ...look,
    kind: "ribbon",
    outer: starLook("dust"),
    t: Math.random(),
    speed: (FLOW_UNITS / routeLength) * (0.97 + Math.random() * 0.06),
    ...ribbonSpread(look.tier),
  };
}

function makeDust(side: -1 | 1): DustStar {
  return {
    ...starBase("dust", { ...bandPoint(side), z: (Math.random() - 0.5) * 0.5 }),
    kind: "dust",
    band: bandPoint(side),
    z: (Math.random() - 0.5) * 0.4,
  };
}

export function AstraField() {
  const trackRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, inside: false, moveX: 0, moveY: 0 });
  const orbit = useRef({ yaw: REST_YAW, pitch: REST_PITCH, yawVelocity: 0, pitchVelocity: 0 });
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originYaw: REST_YAW,
    originPitch: REST_PITCH,
  });

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const current = orbit.current;
    current.yaw = REST_YAW + wrapAngle(current.yaw - REST_YAW);
    current.pitch = REST_PITCH + wrapAngle(current.pitch - REST_PITCH);
    current.yawVelocity = 0;
    current.pitchVelocity = 0;
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!wrap || !canvas || !track) return;

    let alive = true;
    let cleanup = () => {};

    void Promise.all([
      import("three"),
      import("three/examples/jsm/postprocessing/EffectComposer.js"),
      import("three/examples/jsm/postprocessing/RenderPass.js"),
      import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
      import("three/examples/jsm/postprocessing/OutputPass.js"),
    ]).then(([THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }]) => {
      if (!alive) return;

      const upperSpine = sampleSpine(upperWing, 880);
      const lowerSpine = sampleSpine(lowerArch, 1040);
      const route = buildRoute(upperSpine, lowerSpine);
      const leftWord = wrap.querySelector("[data-astra-left]");
      const rightWord = wrap.querySelector("[data-astra-right]");

      // One stream over the whole route (both ribbons plus the hidden hops).
      const ribbonCount = Math.round(
        Math.max(2200, Math.min(5200, (spineLength(upperSpine) + spineLength(lowerSpine)) * 2.9)),
      );
      const stars: Star[] = [];
      for (let i = 0; i < ribbonCount; i++) stars.push(makeRibbon(route.length));
      for (let i = 0; i < DUST_PER_SIDE; i++) stars.push(makeDust(-1));
      for (let i = 0; i < DUST_PER_SIDE; i++) stars.push(makeDust(1));

      const restPosition = (star: RibbonStar) => {
        const inPlane = star.offset * Math.cos(star.angle);
        const depth = star.offset * Math.sin(star.angle) * TUBE_DEPTH;
        const point = pointOnSpine(route.points, route.frames, star.t, inPlane);
        return toWorld(point.x, point.y, sampleAt(route.z, star.t) + depth + star.z);
      };

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(BACKGROUND, 1);
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      // Filmic tone mapping rolls overlapping stars off softly instead of clipping to flat white.
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);
      const group = new THREE.Group();
      group.rotation.set(orbit.current.pitch, orbit.current.yaw, 0);
      scene.add(group);

      const positions = new Float32Array(stars.length * 3);
      const colors = new Float32Array(stars.length * 3);
      const sizes = new Float32Array(stars.length);
      const glows = new Float32Array(stars.length);
      const alphas = new Float32Array(stars.length);
      const nudgeX = new Float32Array(stars.length);
      const nudgeY = new Float32Array(stars.length);
      const ribbonColors = new Float32Array(stars.length * 3);
      const outerColors = new Float32Array(stars.length * 3);
      // Colours stay in display space: the shader writes them without conversion.
      const writeColor = (out: Float32Array, index: number, look: Look) => {
        out[index * 3] = (((look.color >> 16) & 255) / 255) * look.brightness;
        out[index * 3 + 1] = (((look.color >> 8) & 255) / 255) * look.brightness;
        out[index * 3 + 2] = ((look.color & 255) / 255) * look.brightness;
      };
      stars.forEach((star, index) => {
        writeColor(ribbonColors, index, star);
        writeColor(outerColors, index, star.kind === "ribbon" ? star.outer : star);
        writeColor(colors, index, star);
        sizes[index] = star.size;
        glows[index] = star.glow;
        alphas[index] = 1;
      });

      const geometry = new THREE.BufferGeometry();
      const positionAttr = new THREE.BufferAttribute(positions, 3);
      positionAttr.setUsage(THREE.DynamicDrawUsage);
      const sizeAttr = new THREE.BufferAttribute(sizes, 1);
      sizeAttr.setUsage(THREE.DynamicDrawUsage);
      const glowAttr = new THREE.BufferAttribute(glows, 1);
      glowAttr.setUsage(THREE.DynamicDrawUsage);
      const alphaAttr = new THREE.BufferAttribute(alphas, 1);
      alphaAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", positionAttr);
      const colorAttr = new THREE.BufferAttribute(colors, 3);
      colorAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("color", colorAttr);
      geometry.setAttribute("size", sizeAttr);
      geometry.setAttribute("glow", glowAttr);
      geometry.setAttribute("alpha", alphaAttr);

      const uniforms = {
        uPixelRatio: { value: 1 },
        uDepth: { value: 1 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: STAR_VERTEX,
        fragmentShader: STAR_FRAGMENT,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      group.add(points);

      // Stars render into a half-float target so additive overlaps keep their
      // range; bloom then spreads the brightest light, and OutputPass applies
      // tone mapping.
      const composer = new EffectComposer(
        renderer,
        new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }),
      );
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(1, 1),
        BLOOM_STRENGTH,
        BLOOM_RADIUS,
        BLOOM_THRESHOLD,
      );
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const local = new THREE.Vector3();
      const projected = new THREE.Vector3();
      const sprayed = new THREE.Vector3();
      const settled = new THREE.Vector3();
      const inverseWorld = new THREE.Matrix4();

      const restPose = new THREE.Object3D();
      restPose.rotation.set(REST_PITCH, REST_YAW, 0);
      restPose.updateMatrixWorld(true);

      const placeCamera = (distance: number) => {
        const z = distance / Math.hypot(CAMERA_LIFT_X, CAMERA_LIFT_Y, 1);
        camera.far = distance + 24;
        camera.position.set(z * CAMERA_LIFT_X, z * CAMERA_LIFT_Y, z);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
      };

      /** On-screen height of the gathered ribbons in the rest pose. */
      const restHeightPx = () => {
        let top = -Infinity;
        let bottom = Infinity;
        for (const star of stars) {
          if (star.kind !== "ribbon") continue;
          const [x, y, z] = restPosition(star);
          local.set(x, y, z).applyMatrix4(restPose.matrixWorld).project(camera);
          top = Math.max(top, local.y);
          bottom = Math.min(bottom, local.y);
        }
        return top > bottom ? ((top - bottom) / 2) * stageHeight : 0;
      };

      let stageWidth = 1;
      let stageHeight = 1;
      let sizeScale = 1;
      const frameCamera = () => {
        stageWidth = Math.max(1, wrap.clientWidth);
        stageHeight = Math.max(1, wrap.clientHeight);
        const marginX = clamp(stageWidth * 0.04, 16, 56);
        const marginY = clamp(stageHeight * 0.06, 24, 64);
        const markPx = Math.max(
          1,
          Math.min(
            MARK_PX,
            stageHeight - marginY * 2,
            ((stageWidth - marginX * 2) * MARK_HEIGHT) / MARK_WIDTH,
          ),
        );
        let distance =
          (MARK_HEIGHT * SCALE * stageHeight) / (markPx * 2 * Math.tan((FOV * Math.PI) / 360));
        camera.aspect = stageWidth / stageHeight;
        placeCamera(distance);
        for (let pass = 0; pass < 2; pass++) {
          const shown = restHeightPx();
          if (shown > 0) placeCamera((distance *= shown / markPx));
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(stageWidth, stageHeight, false);
        composer.setPixelRatio(renderer.getPixelRatio());
        composer.setSize(stageWidth, stageHeight);
        // Smaller stages get a lighter bloom so the mark does not wash out.
        bloom.strength = BLOOM_STRENGTH * clamp(markPx / MARK_PX, 0.6, 1);
        uniforms.uPixelRatio.value = renderer.getPixelRatio();
        uniforms.uDepth.value = camera.position.length();
        sizeScale = Math.sqrt(markPx / MARK_PX);
      };

      const observer = new ResizeObserver(frameCamera);
      observer.observe(wrap);
      frameCamera();

      const readProgress = () => {
        const rect = track.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return 1;
        const passed = Math.min(Math.max(-rect.top, 0), scrollable);
        return passed / scrollable;
      };

      const ndcToLocal = (ndcX: number, ndcY: number, depth: number, out: typeof projected) => {
        projected.set(ndcX, ndcY, 0.5);
        projected.unproject(camera);
        const origin = camera.position;
        const dz = projected.z - origin.z;
        const travel = Math.abs(dz) > 1e-5 ? (depth - origin.z) / dz : 0;
        out.set(
          origin.x + (projected.x - origin.x) * travel,
          origin.y + (projected.y - origin.y) * travel,
          depth,
        );
        out.applyMatrix4(inverseWorld);
      };

      const wordArea = (element: Element | null): Area | null => {
        const stage = wrap.getBoundingClientRect();
        if (!element || stage.width <= 0 || stage.height <= 0) return null;
        const rect = element.getBoundingClientRect();
        const toX = (px: number) => ((px - stage.left) / stage.width) * 2 - 1;
        const toY = (px: number) => -(((px - stage.top) / stage.height) * 2 - 1);
        return {
          left: toX(rect.left - WORD_PAD_PX),
          right: toX(rect.right + WORD_PAD_PX),
          top: toY(rect.top - WORD_PAD_PX),
          bottom: toY(rect.bottom + WORD_PAD_PX),
        };
      };

      let frame = 0;
      let running = false;
      let previous = performance.now();
      let scroll = reduced.matches ? 1 : readProgress();

      const draw = (now: number) => {
        const dt = Math.min(0.05, (now - previous) * 0.001);
        previous = now;
        const still = reduced.matches;
        const target = still ? 1 : readProgress();
        scroll += (target - scroll) * (1 - Math.exp(-dt * SCROLL_EASE));
        if (Math.abs(target - scroll) < 1e-4) scroll = target;
        const flow = still ? 0 : smoothstep((scroll - FLOW_START) / FLOW_SPAN);
        const time = now * 0.001;

        const pose = orbit.current;
        if (!drag.current.active) {
          if (still) {
            pose.yaw = REST_YAW;
            pose.pitch = REST_PITCH;
            pose.yawVelocity = 0;
            pose.pitchVelocity = 0;
          } else {
            pose.yawVelocity += (SPRING_K * (REST_YAW - pose.yaw) - SPRING_C * pose.yawVelocity) * dt;
            pose.pitchVelocity +=
              (SPRING_K * (REST_PITCH - pose.pitch) - SPRING_C * pose.pitchVelocity) * dt;
            pose.yaw += pose.yawVelocity * dt;
            pose.pitch += pose.pitchVelocity * dt;
          }
        }
        group.rotation.set(pose.pitch, pose.yaw, 0);
        group.updateMatrixWorld(true);
        camera.updateMatrixWorld();
        inverseWorld.copy(group.matrixWorld).invert();

        const cursor = pointer.current;
        const moveX = clamp(cursor.moveX, -64, 64);
        const moveY = clamp(cursor.moveY, -64, 64);
        cursor.moveX = 0;
        cursor.moveY = 0;
        const kicking = cursor.inside && !drag.current.active && (moveX !== 0 || moveY !== 0);
        const nudgeFade = Math.exp(-dt * NUDGE_RETURN);

        const width = stageWidth;
        const height = stageHeight;
        const leftArea = wordArea(leftWord);
        const rightArea = wordArea(rightWord);
        const array = positionAttr.array as Float32Array;

        for (let index = 0; index < stars.length; index++) {
          const star = stars[index];
          if (!star) continue;
          const gather = still
            ? 1
            : smoothstep((scroll - star.delay * GATHER_STAGGER) / GATHER_SPAN);

          if (star.kind === "ribbon") {
            if (flow > 0) {
              star.t += star.speed * dt * flow;
              if (star.t >= 1) star.t -= 1;
            }
            const [tx, ty, tz] = restPosition(star);
            settled.set(tx, ty, tz);
          } else {
            ndcToLocal(star.band.nx, star.band.ny, star.z, settled);
          }

          let x = settled.x;
          let y = settled.y;
          let z = settled.z;
          let size = star.size;
          let tier = star.tier;
          let alpha = 1;
          if (star.kind === "ribbon") {
            const land = smoothstep((gather - LAND_START) / (1 - LAND_START));
            const outer = star.outer;
            const ribbonSize = star.tier === "fine" ? star.size : star.size * sizeScale;
            size = outer.size + (ribbonSize - outer.size) * land;
            glows[index] = outer.glow + (star.glow - outer.glow) * land;
            for (let c = index * 3; c < index * 3 + 3; c++) {
              const from = outerColors[c] ?? 0;
              colors[c] = from + ((ribbonColors[c] ?? 0) - from) * land;
            }
            if (land < 0.5) tier = outer.tier;
            alpha *= 1 - land * (1 - spineFade(star.offset));
            // Approaching a crossing, a star shrinks and fades out; it passes
            // through hidden and grows back in on the other ribbon.
            const pass = sampleAt(route.vis, star.t);
            size *= 1 - land * (1 - (0.2 + 0.8 * pass));
            alpha *= 1 - land * (1 - pass * pass);
          }
          const fine = tier === "fine";
          const flare = tier === "flare";
          if (gather < 1) {
            ndcToLocal(star.spray.nx, star.spray.ny, star.spray.z, sprayed);
            x = sprayed.x + (x - sprayed.x) * gather;
            y = sprayed.y + (y - sprayed.y) * gather;
            z = sprayed.z + (z - sprayed.z) * gather;
          }
          if (flow > 0) {
            const depth = flare ? FLARE_TWINKLE : fine ? FINE_TWINKLE : TWINKLE;
            alpha *= 1 - depth * flow * (0.5 + 0.5 * Math.sin(time * star.rate + star.phase));
          }

          let ox = (nudgeX[index] ?? 0) * nudgeFade;
          let oy = (nudgeY[index] ?? 0) * nudgeFade;
          if (kicking || ox * ox + oy * oy > 0.01) {
            local.set(x, y, z).applyMatrix4(group.matrixWorld);
            projected.copy(local).project(camera);
            if (projected.z > -1 && projected.z < 1) {
              if (kicking) {
                const sx = (projected.x * 0.5 + 0.5) * width;
                const sy = (-projected.y * 0.5 + 0.5) * height;
                const dist = Math.hypot(cursor.x - sx, cursor.y - sy);
                if (dist < NUDGE_RADIUS_PX) {
                  const falloff = 1 - dist / NUDGE_RADIUS_PX;
                  const influence = falloff * falloff;
                  ox += moveX * NUDGE_GAIN * influence;
                  oy += moveY * NUDGE_GAIN * influence;
                  const reach = Math.hypot(ox, oy);
                  if (reach > NUDGE_MAX_PX) {
                    ox *= NUDGE_MAX_PX / reach;
                    oy *= NUDGE_MAX_PX / reach;
                  }
                }
              }
              if (ox * ox + oy * oy > 0.01) {
                projected.x += (ox / width) * 2;
                projected.y -= (oy / height) * 2;
                projected.unproject(camera).applyMatrix4(inverseWorld);
                x = projected.x;
                y = projected.y;
                z = projected.z;
              }
            }
          } else {
            ox = 0;
            oy = 0;
          }
          nudgeX[index] = ox;
          nudgeY[index] = oy;

          const veil = star.kind === "dust" ? 1 : 1 - gather;
          if (veil > 0) {
            local.set(x, y, z).applyMatrix4(group.matrixWorld).project(camera);
            const clear = Math.min(
              wordMask(leftArea, local.x, local.y),
              wordMask(rightArea, local.x, local.y),
            );
            alpha *= 1 - veil * (1 - clear);
          }

          array[index * 3] = x;
          array[index * 3 + 1] = y;
          array[index * 3 + 2] = z;
          sizes[index] = size;
          alphas[index] = alpha;
        }
        positionAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
        glowAttr.needsUpdate = true;
        alphaAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;

        composer.render(dt);
        if (running) frame = requestAnimationFrame(draw);
      };

      const start = () => {
        if (running) return;
        running = true;
        previous = performance.now();
        scroll = reduced.matches ? 1 : readProgress();
        frame = requestAnimationFrame(draw);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };
      const visibility = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start();
        else stop();
      });
      visibility.observe(track);

      cleanup = () => {
        stop();
        visibility.disconnect();
        observer.disconnect();
        geometry.dispose();
        material.dispose();
        bloom.dispose();
        composer.dispose();
        renderer.dispose();
      };
    });

    return () => {
      alive = false;
      cleanup();
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className="relative z-10 h-[220vh] bg-[#08101a]"
      aria-label="BridgeWide mark between the words Bridge and Wide. Drag to turn the mark."
    >
      <div
        ref={wrapRef}
        className="sticky top-0 h-[100svh] min-h-[36rem] cursor-grab touch-pan-y overflow-hidden bg-[#08101a] text-white select-none active:cursor-grabbing"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          const rect = event.currentTarget.getBoundingClientRect();
          pointer.current.x = event.clientX - rect.left;
          pointer.current.y = event.clientY - rect.top;
          pointer.current.moveX = 0;
          pointer.current.moveY = 0;
          drag.current.active = true;
          drag.current.startX = event.clientX;
          drag.current.startY = event.clientY;
          drag.current.originYaw = orbit.current.yaw;
          drag.current.originPitch = orbit.current.pitch;
          orbit.current.yawVelocity = 0;
          orbit.current.pitchVelocity = 0;
        }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          if (pointer.current.inside && !drag.current.active) {
            pointer.current.moveX += x - pointer.current.x;
            pointer.current.moveY += y - pointer.current.y;
          }
          pointer.current.x = x;
          pointer.current.y = y;
          pointer.current.inside = true;
          if (!drag.current.active) return;
          orbit.current.yaw = drag.current.originYaw + (event.clientX - drag.current.startX) * 0.0075;
          orbit.current.pitch = drag.current.originPitch + (event.clientY - drag.current.startY) * 0.005;
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          endDrag();
          pointer.current.inside = false;
          pointer.current.moveX = 0;
          pointer.current.moveY = 0;
        }}
      >
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.3)_100%)]"
        />
        <p
          data-astra-left
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-[112%] -translate-y-1/2 font-sans text-4xl font-medium tracking-[-0.04em] md:left-[15%] md:translate-x-0 md:text-6xl"
        >
          Bridge
        </p>
        <p
          data-astra-right
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 translate-x-[12%] -translate-y-1/2 font-sans text-4xl font-medium tracking-[-0.04em] md:left-auto md:right-[15%] md:translate-x-0 md:text-6xl"
        >
          Wide
        </p>
      </div>
    </section>
  );
}
