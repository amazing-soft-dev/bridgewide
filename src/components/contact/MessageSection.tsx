import { DeskCard } from "@/components/contact/DeskCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { EyebrowChip } from "@/components/ui/EyebrowChip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The contact page's message block: a sticky left column with the heading,
 * lede, and desk card, and the white form card on the right. The columns
 * stack under 900px and the left one stops sticking.
 */
export function MessageSection() {
  return (
    <section
      id="message"
      aria-labelledby="message-heading"
      className="relative scroll-mt-24 border-t border-cloud-soft bg-cloud text-ink"
    >
      <div className="wrap grid items-start gap-[clamp(28px,5vw,90px)] py-16 min-[900px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:py-24">
        <div className="grid gap-5 min-[900px]:sticky min-[900px]:top-[110px]">
          <EyebrowChip>Contact</EyebrowChip>
          <SectionHeading id="message-heading" title="Send us a message." accent />
          <Reveal delay={0.28}>
            <p className="max-w-md text-lg leading-8 text-ink-soft">
              Hiring, looking, or just a question about the market. A person answers.
            </p>
          </Reveal>
          <Reveal delay={0.52}>
            <DeskCard />
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="corner-cut-lg rounded-xl border border-cloud-soft bg-white p-[clamp(22px,2.8vw,40px)] shadow-[0_30px_70px_rgb(17_17_17/0.08)]">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
