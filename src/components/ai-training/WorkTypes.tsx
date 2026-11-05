"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { pageWrap } from "@/components/pages/format";
import {
  formatHourly,
  trainingRegion,
  trainingRoles,
  workTypes,
  type WorkTypeSlug,
} from "@/content/ai-training";

const tabLabel: Record<WorkTypeSlug, string> = {
  code: "Code",
  rlhf: "RLHF",
  specialist: "Specialist",
};

function factsFor(slug: WorkTypeSlug) {
  const matched = trainingRoles.filter((role) => role.workType === slug);
  const payMin = Math.min(...matched.map((role) => role.payMin));
  const payMax = Math.max(...matched.map((role) => role.payMax));
  const places = [
    ...new Set(matched.map((role) => trainingRegion(role.region)?.name).filter((name): name is string => Boolean(name))),
  ];
  return [
    { label: "Pay", value: formatHourly(payMin, payMax) },
    { label: "Roles", value: String(matched.length) },
    { label: "Regions", value: places.join(", ") },
    { label: "Where", value: "Remote" },
  ];
}

export function WorkTypes() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const type = workTypes[selected];
  if (!type) return null;
  const facts = factsFor(type.slug);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) return;
    event.preventDefault();
    const next = (index + (forward ? 1 : -1) + workTypes.length) % workTypes.length;
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 border-t border-cloud-soft bg-cloud text-ink">
      <div className={`${pageWrap} py-16 md:py-24`}>
        <div className="grid items-end gap-6 min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">The work</p>
            <h2 id="work-heading" className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">
              Three kinds of tasks, and the tracks around{" "}
              <span className="bg-brand px-2 text-cloud">them.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-8 text-ink-soft min-[900px]:justify-self-end">
            You apply once. The platform pays you.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Kinds of work"
          className="mt-10 grid gap-2 min-[900px]:grid-cols-3"
        >
          {workTypes.map((item, index) => {
            const active = index === selected;
            return (
              <button
                key={item.slug}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                id={`work-tab-${item.slug}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="work-panel"
                tabIndex={active ? 0 : -1}
                className={`rounded-md px-4 py-3 text-left font-mono text-xs tracking-[0.14em] uppercase ${
                  active ? "bg-ink text-cloud" : "bg-white text-ink"
                }`}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                0{index + 1} {tabLabel[item.slug]}
              </button>
            );
          })}
        </div>
        <div
          id="work-panel"
          role="tabpanel"
          aria-labelledby={`work-tab-${type.slug}`}
          key={type.slug}
          className="mt-3 grid gap-8 bg-ink p-6 text-cloud motion-safe:animate-sth-swap min-[900px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] min-[900px]:p-8 [clip-path:polygon(0_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%)]"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.16em] text-cloud/70 uppercase">
              0{selected + 1} / 0{workTypes.length}
            </p>
            <h3 className="font-display mt-3 text-3xl md:text-4xl">{type.title}</h3>
            <p className="mt-4 max-w-xl text-lg leading-8 text-cloud/85">{type.copy}</p>
          </div>
          <dl className="grid grid-cols-2 border border-cloud/15">
            {facts.map((fact) => (
              <div key={fact.label} className="border border-cloud/15 px-4 py-4">
                <dt className="font-mono text-[11px] tracking-[0.14em] text-cloud/60 uppercase">{fact.label}</dt>
                <dd className="font-display mt-2 text-xl leading-tight">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
