import { HireForm } from "@/components/forms/HireForm";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { Button } from "@/components/ui/Button";
import { fees, images, sampleFiguresNote, week } from "@/content/site";

export const metadata = pageMetadata({
  title: "Employers · BridgeWide",
  description:
    "How a company hires with BridgeWide: a week from brief to offer, sample fees, and a form to open a search.",
  path: "/employers",
});

export default function EmployersPage() {
  return (
    <>
      <PageHero
        eyebrow="Employers"
        title="A shortlist your managers will interview."
        lede="Tell us the stack, the hiring manager, and what the first ninety days need. We source from the USA, Canada, Latin America, and Europe, and we stay on the search until the engineer starts."
        image={{
          src: images.employers,
          alt: "Photograph for companies hiring engineers",
        }}
      >
        <Button href="#brief">Open a search</Button>
        <Button href="/roles" variant="secondary">
          See open roles
        </Button>
      </PageHero>
      <PageSection
        id="how"
        label="The search"
        title="How a company hires"
        lede="The brief is one page. The week that follows is the same shape whether the seat is permanent or contract."
      >
        <ol className="grid gap-8 md:grid-cols-3">
          <li className="border-t border-brand pt-4">
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">01</p>
            <h3 className="font-display mt-3 text-2xl">Name the bar</h3>
            <p className="mt-3 leading-7 text-ink-soft">
              The hiring manager, the system the hire will own, the salary band you will actually offer, and the interview loop.
            </p>
          </li>
          <li className="border-t border-brand pt-4">
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">02</p>
            <h3 className="font-display mt-3 text-2xl">Read the shortlist</h3>
            <p className="mt-3 leading-7 text-ink-soft">
              A long list arrives with notes on depth. The shortlist that follows carries salary, notice, and a plain reason each engineer fits.
            </p>
          </li>
          <li className="border-t border-brand pt-4">
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">03</p>
            <h3 className="font-display mt-3 text-2xl">Stay through the start</h3>
            <p className="mt-3 leading-7 text-ink-soft">
              Offers go out with the desk still on the thread. A confidential search holds the company name until a first conversation.
            </p>
          </li>
        </ol>
      </PageSection>
      <PageSection
        id="week"
        label="The week"
        title="Monday brief. Friday offer."
        tone="ink"
      >
        <ol className="grid gap-8 md:grid-cols-5">
          {week.map((step) => (
            <li key={step.id} className="border-t border-brand pt-4">
              <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">{step.day}</p>
              <h3 className="font-display mt-3 text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-cloud-soft">{step.copy}</p>
            </li>
          ))}
        </ol>
      </PageSection>
      <PageSection
        id="fees"
        label={sampleFiguresNote}
        title="Fees"
        lede="These figures are a sample of usual terms. The signed search agreement is the one that applies."
      >
        <ul className="grid gap-6 md:grid-cols-3">
          <li className="border-t border-brand pt-4">
            <h3 className="font-display text-2xl">Permanent</h3>
            <p className="mt-3 leading-7 text-ink-soft">{fees.permanent}</p>
          </li>
          <li className="border-t border-brand pt-4">
            <h3 className="font-display text-2xl">Contract</h3>
            <p className="mt-3 leading-7 text-ink-soft">{fees.contract}</p>
          </li>
          <li className="border-t border-brand pt-4">
            <h3 className="font-display text-2xl">Guarantee</h3>
            <p className="mt-3 leading-7 text-ink-soft">{fees.guarantee}</p>
          </li>
        </ul>
      </PageSection>
      <PageSection
        id="brief"
        label="Brief"
        title="Tell us the seat"
        lede="Company, role, region, and what good looks like. We reply from the desk."
      >
        <HireForm />
      </PageSection>
    </>
  );
}
