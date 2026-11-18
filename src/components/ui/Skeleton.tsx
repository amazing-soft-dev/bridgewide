type Tone = "ink" | "cloud";
type Surface = "ink" | "cloud" | "cloud-soft";

const surfaceClass: Record<Surface, string> = {
  ink: "bg-ink",
  cloud: "bg-cloud",
  "cloud-soft": "bg-cloud-soft",
};

export function Skeleton({
  tone = "ink",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`skeleton-shimmer block animate-skeleton motion-reduce:animate-none ${tone === "ink" ? "text-ink" : "text-cloud"} ${className}`}
    />
  );
}

/** Shaped stand-in for a home section while its chunk loads. */
export function SectionSkeleton({
  surface,
  minClass,
  cards = 3,
  compact = false,
  viewportOnly = false,
}: {
  surface: Surface;
  minClass: string;
  cards?: number;
  compact?: boolean;
  /** Keep a tall track, and limit the shimmer to the first viewport. */
  viewportOnly?: boolean;
}) {
  const tone: Tone = surface === "ink" ? "cloud" : "ink";

  if (compact) {
    return (
      <div className={`${minClass} ${surfaceClass[surface]} flex items-center`} aria-hidden>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4">
          <Skeleton tone={tone} className="h-3 w-40" />
          <Skeleton tone={tone} className="h-3 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${minClass} ${surfaceClass[surface]}`} aria-hidden>
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-16 ${
          viewportOnly ? "h-svh" : ""
        }`}
      >
        <Skeleton tone={tone} className="h-3 w-28" />
        <Skeleton tone={tone} className="h-10 w-2/3 max-w-lg" />
        <Skeleton tone={tone} className="h-4 w-1/2 max-w-md" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }, (_, index) => (
            <Skeleton key={index} tone={tone} className="h-36" />
          ))}
        </div>
      </div>
    </div>
  );
}
