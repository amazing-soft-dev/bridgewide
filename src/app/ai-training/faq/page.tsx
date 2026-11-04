import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { trainingFaq } from "@/content/ai-training";
import { faqPage } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "FAQ · AI training · BridgeWide",
  description:
    "Who AI-training work is for, who pays, when a profile is shared, and how example roles differ from live openings.",
  path: "/ai-training/faq",
});

export default function AiTrainingFaqPage() {
  return (
    <>
      <JsonLd data={faqPage(trainingFaq)} />
      <PageHero
        eyebrow="FAQ"
        title="Straight answers."
        lede="Pay, sharing, regions, and what the example roles are."
      />
      <PageSection id="questions" label="Questions" title="Candidates and partners.">
        <Accordion
          items={trainingFaq.map((item, index) => ({
            id: `q${index + 1}`,
            question: item.question,
            answer: item.answer,
          }))}
        />
      </PageSection>
    </>
  );
}
