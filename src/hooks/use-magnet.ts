"use client";

import { useEffect, type RefObject } from "react";
import { finePointerQuery, reducedMotionQuery } from "@/hooks/use-media-query";

const MAGNET = 14;
const REACH = 64;

/**
 * Magnetic pull for buttons. One `pointermove` listener serves every button
 * on the page. Element rects are measured in one batch, and only after a
 * scroll or resize made the last batch stale, so a pointer move costs no
 * layout read of its own.
 */
const targets = new Map<HTMLElement, DOMRect>();
let stale = true;
let attached = false;

function markStale() {
  stale = true;
}

function measure() {
  targets.forEach((_, el) => targets.set(el, el.getBoundingClientRect()));
  stale = false;
}

function onMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  if (stale) measure();
  targets.forEach((rect, el) => {
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const near =
      Math.abs(dx) < rect.width / 2 + REACH && Math.abs(dy) < rect.height / 2 + REACH;
    const mx = near ? `${((dx / rect.width) * MAGNET).toFixed(2)}px` : "0px";
    const my = near ? `${((dy / rect.height) * MAGNET).toFixed(2)}px` : "0px";
    if (el.style.getPropertyValue("--mx") !== mx) el.style.setProperty("--mx", mx);
    if (el.style.getPropertyValue("--my") !== my) el.style.setProperty("--my", my);
  });
}

function attach() {
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", markStale, { passive: true });
  window.addEventListener("resize", markStale);
  attached = true;
}

function detach() {
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("scroll", markStale);
  window.removeEventListener("resize", markStale);
  attached = false;
}

function register(el: HTMLElement) {
  targets.set(el, el.getBoundingClientRect());
  stale = true;
  if (!attached) attach();
  return () => {
    targets.delete(el);
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
    if (targets.size === 0) detach();
  };
}

export function useMagnet(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(finePointerQuery).matches) return;
    if (window.matchMedia(reducedMotionQuery).matches) return;
    return register(el);
  }, [ref]);
}
