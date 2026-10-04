"use client";

import { useEffect, useRef } from "react";
import { BridgeMark } from "@/components/brand/Logo";

type Star = {
  angle: number;
  radius: number;
  size: number;
  twinkle: number;
  arm: number;
};

export function AstraField() {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const drag = useRef({
    x: 0,
    y: 0,
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const stars: Star[] = Array.from({ length: 1100 }, (_, index) => {
      const t = index / 1100;
      const arm = index % 2;
      return {
        angle: t * Math.PI * 7.4 + arm * Math.PI,
        radius: 14 + t ** 0.82 * 360 + (Math.random() - 0.5) * 16,
        size: Math.random() < 0.07 ? 2.3 : 0.55 + Math.random() * 1.35,
        twinkle: Math.random() * Math.PI * 2,
        arm,
      };
    });

    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width) * dpr;
      canvas.height = Math.max(1, rect.height) * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const place = (node: HTMLElement | null, x: number, y: number) => {
      if (!node) return;
      node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };

    const draw = (now: number) => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      context.clearRect(0, 0, width, height);

      const still = reduced.matches;
      const mx = pointer.current.inside ? pointer.current.x / width - 0.5 : 0;
      const my = pointer.current.inside ? pointer.current.y / height - 0.5 : 0;
      const shiftX = still ? 0 : mx;
      const shiftY = still ? 0 : my;
      const cx = width / 2 + drag.current.x + shiftX * 26;
      const cy = height / 2 + drag.current.y + shiftY * 16;
      const spin = still ? 0.35 : now * 0.00012;

      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, 110);
      glow.addColorStop(0, "rgba(255,255,255,0.95)");
      glow.addColorStop(0.22, "rgba(255,214,170,0.45)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(cx, cy, 110, 0, Math.PI * 2);
      context.fill();

      for (const star of stars) {
        const depth = 0.3 + star.radius / 420;
        const angle = star.angle + spin * (0.55 + star.arm * 0.3);
        const px = cx + Math.cos(angle) * star.radius + shiftX * 46 * depth;
        const py = cy + Math.sin(angle) * star.radius * 0.7 + shiftY * 28 * depth;
        const flicker = still ? 0.9 : 0.55 + Math.sin(now * 0.003 + star.twinkle) * 0.45;
        context.globalAlpha = flicker;
        context.fillStyle = star.size > 1.8 ? "#fff4e4" : "#d5e2ff";
        context.beginPath();
        context.arc(px, py, star.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;

      place(
        wrap.querySelector<HTMLElement>("[data-astra-logo]"),
        drag.current.x + shiftX * 16,
        drag.current.y + shiftY * 10,
      );
      const left = wrap.querySelector<HTMLElement>("[data-astra-left]");
      const right = wrap.querySelector<HTMLElement>("[data-astra-right]");
      if (left) {
        left.style.transform = `translate(${shiftX * -26}px, calc(-50% + ${shiftY * -12}px))`;
      }
      if (right) {
        right.style.transform = `translate(${shiftX * 26}px, calc(-50% + ${shiftY * 12}px))`;
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative z-10 h-[100svh] min-h-[36rem] cursor-grab touch-none overflow-hidden bg-black text-white active:cursor-grabbing"
      aria-label="BridgeWide mark between the words Bridge and Wide. Drag to move the field."
      onPointerDown={(event) => {
        const node = event.currentTarget;
        drag.current.active = true;
        drag.current.startX = event.clientX;
        drag.current.startY = event.clientY;
        drag.current.originX = drag.current.x;
        drag.current.originY = drag.current.y;
        node.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = event.clientX - rect.left;
        pointer.current.y = event.clientY - rect.top;
        pointer.current.inside = true;
        if (!drag.current.active) return;
        const nextX = drag.current.originX + (event.clientX - drag.current.startX);
        const nextY = drag.current.originY + (event.clientY - drag.current.startY);
        drag.current.x = Math.max(-220, Math.min(220, nextX));
        drag.current.y = Math.max(-140, Math.min(140, nextY));
      }}
      onPointerUp={() => {
        drag.current.active = false;
      }}
      onPointerCancel={() => {
        drag.current.active = false;
      }}
      onPointerLeave={() => {
        pointer.current.inside = false;
        drag.current.active = false;
      }}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
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
      <div
        data-astra-logo
        className="pointer-events-none absolute top-1/2 left-1/2 text-brand"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <BridgeMark className="h-14 w-auto drop-shadow-[0_0_18px_rgba(0,0,0,0.45)] md:h-20" />
      </div>
    </section>
  );
}
