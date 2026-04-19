import { index } from "@/lib/clients/pinecone";
import { ExpectationSummary } from "@/lib/types/expectation-vs-reality-metadata";


function isExpectationSummary(m: unknown): m is ExpectationSummary {
  if (typeof m !== "object" || m === null) return false;

  const obj = m as Record<string, unknown>;

  return (
    obj.type === "expectation_vs_reality" &&
    typeof obj.value_ratio === "number" &&
    typeof obj.actual_avg_points === "number" &&
    typeof obj.team === "string" &&
    typeof obj.player === "string" &&
    typeof obj.actual_points_total === "number" &&
    typeof obj.position === "string" &&
    typeof obj.projected_avg_points === "number" &&
    typeof obj.projected_points_total === "string"
  );
}

export async function getExepectationSummary(
  season: number = 2025,
): Promise<ExpectationSummary[]> {
  const res = await index.query({
    vector: new Array(1536).fill(0),
    topK: 12,
    includeMetadata: true,
    filter: {
      type: "team_summary",
      season,
    },
  });

  const teams: ExpectationSummary[] = [];

  for (const match of res.matches ?? []) {
    if (isExpectationSummary(match.metadata)) {
      teams.push(match.metadata);
    }
  }

  return teams;
}
