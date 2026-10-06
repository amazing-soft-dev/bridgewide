"use client";

import { useEffect, useRef } from "react";
import { markPaths } from "@/components/brand/mark";

/** Mark units → world. The camera then fits this height to 3/4 of the stage. */
const SCALE = 0.0092 * 4;
const MARK_HEIGHT = 100;
const MARK_SCREEN_FRACTION = 0.75;
const [upperWing, lowerArch] = markPaths;

/** Previous upper path midpoint was 0.071. Both ribbons share one third of that. */
const FLOW_SPEED = 0.071 / 3;
const SIZE_MIN = 0.06;
const SIZE_MAX = 0.42;
const NUDGE_RADIUS_PX = 120;
const NUDGE_GAIN = 1.65;
const DUST_PER_SIDE = 210;

type Sample = { x: number; y: number };
type Spine = Sample[];
type RibbonStar = {
  kind: "ribbon";
  spine: 0 | 1;
  side: "left" | "right";
  ju: number;
  jv: number;
  t: number;
  speed: number;
  offset: number;
  z: number;
  size: number;
  warm: boolean;
};
type DustStar = {
  kind: "dust";
  side: "left" | "right";
  ju: number;
  jv: number;
  z: number;
  warm: boolean;
};
type Star = RibbonStar | DustStar;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
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

function starSize() {
  const biased = SIZE_MIN + Math.pow(Math.random(), 3) * (SIZE_MAX - SIZE_MIN);
  return biased;
}

function starGain(size: number) {
  const t = Math.min(1, Math.max(0, (size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)));
  return 0.72 + t * 1.55;
}

function cloudJitter() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

function makeRibbon(spine: 0 | 1): RibbonStar {
  const warm = Math.random() < 0.075;
  return {
    kind: "ribbon",
    spine,
    side: Math.random() < 0.5 ? "left" : "right",
    ju: cloudJitter(),
    jv: cloudJitter(),
    t: Math.random(),
    speed: FLOW_SPEED * (0.97 + Math.random() * 0.06),
    offset: warm
      ? (Math.random() < 0.5 ? -1 : 1) * (5.4 + Math.random() * 2.6)
      : (Math.random() - 0.5) * (4.8 + Math.random() * 4.4),
    z: (Math.random() - 0.5) * 7,
    size: starSize(),
    warm,
  };
}

