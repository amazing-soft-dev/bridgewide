import { Suspense } from "react";
import Link from "next/link";
import { ApplyForm, ApplyFormFromQuery } from "@/components/ai-training/ApplyForm";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { trainingSteps } from "@/content/ai-training";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "For candidates · AI training",
  description:
    "Apply once for remote AI-training work. The platform pays you. BridgeWide does not take a cut, and your profile is shared only after you agree.",
  path: "/ai-training/for-candidates",
});

export default function ForCandidatesPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "For candidates", path: "/ai-training/for-candidates" }])} />
      <PageHero
        eyebrow="For candidates"
        title="One application, then a briefing."
        lede="Tell us your experience, the kind of work, your region, and your English level. Attach a CV. The desk aims to review it within three business days."
      >
        <Link href="/ai-training/jobs" className={textLink}>
          See roles
        </Link>
      </PageHero>
      <PageSection id="path" label="The path" title="What happens after you apply." tone="ink">
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
        id="apply"
        label="Application"
        title="Apply"
        lede="PDF, DOC, or DOCX. Choose Other if your country is outside the five regions."
      >
        <Suspense fallback={<ApplyForm />}>
          <ApplyFormFromQuery />
        </Suspense>
      </PageSection>
    </>
  );
}
