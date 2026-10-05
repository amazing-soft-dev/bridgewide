"use client";

import { useEffect, useRef } from "react";
import { markPaths } from "@/components/brand/mark";

const DEPTH = 46;
const SCALE = 0.0092;
const RIBBON_WORLD_WIDTH = 168 * SCALE;

type Pt = { x: number; y: number };
type ThreeModule = typeof import("three");
type Spray = {
  positions: number[];
  colors: number[];
  tangents: number[];
  amps: number[];
  phases: number[];
};

const EMPTY = (): Spray => ({
  positions: [],
  colors: [],
  tangents: [],
  amps: [],
  phases: [],
});

function inside(poly: Pt[], x: number, y: number) {
  let wind = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j];
    const b = poly[i];
    if (a && b && (a.y > y) !== (b.y > y)) {
      const xint = ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x;
      if (x < xint) wind++;
    }
  }
  return wind % 2 === 1;
}

function distToSeg(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function buildFlow(outline: Pt[]) {
  const gw = 84;
  const gh = 50;
  const sx = 168 / gw;
  const sy = 100 / gh;
  const dist = new Float32Array(gw * gh);
  const tx = new Float32Array(gw * gh);
  const ty = new Float32Array(gw * gh);
  let maxDist = 1;
  let seed = -1;
  let seedX = Infinity;

  for (let j = 0; j < gh; j++) {
    for (let i = 0; i < gw; i++) {
      const x = (i + 0.5) * sx;
      const y = (j + 0.5) * sy;
      const id = j * gw + i;
      if (!inside(outline, x, y)) continue;
      let d = Infinity;
      for (let e = 0; e < outline.length; e++) {
        const a = outline[e];
        const b = outline[(e + 1) % outline.length];
        if (!a || !b) continue;
        d = Math.min(d, distToSeg(x, y, a.x, a.y, b.x, b.y));
      }
      dist[id] = d;
      if (d > maxDist) maxDist = d;
      if (x < seedX) {
        seedX = x;
        seed = id;
      }
    }
  }

  for (let j = 1; j < gh - 1; j++) {
    for (let i = 1; i < gw - 1; i++) {
      const id = j * gw + i;
      if (dist[id] <= 0) continue;
      const gx = (dist[id + 1] ?? 0) - (dist[id - 1] ?? 0);
      const gy = (dist[id + gw] ?? 0) - (dist[id - gw] ?? 0);
      const len = Math.hypot(gx, gy) || 1;
      tx[id] = -gy / len;
      ty[id] = gx / len;
    }
  }

  if (seed >= 0) {
    const seen = new Uint8Array(gw * gh);
    const queue = [seed];
    seen[seed] = 1;
    for (let q = 0; q < queue.length; q++) {
      const id = queue[q] ?? 0;
      const i = id % gw;
      const j = Math.floor(id / gw);
      const neighbors = [i > 0 ? id - 1 : -1, i + 1 < gw ? id + 1 : -1, j > 0 ? id - gw : -1, j + 1 < gh ? id + gw : -1];
      for (const next of neighbors) {
        if (next < 0 || seen[next] || (dist[next] ?? 0) <= 0) continue;
        const dot = (tx[id] ?? 0) * (tx[next] ?? 0) + (ty[id] ?? 0) * (ty[next] ?? 0);
        if (dot < 0) {
          tx[next] = -(tx[next] ?? 0);
          ty[next] = -(ty[next] ?? 0);
        }
        seen[next] = 1;
        queue.push(next);
      }
    }
  }

  return {
    maxDist,
    at(x: number, y: number) {
      const i = Math.max(0, Math.min(gw - 1, Math.floor(x / sx)));
      const j = Math.max(0, Math.min(gh - 1, Math.floor(y / sy)));
      const id = j * gw + i;
      return {
        dist: dist[id] ?? 0,
        tx: tx[id] || 1,
        ty: ty[id] || 0,
      };
    },
  };
}

function shapeFromPath(THREE: ThreeModule, d: string) {
  const tokens = d.match(/[MLCQZ]|-?\d*\.?\d+/g) ?? [];
  const shape = new THREE.Shape();
  let i = 0;
  while (i < tokens.length) {
    const command = tokens[i];
    if (command === "M") {
      shape.moveTo(Number(tokens[++i]), Number(tokens[++i]));
      i++;
    } else if (command === "L") {
      shape.lineTo(Number(tokens[++i]), Number(tokens[++i]));
      i++;
    } else if (command === "C") {
      const x1 = Number(tokens[++i]);
      const y1 = Number(tokens[++i]);
      const x2 = Number(tokens[++i]);
      const y2 = Number(tokens[++i]);
      const x = Number(tokens[++i]);
      const y = Number(tokens[++i]);
      shape.bezierCurveTo(x1, y1, x2, y2, x, y);
      i++;
    } else if (command === "Q") {
      const x1 = Number(tokens[++i]);
      const y1 = Number(tokens[++i]);
      const x = Number(tokens[++i]);
      const y = Number(tokens[++i]);
      shape.quadraticCurveTo(x1, y1, x, y);
      i++;
    } else if (command === "Z") {
      shape.closePath();
      i++;
    } else {
      i++;
    }
  }
  return shape;
}

function worldOf(x: number, y: number, z: number) {
  return [(x - 84) * SCALE, (50 - y) * SCALE, (z - DEPTH / 2) * SCALE] as const;
}

type Flow = ReturnType<typeof buildFlow>;
type Swatch = { r: number; g: number; b: number };

function paint(swatches: { red: Swatch; white: Swatch; ice: Swatch; amber: Swatch }, ridge: number, roll: number) {
  if (ridge > 0.58 && roll < 0.8) return swatches.red;
  if (roll < 0.34) return swatches.white;
  if (roll < 0.67) return swatches.ice;
  return swatches.amber;
}

function pushPoint(
  bins: { small: Spray; mid: Spray; spark: Spray },
  kind: "edge" | "face" | "core" | "dust",
  x: number,
  y: number,
  z: number,
  flow: Flow | null,
  swatches: { red: Swatch; white: Swatch; ice: Swatch; amber: Swatch },
  gain = 1,
) {
  const sample = flow ? flow.at(x, y) : { dist: 0, tx: 1, ty: 0 };
  const ridge = flow ? sample.dist / flow.maxDist : 0;
  const roll = kind === "edge" ? 0.42 + Math.random() * 0.58 : Math.random();
  const color = kind === "dust" ? paint(swatches, 0, roll) : paint(swatches, ridge, roll);
  const bin =
    kind === "dust" || (kind === "edge" && roll < 0.75)
      ? bins.small
      : kind === "core" && ridge > 0.58
        ? roll < 0.45
          ? bins.spark
          : bins.mid
        : roll < 0.5
          ? bins.small
          : roll < 0.88
            ? bins.mid
            : bins.spark;
  const [wx, wy, wz] = worldOf(x, y, z);
  bin.positions.push(wx, wy, wz);
  bin.colors.push(color.r * gain, color.g * gain, color.b * gain);
  if (kind === "dust") {
    const ang = Math.random() * Math.PI * 2;
    bin.tangents.push(Math.cos(ang), Math.sin(ang) * 0.6, (Math.random() - 0.5) * 0.4);
    bin.amps.push(0.03 + Math.random() * 0.04);
  } else {
    const len = Math.hypot(sample.tx, sample.ty) || 1;
    bin.tangents.push(sample.tx / len, -sample.ty / len, 0);
    bin.amps.push(Math.min(0.1, sample.dist * SCALE * 0.7));
  }
  bin.phases.push(Math.random() * Math.PI * 2);
}

function scatterRibbon(THREE: ThreeModule, bins: { small: Spray; mid: Spray; spark: Spray }, swatches: { red: Swatch; white: Swatch; ice: Swatch; amber: Swatch }, d: string) {
  const shape = shapeFromPath(THREE, d);
  const outline = shape.getPoints(6).map((point) => ({ x: point.x, y: point.y }));
  const flow = buildFlow(outline);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: false,
    curveSegments: 6,
    steps: 1,
  });
  const position = geo.getAttribute("position");
  const index = geo.getIndex();
  const triangles = index ? index.count / 3 : position.count / 3;
  let surface = 0;

  for (let tri = 0; tri < triangles; tri++) {
    const i0 = index ? index.getX(tri * 3) : tri * 3;
    const i1 = index ? index.getX(tri * 3 + 1) : tri * 3 + 1;
    const i2 = index ? index.getX(tri * 3 + 2) : tri * 3 + 2;
    const ax = position.getX(i0);
    const ay = position.getY(i0);
    const az = position.getZ(i0);
    const bx = position.getX(i1);
    const by = position.getY(i1);
    const bz = position.getZ(i1);
    const cx = position.getX(i2);
    const cy = position.getY(i2);
    const cz = position.getZ(i2);
    const ux = bx - ax;
    const uy = by - ay;
    const uz = bz - az;
    const vx = cx - ax;
    const vy = cy - ay;
    const vz = cz - az;
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const area = 0.5 * Math.hypot(nx, ny, nz);
    if (area < 1.5) continue;
    const faceZ = nz / (Math.hypot(nx, ny, nz) || 1);
    const kind = Math.abs(faceZ) > 0.72 ? "face" : "edge";
    const density = kind === "edge" ? 0.1 : 0.15;
    const count = Math.round(area * density);
    for (let n = 0; n < count; n++) {
      let a = Math.random();
      let b = Math.random();
      if (a + b > 1) {
        a = 1 - a;
        b = 1 - b;
      }
      const c = 1 - a - b;
      pushPoint(
        bins,
        kind,
        ax * a + bx * b + cx * c,
        ay * a + by * b + cy * c,
        az * a + bz * b + cz * c,
        flow,
        swatches,
      );
      surface++;
    }
  }
  geo.dispose();

  if (surface < 400) {
    const length = outline.reduce((sum, point, i) => {
      const next = outline[(i + 1) % outline.length];
      return next ? sum + Math.hypot(next.x - point.x, next.y - point.y) : sum;
    }, 0);
    for (let n = 0; n < 900; n++) {
      let walk = Math.random() * length;
      for (let i = 0; i < outline.length; i++) {
        const a = outline[i];
        const b = outline[(i + 1) % outline.length];
        if (!a || !b) continue;
        const span = Math.hypot(b.x - a.x, b.y - a.y);
        if (walk > span) {
          walk -= span;
          continue;
        }
        const t = span ? walk / span : 0;
        pushPoint(bins, "edge", a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, Math.random() * DEPTH, flow, swatches);
        break;
      }
    }
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of outline) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  let kept = 0;
  for (let guard = 0; kept < 1700 && guard < 9000; guard++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    if (!inside(outline, x, y)) continue;
    const dist = flow.at(x, y).dist;
    if (dist < 1.4) continue;
    if (dist / flow.maxDist < 0.42 && Math.random() < 0.62) continue;
    pushPoint(bins, "core", x, y, 2 + Math.random() * (DEPTH - 4), flow, swatches, dist / flow.maxDist > 0.58 ? 1.05 : 0.9);
    kept++;
  }
}

