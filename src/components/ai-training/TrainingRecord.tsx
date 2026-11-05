import { pageWrap } from "@/components/pages/format";
import { FlapValue } from "@/components/ui/FlapValue";
import { trainingStats } from "@/content/ai-training";

function StatFigure({ value, index }: { value: string; index: number }) {
  if (!/\d/.test(value)) {
    return (
      <span className="font-display text-[clamp(2.5rem,4.6vw,4.25rem)] leading-none tracking-tight">{value}</span>
    );
  }
  return <FlapValue value={value} index={index} />;
}

export function TrainingRecord() {
  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      className="relative scroll-mt-24 overflow-hidden bg-ink py-20 text-cloud md:py-28 [clip-path:polygon(0_var(--seam),100%_0,100%_calc(100%-var(--seam)),0_100%)]"
    >
      <p
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-display text-[clamp(5rem,18vw,16rem)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgb(244_240_232/0.16)] max-[899px]:hidden motion-reduce:hidden"
        aria-hidden
      >
        PAID · PAID · PAID
      </p>
      <div className={`relative grid items-center gap-12 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] ${pageWrap}`}>
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">At a glance</p>
          <h2 id="stats-heading" className="font-display mt-3 max-w-xl text-4xl leading-[1.02] tracking-tight md:text-5xl">
            One application, paid by the platform.
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-8">
          {trainingStats.map((stat, index) => (
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
