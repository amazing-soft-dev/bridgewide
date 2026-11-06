import { QuestionDesk } from "@/components/ai-training/QuestionDesk";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { trainingFaq } from "@/content/ai-training";
import { breadcrumbs, faqPage } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "FAQ · AI training",
  description:
    "Who AI-training work is for, who pays, when a profile is shared, and how the listed roles differ from live openings.",
  path: "/ai-training/faq",
});

export default function AiTrainingFaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "FAQ", path: "/ai-training/faq" }])} />
      <JsonLd data={faqPage(trainingFaq)} />
      <PageHero
        eyebrow="FAQ"
        title="Straight answers."
        lede="Pay, sharing, regions, and what the listed roles are."
      />
      <PageSection id="questions" label="Questions" title="Candidates and partners.">
        <QuestionDesk
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
