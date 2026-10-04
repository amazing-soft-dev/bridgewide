import { sampleFiguresNote } from "@/content/site";

export function SampleNote({ className }: { className?: string }) {
  return (
    <span
      className={`font-mono text-xs tracking-[0.18em] text-brand uppercase ${className ?? ""}`}
    >
      {sampleFiguresNote}
    </span>
  );
}
