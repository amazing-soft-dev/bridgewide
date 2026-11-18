import { PartnerForm } from "@/components/ai-training/PartnerForm";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

const partnerSteps = [
  {
    title: "Brief",
    copy: "Tell us the tracks, the seniority, the languages, and the time zones you need to cover.",
  },
  {
    title: "Source",
    copy: "We look across the United States, Canada, Latin America, Europe, Asia, and applicants anywhere else.",
  },
  {
    title: "Screen",
    copy: "Profiles are screened before they reach you, so a cohort does not start as a pile of cold applications.",
  },
  {
    title: "Shortlist",
    copy: "You get a shortlist matched to the brief, without standing up an internal recruiting team for the cohort.",
  },
] as const;

export const metadata = pageMetadata({
  title: "For partners · AI training",
  description:
    "A pre-screened pipeline for AI-training platforms and labs, matched by discipline, seniority, language, and time zone.",
  path: "/ai-training/for-partners",
});

export default function ForPartnersPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "For partners", path: "/ai-training/for-partners" }])} />
      <PageHero
        eyebrow="For partners"
        title="A pipeline, without a new recruiting team."
        lede="BridgeWide briefs, sources, screens, and delivers a shortlist for AI-training platforms and labs. Candidates are matched by discipline, seniority, language, and time zone."
      />
      <PageSection id="path" label="The path" title="Brief, source, screen, deliver." tone="ink">
        <ol className="grid gap-8 md:grid-cols-2">
          {partnerSteps.map((step, index) => (
            <li key={step.title} className="border-t border-brand pt-4">
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="font-display mt-3 text-2xl">{step.title}</h3>
              <p className="mt-3 leading-7 text-cloud-soft">{step.copy}</p>
            </li>
          ))}
        </ol>
      </PageSection>
      <PageSection
        id="inquiry"
        label="Inquiry"
        title="Tell us the cohort."
        lede="Platforms and labs use this form. Candidates apply on the candidate page."
      >
        <PartnerForm />
      </PageSection>
    </>
  );
}
