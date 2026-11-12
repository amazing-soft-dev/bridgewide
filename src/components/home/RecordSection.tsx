import { StatsBand } from "@/components/ui/StatsBand";
import { stats, statsBasis } from "@/content/site";

export default function RecordSection() {
  return (
    <StatsBand
      headingId="record-heading"
      watermark="PLACED"
      eyebrow="The record"
      title="Numbers we would put on a departures board."
      accentWords={2}
      stats={stats}
      seam="right"
      note={statsBasis}
    />
  );
}
