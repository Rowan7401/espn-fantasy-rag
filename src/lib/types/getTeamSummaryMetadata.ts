import { index } from "@/lib/clients/pinecone";
import { TeamSummary } from "@/lib/types/team-summary-metadata";

function isTeamSummary(m: unknown): m is TeamSummary {
  if (typeof m !== "object" || m === null) return false;

  const obj = m as Record<string, unknown>;

  return (
    obj.type === "team_summary" &&
    typeof obj.wins === "number" &&
    typeof obj.losses === "number" &&
    typeof obj.team === "string" &&
    typeof obj.points_for === "number" &&
    typeof obj.points_against === "number" 
  );
}

export async function getTeamSummaries(
  season: number = 2025,
): Promise<TeamSummary[]> {
  const res = await index.query({
    vector: new Array(1536).fill(0),
    topK: 12,
    includeMetadata: true,
    filter: {
      type: "team_summary",
      season,
    },
  });

  const teams: TeamSummary[] = [];

  for (const match of res.matches ?? []) {
    if (isTeamSummary(match.metadata)) {
      teams.push(match.metadata);
    }
  }

  return teams;
}
