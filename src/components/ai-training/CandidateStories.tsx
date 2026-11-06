import { StorySlides } from "@/components/ui/StorySlides";
import { trainingBenefits } from "@/content/ai-training";

const pad = (value: number) => String(value).padStart(2, "0");

/** One full-screen slide per promise, wiped in on scroll. Same stage as the home employer stories. */
export function CandidateStories() {
  return (
    <StorySlides
      id="benefits"
      heading="What you can count on"
      headingId="benefits-heading"
      badge="For candidates"
      seam="right"
      clearance="top"
      slides={trainingBenefits.map((benefit, index) => ({
        key: benefit.title,
        image: { src: benefit.image, alt: benefit.alt },
        kicker: "What you can count on",
        copy: (
          <>
            <h3 className="mt-4 max-w-[36rem] font-display text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.02] tracking-tight text-cloud">
              {benefit.title}
              <span className="text-brand">.</span>
            </h3>
            <p className="mt-5 max-w-[32rem] text-lg leading-8 text-cloud/85">{benefit.copy}</p>
          </>
        ),
        cta: { href: "/ai-training/for-candidates", label: "Apply once" },
        card: { figure: benefit.figure, unit: benefit.unit, foot: `Promise ${pad(index + 1)}` },
        note: benefit.note,
      }))}
    />
  );
}
