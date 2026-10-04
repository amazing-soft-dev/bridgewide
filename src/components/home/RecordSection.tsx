import { CountUp } from "@/components/ui/CountUp";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { sampleFiguresNote, stats } from "@/content/site";

export default function RecordSection() {
  return (
    <section
      className="seam-left relative z-10 bg-ink pt-24 pb-24 text-cloud md:pt-28 md:pb-28"
      aria-labelledby="record-heading"
    >
      <div className={sectionContainer}>
        <SectionHeading
          id="record-heading"
          tone="dark"
          eyebrow="Past year"
          title="The record"
          lede={
            <span className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
              {sampleFiguresNote}
            </span>
          }
        />
        <RevealGroup
          as="dl"
          className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="flex flex-col border-t border-brand pt-4"
            >
              <dt className="order-2 mt-3 max-w-[16rem] text-sm leading-6 text-cloud/85">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-5xl leading-none text-cloud md:text-6xl">
                <CountUp value={stat.value} />
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
