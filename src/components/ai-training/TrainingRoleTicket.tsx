import { JobTicket } from "@/components/ui/JobTicket";
import {
  formatCompactHourly,
  trainingRegion,
  workTypeShort,
  type TrainingRole,
  type WorkTypeSlug,
} from "@/content/ai-training";

const code: Record<WorkTypeSlug, string> = {
  code: "COD",
  rlhf: "RLH",
  specialist: "SPC",
};

/** An AI-training role as a JobTicket. Used by the jobs board, the training role list, and the region pages. */
export function TrainingRoleTicket({ role, heading }: { role: TrainingRole; heading?: "h2" | "h3" }) {
  return (
    <JobTicket
      href={`/ai-training/jobs/${role.slug}`}
      code={code[role.workType]}
      title={role.title}
      summary={role.summary}
      place={trainingRegion(role.region)?.name ?? role.region}
      kind={workTypeShort(role.workType)}
      pay={formatCompactHourly(role.payMin, role.payMax)}
      heading={heading}
    />
  );
}
