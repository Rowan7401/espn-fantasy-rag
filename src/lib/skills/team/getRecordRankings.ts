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

export async function getNthBestRankingTeam({
  n,
  order = "desc", 
  season = 2025
}: {
  n: number;
  order?: "asc" | "desc";
  season?: number;
}) {
  const teams = await getTeamSummaries(season);

  const sorted = sortTeamByWins(teams, order);

  if (n < 1 || n > sorted.length) {
    throw new Error(`Invalid rank requested. Total teams available: ${sorted.length}`);
  }

  return sorted[n - 1]; 
}