function softSprite(THREE: typeof import("three")) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Texture();
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.22, "rgba(255,255,255,0.85)");
  glow.addColorStop(0.48, "rgba(255,255,255,0.28)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function AstraField() {
  const trackRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, inside: false, dx: 0, dy: 0 });
  const orbit = useRef({ yaw: 0.62, pitch: -0.18 });
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originYaw: 0.62,
    originPitch: -0.18,
  });

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
      const pushRibbons = (spine: 0 | 1, count: number) => {
        for (let i = 0; i < count; i++) stars.push(makeRibbon(spine));
      };
      const pushDust = (side: "left" | "right") => {
        for (let i = 0; i < DUST_PER_SIDE; i++) {
          stars.push({
            kind: "dust",
            side,
            ju: cloudJitter(),
            jv: cloudJitter(),
            z: (Math.random() - 0.5) * 0.4,
            warm: Math.random() < 0.075,
          });
        }
      };
      pushRibbons(0, counts[0] ?? 640);
      pushRibbons(1, counts[1] ?? 720);
      pushDust("left");
      pushDust("right");

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
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
      const group = new THREE.Group();
      group.rotation.y = orbit.current.yaw;
      group.rotation.x = orbit.current.pitch;
      scene.add(group);

      const sprite = softSprite(THREE);
      const white = new THREE.Color("#ffffff");
      const ice = new THREE.Color("#c5dfff");
      const orange = new THREE.Color("#ff8f3a");

      const positions = new Float32Array(stars.length * 3);
      const colors = new Float32Array(stars.length * 3);
      const baseColors = new Float32Array(stars.length * 3);
      const sizes = new Float32Array(stars.length);
      stars.forEach((star, index) => {
        const color = star.warm ? orange : Math.random() < 0.52 ? white : ice;
        baseColors[index * 3] = color.r;
        baseColors[index * 3 + 1] = color.g;
        baseColors[index * 3 + 2] = color.b;
        const shown = star.kind === "dust" ? SIZE_MIN : SIZE_MIN;
        const gain = starGain(shown);
        colors[index * 3] = color.r * gain;
        colors[index * 3 + 1] = color.g * gain;
        colors[index * 3 + 2] = color.b * gain;
        sizes[index] = shown;
      });

      const geometry = new THREE.BufferGeometry();
      const positionAttr = new THREE.BufferAttribute(positions, 3);
      positionAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", positionAttr);
      const colorAttr = new THREE.BufferAttribute(colors, 3);
      const sizeAttr = new THREE.BufferAttribute(sizes, 1);
      colorAttr.setUsage(THREE.DynamicDrawUsage);
      sizeAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("color", colorAttr);
      geometry.setAttribute("size", sizeAttr);
      geometry.computeBoundingSphere();
      if (geometry.boundingSphere) geometry.boundingSphere.radius += 2;

      const material = new THREE.PointsMaterial({
        map: sprite,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        size: 1,
        sizeAttenuation: true,
      });
      material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace("uniform float size;", "attribute float size;");
      };
      material.customProgramCacheKey = () => "astra-sized-points";

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      group.add(points);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const local = new THREE.Vector3();
      const projected = new THREE.Vector3();
      const scratch = new THREE.Vector3();
      const inverseWorld = new THREE.Matrix4();

      const frameCamera = () => {
        const width = Math.max(1, wrap.clientWidth);
        const height = Math.max(1, wrap.clientHeight);
        const aspect = width / height;
        camera.aspect = aspect;
        const fovRad = (30 * Math.PI) / 180;
        const visibleHeight = (MARK_HEIGHT * SCALE) / MARK_SCREEN_FRACTION;
        const distance = visibleHeight / (2 * Math.tan(fovRad / 2));
        const aim = new THREE.Vector3(0.16, 0.09, 1).normalize().multiplyScalar(distance);
        camera.position.copy(aim);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(width, height, false);
      };

      const resize = () => frameCamera();
      const observer = new ResizeObserver(resize);
      observer.observe(wrap);
      frameCamera();

      const readProgress = () => {
        const rect = track.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return 1;
        const passed = Math.min(Math.max(-rect.top, 0), scrollable);
        return passed / scrollable;
      };

      const ndcToLocal = (ndcX: number, ndcY: number, depth: number, out: typeof scratch) => {
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

      const wordBand = (element: Element | null, fallbackX: number) => {
        const stage = wrap.getBoundingClientRect();
        if (!element || stage.width <= 0 || stage.height <= 0) return { x: fallbackX, y: 0 };
        const rect = element.getBoundingClientRect();
        const cx = (rect.left + rect.width / 2 - stage.left) / stage.width;
        const cy = (rect.top + rect.height / 2 - stage.top) / stage.height;
        return { x: cx * 2 - 1, y: -(cy * 2 - 1) };
      };

      let frame = 0;
      let previous = performance.now();
      const draw = (now: number) => {
        const dt = Math.min(0.05, (now - previous) * 0.001);
        previous = now;
        const progress = reduced.matches ? 1 : readProgress();
        const gather = reduced.matches ? 1 : smoothstep(progress / 0.64);
        if (!reduced.matches && gather >= 0.999) {
          for (const star of stars) {
            if (star.kind !== "ribbon") continue;
            star.t += star.speed * dt;
            if (star.t >= 1) star.t -= 1;
          }
        }

        group.rotation.y = orbit.current.yaw;
        group.rotation.x = orbit.current.pitch;
        group.updateMatrixWorld(true);
        camera.updateMatrixWorld();
        inverseWorld.copy(group.matrixWorld).invert();

        const nudgeX = pointer.current.dx;
        const nudgeY = pointer.current.dy;
        const nudging =
          pointer.current.inside &&
          !drag.current.active &&
          nudgeX * nudgeX + nudgeY * nudgeY > 0.16;

        const width = Math.max(1, wrap.clientWidth);
        const height = Math.max(1, wrap.clientHeight);
        const leftBand = wordBand(leftWord, -0.55);
        const rightBand = wordBand(rightWord, 0.55);
        const spreadX = width < 768 ? 0.2 : 0.15;
        const sidePoint = (side: "left" | "right", ju: number, jv: number, depth: number) => {
          const band = side === "left" ? leftBand : rightBand;
          const cloudX = Math.min(0.94, Math.max(-0.94, band.x + ju * spreadX));
          const cloudY = Math.min(0.72, Math.max(-0.72, band.y + jv * 0.22));
          ndcToLocal(cloudX, cloudY, depth, scratch);
          return { x: scratch.x, y: scratch.y, z: scratch.z };
        };
        const array = positionAttr.array as Float32Array;
        const colorArray = colorAttr.array as Float32Array;
        const sizeArray = sizeAttr.array as Float32Array;

        for (let index = 0; index < stars.length; index++) {
          const star = stars[index];
          if (!star) continue;
          let x = 0;
          let y = 0;
          let z = 0;
          let shown = SIZE_MIN;
          if (star.kind === "ribbon") {
            const home = sidePoint(star.side, star.ju, star.jv, star.z * SCALE);
            const [tx, ty, tz] = restPosition(star);
            if (gather >= 1) {
              x = tx;
              y = ty;
              z = tz;
            } else {
              x = home.x + (tx - home.x) * gather;
              y = home.y + (ty - home.y) * gather;
              z = home.z + (tz - home.z) * gather;
            }
            shown = SIZE_MIN + (star.size - SIZE_MIN) * gather;
          } else {
            const parked = sidePoint(star.side, star.ju, star.jv, star.z);
            x = parked.x;
            y = parked.y;
            z = parked.z;
            shown = SIZE_MIN;
          }

          sizeArray[index] = shown;
          const gain = starGain(shown);
          colorArray[index * 3] = (baseColors[index * 3] ?? 1) * gain;
          colorArray[index * 3 + 1] = (baseColors[index * 3 + 1] ?? 1) * gain;
          colorArray[index * 3 + 2] = (baseColors[index * 3 + 2] ?? 1) * gain;

          if (nudging && star.kind === "ribbon") {
            local.set(x, y, z).applyMatrix4(group.matrixWorld);
            projected.copy(local).project(camera);
            if (projected.z > -1 && projected.z < 1) {
              const sx = (projected.x * 0.5 + 0.5) * width;
              const sy = (-projected.y * 0.5 + 0.5) * height;
              const dx = pointer.current.x - sx;
              const dy = pointer.current.y - sy;
              const dist = Math.hypot(dx, dy);
              if (dist < NUDGE_RADIUS_PX) {
                const falloff = 1 - dist / NUDGE_RADIUS_PX;
                const influence = falloff * falloff;
                const px = sx + nudgeX * NUDGE_GAIN * influence;
                const py = sy + nudgeY * NUDGE_GAIN * influence;
                projected.x = (px / width) * 2 - 1;
                projected.y = -((py / height) * 2 - 1);
                projected.unproject(camera).applyMatrix4(inverseWorld);
                x = projected.x;
                y = projected.y;
                z = projected.z;
              }
            }
          }

          array[index * 3] = x;
          array[index * 3 + 1] = y;
          array[index * 3 + 2] = z;
        }
        positionAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;

        const fade = Math.exp(-dt * 8);
        pointer.current.dx *= fade;
        pointer.current.dy *= fade;

        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        geometry.dispose();
        material.dispose();
        sprite.dispose();
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
      aria-label="BridgeWide mark between the words Bridge and Wide. Drag to orbit the mark."
    >
      <div
        ref={wrapRef}
        className="sticky top-0 h-[100svh] min-h-[36rem] cursor-grab touch-none overflow-hidden bg-[#050505] text-white select-none active:cursor-grabbing"
        onPointerDown={(event) => {
          drag.current.active = true;
          drag.current.startX = event.clientX;
          drag.current.startY = event.clientY;
          drag.current.originYaw = orbit.current.yaw;
          drag.current.originPitch = orbit.current.pitch;
          pointer.current.dx = 0;
          pointer.current.dy = 0;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          if (pointer.current.inside && !drag.current.active) {
            const dx = Math.max(-48, Math.min(48, x - pointer.current.x));
            const dy = Math.max(-48, Math.min(48, y - pointer.current.y));
            pointer.current.dx = Math.max(-64, Math.min(64, pointer.current.dx + dx));
            pointer.current.dy = Math.max(-64, Math.min(64, pointer.current.dy + dy));
          }
          pointer.current.x = x;
          pointer.current.y = y;
          pointer.current.inside = true;
          if (!drag.current.active) return;
          orbit.current.yaw = drag.current.originYaw + (event.clientX - drag.current.startX) * 0.0075;
          const pitch = drag.current.originPitch + (event.clientY - drag.current.startY) * 0.005;
          orbit.current.pitch = Math.max(-1.05, Math.min(1.05, pitch));
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        onPointerCancel={() => {
          drag.current.active = false;
        }}
        onPointerLeave={() => {
          pointer.current.inside = false;
          pointer.current.dx = 0;
          pointer.current.dy = 0;
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
