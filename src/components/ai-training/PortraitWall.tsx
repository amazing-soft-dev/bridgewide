import { PersonCard } from "@/components/ui/PersonCard";
import { TileWall } from "@/components/ui/TileWall";
import { portraits } from "@/content/ai-training";

export function PortraitWall() {
  return (
    <TileWall
      id="talent"
      headingId="talent-heading"
      eyebrow="The talent"
      title="The team."
      accent
      lede="The people the desk matches to platforms: engineers, writers, and specialists, placed by region, language, and track."
      phrase="THE TEAM"
      image="/images/training-team.webp"
      imagePosition="center 30%"
      trackHeight="h-[280vh]"
      columns={portraits.length}
      // The portraits are 4:5. The card keeps that ratio and sits narrower in its column so the
      // row still fits the stage. This wall has no button under its lede, so a short viewport
      // caps the photo later than the desk wall does, and the crop then holds the face.
      cardClassName="justify-center [&_article>span:first-child]:aspect-[4/5] [&_img]:object-[50%_18%] min-[900px]:[&>article]:max-w-[15rem] min-[900px]:[&_article>span:first-child]:max-h-[max(6rem,calc(100vh_-_29rem))]"
      cards={portraits.map((person) => ({
        id: person.id,
        node: (
          <PersonCard
            name={person.name}
            line={person.place}
            focus={person.focus}
            badge={person.place}
            image={person.image}
            sizes="(max-width: 699px) 50vw, (max-width: 899px) 58vw, 25vw"
          />
        ),
      }))}
    />
  );
}
