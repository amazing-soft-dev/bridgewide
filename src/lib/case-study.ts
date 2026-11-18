import type { Story } from "@/content/site";

/** Every story tells its three paragraphs in this order. */
export const caseStudyLabels = ["Challenge", "Approach", "Result"] as const;

/** A story's body as labelled blocks: what the client needed, what the desk did, how it ended. */
export function caseStudySections(story: Pick<Story, "body">): { label: (typeof caseStudyLabels)[number]; text: string }[] {
  return story.body.map((text, index) => ({ label: caseStudyLabels[index], text }));
}

/** The person quoted, without the title and company: "Amira Shah" from "Amira Shah, VP Engineering, Northline". */
export function quoteSpeaker(attribution: string): string {
  return attribution.split(",")[0].trim();
}
