"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { images, week } from "@/content/site";

const weekImages = [
  images.hero,
  images.employers,
  images.engineers,
  images.desk,
  images.close,
] as const;

const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

export default function WeekSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const stamp = week[week.length - 1]?.title ?? "";

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
      const pp = scrollable > 0 ? passed / scrollable : 0;
      const u = Math.min(1, Math.max(0, (pp - 0.04) / 0.92));

      stage.style.setProperty("--pp", pp.toFixed(4));
      stage.style.setProperty("--u", u.toFixed(4));

      const stamped = u >= 0.98 ? "true" : "false";
      if (stage.dataset.stamped !== stamped) stage.dataset.stamped = stamped;

      const next = Math.min(week.length - 1, Math.floor(u * week.length));
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
      className="seam-left relative z-10 bg-ink text-cloud"
      aria-labelledby="week-heading"
    >
      <div ref={trackRef} className="week-track">
        <div
          ref={stageRef}
          className="week-stage"
          data-stamped="false"
          style={{ "--pp": 0, "--u": 0 } as CSSProperties}
        >
          <div className="week-photos" aria-hidden>
            {weekImages.map((src, index) => (
              <div
                key={src}
                className="absolute inset-0"
                style={{
                  opacity: index === active ? 1 : 0,
                  zIndex: index === active ? 1 : 0,
                  transition: "opacity 1.1s ease",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={{
                    transform: index === active ? "scale(1.06)" : "scale(1)",
                    transition: "transform 1.1s ease",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="week-veil" aria-hidden />
          <div className={`week-body ${sectionContainer}`}>
            <SectionHeading
              id="week-heading"
              tone="dark"
              eyebrow="How a search runs"
              title="The week"
              lede="Monday we take the brief. Friday the offer is on its way, with the desk still on the thread."
            />
            <div className="week-rail">
              <div className="week-line">
                <div className="week-track-line" aria-hidden />
                <div className="week-progress" aria-hidden />
                <ol className="week-cards">
                  {week.map((step, index) => (
                    <li
                      key={step.id}
                      className="week-step"
                      style={{ "--i": index } as CSSProperties}
                    >
                      <span className="week-dot" aria-hidden />
                      <article className="week-card">
                        <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">
                          {step.day}
                        </p>
                        <h3 className="mt-2 font-display text-2xl leading-tight text-cloud">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-cloud/85">{step.copy}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="week-stamp font-display uppercase" aria-hidden="true">
              {stamp}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
