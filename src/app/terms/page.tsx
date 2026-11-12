import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { pageMetadata } from "@/components/pages/metadata";
import { fees } from "@/content/site";

export const metadata = pageMetadata({
  title: "Terms",
  description: "The published fees and the 12-week replacement for a BridgeWide search.",
  path: "/terms",
  robots: { index: false, follow: true },
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Fees and the replacement search."
        lede="A signed search agreement is the document that applies. These terms restate the fees published on the site. A lawyer reviews them before they are indexed."
      />
      <PageSection id="fees" label="Fees" title="What a search costs">
        <Prose>
          <p>{fees.permanent}</p>
          <p>{fees.contract}</p>
          <p>
            {fees.guarantee} The clock starts on the engineer&apos;s start date. The reopen is once, and it covers a permanent hire. It does not cover a contract seat, a resignation the agreement excludes, or a termination the agreement treats as outside the guarantee. The signed agreement wins if it differs from this page.
          </p>
          <p>
            AI-training candidates are paid by the platform. BridgeWide does not take a cut of those earnings and does not pay the candidate. A profile is introduced only after the candidate agrees.
          </p>
        </Prose>
      </PageSection>
    </>
  );
}
