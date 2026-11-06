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
 * A dark band with a watermark word behind it, a heading on the left, and a
 * two-by-two grid of split-flap figures on the right. Figures without a
 * digit are set as plain display text.
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
      className={`relative z-10 overflow-hidden bg-ink text-cloud ${seam === "left" ? "seam-left" : "seam-right"} ${className}`}
      aria-labelledby={headingId}
    >
      <p
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-display text-[clamp(5rem,18vw,16rem)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgb(244_240_232/0.16)] max-[899px]:hidden motion-reduce:hidden"
        aria-hidden
      >
        {watermark} · {watermark} · {watermark}
      </p>
      <div className="wrap relative grid items-center gap-12 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionHeading id={headingId} tone="dark" eyebrow={eyebrow} title={title} />
        <ul className="grid grid-cols-2 gap-x-8 gap-y-8">
          {stats.map((stat, index) => (
            <li key={stat.label} className="grid gap-2.5">
              <StatFigure value={stat.value} index={index} />
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-cloud/80 uppercase">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
