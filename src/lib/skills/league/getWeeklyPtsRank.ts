import { BoxScoreSummary } from "@/lib/types/box-score-summary-metadata";
import { getBoxScoreSummaries } from "./getBoxScoreSummaryMetadata";

type OwnerWeeklyStats = {
  owner: string;
  team: string;
  week: number;
  totalPoints: number;
  rank: number;
  topPlayerName: string; 
  topPlayerFloorPts: number;
};

// Defensive helper to parse the cold hard data out of the broken "Name (XX" string
function parseTopPlayerMetadata(topPlayersStr: string | undefined): { name: string; floorPts: number } {
  const fallback = { name: "Unknown", floorPts: 0 };
  
  if (!topPlayersStr || typeof topPlayersStr !== "string") return fallback;

  try {
    const parts = topPlayersStr.split("(");
    
    if (parts.length >= 1) {
      const cleanName = parts[0].trim();
      
      // Defensively parse whatever integer digits made it past the cutoff
      const rawPoints = parts[1] ? parseInt(parts[1].trim(), 10) : 0;
      const cleanPoints = isNaN(rawPoints) ? 0 : rawPoints;

      return {
        name: cleanName || "Unknown",
        floorPts: cleanPoints
      };
    }
  } catch (e) {
    return fallback;
  }

  return fallback;
}

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
    const sortedWeek = [...weeklyScores].sort((a, b) => b.total_points - a.total_points);

    if (sortedWeek.length === 0) continue;

    const rankedPlayers: OwnerWeeklyStats[] = sortedWeek.map((score, index) => {
      // Execute the structural string split
      const topPlayerData = parseTopPlayerMetadata(score.top_players);

      return {
        owner: score.owner,
        team: score.team,
        week: week,
        totalPoints: score.total_points,
        rank: index + 1,
        topPlayerName: topPlayerData.name,
        topPlayerFloorPts: topPlayerData.floorPts
      };
    });

    finalWeeklyRankings.set(week, rankedPlayers);
  }

  return finalWeeklyRankings;
}