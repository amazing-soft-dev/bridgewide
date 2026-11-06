"use client";

import Link from "next/link";
import { m } from "motion/react";
import { useState } from "react";
import { lightTextLink } from "@/components/pages/format";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { revealViewport } from "@/lib/motion";
import {
  formatHourly,
  trainingRegion,
  trainingRoles,
  workTypes,
  workTypeShort,
  type WorkTypeSlug,
} from "@/content/ai-training";

const code: Record<WorkTypeSlug, string> = {
  code: "COD",
  rlhf: "RLH",
  specialist: "SPC",
};

/** The hourly scale: ticks every $30 up to the highest pay on the list. */
const TICK = 30;
const top = Math.ceil(Math.max(...trainingRoles.map((role) => role.payMax)) / TICK) * TICK;
const ticks = Array.from({ length: top / TICK + 1 }, (_, index) => index * TICK);
const lowest = Math.min(...trainingRoles.map((role) => role.payMin));

const pct = (value: number) => `${(value / top) * 100}%`;

const columns = "min-[700px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]";

/**
 * The roles as a pay-range chart: one row per role, with a bar from its
 * lowest to its highest hourly rate on a shared scale. The bars grow in as
 * the chart scrolls into view. The chips filter by kind of work.
 */
export function TrainingRoleList() {
  const [filter, setFilter] = useState<WorkTypeSlug | "all">("all");
  const visible = trainingRoles.filter((role) => filter === "all" || role.workType === filter);
  const chips = [
    { id: "all" as const, label: "All", count: trainingRoles.length },
    ...workTypes.map((type) => ({
      id: type.slug,
      label: workTypeShort(type.slug),
      count: trainingRoles.filter((role) => role.workType === type.slug).length,
    })),
  ];

  return (
    <section
      id="roles"
      data-header-tone="dark"
      aria-labelledby="roles-heading"
      className="relative scroll-mt-24 overflow-hidden bg-ink text-cloud"
    >
      <div className="wrap py-16 md:py-24">
        <div className="grid gap-8 min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:items-end">
          <SectionHeading
            id="roles-heading"
            tone="dark"
            eyebrow="Roles"
            title="The range of the work."
            lede={`From $${lowest} to $${top} an hour, in USD, paid by the platform. Each bar is one role's range.`}
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind of work">
            {chips.map((chip) => {
              const selected = filter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors duration-300 ${
                    selected
                      ? "border-cloud bg-cloud text-ink"
                      : "border-cloud/20 text-cloud hover:border-cloud/60 focus-visible:border-cloud/60"
                  }`}
                  onClick={() => setFilter(chip.id)}
                >
                  {chip.label}
                  <span className={`rounded px-1.5 py-0.5 ${selected ? "bg-ink text-cloud" : "bg-cloud/10 text-cloud"}`}>
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <div className={`grid gap-x-10 ${columns}`} aria-hidden>
            <p className="hidden font-mono text-[11px] tracking-[0.14em] text-cloud/50 uppercase min-[700px]:block">
              Role
            </p>
            <p className="relative h-5 font-mono text-[11px] tracking-[0.08em] text-cloud/50">
              {ticks.map((tick, index) => (
                <span
                  key={tick}
                  className={`absolute top-0 ${
                    index === 0 ? "" : index === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
                  }`}
                  style={{ left: pct(tick) }}
                >
                  ${tick}
                </span>
              ))}
            </p>
          </div>

          <ol className="m-0 list-none border-t border-cloud/15 p-0">
            {visible.map((role, index) => {
              const region = trainingRegion(role.region)?.name ?? role.region;
              return (
                <li key={role.slug} className="border-b border-cloud/15">
                  <Link
                    href={`/ai-training/jobs/${role.slug}`}
                    className={`group grid gap-x-10 gap-y-4 py-5 text-cloud no-underline transition-colors duration-300 hover:bg-cloud/[0.04] focus-visible:bg-cloud/[0.04] min-[700px]:items-center min-[700px]:py-6 ${columns}`}
                  >
                    <span className="grid min-w-0 gap-1.5">
                      <span className="flex items-center gap-3">
                        <span className="grid w-11 shrink-0 place-items-center rounded-[3px] border border-brand/60 py-1 font-mono text-[11px] tracking-[0.12em] text-brand">
                          {code[role.workType]}
                        </span>
                        <h3 className="m-0 font-display text-xl leading-tight font-bold tracking-[-0.02em] transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand">
                          {role.title}
                        </h3>
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.12em] text-cloud/55 uppercase">
                        {region} · {workTypeShort(role.workType)}
                      </span>
                      <span className="text-sm leading-6 text-cloud/70">{role.summary}</span>
                      <span className="sr-only">{formatHourly(role.payMin, role.payMax)}</span>
                    </span>

                    <span className="relative block h-14" aria-hidden>
                      {ticks.map((tick) => (
                        <span key={tick} className="absolute inset-y-0 w-px bg-cloud/10" style={{ left: pct(tick) }} />
                      ))}
                      <m.span
                        className="absolute top-1/2 h-3 -translate-y-1/2 rounded-[2px] bg-brand transition-[background-color,box-shadow] duration-300 group-hover:bg-[#ff3b3a] group-hover:shadow-[0_0_24px_rgb(243_1_0/0.5)]"
                        style={{ left: pct(role.payMin), width: pct(role.payMax - role.payMin), originX: 0 }}
                        data-motion="bar"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={revealViewport}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 + index * 0.08 }}
                      />
                      <span
                        className="absolute top-0 font-mono text-xs tracking-[0.04em] text-cloud/80"
                        style={{ left: pct(role.payMin) }}
                      >
                        ${role.payMin}
                      </span>
                      <span
                        className="absolute bottom-0 -translate-x-full font-mono text-xs tracking-[0.04em] font-semibold text-cloud"
                        style={{ left: pct(role.payMax) }}
                      >
                        ${role.payMax}/hr
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[11px] tracking-[0.14em] text-cloud/55 uppercase">
              {visible.length} of {trainingRoles.length} roles · hourly, in USD
            </p>
            <Link href="/ai-training/jobs" className={lightTextLink}>
              Filter roles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
