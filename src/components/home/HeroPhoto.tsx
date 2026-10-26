"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

export function HeroPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scrollShift = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const lagX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.4 });
  const lagY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.4 });
  const y = useTransform([scrollShift, lagY], ([scroll, pointer]) => {
    const down = typeof scroll === "number" ? scroll : 0;
    const nudge = typeof pointer === "number" ? pointer : 0;
    return `calc(${down}% + ${nudge}px)`;
  });

  useEffect(() => {
    const frame = ref.current;
    const section = frame?.parentElement;
    if (!frame || !section || reduced) return;

    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = section.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(nx * -0.04 * rect.width);
      pointerY.set(ny * -0.04 * rect.height);
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", reset);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", reset);
    };
  }, [pointerX, pointerY, reduced]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-x-[-8%] -top-[12%] -bottom-[12%]"
        data-motion="parallax"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={reduced ? undefined : { x: lagX, y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="hero-photo object-cover"
        />
      </motion.div>
    </div>
  );
}
