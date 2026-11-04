import type { ReactNode } from "react";
import { RegionHintSlot } from "@/components/ai-training/RegionHintSlot";
import { TrainingNav } from "@/components/ai-training/TrainingNav";

export default function AiTrainingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TrainingNav />
      <RegionHintSlot />
      {children}
    </>
  );
}
