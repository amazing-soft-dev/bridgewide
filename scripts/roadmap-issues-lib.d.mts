export function normalizeTitle(title: string): string;

export type RoadmapItem = [branch: string, title: string, body: string];

export function planIssues(
  items: readonly RoadmapItem[],
  existingTitles: readonly string[],
): {
  create: { branch: string; title: string; body: string }[];
  skip: { branch: string; title: string }[];
};

export function issueBody(item: { branch: string; body: string }): string;
