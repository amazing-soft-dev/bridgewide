"use client";

import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { FlapValue } from "@/components/ui/FlapValue";
import { stats } from "@/content/site";

export default function RecordSection() {
  return (
    <section data-header-tone="dark"
      className="relative z-10 mt-[calc(var(--seam)*-1)] flex min-h-[calc(100vh+var(--seam))] flex-col justify-center overflow-hidden bg-ink pt-24 pb-24 text-cloud [clip-path:polygon(0_0,100%_var(--seam),100%_100%,0_100%)] md:pt-28 md:pb-28"
      aria-labelledby="record-heading"
    >
      <p
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-display text-[clamp(5rem,18vw,16rem)] leading-none font-extrabold tracking-[-0.04em] text-transparent pointer-events-none [-webkit-text-stroke:1.5px_rgb(244_240_232/0.16)] max-[899px]:hidden motion-reduce:hidden"
        aria-hidden
      >
        PLACED · PLACED · PLACED
      </p>
      <div
        className={`relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] ${sectionContainer}`}
      >
        <SectionHeading
          id="record-heading"
          tone="dark"
          eyebrow="The record"
          title="Numbers we would put on a departures board."
        />
        <ul className="grid grid-cols-2 gap-x-8 gap-y-8">
          {stats.map((stat, index) => (
            <li key={stat.label} className="grid gap-2.5">
              <FlapValue value={stat.value} index={index} />
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-cloud/80 uppercase">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
