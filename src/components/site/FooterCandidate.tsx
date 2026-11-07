"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

/** The candidate door for each section. Staffing is every page outside /ai-training. */
const doors = {
  staffing: { label: "Send a CV", href: "/engineers" },
  training: { label: "Apply once", href: "/ai-training/for-candidates" },
} as const;

/**
 * The candidate line under the salary-guide signup: a label and one compact
 * button to the CV page, or to the AI training application under
 * /ai-training. The footer holds no upload of its own; the forms live on
 * their pages.
 */
export function FooterCandidate() {
  const pathname = usePathname();
  const door = pathname.startsWith("/ai-training") ? doors.training : doors.staffing;

  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <span className="font-mono text-xs tracking-[0.14em] text-cloud-soft uppercase">
        <span className="mr-2 inline-block size-[5px] rounded-[1px] bg-brand align-middle" aria-hidden />
        For candidates
      </span>
      <Button href={door.href} compact variant="onDark">
        {door.label}
      </Button>
    </p>
  );
}
