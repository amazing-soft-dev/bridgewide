import { PinnedSteps } from "@/components/ui/PinnedSteps";
import { trainingSteps } from "@/content/ai-training";

const stepImages = [
  "/images/training-path-1.webp",
  "/images/training-path-2.webp",
  "/images/training-path-3.webp",
  "/images/training-path-4.webp",
] as const;

export function PathSteps() {
  return (
    <PinnedSteps
      id="path"
      headingId="path-heading"
      eyebrow="The path"
      title="Apply, match, brief, start."
      lede="The desk aims to review an application within three business days."
      steps={trainingSteps.map((step, index) => ({
        key: step.title,
        label: `0${index + 1}`,
        title: step.title,
        copy: step.copy,
      }))}
      images={stepImages}
      trackHeight="h-[440vh]"
      revealSpan={0.2}
    />
  );
}
