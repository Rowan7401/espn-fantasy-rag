import { getBoxScoreSummaries } from "./getBoxScoreSummaryMetadata";

type BenchedPointsT = {
  owner: string;
  team: string;
  missedOpportunityCount: number;
};

export async function testBoxScoreWiring() {
  console.log(await getBoxScoreSummaries(2025));
}

export async function getTotalMissedOpportunities(
  season: number = 2025,
  order: "asc" | "desc" = "desc"
) {
  const boxScores = await getBoxScoreSummaries(season);

  const counts = new Map<string, MissedOpportunityCount>();

  for (const boxScore of boxScores) {
    const hasMissed = boxScore.has_missed_opportunity === true

    if (!hasMissed) continue;

    const key = boxScore.owner;
    const existing = counts.get(key);

    counts.set(key, {
      owner: boxScore.owner,
      team: boxScore.team,
      missedOpportunityCount: (existing?.missedOpportunityCount ?? 0) + 1,
    });
  }

  return Array.from(counts.values()).sort((a, b) =>
    order === "desc"
      ? b.missedOpportunityCount - a.missedOpportunityCount
      : a.missedOpportunityCount - b.missedOpportunityCount
  );
}