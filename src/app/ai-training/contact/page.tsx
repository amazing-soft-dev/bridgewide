import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { contact } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Contact · AI training",
  description: `Questions about AI-training work. Write to ${contact.email}, or use the candidate and partner forms.`,
  path: "/ai-training/contact",
});

export default function AiTrainingContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "Contact", path: "/ai-training/contact" }])} />
      <PageHero
        eyebrow="Contact"
        title="A note to the AI-training desk."
        lede="Candidates with a CV should use the application. Platforms and labs should use the partner form. This note is for everything else."
      />
      <PageSection id="note" label="Write" title="Send a message.">
        <p className="mb-8 max-w-2xl leading-8 text-ink-soft">
          <Link href="/ai-training/for-candidates" className={textLink}>
            Apply as a candidate
          </Link>
          {" · "}
          <Link href="/ai-training/for-partners" className={textLink}>
            Partner inquiry
          </Link>
          {" · "}
          <a href={`mailto:${contact.email}`} className={textLink}>
            {contact.email}
          </a>
        </p>
        <ContactForm />
      </PageSection>
    </>
  );
}
