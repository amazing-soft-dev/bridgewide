import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { trainingMission } from "@/content/ai-training";

export const metadata = pageMetadata({
  title: "About · AI training · BridgeWide",
  description: trainingMission,
  path: "/ai-training/about",
});

export default function AiTrainingAboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="A second desk, for AI-training work." lede={trainingMission} />
      <PageSection id="who" label="Who it is for" title="Candidates and partners.">
        <Prose>
          <p>
            Candidates are people who can do the work public AI-training platforms post. That includes
            software, data, AI, writing, STEM, multilingual tasks, and other specialist tracks. The work
            is remote and can be part-time, about ten hours a week, or full-time. The platform pays in
            USD.
          </p>
          <p>
            Partners are the platforms and labs that need a pre-screened pipeline. BridgeWide briefs,
            sources, screens, and delivers a shortlist so a cohort can grow without a larger internal
            recruiting team.
          </p>
          <p>
            This desk sits beside the staffing practice. Companies that want to hire an engineer onto
            their own team still use the{" "}
            <Link href="/employers" className={textLink}>
              employers page
            </Link>
            . The company story is on{" "}
            <Link href="/about" className={textLink}>
              About
            </Link>
            .
          </p>
        </Prose>
      </PageSection>
    </>
  );
}
