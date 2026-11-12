import { JobBoard } from "@/components/ai-training/JobBoard";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { trainingRoles } from "@/content/ai-training";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Roles · AI training",
  description: "AI-training roles across coding, rating, and specialist tracks.",
  path: "/ai-training/jobs",
});

export default function TrainingJobsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "Roles", path: "/ai-training/jobs" }])} />
      <PageHero
        eyebrow="Jobs"
        title="Roles, until a live opening replaces them."
        lede="Filter by the kind of work and the region."
      />
      <PageSection id="board" label="Board" title="Filter the roles.">
        <JobBoard roles={trainingRoles} />
      </PageSection>
    </>
  );
}
