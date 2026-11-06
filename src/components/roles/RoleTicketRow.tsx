import { formatCompactSalary } from "@/components/pages/format";
import { JobTicket } from "@/components/ui/JobTicket";
import type { Role } from "@/content/site";
import { firstTag, isNewTag, placeLine } from "@/lib/role-desk";

/** A site role as a JobTicket. Used by the roles desk, the region pages, and the home preview. */
export function RoleTicketRow({
  role,
  age,
  heading,
}: {
  role: Role;
  /** "19 days", shown on the widest layout. */
  age?: string;
  heading?: "h2" | "h3";
}) {
  const tag = firstTag(role);

  return (
    <JobTicket
      href={`/roles/${role.slug}`}
      code={role.boardCode}
      title={role.title}
      summary={role.summary}
      place={placeLine(role)}
      kind={role.engagement}
      pay={formatCompactSalary(role.salaryMin, role.salaryUnit)}
      tag={tag}
      tagTone={isNewTag(tag) ? "brand" : "quiet"}
      age={age}
      heading={heading}
    />
  );
}
