"use client";

import Link from "next/link";
import { useState } from "react";
import { TrainingRoleTicket } from "@/components/ai-training/TrainingRoleTicket";
import { textLink } from "@/components/pages/format";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trainingRoles, workTypes, type WorkTypeSlug } from "@/content/ai-training";

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
      <div className={`wrap py-16 md:py-24`}>
        <SectionHeading id="roles-heading" eyebrow="Roles" title="The range of the work." />
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
        <ul className="mt-4 grid list-none gap-1.5 p-0">
          {visible.map((role) => (
            <li key={role.slug}>
              <TrainingRoleTicket role={role} />
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
