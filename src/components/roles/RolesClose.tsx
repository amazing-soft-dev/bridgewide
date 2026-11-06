import { Button } from "@/components/ui/Button";
import { ClosingBand } from "@/components/ui/ClosingBand";
import { hero, roles } from "@/content/site";

export function RolesClose() {
  return (
    <ClosingBand
      headingId="roles-close-heading"
      title="Tell us the seat."
      copy="A brief or a CV. Either way a consultant, not a form, gets back to you."
      stamp="Open"
      count={roles.length}
      countLabel="roles open right now"
      wide
      actions={
        <>
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href="/engineers" variant="onDark">
            Send a CV
          </Button>
        </>
      }
    />
  );
}
