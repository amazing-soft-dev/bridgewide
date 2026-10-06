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

/** Previous upper path midpoint was 0.071. Both ribbons share one third of that. */
const FLOW_SPEED = 0.071 / 3;
const TWINKLE = 0.45;
const FLARE_TWINKLE = 0.2;
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
/** Ribbon: 60% 1px dust, 30% 3px cyan, 10% 8–12px flares. */
const RIBBON_TIERS = [0.6, 0.3] as const;
const FINE_COLOR = 0xdfe9f5;
const ICE_COLOR = 0x9fdcff;
const FLARE_COLOR = 0xffffff;
/** ~65% of a N(0, σ) sample falls inside ±1.2 mark units. */
const SPINE_SIGMA = 1.28;

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
  vColor = color;
  vGlow = glow;
  vAlpha = alpha;
  vSize = max(size * uPixelRatio, 1.0);
  // Halo must reach past the core so neighbours add into one beam.
  vQuad = max(vSize, mix(2.5, 10.0, vGlow) * uPixelRatio);
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
  if (d > vQuad * 0.5) discard;
  float css = d / uPixelRatio;
  float sizeCss = vSize / uPixelRatio;
  float hero = step(0.8, vGlow);
  float coreCss = mix(
    clamp(sizeCss * 0.45, 0.4, 1.4),
    clamp(sizeCss * 0.35, 2.0, 5.0),
    hero
  );
  // Under one device pixel the core aliases as it moves, so widen it and keep its energy.
  float coreWidth = max(coreCss, 1.0 / uPixelRatio);
  float c = css / coreWidth;
  float core = (coreCss * coreCss) / (coreWidth * coreWidth) * exp(-2.0 * c * c);
  float r = min(d / (vSize * 0.5), 1.0);
  float edge = 1.0 - r * r;
  float halo = (0.18 + vGlow) * exp(-mix(2.6, 1.55, hero) * r) * edge * edge;
  vec3 ice = vec3(0.682, 0.902, 1.0);
  vec3 hot = mix(vColor, vec3(1.0), clamp(core * 1.35, 0.0, 1.0));
  gl_FragColor = vec4((hot * core + ice * halo) * vAlpha, 1.0);
}
`;

type Sample = { x: number; y: number };
type Spine = Sample[];
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
  spine: 0 | 1;
  t: number;
  speed: number;
  offset: number;
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

function pointOnSpine(spine: Spine, t: number, offset: number) {
  const n = spine.length;
  const wrapped = ((t % 1) + 1) % 1;
  const f = wrapped * n;
  const i = Math.floor(f) % n;
  const u = f - Math.floor(f);
  const a = spine[i];
  const b = spine[(i + 1) % n];
  if (!a || !b) return { x: 84, y: 50 };
  const tx = b.x - a.x;
  const ty = b.y - a.y;
  const len = Math.hypot(tx, ty) || 1;
  return {
    x: a.x + tx * u + (-ty / len) * offset,
    y: a.y + ty * u + (tx / len) * offset,
  };
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

function starLook(kind: "ribbon" | "dust"): Look {
  const dust = kind === "dust";
  const [fine, ambient] = dust ? DUST_TIERS : RIBBON_TIERS;
  const roll = Math.random();
  if (roll < fine) {
    return {
      tier: "fine" as const,
      size: dust ? between(0.8, 1.5) : between(0.9, 1.2),
      glow: dust ? 0 : 0.22,
      color: FINE_COLOR,
      brightness: dust ? between(0.35, 0.65) : between(0.7, 1),
    };
  }
  if (dust || roll < fine + ambient) {
    return {
      tier: "ambient" as const,
      size: dust ? between(2, 3) : between(2.7, 3.3),
      glow: dust ? 0.3 : 0.78,
      color: ICE_COLOR,
      brightness: dust ? between(0.4, 0.6) : between(0.85, 1),
    };
  }
  return { tier: "flare" as const, size: between(8, 12), glow: 1, color: FLARE_COLOR, brightness: 1 };
}

/** Gaussian scatter around the path: ~65% on the spine, a thin mist at the fringes. */
function ribbonSpread(tier: Tier) {
  const sigma = tier === "flare" ? 0.65 : SPINE_SIGMA;
  let offset = gaussian(sigma);
  if (tier !== "flare" && Math.random() < 0.08) offset = gaussian(4.5);
  const z = gaussian(tier === "flare" ? 0.7 : 2.1);
  return { offset, z };
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

function makeRibbon(spine: 0 | 1): RibbonStar {
  const base = starBase("ribbon", sprayPoint(Math.random() < 0.5 ? -1 : 1));
  return {
    ...base,
    kind: "ribbon",
    outer: starLook("dust"),
    spine,
    t: Math.random(),
    speed: FLOW_SPEED * (0.97 + Math.random() * 0.06),
    ...ribbonSpread(base.tier),
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

    void import("three").then((THREE) => {
      if (!alive) return;

      const upperSpine = sampleSpine(upperWing, 880);
      const lowerSpine = sampleSpine(lowerArch, 1040);
      const spines = [upperSpine, lowerSpine];
      const leftWord = wrap.querySelector("[data-astra-left]");
      const rightWord = wrap.querySelector("[data-astra-right]");

      const counts = [
        Math.round(Math.max(1600, Math.min(3600, spineLength(upperSpine) * 4))),
        Math.round(Math.max(1800, Math.min(4000, spineLength(lowerSpine) * 4))),
      ];
      const stars: Star[] = [];
      for (let i = 0; i < (counts[0] ?? 640); i++) stars.push(makeRibbon(0));
      for (let i = 0; i < (counts[1] ?? 720); i++) stars.push(makeRibbon(1));
      for (let i = 0; i < DUST_PER_SIDE; i++) stars.push(makeDust(-1));
      for (let i = 0; i < DUST_PER_SIDE; i++) stars.push(makeDust(1));
      // #region agent log
      {
        const ribbon = stars.filter((s): s is RibbonStar => s.kind === "ribbon");
        const abs = ribbon.map((s) => Math.abs(s.offset)).sort((a, b) => a - b);
        const pick = (q: number) => +(abs[Math.floor(q * (abs.length - 1))] ?? 0).toFixed(2);
        const by: Record<string, number> = {};
        for (const s of ribbon) by[s.tier] = (by[s.tier] ?? 0) + 1;
        fetch("http://127.0.0.1:7294/ingest/d6eebea7-5345-4b53-a2ba-10de4bfce00d", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48e4f6" },
          body: JSON.stringify({
            sessionId: "48e4f6",
            runId: "post-fix",
            hypothesisId: "B,C,D",
            location: "AstraField.tsx:init",
            message: "ribbon gaussian offsets and 60/30/10 split",
            data: {
              n: ribbon.length,
              onSpinePct: +((100 * abs.filter((v) => v <= 1.2).length) / Math.max(1, abs.length)).toFixed(1),
              offset: { p50: pick(0.5), p90: pick(0.9), max: pick(1) },
              share: {
                fine: +((100 * (by.fine ?? 0)) / ribbon.length).toFixed(1),
                ambient: +((100 * (by.ambient ?? 0)) / ribbon.length).toFixed(1),
                flare: +((100 * (by.flare ?? 0)) / ribbon.length).toFixed(1),
              },
              sizes: {
                fine: ribbon.filter((s) => s.tier === "fine").slice(0, 1).map((s) => +s.size.toFixed(2)),
                ambient: ribbon.filter((s) => s.tier === "ambient").slice(0, 1).map((s) => +s.size.toFixed(2)),
                flare: ribbon.filter((s) => s.tier === "flare").slice(0, 1).map((s) => +s.size.toFixed(2)),
              },
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      }
      // #endregion

      const restPosition = (star: RibbonStar) => {
        const spine = spines[star.spine];
        if (!spine) return [0, 0, 0] as const;
        const point = pointOnSpine(spine, star.t, star.offset);
        return toWorld(point.x, point.y, star.z);
      };

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x050505, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

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
        uniforms.uDepth.value = distance;
        uniforms.uPixelRatio.value = renderer.getPixelRatio();
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

      let debugLast = 0;
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
          }
          const fine = tier === "fine";
          const flare = tier === "flare";
          let alpha = 1;
          if (gather < 1) {
            ndcToLocal(star.spray.nx, star.spray.ny, star.spray.z, sprayed);
            x = sprayed.x + (x - sprayed.x) * gather;
            y = sprayed.y + (y - sprayed.y) * gather;
            z = sprayed.z + (z - sprayed.z) * gather;
          }
          if (flow > 0 && !fine) {
            const depth = flare ? FLARE_TWINKLE : TWINKLE;
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

        // #region agent log
        if (now - debugLast > 2000) {
          debugLast = now;
          fetch("http://127.0.0.1:7294/ingest/d6eebea7-5345-4b53-a2ba-10de4bfce00d", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48e4f6" },
            body: JSON.stringify({
              sessionId: "48e4f6",
              runId: "post-fix",
              hypothesisId: "A",
              location: "AstraField.tsx:draw",
              message: "additive blend and halo still active",
              data: {
                scroll: +scroll.toFixed(3),
                blending: material.blending === THREE.AdditiveBlending,
                transparent: material.transparent,
                depthWrite: material.depthWrite,
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        }
        // #endregion

        renderer.render(scene, camera);
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
      className="relative z-10 h-[220vh] bg-[#050505]"
      aria-label="BridgeWide mark between the words Bridge and Wide. Drag to turn the mark."
    >
      <div
        ref={wrapRef}
        className="sticky top-0 h-[100svh] min-h-[36rem] cursor-grab touch-pan-y overflow-hidden bg-[#050505] text-white select-none active:cursor-grabbing"
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
