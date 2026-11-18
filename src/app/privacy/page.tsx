import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { pageMetadata } from "@/components/pages/metadata";
import { privacySections, privacyUpdatedOn } from "@/content/privacy";

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
        lede={`Every form is an email, and nothing is stored in a database. Updated ${privacyUpdatedOn}. A lawyer reviews this notice before it is indexed.`}
      />
      {privacySections.map((section) => (
        <PageSection key={section.id} id={section.id} label="Notice" title={section.title}>
          <Prose>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </PageSection>
      ))}
    </>
  );
}
