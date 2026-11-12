import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { pageMetadata } from "@/components/pages/metadata";
import { contact } from "@/content/site";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How BridgeWide handles the details you send through the site.",
  path: "/privacy",
  robots: { index: false, follow: true },
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="How the desk handles your details."
        lede="BridgeWide is the controller for the forms on this site. A lawyer reviews this notice before it is indexed."
      />
      <PageSection id="notice" label="Notice" title="What we collect">
        <Prose>
          <p>
            The hire, CV, contact, salary-guide, talent-pool, and AI-training forms collect the fields on the form, including a CV when you attach one. The desk email is {contact.email}. Messages go through Resend. The site is hosted on Vercel. Those two companies process the message so it can be delivered and stored.
          </p>
          <p>
            A talent-pool CV is kept for 12 months from the day you consent, then deleted. You can email {contact.email} sooner to pause or delete a profile. AI-training profiles are introduced to a platform only after you agree to that introduction. The platform pays you.
          </p>
          <p>
            Vercel Web Analytics and Speed Insights load only in production. They are skipped when the browser sends Do Not Track. Query strings are stripped, and a hit that includes an email address is dropped. The site does not use a cookie banner for that collection.
          </p>
          <p>
            Readers in the United States, Canada, the United Kingdom, the European Union, Brazil, and the rest of Latin America can email {contact.email} to ask for a copy or for deletion. This notice stays out of the search index until that review is finished.
          </p>
        </Prose>
      </PageSection>
    </>
  );
}
