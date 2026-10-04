import dynamic from "next/dynamic";
import { pageMetadata } from "@/components/pages/metadata";
import { AstraField } from "@/components/home/AstraField";
import { ClosingBand } from "@/components/home/ClosingBand";
import { Hero } from "@/components/home/Hero";
import { TwoDoors } from "@/components/home/TwoDoors";
import { hero } from "@/content/site";

export const metadata = pageMetadata({
  title: "BridgeWide — Engineers across four regions",
  description: hero.subcopy,
  path: "/",
});

const PlacedMarquee = dynamic(() => import("@/components/home/PlacedMarquee"), {
  ssr: true,
  loading: () => <div className="min-h-36 bg-ink" aria-hidden />,
});

const RegionsSection = dynamic(
  () => import("@/components/home/RegionsSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[36rem] bg-cloud" aria-hidden />,
  },
);

const WeekSection = dynamic(() => import("@/components/home/WeekSection"), {
  ssr: true,
  loading: () => <div className="min-h-[28rem] bg-ink" aria-hidden />,
});

const RolesPreview = dynamic(() => import("@/components/home/RolesPreview"), {
  ssr: true,
  loading: () => <div className="min-h-[32rem] bg-cloud" aria-hidden />,
});

const RecordSection = dynamic(() => import("@/components/home/RecordSection"), {
  ssr: true,
  loading: () => <div className="min-h-80 bg-ink" aria-hidden />,
});

const DeskSection = dynamic(() => import("@/components/home/DeskSection"), {
  ssr: true,
  loading: () => <div className="min-h-[40rem] bg-ink" aria-hidden />,
});

const SalaryPreview = dynamic(() => import("@/components/home/SalaryPreview"), {
  ssr: true,
  loading: () => <div className="min-h-[36rem] bg-cloud" aria-hidden />,
});

const StoriesSection = dynamic(
  () => import("@/components/home/StoriesSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[40rem] bg-cloud-soft" aria-hidden />,
  },
);

const InsightsSection = dynamic(
  () => import("@/components/home/InsightsSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-96 bg-cloud" aria-hidden />,
  },
);

const FaqSection = dynamic(() => import("@/components/home/FaqSection"), {
  ssr: true,
  loading: () => <div className="min-h-[32rem] bg-cloud-soft" aria-hidden />,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TwoDoors />
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
      <AstraField />
    </>
  );
}
