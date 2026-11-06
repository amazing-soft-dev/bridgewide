import { RoleTicketRow } from "@/components/roles/RoleTicketRow";
import { Button } from "@/components/ui/Button";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { roles } from "@/content/site";

export default function RolesPreview() {
  const preview = roles.slice(0, 4);

  return (
    <section
      className="seam-left relative z-10 bg-cloud pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="roles-heading"
    >
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="roles-heading"
            eyebrow="Now hiring"
            title="Open roles"
            lede="Four of the seats that are live. The full list is on the roles page."
          />
          <Button href="/roles" variant="secondary">
            See all roles
          </Button>
        </div>
        <RevealGroup as="ul" className="mt-8 grid list-none gap-1.5 p-0">
          {preview.map((role) => (
            <RevealItem key={role.slug} as="li">
              <RoleTicketRow role={role} heading="h3" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
