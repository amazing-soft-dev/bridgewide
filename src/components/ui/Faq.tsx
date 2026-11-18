import { QuestionDesk, type QuestionDeskFooter } from "@/components/ai-training/QuestionDesk";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { faqPage } from "@/lib/structured-data";

/** A question and its answer, as the content files hold them. */
export type FaqEntry = {
  question: string;
  answer: string;
  /** Who asks it; shown as the small label on the accordion. */
  label?: string;
};

/** An entry with the id the layouts use for their button and panel pairs. */
export type FaqItem = FaqEntry & { id: string };

/**
 * One FAQ block: the questions as an accordion or the two-column question
 * desk, plus the FAQPage structured data for the same questions. Pages
 * render this once and never emit the JSON-LD themselves.
 */
export function Faq({
  items,
  layout = "accordion",
  idPrefix = "faq",
  structuredData = true,
  deskFooter,
}: {
  items: readonly FaqEntry[];
  layout?: "accordion" | "desk";
  idPrefix?: string;
  structuredData?: boolean;
  /** The "Still asking?" line under the desk layout. Defaults to the AI-training desk. */
  deskFooter?: QuestionDeskFooter;
}) {
  const entries: FaqItem[] = items.map((item, index) => ({ ...item, id: `${idPrefix}-${index + 1}` }));

  return (
    <>
      {structuredData ? <JsonLd data={faqPage(items)} /> : null}
      {layout === "desk" ? (
        <QuestionDesk items={entries} footer={deskFooter} />
      ) : (
        <Accordion items={entries} />
      )}
    </>
  );
}
