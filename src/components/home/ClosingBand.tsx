import { Button } from "@/components/ui/Button";
import { ClosingBand as Band } from "@/components/ui/ClosingBand";
import { hero, roles } from "@/content/site";

export function ClosingBand() {
  return (
    <Band
      headingId="close-heading"
      eyebrow="Start a search"
      title="Tell us the seat."
      copy="The brief needs a manager, a stack, and a band you will actually offer. The desk takes it from there."
      stamp="Open"
      count={roles.length}
      countLabel="roles open right now"
      actions={
        <>
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="onDark">
            {hero.secondaryCta.label}
          </Button>
        </>
      }
    />
  );
}
