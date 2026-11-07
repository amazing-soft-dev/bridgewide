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
      className="scroll-mt-24"
    />
  );
}
