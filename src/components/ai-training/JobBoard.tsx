"use client";

import { useMemo, useState } from "react";
import { TrainingRoleTicket } from "@/components/ai-training/TrainingRoleTicket";
import {
  trainingRegions,
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
        <ul className="grid list-none gap-1.5 p-0">
          {visible.map((role) => (
            <li key={role.slug}>
              <TrainingRoleTicket role={role} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
