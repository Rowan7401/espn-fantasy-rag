import { TeamSummary } from "@/lib/types/team-summary-metadata";
import { getTeamSummaries } from "./getTeamSummaryMetadata";

export function sortTeamByWins(
  teams: TeamSummary[],
  order: "asc" | "desc" = "desc"
): TeamSummary[] {
  return [...teams].sort((a, b) => {
    return order === "desc"
      ? b.wins - a.wins
      : a.wins - b.wins;
  });
}

export async function getNthBestRankingTeam(
    n: number,
    season: number = 2025
  ) {
    const teams = await getTeamSummaries(season);
  
    const sorted = sortTeamByWins(teams, "desc");
  
    if (n < 1 || n > sorted.length) {
      throw new Error("Invalid rank requested");
    }
  
    return sorted[n - 1]; 
  }
