import { RoleTicketRow } from "@/components/roles/RoleTicketRow";
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

  return (
    <RevealGroup as="ul" className="grid list-none gap-1.5 p-0">
      {items.map((role) => (
        <RevealItem key={role.slug} as="li">
          <RoleTicketRow role={role} heading={headingLevel} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
