import { RoleTicket } from "@/components/ui/RoleTicket";
import {
  formatHourly,
  trainingRegion,
  type TrainingRole,
  type WorkTypeSlug,
} from "@/content/ai-training";

const code: Record<WorkTypeSlug, string> = {
  code: "COD",
  rlhf: "RLH",
  specialist: "SPC",
};

export function TrainingRoleTicket({ role }: { role: TrainingRole }) {
  return (
    <RoleTicket
      href={`/ai-training/jobs/${role.slug}`}
      code={code[role.workType]}
      title={role.title}
      summary={role.summary}
      arrowAt={700}
      className="grid-cols-1 min-[700px]:grid-cols-[44px_minmax(0,1fr)_auto_auto_auto_20px] min-[700px]:gap-3.5 min-[700px]:px-[18px]"
    >
      <span className="font-mono text-xs tracking-[0.04em] text-stone uppercase">
        {trainingRegion(role.region)?.name}
      </span>
      <span className="text-[15px] font-bold tracking-[-0.02em]">
        {formatHourly(role.payMin, role.payMax)}
      </span>
      {role.sample ? (
        <span className="w-fit justify-self-start rounded-[3px] bg-brand px-1.5 py-1 font-mono text-xs tracking-[0.12em] text-white uppercase">
          Sample
        </span>
      ) : (
        <span aria-hidden />
      )}
    </RoleTicket>
  );
}
