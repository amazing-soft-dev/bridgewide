import { StatsBand } from "@/components/ui/StatsBand";
import { trainingStats } from "@/content/ai-training";

export function TrainingRecord() {
  return (
    <StatsBand
      id="stats"
      headingId="stats-heading"
      watermark="PAID"
      eyebrow="At a glance"
      title="One application, paid by the platform."
      stats={trainingStats}
      seam="left"
      className="scroll-mt-24 pt-[calc(var(--seam)+5rem)] pb-[calc(var(--seam)+5rem)] md:pt-[calc(var(--seam)+7rem)] md:pb-[calc(var(--seam)+7rem)]"
    />
  );
}
