import { MessageSection } from "@/components/contact/MessageSection";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/ui/Faq";
import { contact, contactFaq } from "@/content/site";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Call ${contact.phone} or write to ${contact.email}. ${contact.hours.label}. A person answers, usually within two working hours.`,
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
        lede="Hiring, looking, or a question about the market. A person answers, usually within two working hours."
        accent
      />
      <MessageSection />
      <PageSection id="questions" label="Questions" title="Quick answers." accent>
        <Faq items={contactFaq} layout="desk" idPrefix="contact-q" deskFooter={deskFooter} />
      </PageSection>
    </>
  );
}
