"use client";

import { useEffect, useRef } from "react";
import { markPaths } from "@/components/brand/mark";

const SCALE = 0.0092;
const RIBBON_WORLD_WIDTH = 168 * SCALE;
const [upperWing, lowerArch] = markPaths;

/** Previous upper path midpoint was 0.071. Both ribbons share one third of that. */
const FLOW_SPEED = 0.071 / 3;
const SIZE_MIN = 0.02;
const SIZE_MAX = 0.16;
const PULL_RADIUS_PX = 96;
const PULL_MAX_PX = 18;
const DUST_PER_SIDE = 210;

type Sample = { x: number; y: number };
type Spine = Sample[];
type RibbonStar = {
  kind: "ribbon";
  spine: 0 | 1;
  t: number;
  speed: number;
  offset: number;
  z: number;
  size: number;
  warm: boolean;
};
type DustStar = {
  kind: "dust";
  x: number;
  y: number;
  z: number;
  size: number;
  warm: boolean;
};
type Star = RibbonStar | DustStar;

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
  const biased = SIZE_MIN + Math.pow(Math.random(), 5) * (SIZE_MAX - SIZE_MIN);
  return biased;
}

function starGain(size: number) {
  const t = Math.min(1, Math.max(0, (size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)));
  return 0.34 + t * 1.22;
}

