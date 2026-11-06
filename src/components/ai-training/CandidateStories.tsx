"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { pageWrap } from "@/components/pages/format";
import { Button } from "@/components/ui/Button";
import { trainingBenefits } from "@/content/ai-training";

const count = trainingBenefits.length;
const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

function subscribeGate(onChange: () => void) {
  const gate = window.matchMedia(motionGate);
  gate.addEventListener("change", onChange);
  return () => gate.removeEventListener("change", onChange);
}

const pad = (value: number) => String(value).padStart(2, "0");

/** One full-screen slide per promise, wiped in on scroll. Same stage as the home employer stories. */
export function CandidateStories() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const pinned = useSyncExternalStore(
    subscribeGate,
    () => !window.matchMedia(motionGate).matches,
    () => false,
  );

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const gate = window.matchMedia(motionGate);
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (gate.matches) return;

      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 0));
      const progress = scrollable > 0 ? passed / scrollable : 0;
      const u = Math.min(1, Math.max(0, (progress - 0.06) / 0.88));
      const s = u * (count - 1);

      stage.style.setProperty("--s", s.toFixed(4));

      const next = Math.min(count - 1, Math.round(s));
      if (activeRef.current !== next) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const syncListener = () => {
      if (gate.matches) {
        window.removeEventListener("scroll", request);
        return;
      }
      window.addEventListener("scroll", request, { passive: true });
      request();
    };

    syncListener();
    window.addEventListener("resize", request);
    gate.addEventListener("change", syncListener);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      gate.removeEventListener("change", syncListener);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="relative z-10 mt-[calc(var(--seam)*-1)] scroll-mt-24 bg-ink text-cloud [clip-path:polygon(0_0,100%_var(--seam),100%_100%,0_100%)]"
    >
      <h2 id="benefits-heading" className="sr-only">
        What you can count on
      </h2>
      <div
        ref={trackRef}
        className="h-[calc((1+(var(--n)-1)*1.4)*100vh)] gate:h-auto"
        style={{ "--n": count } as CSSProperties}
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-[100vh] overflow-hidden bg-[#111] gate:relative gate:h-auto gate:overflow-visible"
          style={{ "--s": 0 } as CSSProperties}
        >
          {trainingBenefits.map((benefit, index) => {
            const hidden = pinned && index !== active;
            return (
              <article
                key={benefit.title}
                className="group/slide absolute inset-0 overflow-hidden [--w:clamp(0,((var(--s)_-_var(--i)_+_0.75)/0.5),1)] [--o:clamp(0,((var(--s)_-_var(--i)_-_0.25)/0.5),1)] [--e:calc(var(--w)*var(--w)*(3_-_2*var(--w)))] [--cut:calc(var(--e)*150%)] [clip-path:polygon(calc(150%_-_var(--cut))_0,200%_0,200%_100%,calc(100%_-_var(--cut))_100%)] gate:relative gate:inset-auto gate:[clip-path:none]"
                aria-hidden={hidden || undefined}
                style={{ "--i": index, zIndex: index } as CSSProperties}
              >
                <div className="absolute inset-0 [&_img]:scale-[calc(1.12_-_var(--e)*0.12)] gate:[&_img]:scale-none">
                  <Image
                    src={benefit.image}
                    alt={benefit.alt}
                    fill
                    loading="lazy"
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div
                  className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgb(17_17_17/0.9)_0%,rgb(17_17_17/0.68)_42%,rgb(17_17_17/0.4)_100%),linear-gradient(180deg,rgb(17_17_17/0.45),transparent_32%,transparent_68%,rgb(17_17_17/0.6))]"
                  aria-hidden
                />
                <div
                  className={`relative z-[2] grid h-full grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] items-center gap-[clamp(2rem,6vw,5rem)] pt-[calc(var(--seam)_+_clamp(3rem,8vh,5rem))] pb-[clamp(1.5rem,4vh,2.75rem)] max-[899px]:grid-cols-[minmax(0,1fr)] max-[899px]:items-start max-[899px]:gap-10 gate:h-auto gate:pt-14 gate:pb-14 gate:group-first/slide:pt-[calc(var(--seam)_+_3.5rem)] ${pageWrap}`}
                >
                  <div className="[opacity:calc(var(--w)*var(--w)_-_var(--o)*1.6)] [translate:0_calc((1_-_var(--w)_-_var(--o))*28px)] gate:opacity-100 gate:[translate:none]">
                    <p className="inline-flex items-center gap-2.5 border border-brand/70 bg-ink/40 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-cloud uppercase">
                      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                      For candidates
                      <span className="text-cloud/60">
                        {pad(index + 1)} / {pad(count)}
                      </span>
                    </p>
                    <p className="mt-5 font-mono text-[11px] tracking-[0.16em] text-cloud/70 uppercase">
                      What you can count on
                    </p>
                    <h3 className="mt-4 max-w-[36rem] font-display text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.02] tracking-tight text-cloud">
                      {benefit.title}
                      <span className="text-brand">.</span>
                    </h3>
                    <p className="mt-5 max-w-[32rem] text-lg leading-8 text-cloud/85">{benefit.copy}</p>
                    <Button
                      href="/ai-training/for-candidates"
                      variant="onDark"
                      className="mt-8"
                      tabIndex={hidden ? -1 : undefined}
                    >
                      Apply once
                    </Button>
                  </div>
                  <div className="[opacity:calc(var(--w)*var(--w)_-_var(--o)*1.6)] [translate:0_calc((1_-_var(--w)_-_var(--o))*48px)] gate:opacity-100 gate:[translate:none]">
                    <div className="w-[min(100%,15rem)] rounded-lg bg-cloud px-[1.15rem] pt-[1.15rem] pb-4 text-ink [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,0_100%)]">
                      <p className="font-display text-6xl leading-none tracking-tight text-brand">{benefit.figure}</p>
                      <p className="mt-3 text-sm font-semibold">{benefit.unit}</p>
                      <p className="mt-3 border-t border-dashed border-stone/50 pt-2 font-mono text-[10px] tracking-[0.16em] text-stone uppercase">
                        Promise {pad(index + 1)}
                      </p>
                    </div>
                    <p className="mt-4 max-w-[16rem] text-sm leading-6 text-cloud/85">{benefit.note}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
