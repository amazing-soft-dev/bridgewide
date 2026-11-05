"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { pageWrap } from "@/components/pages/format";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { portraits } from "@/content/ai-training";

const columns = 16;
const rows = 8;
const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

const tiles = Array.from({ length: columns * rows }, (_, index) => {
  const column = index % columns;
  const row = Math.floor(index / columns);
  return {
    index,
    progress: (column + row) / (columns + rows - 2),
    accent: (column + row * 3) % 17 === 0,
  };
});

export function PortraitWall() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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
      const reveal = Math.min(1, Math.max(0, (progress - 0.04) / 0.9));
      stage.style.setProperty("--u", reveal.toFixed(4));
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const syncListener = () => {
      if (gate.matches) {
        window.removeEventListener("scroll", request);
        stage.style.setProperty("--u", "1");
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
    <section id="talent" aria-labelledby="talent-heading" className="scroll-mt-24 bg-ink text-cloud">
      <div ref={trackRef} className="h-[280vh] gate:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden gate:relative gate:h-auto"
          style={{ "--u": 0 } as CSSProperties}
        >
          <div
            className="pointer-events-none absolute inset-0 z-20 grid gap-[3px] p-[3px] [perspective:1400px] gate:hidden"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
            aria-hidden
          >
            {tiles.map((tile) => (
              <span
                key={tile.index}
                className="block rounded-[3px] [transform:rotateX(calc(var(--f)*-92deg))] [opacity:clamp(0,calc((1-var(--f))*8),1)]"
                style={
                  {
                    background: tile.accent ? "#f30100" : "#171717",
                    transformOrigin: "50% 0",
                    backfaceVisibility: "hidden",
                    "--t": tile.progress.toFixed(3),
                    "--f": "clamp(0, calc((var(--u) - var(--t) * 0.78) / 0.16), 1)",
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className={`relative z-10 flex h-full flex-col py-16 md:py-20 gate:block gate:h-auto ${pageWrap}`}>
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
              <SplitWords text="Sample profiles" />
            </p>
            <h2 id="talent-heading" className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">
              <SplitWords text="Four fictional portraits." delay={0.06} />
            </h2>
            <Reveal delay={0.12}>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-cloud-soft">
                These people are samples. They are not candidates BridgeWide has placed.
              </p>
            </Reveal>
            <ul className="portrait-row mt-auto list-none p-0 gate:mt-10">
              {portraits.map((person) => (
                <li key={person.id}>
                  <article className="group relative overflow-hidden rounded-lg bg-cloud text-ink [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)] transition duration-300 hover:shadow-[0_30px_60px_rgb(0_0_0/0.4)]">
                    <span className="relative block aspect-[4/4.4] overflow-hidden bg-cloud-soft">
                      <Image
                        src={person.image}
                        alt=""
                        fill
                        sizes="(max-width: 699px) 50vw, 25vw"
                        className="object-cover saturate-[.6] transition duration-700 group-hover:scale-105 group-hover:saturate-100"
                      />
                    </span>
                    <span className="absolute top-2.5 right-2.5 rotate-6 rounded-[3px] bg-brand px-2 py-1 font-mono text-[11px] tracking-[0.14em] text-cloud uppercase opacity-100 transition duration-300 [@media(hover:hover)]:scale-110 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100">
                      {person.place}
                    </span>
                    <div className="grid gap-0.5 border-t-[1.5px] border-dashed border-cloud-soft px-3 py-3">
                      <h3 className="font-display text-[15px] tracking-tight">{person.name}</h3>
                      <p className="text-xs text-stone">{person.place}</p>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-brand uppercase">
                        {person.focus}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
