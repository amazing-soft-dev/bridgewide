"use client";

import Link from "next/link";
import { useState } from "react";
import { pageWrap, textLink } from "@/components/pages/format";
import {
  formatHourly,
  trainingRegion,
  trainingRoles,
  workTypes,
  type WorkTypeSlug,
} from "@/content/ai-training";

const code: Record<WorkTypeSlug, string> = {
  code: "COD",
  rlhf: "RLH",
  specialist: "SPC",
};

export function TrainingRoleList() {
  const [filter, setFilter] = useState<WorkTypeSlug | "all">("all");
  const visible = trainingRoles.filter((role) => filter === "all" || role.workType === filter);
  const chips = [
    { id: "all" as const, label: "All", count: trainingRoles.length },
    ...workTypes.map((type) => ({
      id: type.slug,
      label: type.slug === "rlhf" ? "RLHF" : type.slug === "code" ? "Code" : "Specialist",
      count: trainingRoles.filter((role) => role.workType === type.slug).length,
    })),
  ];

  return (
    <section id="roles" aria-labelledby="roles-heading" className="scroll-mt-24 border-t border-cloud-soft bg-cloud text-ink">
      <div className={`${pageWrap} py-16 md:py-24`}>
        <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">Roles</p>
        <h2 id="roles-heading" className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">
          The range of the work.
        </h2>
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by kind of work">
          {chips.map((chip) => {
            const selected = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={selected}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs tracking-[0.12em] uppercase ${
                  selected ? "bg-ink text-cloud" : "bg-white text-ink"
                }`}
                onClick={() => setFilter(chip.id)}
              >
                {chip.label}
                <span className={`rounded px-1.5 py-0.5 ${selected ? "bg-cloud text-ink" : "bg-cloud-soft text-ink"}`}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
        <ul className="mt-4 grid gap-3">
          {visible.map((role) => (
            <li key={role.slug}>
              <Link
                href={`/ai-training/jobs/${role.slug}`}
                className="grid items-start gap-3 rounded-xl bg-white px-4 py-4 text-ink no-underline shadow-[0_8px_24px_rgb(17_17_17/0.04)] min-[700px]:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] min-[700px]:items-center"
              >
                <span className="grid size-11 place-items-center rounded-md border border-cloud-soft font-mono text-xs tracking-wide">
                  {code[role.workType]}
                </span>
                <span className="min-w-0">
                  <span className="font-display text-lg leading-tight">{role.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-ink-soft">{role.summary}</span>
                </span>
                <span className="font-mono text-xs tracking-wide text-stone uppercase">
                  {trainingRegion(role.region)?.name}
                </span>
                <span className="font-mono text-sm">{formatHourly(role.payMin, role.payMax)}</span>
                {role.sample ? (
                  <span className="w-fit rounded bg-brand px-2 py-1 font-mono text-[11px] tracking-[0.12em] text-cloud uppercase">
                    Sample
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href="/ai-training/jobs" className={textLink}>
            Filter roles
          </Link>
        </p>
      </div>
    </section>
  );
}
