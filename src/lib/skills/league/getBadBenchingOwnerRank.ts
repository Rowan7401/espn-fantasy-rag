import { getBoxScoreSummaries } from "../../types/getBoxScoreSummaryMetadata";

type MissedOpportunityCount = {
  owner: string;
  team: string;
  missedOpportunityCount: number;
  missedBenchPoints: number;
};

export async function testBoxScoreWiring() {
  console.log(await getBoxScoreSummaries(2025));
}

export async function getTotalMissedOpportunities(
  season: number = 2025,
  order: "asc" | "desc" = "desc"
) {
  const boxScores = await getBoxScoreSummaries(season);

  const missedOpsMap = new Map<string, MissedOpportunityCount>();

  for (const boxScore of boxScores) {
    const hasMissed = boxScore.has_missed_opportunity === true

    if (!hasMissed) continue;

    const key = boxScore.owner;
    const currTeam = missedOpsMap.get(key);


    missedOpsMap.set(key, {
      owner: boxScore.owner,
      team: boxScore.team,
      missedOpportunityCount: (currTeam?.missedOpportunityCount ?? 0) + 1,
      missedBenchPoints: (currTeam?.missedBenchPoints ?? 0) + (boxScore.missed_bench_points ?? 0),
    });
  }

  return Array.from(missedOpsMap.values()).sort((a, b) =>
    order === "desc"
      ? b.missedOpportunityCount - a.missedOpportunityCount
      : a.missedOpportunityCount - b.missedOpportunityCount
  );
}