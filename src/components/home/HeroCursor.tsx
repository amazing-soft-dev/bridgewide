"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

function useFinePointer() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(hover: hover) and (pointer: fine)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false,
  );
}

export function HeroCursor({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const node = nodeRef.current;
    const section = sectionRef.current;
    if (!node || !section || reduced || !fine) return;

    let x = -120;
    let y = -120;
    let targetX = -120;
    let targetY = -120;
    let frame = 0;

    const tick = () => {
      x += (targetX - x) * 0.35;
      y += (targetY - y) * 0.35;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const place = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = section.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      targetX = event.clientX;
      targetY = event.clientY;
      node.style.opacity = inside ? "1" : "0";
      const label = event.clientX < window.innerWidth / 2 ? "Hire" : "Apply";
      if (labelRef.current && labelRef.current.textContent !== label) {
        labelRef.current.textContent = label;
      }
    };

    const hide = () => {
      node.style.opacity = "0";
    };

    const onLeaveWindow = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    window.addEventListener("pointermove", place);
    section.addEventListener("pointerleave", hide);
    document.addEventListener("pointerout", onLeaveWindow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", place);
      section.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerout", onLeaveWindow);
    };
  }, [fine, reduced, sectionRef]);

  return (
    <div
      ref={nodeRef}
      className="pointer-events-none fixed top-0 left-0 z-[60] opacity-0 transition-opacity duration-300 [@media(hover:none),(pointer:coarse),(prefers-reduced-motion:reduce)]:hidden"
      aria-hidden
    >
      <span className="absolute top-0 left-0 size-2 -translate-1/2 rounded-full bg-brand shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-cloud)_70%,transparent)]" />
      <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-[7px] rounded-[5px] bg-cloud py-1.5 pr-2.5 pl-2 font-mono text-xs leading-none font-semibold tracking-[0.18em] whitespace-nowrap text-ink uppercase shadow-[0_10px_30px_rgb(0_0_0/0.18)]">
        <i className="size-2 rounded-[2px] bg-brand" />
        <b ref={labelRef} className="font-semibold">Hire</b>
      </span>
    </div>
  );
}
