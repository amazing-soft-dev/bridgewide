"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import "./footer.css";

const FooterRevealContext = createContext(true);

export function useFooterShown() {
  return useContext(FooterRevealContext);
}

const ease = 0.18;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function FooterCurtain({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);
  const [height, setHeight] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [canCurtain, setCanCurtain] = useState(false);
  const active = !reduced && height > 0 && canCurtain;
  const shown = reduced || !active || revealed;

  useEffect(() => {
    if (reduced) return;
    const inner = innerRef.current;
    if (!inner) return;
    const measure = () => setHeight(inner.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || height <= 0) return;
    const check = () => {
      const above = document.documentElement.scrollHeight - height;
      setCanCurtain(above > window.innerHeight + 24);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(document.body);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [reduced, height]);

  useEffect(() => {
    if (!active || !rootRef.current) return;
    const root = rootRef.current;
    let intersecting = true;
    let smoothed = -1;
    let last = -1;
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "30% 0px 30% 0px" },
    );
    observer.observe(root);

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!intersecting) return;
      const spacer = spacerRef.current?.offsetHeight ?? 0;
      if (!spacer) return;
      const viewport = window.innerHeight || 1;
      const top = root.getBoundingClientRect().top;
      const target = clamp01((viewport - spacer - top) / spacer);
      if (smoothed < 0) smoothed = target;
      else {
        smoothed += (target - smoothed) * ease;
        if (Math.abs(target - smoothed) < 0.0005) smoothed = target;
      }
      if (Math.abs(smoothed - last) >= 0.0004) {
        last = smoothed;
        root.style.setProperty("--rv", smoothed.toFixed(4));
      }
      if (!revealedRef.current && smoothed > 0.24) {
        revealedRef.current = true;
        setRevealed(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active]);

  function onFocusCapture() {
    const root = rootRef.current;
    if (!active || !root) return;
    const progress = Number.parseFloat(getComputedStyle(root).getPropertyValue("--rv"));
    if (progress > 0.85) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const destination = top + root.offsetHeight - window.innerHeight;
    if (Math.abs(window.scrollY - destination) < 4) return;
    window.scrollTo(0, Math.max(0, destination));
  }

  return (
    <FooterRevealContext.Provider value={shown}>
      <div
        ref={rootRef}
        className={active ? "footer-curtain is-active" : "footer-curtain"}
        style={{ ["--h" as string]: `${height}px`, ["--layer" as string]: "9" }}
        onFocusCapture={onFocusCapture}
      >
        <div ref={innerRef} className="footer-curtain-in">
          {children}
        </div>
        <div ref={spacerRef} className="footer-curtain-sp" aria-hidden="true" />
      </div>
    </FooterRevealContext.Provider>
  );
}
