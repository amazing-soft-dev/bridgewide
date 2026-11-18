import dynamic from "next/dynamic";
import { pageMetadata } from "@/components/pages/metadata";
import { AiTrainingBand } from "@/components/home/AiTrainingBand";
import { ClosingBand } from "@/components/home/ClosingBand";
import { Hero } from "@/components/home/Hero";
import { TwoDoors } from "@/components/home/TwoDoors";
import { SectionSkeleton } from "@/components/ui/Skeleton";
import { hero } from "@/content/site";

export const metadata = pageMetadata({
  title: { absolute: "BridgeWide — Engineers across five regions" },
  description: hero.subcopy,
  path: "/",
});

const PlacedMarquee = dynamic(() => import("@/components/home/PlacedMarquee"), {
  ssr: true,
  loading: () => <SectionSkeleton surface="ink" minClass="min-h-36" compact />,
});

const RegionsSection = dynamic(
  () => import("@/components/home/RegionsSection"),
  {
    ssr: true,
    loading: () => <SectionSkeleton surface="cloud" minClass="min-h-[36rem]" />,
  },
);

const WeekSection = dynamic(() => import("@/components/home/WeekSection"), {
  ssr: true,
  loading: () => <SectionSkeleton surface="ink" minClass="min-h-[28rem]" />,
});

const RolesPreview = dynamic(() => import("@/components/home/RolesPreview"), {
  ssr: true,
  loading: () => <SectionSkeleton surface="cloud" minClass="min-h-[32rem]" />,
});

const RecordSection = dynamic(() => import("@/components/home/RecordSection"), {
  ssr: true,
  loading: () => <SectionSkeleton surface="ink" minClass="min-h-80" cards={4} />,
});

const DeskSection = dynamic(() => import("@/components/home/DeskSection"), {
  ssr: true,
  loading: () => <SectionSkeleton surface="ink" minClass="min-h-[40rem]" />,
});

const SalaryPreview = dynamic(() => import("@/components/home/SalaryPreview"), {
  ssr: true,
  loading: () => <SectionSkeleton surface="cloud" minClass="min-h-[36rem]" />,
});

const StoriesSection = dynamic(
  () => import("@/components/home/StoriesSection"),
  {
    ssr: true,
    loading: () => <SectionSkeleton surface="ink" minClass="min-h-[400vh]" viewportOnly />,
  },
);

const InsightsSection = dynamic(
  () => import("@/components/home/InsightsSection"),
  {
    ssr: true,
    loading: () => <SectionSkeleton surface="cloud" minClass="min-h-96" />,
  },
);

const FaqSection = dynamic(() => import("@/components/home/FaqSection"), {
  ssr: true,
  loading: () => <SectionSkeleton surface="cloud-soft" minClass="min-h-[32rem]" cards={2} />,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TwoDoors />
      <AiTrainingBand />
      <PlacedMarquee />
      <RegionsSection />
      <WeekSection />
      <RolesPreview />
      <RecordSection />
      <DeskSection />
      <SalaryPreview />
      <StoriesSection />
      <InsightsSection />
      <FaqSection />
      <ClosingBand />
    </>
  );
}
