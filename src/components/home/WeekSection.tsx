import { PinnedSteps } from "@/components/ui/PinnedSteps";
import { images, week } from "@/content/site";

const weekImages = [
  images.hero,
  images.employers,
  images.engineers,
  images.desk,
  images.close,
] as const;

export default function WeekSection() {
  return (
    <PinnedSteps
      headingId="week-heading"
      eyebrow="How a search runs"
      title="The week"
      lede="Monday we take the brief. Friday the offer is on its way, with the desk still on the thread."
      steps={week.map((step) => ({ key: step.id, label: step.day, title: step.title, copy: step.copy }))}
      images={weekImages}
      stamp={week[week.length - 1]?.title}
      seam="right"
      trackHeight="h-[560vh]"
      revealSpan={0.16}
    />
  );
}
