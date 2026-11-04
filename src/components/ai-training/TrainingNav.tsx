import Link from "next/link";
import { trainingNav } from "@/content/ai-training";

export function TrainingNav() {
  return (
    <nav aria-label="AI training" className="border-b border-cloud-soft bg-cloud">
      <ul className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-5 gap-y-2 px-4 py-3">
        {trainingNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-mono text-xs tracking-[0.18em] text-brand uppercase no-underline hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
