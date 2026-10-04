import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { pageMetadata } from "@/components/pages/metadata";

export const metadata = pageMetadata({
  title: "Terms · BridgeWide",
  description:
    "Placeholder terms for BridgeWide. This page is not legal advice and it is not a contract.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="A placeholder, not a contract."
        lede="This page is not legal advice, and it does not create terms of use."
      />
      <PageSection id="draft" label="Draft" title="What this page is">
        <Prose>
          <p>
            Fees, replacement language, and salary bands elsewhere on this site are labeled sample figures. They are not an offer. A signed search agreement is the document that applies to a hire.
          </p>
          <p>
            Nothing on this page limits liability, grants a licence, or sets rules for using the site. Those clauses belong in a document a lawyer has reviewed.
          </p>
          <p>
            BridgeWide will replace this note before anyone is asked to accept terms. Until then, treat the page as a draft and not as legal advice.
          </p>
        </Prose>
      </PageSection>
    </>
  );
}
