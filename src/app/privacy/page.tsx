import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { pageMetadata } from "@/components/pages/metadata";

export const metadata = pageMetadata({
  title: "Privacy · BridgeWide",
  description: "Placeholder privacy note for BridgeWide. This page is not legal advice.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="A placeholder, not a policy."
        lede="This page is not legal advice, and it is not a privacy policy you can rely on."
      />
      <PageSection id="draft" label="Draft" title="What this page is">
        <Prose>
          <p>
            BridgeWide will replace this note with a real privacy notice before the site treats it as policy. Until then, read it as a draft and do not use it to decide your rights.
          </p>
          <p>
            The hire, CV, and contact forms send the details you type to the desk by email so someone can reply. That is a description of the form, not a promise about retention, sharing, or your legal rights.
          </p>
          <p>
            If you need advice about privacy law, ask a lawyer. This text was written as a placeholder for the marketing site.
          </p>
        </Prose>
      </PageSection>
    </>
  );
}
