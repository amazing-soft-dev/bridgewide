"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AccentLine } from "@/components/roles/AccentLine";
import { deskWrap } from "@/components/roles/desk";
import { useEntered } from "@/components/roles/use-entered";
import { Button } from "@/components/ui/Button";
import { hero, images, roles } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion";

function chamfer(progress: number) {
  const easedIn = Math.min(1, Math.max(0, (progress - 0.08) / 0.3));
  const smooth = easedIn * easedIn * (3 - 2 * easedIn);
  const inset = (1 - smooth) * 100;
  return {
    clip: `polygon(${inset}% 0, 100% 0, 100% ${100 - inset}%, ${100 - inset}% 100%, 0 100%, 0 ${inset}%)`,
    scale: 1.1 - smooth * 0.1,
  };
}

export function RolesClose() {
  const ref = useRef<HTMLElement>(null);
  const on = useEntered();
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const view = window.innerHeight;
      const seen = view - rect.top;
      const total = rect.height + view;
      setProgress(Math.min(1, Math.max(0, seen / total)));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const shape = chamfer(reduced ? 1 : progress);
  const open = reduced || progress > 0.22;

  return (
    <section ref={ref} data-header-tone="dark" className="bg-cloud text-white" aria-labelledby="roles-close-heading">
      <div
        className="relative min-h-[max(88vh,640px)] overflow-hidden bg-brand"
        style={{ clipPath: shape.clip }}
      >
        <div className="absolute inset-0" aria-hidden style={{ scale: String(shape.scale) }}>
          <Image
            src={images.close}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_40%] opacity-55 mix-blend-multiply saturate-50 brightness-75"
          />
          <span className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_srgb,var(--color-ink)_82%,transparent),color-mix(in_srgb,var(--color-ink)_45%,transparent))]" />
        </div>
        <div
          className={`${deskWrap} relative z-[2] grid min-h-[max(88vh,640px)] items-center gap-8 py-16 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] min-[900px]:gap-[clamp(24px,4vw,72px)]`}
        >
          <div className="grid gap-5 max-[899px]:order-2">
            <h2
              id="roles-close-heading"
              className="font-display max-w-[14ch] text-[clamp(40px,5.4vw,84px)] leading-[1.02] tracking-[-0.04em]"
            >
              <AccentLine text="Tell us the seat." on={on} tone="dark" />
            </h2>
            <p
              data-motion="reveal"
              className={`m-0 max-w-[480px] text-[17px] leading-[1.6] text-white/90 transition duration-700 delay-300 ${
                on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              A brief or a CV. Either way a consultant, not a form, gets back to you.
            </p>
            <div
              data-motion="reveal"
              className={`flex flex-wrap gap-2.5 transition duration-700 delay-500 ${
                on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <Button href="/engineers" variant="onDark">
                Send a CV
              </Button>
            </div>
          </div>
          <div className="grid justify-items-end gap-6 max-[899px]:order-1 max-[899px]:justify-items-start">
            <p
              data-motion="reveal"
              className={`border-[4px] border-white px-6 py-3 font-display text-[clamp(40px,12vw,72px)] leading-[0.95] tracking-[-0.04em] text-white -rotate-8 transition duration-500 min-[900px]:border-[5px] min-[900px]:text-[clamp(48px,7vw,112px)] ${
                open ? "scale-100 opacity-100" : "scale-150 opacity-0"
              }`}
            >
              Open
            </p>
            <p className="inline-flex items-center gap-3 rounded-md bg-ink/60 px-2.5 py-2.5 font-mono text-xs tracking-[0.14em] text-white/85 uppercase backdrop-blur-md">
              <b className="rounded bg-ink px-2 py-0.5 font-display text-[28px] tracking-[-0.03em] text-white">
                {roles.length}
              </b>
              roles open right now
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
