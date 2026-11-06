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
      phraseCol={4}
      image="/images/training-team.webp"
      imagePosition="center 30%"
      trackHeight="h-[280vh]"
      columns={portraits.length}
    >
      {portraits.map((person) => (
        <li key={person.id}>
          <PersonCard
            name={person.name}
            line={person.place}
            focus={person.focus}
            badge={person.place}
            image={person.image}
            sizes="(max-width: 899px) 68vw, 25vw"
          />
        </li>
      ))}
    </TileWall>
  );
}
