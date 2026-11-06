import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/content/site";

export default function FaqSection() {
  return (
    <section
      className="seam-left relative z-10 bg-cloud-soft pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="faq-heading"
    >
      <div className="wrap">
        <SectionHeading
          id="faq-heading"
          eyebrow="Answers"
          title="Questions we hear"
          lede="From hiring teams and from engineers, before a name goes on a shortlist."
        />
        <div className="mt-10">
          <Faq items={faq.map((item) => ({ ...item, label: item.audience }))} />
        </div>
      </div>
    </section>
  );
}
