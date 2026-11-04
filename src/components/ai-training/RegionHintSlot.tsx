"use client";

import dynamic from "next/dynamic";

const RegionHint = dynamic(
  () => import("@/components/ai-training/RegionHint").then((mod) => mod.RegionHint),
  { ssr: false },
);

export function RegionHintSlot() {
  return <RegionHint />;
}
