import { BoxScoreSummary } from "@/lib/types/box-score-summary-metadata";
import { getBoxScoreSummaries } from "./getBoxScoreSummaryMetadata";

type OwnerWeeklyStats = {
  owner: string;
  team: string;
  week: number;
  totalPoints: number;
  rank: number;
};

export async function getWeeklyRankingsAndAwards(season: number = 2025): Promise<Map<number, OwnerWeeklyStats[]>> {
  const boxScores = await getBoxScoreSummaries(season);

  const weeksMap = new Map<number, BoxScoreSummary[]>();

  for (const score of boxScores) {
    if (score.total_points === undefined || score.total_points === null) continue;
    
    if (!weeksMap.has(score.week)) {
      weeksMap.set(score.week, []);
    }
    weeksMap.get(score.week)!.push(score);
  }

  const finalWeeklyRankings = new Map<number, OwnerWeeklyStats[]>();

  for (const [week, weeklyScores] of weeksMap.entries()) {
    // Sort this week's scores highest to lowest
    const sortedWeek = [...weeklyScores].sort((a, b) => b.total_points - a.total_points);

    if (sortedWeek.length === 0) continue;

    // Map raw data into our clean types with ranks included
    const rankedPlayers: OwnerWeeklyStats[] = sortedWeek.map((score, index) => ({
      owner: score.owner,
      team: score.team,
      week: week,
      totalPoints: score.total_points,
      rank: index + 1 // 1st, 2nd, 3rd...
    }));

    finalWeeklyRankings.set(week, rankedPlayers);
  }

  return finalWeeklyRankings;
}