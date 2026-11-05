"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { pageWrap } from "@/components/pages/format";
import { trainingBenefits } from "@/content/ai-training";

const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

export function BenefitsTimeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

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
      const reveal = Math.min(1, Math.max(0, (progress - 0.04) / 0.92));
      stage.style.setProperty("--u", reveal.toFixed(4));

      const next = Math.min(trainingBenefits.length - 1, Math.floor(reveal * trainingBenefits.length));
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
    <section id="benefits" aria-labelledby="benefits-heading" className="scroll-mt-24 bg-ink text-cloud">
      <div ref={trackRef} className="h-[360vh] gate:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden gate:relative gate:h-auto gate:overflow-visible"
          style={{ "--u": 0 } as CSSProperties}
        >
          <div className="absolute inset-0" aria-hidden>
            <Image
              src="/images/training-benefits.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_40%]"
            />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_10/0.78)_0%,rgb(10_10_10/0.55)_42%,rgb(10_10_10/0.88)_100%)]"
            aria-hidden
          />
          <div className={`relative z-[1] flex h-full flex-col pt-24 pb-10 gate:block gate:h-auto gate:py-16 ${pageWrap}`}>
            <p className="inline-flex w-fit items-center rounded-full border border-cloud/30 px-3 py-1 font-mono text-xs tracking-[0.16em] text-cloud uppercase">
              For candidates
            </p>
            <h2 id="benefits-heading" className="font-display mt-4 max-w-3xl text-4xl leading-[1.02] md:text-6xl">
              What you can count <span className="bg-brand px-2 text-cloud">on.</span>
            </h2>
            <div className="relative mt-auto pt-8 gate:mt-10">
              <div className="pointer-events-none absolute top-8 right-0 left-0 h-px bg-cloud/30 gate:hidden" aria-hidden />
              <div
                className="absolute top-8 right-0 left-0 z-[1] h-px origin-left bg-brand [transform:scaleX(var(--u))] gate:hidden"
                aria-hidden
              />
              <ol className="m-0 grid list-none grid-cols-4 gap-4 p-0 gate:flex gate:flex-col gate:gap-6">
                {trainingBenefits.map((benefit, index) => {
                  const shown = index === active;
                  return (
                    <li key={benefit.title} className="min-w-0">
                      <span
                        className={`relative z-[2] mb-6 grid size-[18px] place-items-center rounded-full border-2 bg-[#0a0a0a] gate:hidden ${
                          index <= active ? "border-brand" : "border-cloud/40"
                        }`}
                        aria-hidden
                      >
                        <span className={`size-2 rounded-full bg-brand ${index <= active ? "opacity-100" : "opacity-0"}`} />
                      </span>
                      <article
                        className={`max-w-xs rounded-lg border border-cloud/15 border-t-[3px] border-t-brand bg-ink/75 px-4 py-4 backdrop-blur-md gate:max-w-none ${
                          shown ? "opacity-100" : "opacity-0 gate:opacity-100"
                        }`}
                      >
                        <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">0{index + 1}</p>
                        <h3 className="mt-2 font-display text-2xl">{benefit.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-cloud/85">{benefit.copy}</p>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
