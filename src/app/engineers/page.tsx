import { CvForm } from "@/components/forms/CvForm";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { Button } from "@/components/ui/Button";
import { images } from "@/content/site";

export const metadata = pageMetadata({
  title: "Engineers · BridgeWide",
  description:
    "The candidate path is free and confidential. Send a CV and your consultant shares the band before your name goes to a company.",
  path: "/engineers",
});

const path = [
  {
    title: "Free",
    copy: "Companies pay BridgeWide. Engineers do not pay a fee to be introduced, interviewed, or hired.",
  },
  {
    title: "Confidential",
    copy: "Your consultant tells you the band, the city or remote setup, and the hiring manager before your name goes across. A company can keep its own name inside a small group until that first conversation.",
  },
  {
    title: "A CV, then a conversation",
    copy: "Send a CV and the region you want. If a role is live, you hear the brief before anyone at the company sees your name.",
  },
] as const;

export default function EngineersPage() {
  return (
    <>
      <PageHero
        eyebrow="Engineers"
        title="Your name stays with us until the brief is real."
        lede="BridgeWide places software engineers for companies. The path for candidates is free, and an introduction only happens after you know the band and the manager."
        image={{
          src: images.engineers,
          alt: "Photograph for engineers looking for a role",
        }}
      >
        <Button href="#cv">Send a CV</Button>
        <Button href="/roles" variant="secondary">
          See open roles
        </Button>
      </PageHero>
      <PageSection id="path" label="The path" title="Free, then confidential, then a conversation." tone="ink">
        <ol className="grid gap-8 md:grid-cols-3">
          {path.map((step, index) => (
            <li key={step.title} className="border-t border-brand pt-4">
              <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
                0{index + 1}
              </p>
              <h3 className="font-display mt-3 text-2xl">{step.title}</h3>
              <p className="mt-3 leading-7 text-cloud-soft">{step.copy}</p>
            </li>
          ))}
        </ol>
      </PageSection>
      <PageSection
        id="cv"
        label="CV"
        title="Send a CV"
        lede="PDF, DOC, or DOCX. Tell us which of the four regions you want to work in."
      >
        <CvForm />
      </PageSection>
    </>
  );
}
