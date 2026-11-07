import { DriftingWord } from "@/components/ui/DriftingWord";
import { ChipLabel } from "@/components/ui/EyebrowChip";
import { FlapValue } from "@/components/ui/FlapValue";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type BandStat = { value: string; label: string };

function StatFigure({ value, index }: { value: string; index: number }) {
  if (!/\d/.test(value)) {
    return (
      <span className="font-display text-[clamp(2.5rem,4.6vw,4.25rem)] leading-none tracking-tight">
        {value}
      </span>
    );
  }
  return <FlapValue value={value} index={index} />;
}

/**
 * A brand-red band with a chip eyebrow and heading on the left, a two-by-two
 * grid of split-flap figures on the right, and the outline word drifting
 * along its bottom edge. Figures without a digit are set as plain display
 * text.
 */
export function StatsBand({
  id,
  headingId,
  watermark,
  eyebrow,
  title,
  stats,
  seam,
  className = "",
}: {
  id?: string;
  headingId: string;
  watermark: string;
  eyebrow: string;
  title: string;
  stats: readonly BandStat[];
  seam: "left" | "right";
  /** Height and vertical padding; differs by where the band sits. */
  className?: string;
}) {
  return (
    <section
      id={id}
      data-header-tone="dark"
      className={`relative z-10 overflow-hidden bg-brand text-white ${seam === "left" ? "seam-left" : "seam-right"} ${className}`}
      aria-labelledby={headingId}
    >
      <DriftingWord word={watermark} />
      <div className="wrap relative grid items-center gap-12 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="m-0">
            <ChipLabel tone="brand">{eyebrow}</ChipLabel>
          </p>
          <SectionHeading id={headingId} tone="dark" title={title} className="[&_h2]:text-white" />
        </div>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-8">
          {stats.map((stat, index) => (
            <li key={stat.label} className="grid gap-2.5">
              <StatFigure value={stat.value} index={index} />
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-white/85 uppercase">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
