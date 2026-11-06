"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { useTrackProgress } from "@/hooks/use-track-progress";
import { ramp } from "@/hooks/scroll-frame";

import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { portraits } from "@/content/ai-training";
import "./portrait-wall.css";

const columns = 16;
const rows = 9;
const phrase = "THE TEAM";
const phraseRow = 4;
const phraseColumn = 4;

const tiles = Array.from({ length: columns * rows }, (_, index) => {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const offset = column - phraseColumn;
  const letter = row === phraseRow && offset >= 0 && offset < phrase.length ? phrase[offset] : "";
  return {
    index,
    progress: (column + row) / (columns + rows - 2),
    letter,
    space: letter === " ",
  };
});

export function PortraitWall() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useTrackProgress(
    trackRef,
    (progress) => {
      const reveal = ramp(progress, 0.04, 0.9);
      return () => stageRef.current?.style.setProperty("--u", reveal.toFixed(4));
    },
    () => stageRef.current?.style.setProperty("--u", "1"),
  );

  return (
    <section id="talent" aria-labelledby="talent-heading" className="scroll-mt-24 bg-[#0b0d12] text-cloud">
      <div ref={trackRef} className="h-[280vh] gate:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden gate:relative gate:h-auto"
          style={{ "--u": 0 } as CSSProperties}
        >
          <div className="absolute inset-0 [&_img]:scale-[calc(1.08_-_var(--u)*0.08)] gate:[&_img]:scale-none" aria-hidden>
            <Image
              src="/images/training-team.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
          </div>
          <div className="absolute inset-0 bg-[#0b0d12] [opacity:calc(1-var(--u))] gate:[opacity:0]" aria-hidden />
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_10_10/0.78)_0%,rgb(10_10_10/0.35)_55%,rgb(10_10_10/0.62)_100%)] [opacity:var(--u)] gate:opacity-100"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-20 grid gap-[3px] p-[3px] [perspective:1400px] gate:hidden"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
            aria-hidden
          >
            {tiles.map((tile) => {
              const marked = Boolean(tile.letter) && !tile.space;
              return (
                <span
                  key={tile.index}
                  className={`relative grid place-items-center rounded-[3px] font-mono text-[clamp(1.1rem,2.4vw,2.4rem)] font-semibold text-cloud [transform:rotateX(calc(var(--f)*-92deg))] [opacity:clamp(0,calc((1-var(--f))*8),1)] ${
                    marked
                      ? "bg-brand after:absolute after:top-1/2 after:right-0 after:left-0 after:h-px after:bg-black/45 after:content-['']"
                      : "bg-[#14181f]"
                  }`}
                  style={
                    {
                      transformOrigin: "50% 0",
                      backfaceVisibility: "hidden",
                      "--t": tile.progress.toFixed(3),
                      "--f": "clamp(0, calc((var(--u) - var(--t) * 0.78) / 0.16), 1)",
                    } as CSSProperties
                  }
                >
                  {tile.space ? "" : tile.letter}
                </span>
              );
            })}
          </div>
          <div className={`relative z-10 flex h-full flex-col py-16 md:py-20 gate:block gate:h-auto wrap`}>
            <p className="eyebrow">
              <SplitWords text="Sample profiles" />
            </p>
            <h2 id="talent-heading" className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">
              The <span className="bg-brand px-2 text-cloud">team.</span>
            </h2>
            <Reveal delay={0.12}>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-cloud-soft">
                These people are samples. They are not candidates BridgeWide has placed.
              </p>
            </Reveal>
            <ul className="portrait-row mt-auto list-none p-0 gate:mt-10">
              {portraits.map((person) => (
                <li key={person.id}>
                  <article className="group relative overflow-hidden rounded-lg bg-cloud text-ink corner-cut transition duration-300 hover:shadow-[0_30px_60px_rgb(0_0_0/0.4)]">
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
