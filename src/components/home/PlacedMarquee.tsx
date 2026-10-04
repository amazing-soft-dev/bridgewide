import { Marquee } from "@/components/ui/Marquee";
import { SplitWords } from "@/components/ui/SplitWords";
import { sectionContainer } from "@/components/ui/SectionHeading";
import { placements } from "@/content/site";

export default function PlacedMarquee() {
  return (
    <section
      className="seam-left relative z-10 bg-ink pt-20 pb-16 text-cloud"
      aria-labelledby="placed-heading"
    >
      <div className={sectionContainer}>
        <h2
          id="placed-heading"
          className="font-display text-3xl leading-tight tracking-tight text-cloud md:text-4xl"
        >
          <SplitWords text="Placed this month" />
        </h2>
      </div>
      <div className="mt-6">
        <Marquee className={`${sectionContainer} flex flex-wrap gap-x-8 gap-y-4`}>
          {placements.map((placement) => (
            <p
              key={`${placement.company}-${placement.title}`}
              className="flex items-baseline gap-3 whitespace-nowrap text-sm"
            >
              <span className="text-cloud">{placement.title}</span>
              <span className="text-brand">{placement.company}</span>
              <span className="font-mono text-[11px] tracking-wide text-cloud/75 uppercase">
                {placement.region} · {placement.engagement} · {placement.days}{" "}
                days
              </span>
            </p>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
