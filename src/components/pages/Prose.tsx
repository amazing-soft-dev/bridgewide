import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return <div className="grid max-w-2xl gap-6 text-lg leading-8 text-ink-soft">{children}</div>;
}
