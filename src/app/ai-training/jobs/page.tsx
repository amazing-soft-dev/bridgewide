import { JobBoard } from "@/components/ai-training/JobBoard";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { trainingRoles } from "@/content/ai-training";

export const metadata = pageMetadata({
  title: "Example roles · AI training · BridgeWide",
  description:
    "Example AI-training roles across coding, rating, and specialist tracks. Each listing is marked Example role.",
  path: "/ai-training/jobs",
});

export default function TrainingJobsPage() {
  return (
    <>
      <PageHero
        eyebrow="Jobs"
        title="Example roles, until a live opening replaces them."
        lede="Filter by the kind of work and the region. Every card is an example, with an Example role badge."
      />
      <PageSection id="board" label="Board" title="Filter the examples.">
        <JobBoard roles={trainingRoles} />
      </PageSection>
    </>
  );
}
