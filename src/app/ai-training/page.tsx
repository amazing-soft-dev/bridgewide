import Link from "next/link";
import { ExampleBadge } from "@/components/ai-training/ExampleBadge";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import {
  formatHourly,
  platforms,
  portraits,
  testimonials,
  trainingBenefits,
  trainingFaq,
  trainingHero,
  trainingMission,
  trainingRegions,
  trainingRoles,
  trainingStats,
  trainingSteps,
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
        <Marquee className="flex flex-wrap gap-x-8 gap-y-3">
          {platforms.map((platform) => (
            <Link
              key={platform.slug}
              href={`/ai-training/platforms/${platform.slug}`}
              className="font-display text-2xl whitespace-nowrap text-cloud no-underline hover:text-brand"
            >
              {platform.name}
            </Link>
          ))}
        </Marquee>
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

      <PageSection id="mission" label="Mission" title="Close the gap." tone="ink">
        <p className="max-w-3xl text-lg leading-8 text-cloud-soft">{trainingMission}</p>
      </PageSection>

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

      <PageSection
        id="path"
        label="The path"
        title="Apply, match, brief, start."
        lede="The desk aims to review an application within three business days."
        tone="ink"
      >
        <ol className="grid gap-8 md:grid-cols-2">
          {trainingSteps.map((step, index) => (
            <li key={step.title} className="border-t border-brand pt-4">
              <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">0{index + 1}</p>
              <h3 className="font-display mt-3 text-2xl">{step.title}</h3>
              <p className="mt-3 leading-7 text-cloud-soft">{step.copy}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection
        id="roles"
        label="Example roles"
        title="The range of the work."
        lede="These listings are examples. Each one is marked Example role."
      >
        <ul className="grid gap-6">
          {trainingRoles.map((role) => (
            <li key={role.slug} className="border-t border-brand pt-4">
              <div className="flex flex-wrap items-center gap-3">
                <ExampleBadge />
                <p className="font-mono text-xs tracking-[0.16em] text-stone uppercase">
                  {workTypeLabel(role.workType)}
                </p>
              </div>
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
            Filter example roles
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

      <PageSection
        id="talent"
        label="Sample profiles"
        title="Four fictional portraits."
        lede="These people are samples. They are not candidates BridgeWide has placed."
        tone="ink"
      >
        <ul className="grid gap-6 sm:grid-cols-2">
          {portraits.map((person) => (
            <li key={person.id} className="border-t border-brand pt-4">
              <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">Sample profile</p>
              <h3 className="font-display mt-3 text-2xl">{person.name}</h3>
              <p className="mt-2 text-cloud-soft">
                {person.place} · {person.focus}
              </p>
            </li>
          ))}
        </ul>
      </PageSection>

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
