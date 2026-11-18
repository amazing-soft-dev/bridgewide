import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { Button } from "@/components/ui/Button";
import { trainingSteps } from "@/content/ai-training";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "How it works · AI training",
  description:
    "Apply once, get screened and matched, get briefed and introduced, then start on the platform’s terms.",
  path: "/ai-training/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "How it works", path: "/ai-training/how-it-works" }])} />
      <PageHero
        eyebrow="How it works"
        title="Four steps, then the platform pays you."
        lede="The desk aims to review an application within three business days. Your profile is shared only after you agree."
      >
        <Button href="/ai-training/for-candidates">Apply</Button>
      </PageHero>
      <PageSection id="steps" label="The path" title="Apply, match, brief, start.">
        <ol className="grid gap-8">
          {trainingSteps.map((step, index) => (
            <li key={step.title} className="border-t border-brand pt-4">
              <p className="eyebrow">0{index + 1}</p>
              <h2 className="font-display mt-3 text-3xl">{step.title}</h2>
              <p className="mt-3 max-w-2xl leading-8 text-ink-soft">{step.copy}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10">
          <Link href="/ai-training/for-partners" className={textLink}>
            The path for partners
          </Link>
        </p>
      </PageSection>
    </>
  );
}
