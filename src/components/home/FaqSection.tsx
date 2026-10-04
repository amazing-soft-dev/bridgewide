import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { faq } from "@/content/site";

export default function FaqSection() {
  return (
    <section
      className="seam-right relative z-10 bg-cloud-soft pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="faq-heading"
    >
      <div className={sectionContainer}>
        <SectionHeading
          id="faq-heading"
          eyebrow="Answers"
          title="Questions we hear"
          lede="From hiring teams and from engineers, before a name goes on a shortlist."
        />
        <div className="mt-10">
          <Accordion
            items={faq.map((item, index) => ({
              id: `faq-${index}`,
              label: item.audience,
              question: item.question,
              answer: item.answer,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
