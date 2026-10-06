"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { sectionContainer } from "@/components/ui/SectionHeading";
import { getRegion, stories } from "@/content/site";

const storyAlt: Record<string, string> = {
  "northline-ledger-owner": "People in a meeting around a table",
  "harbor-metrics-warehouse": "A quiet modern office interior",
  "campo-health-release": "A laptop open on a desk",
  "keel-systems-paved-path": "A team working side by side",
};

const count = stories.length;
const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

function subscribeGate(onChange: () => void) {
  const gate = window.matchMedia(motionGate);
  gate.addEventListener("change", onChange);
  return () => gate.removeEventListener("change", onChange);
}

const pad = (value: number) => String(value).padStart(2, "0");

export default function StoriesSection() {
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
      const pp = scrollable > 0 ? passed / scrollable : 0;
      const u = Math.min(1, Math.max(0, (pp - 0.06) / 0.88));
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
      className="seam-right relative z-10 bg-ink text-cloud"
      aria-labelledby="stories-heading"
    >
      <h2 id="stories-heading" className="sr-only">
        Employer stories
      </h2>
      <div ref={trackRef} className="stories-track" style={{ "--n": count } as CSSProperties}>
        <div ref={stageRef} className="stories-stage" style={{ "--s": 0 } as CSSProperties}>
          {stories.map((story, index) => {
            const hidden = pinned && index !== active;
            const [figure, ...unit] = story.metric.split(" ");
            const region = getRegion(story.region);
            return (
              <article
                key={story.slug}
                className="story-slide"
                aria-hidden={hidden || undefined}
                style={{ "--i": index, zIndex: index } as CSSProperties}
              >
                <div className="story-bg">
                  <Image
                    src={story.image}
                    alt={storyAlt[story.slug] ?? story.company}
                    fill
                    loading="lazy"
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div className="story-veil" aria-hidden />
                <div className={`story-body ${sectionContainer}`}>
                  <div className="story-copy">
                    <p className="inline-flex items-center gap-2.5 border border-brand/70 bg-ink/40 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-cloud uppercase">
                      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                      Employer stories
                      <span className="text-cloud/60">
                        {pad(index + 1)} / {pad(count)}
                      </span>
                    </p>
                    <h3 className="mt-5 font-mono text-[11px] tracking-[0.16em] text-cloud/70 uppercase">
                      {story.company} · {region?.name}
                    </h3>
                    <figure className="mt-4">
                      <blockquote className="max-w-[36rem] font-display text-[clamp(1.85rem,3.3vw,3rem)] leading-[1.06] tracking-tight text-cloud">
                        “{story.quote}”
                      </blockquote>
                      <figcaption className="mt-5 text-sm text-cloud/80">
                        {story.attribution}
                      </figcaption>
                    </figure>
                    <Link
                      href={`/stories/${story.slug}`}
                      tabIndex={hidden ? -1 : undefined}
                      className="group mt-8 mr-4 inline-flex items-center gap-5 border border-cloud/35 bg-cloud/5 py-2.5 pl-4 text-sm font-semibold text-cloud no-underline backdrop-blur-md transition-colors hover:border-cloud/70"
                    >
                      Read the story
                      <span
                        aria-hidden
                        className="-mr-4 grid size-8 rotate-45 place-items-center bg-cloud text-ink transition-colors group-hover:bg-brand group-hover:text-cloud"
                      >
                        <span className="-rotate-45 text-sm leading-none">↗</span>
                      </span>
                    </Link>
                  </div>
                  <div className="story-side">
                    <div className="story-stat">
                      <p className="font-display text-6xl leading-none tracking-tight text-brand">
                        {figure}
                      </p>
                      <p className="mt-3 text-sm font-semibold">
                        {unit.join(" ")} from brief to start
                      </p>
                      <p className="mt-3 border-t border-dashed border-stone/50 pt-2 font-mono text-[10px] tracking-[0.16em] text-stone uppercase">
                        {region?.code} placement
                      </p>
                    </div>
                    <p className="mt-4 max-w-[16rem] text-sm leading-6 text-cloud/85">
                      {story.result}
                    </p>
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
