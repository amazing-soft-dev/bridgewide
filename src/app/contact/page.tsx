import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { telHref, textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { contact } from "@/content/site";

export const metadata = pageMetadata({
  title: "Contact · BridgeWide",
  description: `Write to ${contact.email} or call ${contact.phone}. ${contact.location}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="The desk answers."
        lede={contact.location}
      />
      <PageSection
        id="reach"
        label="Reach us"
        title="Phone, email, or a note"
        lede={
          <>
            Hiring managers can open a search on the{" "}
            <Link href="/employers" className={textLink}>
              employers page
            </Link>
            . Engineers can send a CV on the{" "}
            <Link href="/engineers" className={textLink}>
              engineers page
            </Link>
            . Everyone else can use this form.
          </>
        }
      >
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] md:items-start">
          <address className="border-t border-brand pt-4 not-italic">
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">Desk</p>
            <ul className="mt-4 grid gap-3 text-lg">
              <li>
                <a href={`mailto:${contact.email}`} className={textLink}>
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={telHref(contact.phone)} className={textLink}>
                  {contact.phone}
                </a>
              </li>
              <li className="text-ink-soft">{contact.location}</li>
            </ul>
          </address>
          <ContactForm />
        </div>
      </PageSection>
    </>
  );
}
