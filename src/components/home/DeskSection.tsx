import { PersonCard } from "@/components/ui/PersonCard";
import { TileWall } from "@/components/ui/TileWall";
import { images, people } from "@/content/site";

export default function DeskSection() {
  return (
    <TileWall
      headingId="desk-heading"
      eyebrow="The desk"
      title="Recruiters who did the job first."
      lede="Former engineers and managers. Each consultant keeps a region or a discipline, and stays on the search until someone starts."
      cta={{ href: "/about", label: "Meet the team" }}
      phrase="MEET THE DESK"
      image={images.desk}
      columns={people.length}
      clearance="bottom"
      cards={people.map((person) => ({
        id: person.id,
        node: (
          <PersonCard
            href={`/about#${person.id}`}
            name={person.name}
            line={person.role}
            focus={person.focus}
            badge={`${person.placementCount} placements`}
            image={person.image}
            alt={person.name}
            sizes="(max-width: 699px) 50vw, (max-width: 899px) 58vw, 18vw"
          />
        ),
      }))}
    />
  );
}
