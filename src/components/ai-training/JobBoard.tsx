"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { textLink } from "@/components/pages/format";
import {
  formatHourly,
  trainingRegions,
  workTypeLabel,
  workTypes,
  type TrainingRegionSlug,
  type TrainingRole,
  type WorkTypeSlug,
} from "@/content/ai-training";

type WorkFilter = WorkTypeSlug | "all";
type RegionFilter = TrainingRegionSlug | "all";

export function JobBoard({ roles }: { roles: readonly TrainingRole[] }) {
  const [work, setWork] = useState<WorkFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");

  const visible = useMemo(
    () =>
      roles.filter((role) => {
        if (work !== "all" && role.workType !== work) return false;
        if (region !== "all" && role.region !== region) return false;
        return true;
      }),
    [region, roles, work],
  );

  return (
    <div className="grid gap-8">
      <form className="grid gap-4 sm:grid-cols-2" aria-label="Filter roles">
        <label className="grid gap-1.5">
          <span className="font-mono text-xs tracking-wide text-ink-soft uppercase">Kind of work</span>
          <select
            className="w-full border border-stone bg-white px-3 py-2 text-base text-ink"
            value={work}
            onChange={(event) => setWork(event.target.value as WorkFilter)}
          >
            <option value="all">All kinds</option>
            {workTypes.map((type) => (
              <option key={type.slug} value={type.slug}>
                {type.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="font-mono text-xs tracking-wide text-ink-soft uppercase">Region</span>
          <select
            className="w-full border border-stone bg-white px-3 py-2 text-base text-ink"
            value={region}
            onChange={(event) => setRegion(event.target.value as RegionFilter)}
          >
            <option value="all">All regions</option>
            {trainingRegions.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </form>
      {visible.length === 0 ? (
        <p className="text-ink-soft">No roles match those filters.</p>
      ) : (
        <ul className="grid gap-4">
          {visible.map((role) => {
            const place = trainingRegions.find((item) => item.slug === role.region);
            return (
              <li key={role.slug} className="border-t border-brand pt-4">
                <p className="font-mono text-xs tracking-[0.16em] text-stone uppercase">
                  {place?.name} · {workTypeLabel(role.workType)}
                </p>
                <h3 className="font-display mt-3 text-2xl">
                  <Link href={`/ai-training/jobs/${role.slug}`} className={textLink}>
                    {role.title}
                  </Link>
                </h3>
                <p className="mt-2 text-ink-soft">{role.summary}</p>
                <p className="mt-2 font-mono text-sm text-ink">{formatHourly(role.payMin, role.payMax)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