function scatterDust(bins: { small: Spray; mid: Spray; spark: Spray }, swatches: { red: Swatch; white: Swatch; ice: Swatch; amber: Swatch }) {
  for (let i = 0; i < 820; i++) {
    const x = 84 + (Math.random() - 0.5) * 230;
    const y = 50 + (Math.random() - 0.5) * 150;
    const z = (Math.random() - 0.5) * 90;
    pushPoint(bins, "dust", x, y, z + DEPTH / 2, null, swatches, 0.42);
  }
}

function softSprite(THREE: ThreeModule) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Texture();
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.28, "rgba(255,255,255,0.72)");
  glow.addColorStop(0.62, "rgba(255,255,255,0.18)");
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

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
      const group = new THREE.Group();
      group.rotation.y = orbit.current.yaw;
      group.rotation.x = orbit.current.pitch;
      scene.add(group);

      const swatches = {
        red: new THREE.Color("#F30100"),
        white: new THREE.Color("#ffffff"),
        ice: new THREE.Color("#c5dfff"),
        amber: new THREE.Color("#ffb35c"),
      };
      const bins = { small: EMPTY(), mid: EMPTY(), spark: EMPTY() };
      for (const path of markPaths) scatterRibbon(THREE, bins, swatches, path);
      scatterDust(bins, swatches);

      const sprite = softSprite(THREE);
      const sizes = { small: 0.034, mid: 0.058, spark: 0.098 };
      const clouds = (Object.keys(bins) as Array<keyof typeof bins>).map((key) => {
        const spray = bins[key];
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(spray.positions, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(spray.colors, 3));
        geometry.computeBoundingSphere();
        if (geometry.boundingSphere) geometry.boundingSphere.radius += 0.25;
        const material = new THREE.PointsMaterial({
          map: sprite,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          size: sizes[key],
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
        group.add(points);
        return {
          points,
          base: Float32Array.from(spray.positions),
          tangent: Float32Array.from(spray.tangents),
          amp: Float32Array.from(spray.amps),
          phase: Float32Array.from(spray.phases),
        };
      });

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const left = wrap.querySelector<HTMLElement>("[data-astra-left]");
      const right = wrap.querySelector<HTMLElement>("[data-astra-right]");

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
      const draw = (now: number) => {
        const elapsed = now * 0.001;
        const drift = reduced.matches ? 0 : 1;
        for (const cloud of clouds) {
          const position = cloud.points.geometry.getAttribute("position");
          const array = position.array as Float32Array;
          for (let i = 0; i < cloud.amp.length; i++) {
            const along = Math.sin(elapsed * 0.22 + (cloud.phase[i] ?? 0)) * (cloud.amp[i] ?? 0) * drift;
            array[i * 3] = (cloud.base[i * 3] ?? 0) + (cloud.tangent[i * 3] ?? 0) * along;
            array[i * 3 + 1] = (cloud.base[i * 3 + 1] ?? 0) + (cloud.tangent[i * 3 + 1] ?? 0) * along;
            array[i * 3 + 2] = (cloud.base[i * 3 + 2] ?? 0) + (cloud.tangent[i * 3 + 2] ?? 0) * along;
          }
          position.needsUpdate = true;
        }

        const width = Math.max(1, wrap.clientWidth);
        const height = Math.max(1, wrap.clientHeight);
        const px = pointer.current.inside ? pointer.current.x / width - 0.5 : 0;
        const py = pointer.current.inside ? pointer.current.y / height - 0.5 : 0;
        group.rotation.y = orbit.current.yaw + px * 0.36;
        group.rotation.x = orbit.current.pitch + py * 0.2;
        if (left) {
          left.style.transform = `translate(${px * -34}px, calc(-50% + ${py * -16}px))`;
        }
        if (right) {
          right.style.transform = `translate(${px * 34}px, calc(-50% + ${py * 16}px))`;
        }
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        for (const cloud of clouds) {
          cloud.points.geometry.dispose();
          const material = cloud.points.material;
          if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
          else material.dispose();
        }
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
      className="relative z-10 h-[100svh] min-h-[36rem] cursor-grab touch-none overflow-hidden bg-black text-white select-none active:cursor-grabbing"
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
        className="pointer-events-none absolute top-1/2 left-[7%] font-sans text-4xl font-medium tracking-[-0.04em] md:text-6xl"
        style={{ transform: "translateY(-50%)" }}
      >
        Bridge
      </p>
      <p
        data-astra-right
        className="pointer-events-none absolute top-1/2 right-[7%] font-sans text-4xl font-medium tracking-[-0.04em] md:text-6xl"
        style={{ transform: "translateY(-50%)" }}
      >
        Wide
      </p>
    </section>
  );
}
