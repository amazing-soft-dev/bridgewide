import { StatsBand } from "@/components/ui/StatsBand";
import { stats } from "@/content/site";

export default function RecordSection() {
  return (
    <StatsBand
      headingId="record-heading"
      watermark="PLACED"
      eyebrow="The record"
      title="Numbers we would put on a departures board."
      stats={stats}
      seam="right"
      className="flex min-h-[calc(100vh+var(--seam))] flex-col justify-center pt-24 pb-24 md:pt-28 md:pb-28"
    />
  );
}
