import Link from "next/link";
import { SampleNote } from "@/components/pages/SampleNote";
import { regionFor, textLink } from "@/components/pages/format";
import { HoverLift } from "@/components/ui/HoverLift";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { Role } from "@/content/site";

export function RoleList({
  items,
  headingLevel = "h3",
}: {
  items: readonly Role[];
  headingLevel?: "h2" | "h3";
}) {
  if (items.length === 0) {
    return <p className="text-ink-soft">No open roles in this region right now.</p>;
  }

  const Heading = headingLevel;

  return (
    <RevealGroup className="grid gap-10">
      {items.map((role) => {
        const region = regionFor(role.region);
        return (
          <RevealItem key={role.slug}>
            <HoverLift>
            <article className="border-t border-brand pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <Heading className="font-display text-2xl text-ink md:text-3xl">
                  <Link href={`/roles/${role.slug}`} className={textLink}>
                    {role.title}
                  </Link>
                </Heading>
                {role.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs tracking-[0.18em] text-brand uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-stone">
                {region.name} · {role.city} · {role.workMode} · {role.engagement} · {role.discipline}
              </p>
              <p className="mt-4 text-ink">
                <SampleNote /> <span className="ml-2">{role.salary}</span>
              </p>
              <p className="mt-4 max-w-3xl leading-7 text-ink-soft">{role.summary}</p>
            </article>
            </HoverLift>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
