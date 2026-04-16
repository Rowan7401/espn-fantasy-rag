import { TeamSummary } from "@/lib/types/team-summary-metadata";
import { getTeamSummaries } from "./getTeamSummaryMetadata";

export function sortTeamForPunchingBag(
  teams: TeamSummary[],
  order: "asc" | "desc" = "desc"
): TeamSummary[] {
  return [...teams].sort((a, b) => {
    return order === "desc"
      ? b.points_against - a.points_against
      : a.points_against - b.points_against;
  });
}

export async function getNthBestRankingTeam(
    n: number,
    season: number = 2025
  ) {
    const teams = await getTeamSummaries(season);
  
    const sorted = sortTeamForPunchingBag(teams, "desc");
  
    if (n < 1 || n > sorted.length) {
      throw new Error("Invalid rank requested");
    }
  
    return sorted[n - 1]; 
  }
