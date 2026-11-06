import { PersonCard } from "@/components/ui/PersonCard";
import { TileWall } from "@/components/ui/TileWall";
import { portraits } from "@/content/ai-training";

export function PortraitWall() {
  return (
    <TileWall
      id="talent"
      headingId="talent-heading"
      eyebrow="Sample profiles"
      title="The team."
      accent
      lede="These people are samples. They are not candidates BridgeWide has placed."
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
