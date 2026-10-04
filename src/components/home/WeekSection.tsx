import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { week } from "@/content/site";

export default function WeekSection() {
  return (
    <section
      className="seam-left relative z-10 bg-ink pt-24 pb-24 text-cloud md:pt-28 md:pb-28"
      aria-labelledby="week-heading"
    >
      <div className={sectionContainer}>
        <SectionHeading
          id="week-heading"
          tone="dark"
          eyebrow="How a search runs"
          title="The week"
          lede="Monday we take the brief. Friday the offer is on its way, with the desk still on the thread."
        />
        <RevealGroup className="mt-12 grid gap-8 md:grid-cols-5" stagger={0.14}>
          {week.map((step) => (
            <RevealItem key={step.id}>
              <article className="border-t border-brand pt-4">
                <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">
                  {step.day}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-tight text-cloud">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-cloud/85">{step.copy}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
