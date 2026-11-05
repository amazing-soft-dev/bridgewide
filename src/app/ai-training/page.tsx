import Link from "next/link";
import { MissionBand } from "@/components/ai-training/MissionBand";
import { PathSteps } from "@/components/ai-training/PathSteps";
import { PlatformTape } from "@/components/ai-training/PlatformTape";
import { PortraitWall } from "@/components/ai-training/PortraitWall";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import {
  formatHourly,
  testimonials,
  trainingBenefits,
  trainingFaq,
  trainingHero,
  trainingRegions,
  trainingRoles,
  trainingStats,
  workTypeLabel,
  workTypes,
} from "@/content/ai-training";
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
      >
        <PlatformTape />
      </PageSection>

      <PageSection
        id="work"
        label="The work"
        title="Three kinds of tasks, and the tracks around them."
      >
        <ol className="grid gap-8 md:grid-cols-3">
          {workTypes.map((type, index) => (
            <li key={type.slug} className="border-t border-brand pt-4">
              <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">0{index + 1}</p>
              <h3 className="font-display mt-3 text-2xl">{type.title}</h3>
              <p className="mt-3 leading-7 text-ink-soft">{type.copy}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <MissionBand />

      <PageSection id="stats" label="At a glance" title="One application, paid by the platform.">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trainingStats.map((stat) => (
            <div key={stat.label} className="border-t border-brand pt-4">
              <dt className="font-mono text-xs tracking-[0.16em] text-stone uppercase">{stat.label}</dt>
              <dd className="font-display mt-3 text-4xl text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection id="benefits" label="For candidates" title="What you can count on.">
        <ul className="grid gap-8 md:grid-cols-2">
          {trainingBenefits.map((benefit) => (
            <li key={benefit.title} className="border-t border-brand pt-4">
              <h3 className="font-display text-2xl">{benefit.title}</h3>
              <p className="mt-3 leading-7 text-ink-soft">{benefit.copy}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PathSteps />

      <PageSection id="roles" label="Roles" title="The range of the work.">
        <ul className="grid gap-6">
          {trainingRoles.map((role) => (
            <li key={role.slug} className="border-t border-brand pt-4">
              <p className="font-mono text-xs tracking-[0.16em] text-stone uppercase">
                {workTypeLabel(role.workType)}
              </p>
              <h3 className="font-display mt-3 text-2xl">
                <Link href={`/ai-training/jobs/${role.slug}`} className={textLink}>
                  {role.title}
                </Link>
              </h3>
              <p className="mt-2 text-ink-soft">{role.summary}</p>
              <p className="mt-2 font-mono text-sm">{formatHourly(role.payMin, role.payMax)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href="/ai-training/jobs" className={textLink}>
            Filter roles
          </Link>
        </p>
      </PageSection>

      <PageSection id="regions" label="Regions" title="Real pages, not a location swap.">
        <ul className="grid gap-6 md:grid-cols-2">
          {trainingRegions.map((region) => (
            <li key={region.slug} className="border-t border-brand pt-4">
              <h3 className="font-display text-2xl">
                <Link href={`/ai-training/${region.slug}`} className={textLink}>
                  {region.name}
                </Link>
              </h3>
              <p className="mt-3 leading-7 text-ink-soft">{region.summary}</p>
            </li>
          ))}
        </ul>
      </PageSection>

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
        <Accordion
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
