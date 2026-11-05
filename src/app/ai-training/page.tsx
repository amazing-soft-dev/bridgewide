import Link from "next/link";
import { BenefitsTimeline } from "@/components/ai-training/BenefitsTimeline";
import { MissionBand } from "@/components/ai-training/MissionBand";
import { PathSteps } from "@/components/ai-training/PathSteps";
import { PlatformTape } from "@/components/ai-training/PlatformTape";
import { PortraitWall } from "@/components/ai-training/PortraitWall";
import { QuestionDesk } from "@/components/ai-training/QuestionDesk";
import { TrainingRecord } from "@/components/ai-training/TrainingRecord";
import { TrainingRegions } from "@/components/ai-training/TrainingRegions";
import { TrainingRoleList } from "@/components/ai-training/TrainingRoleList";
import { WorkTypes } from "@/components/ai-training/WorkTypes";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { testimonials, trainingFaq, trainingHero } from "@/content/ai-training";
import { faqPage } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "AI training · BridgeWide",
  description: trainingHero.subcopy,
  path: "/ai-training",
});

export default function AiTrainingPage() {
  return (
    <>
      <JsonLd data={faqPage(trainingFaq)} />
      <PageHero eyebrow={trainingHero.eyebrow} title={trainingHero.headline} lede={trainingHero.subcopy}>
        <Button href="/ai-training/for-candidates">Apply</Button>
        <Button href="/ai-training/for-partners" variant="secondary">
          For partners
        </Button>
      </PageHero>

      <PageSection
        id="platforms"
        label="Platforms"
        title="The work lives on many platforms."
        lede="Outlier, Surge AI, Mercor, Turing, Micro1, and the others in this directory. BridgeWide is the shortcut through that maze."
        tone="ink"
        backgroundImage="/images/training-platforms.webp"
      >
        <PlatformTape />
      </PageSection>

      <WorkTypes />

      <MissionBand />

      <TrainingRecord />

      <BenefitsTimeline />

      <PathSteps />

      <TrainingRoleList />

      <TrainingRegions />

      <PortraitWall />

      {testimonials.length > 0 ? (
        <PageSection id="testimonials" label="Testimonials" title="In their words.">
          <ul className="grid gap-6">
            {testimonials.map((item) => (
              <li key={item.name} className="border-t border-brand pt-4">
                <blockquote className="text-lg leading-8 text-ink-soft">“{item.quote}”</blockquote>
                <p className="mt-3 text-sm text-stone">
                  {item.name}, {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </PageSection>
      ) : null}

      <PageSection id="faq" label="FAQ" title="Questions candidates ask.">
        <QuestionDesk
          items={trainingFaq.map((item, index) => ({
            id: `q${index + 1}`,
            question: item.question,
            answer: item.answer,
          }))}
        />
        <p className="mt-8">
          <Link href="/ai-training/faq" className={textLink}>
            All questions
          </Link>
        </p>
      </PageSection>
    </>
  );
}
