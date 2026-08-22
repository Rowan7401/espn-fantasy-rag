import { TeamSummary } from "@/lib/types/team-summary-metadata";
import { getTeamSummaries } from "../../types/getTeamSummaryMetadata";

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

export async function getNthPunchingBagTeam({
  n,
  order = "desc",
  season = 2025
}: {
  n: number;
  order?: "asc" | "desc";
  season?: number;
}) {
  const teams = await getTeamSummaries(season);

  const sorted = sortTeamForPunchingBag(teams, order);

  if (n < 1 || n > sorted.length) {
    throw new Error(`Invalid rank requested. Total teams available: ${sorted.length}`);
  }

  return sorted[n - 1]; 
}