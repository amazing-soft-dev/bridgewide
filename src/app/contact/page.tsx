import { MessageSection } from "@/components/contact/MessageSection";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/ui/Faq";
import { TalentPoolForm } from "@/components/contact/TalentPoolForm";
import { contact, contactFaq } from "@/content/site";
import { sla } from "@/content/sla";
import { Suspense } from "react";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Call ${contact.phone} or write to ${contact.email}. ${contact.hours.label}. ${sla.employer}`,
  path: "/contact",
});

const deskFooter = {
  note: "Call the desk or send the question. A consultant answers, not a bot.",
  links: [
    { label: contact.phone, href: `tel:${contact.phoneHref}` },
    { label: contact.email, href: `mailto:${contact.email}` },
  ],
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Contact", path: "/contact" }])} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Talk to the desk."
        lede={`Hiring, looking, or a question about the market. ${sla.employer}`}
        accent
      />
      <MessageSection />
      <PageSection id="keep" label="No open role" title="Keep a profile on file.">
        <p className="mb-8 max-w-2xl leading-8 text-ink-soft">
          If a region you want has no open role, leave a CV and a short profile. The desk keeps them for 12 months.
        </p>
        <Suspense>
          <TalentPoolForm />
        </Suspense>
      </PageSection>
      <PageSection id="questions" label="Questions" title="Quick answers." accent>
        <Faq items={contactFaq} layout="desk" idPrefix="contact-q" deskFooter={deskFooter} />
      </PageSection>
    </>
  );
}