function makeRibbon(spine: 0 | 1): RibbonStar {
  const warm = Math.random() < 0.075;
  return {
    kind: "ribbon",
    spine,
    t: Math.random(),
    speed: FLOW_SPEED * (0.97 + Math.random() * 0.06),
    offset: warm
      ? (Math.random() < 0.5 ? -1 : 1) * (2.5 + Math.random() * 2.4)
      : (Math.random() - 0.5) * (1.2 + Math.random() * 1.1),
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
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, inside: false });
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
    if (!wrap || !canvas) return;

    let alive = true;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (!alive) return;

      const upperSpine = sampleSpine(upperWing, 880);
      const lowerSpine = sampleSpine(lowerArch, 1040);
      const spines = [upperSpine, lowerSpine];
      const strokeSamples: Sample[] = [];
      for (const spine of spines) {
        for (let i = 0; i < spine.length; i += 3) {
          const point = spine[i];
          if (point) strokeSamples.push(point);
        }
      }
      const clearOfStroke = (x: number, y: number, min: number) => {
        const min2 = min * min;
        for (const point of strokeSamples) {
          const dx = point.x - x;
          const dy = point.y - y;
          if (dx * dx + dy * dy < min2) return false;
        }
        return true;
      };
      const makeDust = (side: "left" | "right"): DustStar | null => {
        const left = side === "left";
        for (let attempt = 0; attempt < 28; attempt++) {
          let x: number;
          let y: number;
          if (attempt % 2 === 0) {
            const spine = spines[Math.random() < 0.5 ? 0 : 1];
            if (!spine) continue;
            const sign = Math.random() < 0.5 ? -1 : 1;
            const point = pointOnSpine(spine, Math.random(), sign * (12 + Math.random() * 22));
            x = point.x + (Math.random() - 0.5) * 16 + (left ? -1 : 1) * (4 + Math.random() * 14);
            y = point.y + (Math.random() - 0.5) * 14;
          } else {
            x = left ? -8 + Math.random() * 80 : 96 + Math.random() * 86;
            y = -6 + Math.random() * 112;
          }
          if (y < -16 || y > 116) continue;
          if (left) {
            if (x < -18 || x > 76) continue;
          } else if (x < 92 || x > 186) continue;
          if (!clearOfStroke(x, y, 7.5)) continue;
          return {
            kind: "dust",
            x,
            y,
            z: (Math.random() - 0.5) * 26,
            size: starSize(),
            warm: Math.random() < 0.075,
          };
        }
        return null;
      };

      const counts = [
        Math.round(Math.max(460, Math.min(980, spineLength(upperSpine) * 1.15))),
        Math.round(Math.max(520, Math.min(1100, spineLength(lowerSpine) * 1.15))),
      ];
      const stars: Star[] = [];
      const pushRibbons = (spine: 0 | 1, count: number) => {
        for (let i = 0; i < count; i++) stars.push(makeRibbon(spine));
      };
      const pushDust = (side: "left" | "right") => {
        let placed = 0;
        let guard = 0;
        while (placed < DUST_PER_SIDE && guard < DUST_PER_SIDE * 40) {
          guard += 1;
          const dust = makeDust(side);
          if (!dust) continue;
          stars.push(dust);
          placed += 1;
        }
      };
      pushRibbons(0, counts[0] ?? 640);
      pushRibbons(1, counts[1] ?? 720);
      pushDust("left");
      pushDust("right");

      const restPosition = (star: Star) => {
        if (star.kind === "dust") return toWorld(star.x, star.y, star.z);
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
      const sizes = new Float32Array(stars.length);
      stars.forEach((star, index) => {
        const color = star.warm ? orange : Math.random() < 0.52 ? white : ice;
        const gain = starGain(star.size);
        colors[index * 3] = color.r * gain;
        colors[index * 3 + 1] = color.g * gain;
        colors[index * 3 + 2] = color.b * gain;
        sizes[index] = star.size;
        const [x, y, z] = restPosition(star);
        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;
      });

      const geometry = new THREE.BufferGeometry();
      const positionAttr = new THREE.BufferAttribute(positions, 3);
      positionAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", positionAttr);
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geometry.computeBoundingSphere();
      if (geometry.boundingSphere) geometry.boundingSphere.radius += 0.45;

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
      const inverseWorld = new THREE.Matrix4();

      const frameCamera = () => {
        const width = Math.max(1, wrap.clientWidth);
        const height = Math.max(1, wrap.clientHeight);
        const aspect = width / height;
        camera.aspect = aspect;
        const visible = RIBBON_WORLD_WIDTH / 0.36;
        const z = visible / (2 * Math.tan((30 * Math.PI) / 360) * Math.max(aspect, 0.45));
        camera.position.set(z * 0.16, z * 0.09, z);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(width, height, false);
      };

      const resize = () => frameCamera();
      const observer = new ResizeObserver(resize);
      observer.observe(wrap);
      frameCamera();

      let frame = 0;
      let previous = performance.now();
      const draw = (now: number) => {
        const dt = Math.min(0.05, (now - previous) * 0.001);
        previous = now;
        if (!reduced.matches) {
          for (const star of stars) {
            if (star.kind !== "ribbon") continue;
            star.t += star.speed * dt;
            if (star.t >= 1) star.t -= 1;
          }
        }

        group.rotation.y = orbit.current.yaw;
        group.rotation.x = orbit.current.pitch;

        const width = Math.max(1, wrap.clientWidth);
        const height = Math.max(1, wrap.clientHeight);
        const attract = pointer.current.inside && !drag.current.active;
        if (attract) {
          group.updateMatrixWorld(true);
          camera.updateMatrixWorld();
          inverseWorld.copy(group.matrixWorld).invert();
        }

        const array = positionAttr.array as Float32Array;
        for (let index = 0; index < stars.length; index++) {
          const star = stars[index];
          if (!star) continue;
          let [x, y, z] = restPosition(star);
          if (attract) {
            local.set(x, y, z).applyMatrix4(group.matrixWorld);
            projected.copy(local).project(camera);
            if (projected.z > -1 && projected.z < 1) {
              const sx = (projected.x * 0.5 + 0.5) * width;
              const sy = (-projected.y * 0.5 + 0.5) * height;
              const dx = pointer.current.x - sx;
              const dy = pointer.current.y - sy;
              const dist = Math.hypot(dx, dy);
              if (dist < PULL_RADIUS_PX && dist > 0.5) {
                const falloff = 1 - dist / PULL_RADIUS_PX;
                const shift = PULL_MAX_PX * falloff * falloff;
                const px = sx + (dx / dist) * shift;
                const py = sy + (dy / dist) * shift;
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
      ref={wrapRef}
      className="relative z-10 h-[100svh] min-h-[36rem] cursor-grab touch-none overflow-hidden bg-[#050505] text-white select-none active:cursor-grabbing"
      aria-label="BridgeWide mark between the words Bridge and Wide. Drag to orbit the mark."
      onPointerDown={(event) => {
        drag.current.active = true;
        drag.current.startX = event.clientX;
        drag.current.startY = event.clientY;
        drag.current.originYaw = orbit.current.yaw;
        drag.current.originPitch = orbit.current.pitch;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = event.clientX - rect.left;
        pointer.current.y = event.clientY - rect.top;
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
      }}
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <p
        data-astra-left
        className="pointer-events-none absolute top-1/2 left-[12%] -translate-y-1/2 font-sans text-4xl font-medium tracking-[-0.04em] md:left-[15%] md:text-6xl"
      >
        Bridge
      </p>
      <p
        data-astra-right
        className="pointer-events-none absolute top-1/2 right-[12%] -translate-y-1/2 font-sans text-4xl font-medium tracking-[-0.04em] md:right-[15%] md:text-6xl"
      >
        Wide
      </p>
    </section>
  );
}
