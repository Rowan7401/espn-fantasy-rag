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
    typeof obj.projected_points_total === "number"
  );
}


export async function getExpectationSummary(
    season: number = 2025,
  ): Promise<ExpectationSummary[]> {
    const DUMMY_VECTOR = Array.from({ length: 1536 }, () => 0);

    const res = await  index.query({
        vector: DUMMY_VECTOR,
        topK: 200,
        includeMetadata: true,
        filter: {
          type: "expectation_vs_reality",
          season: season,
        },
      });
  
  
    const players: ExpectationSummary[] = [];
  
    for (const match of res.matches ?? []) {
  
      if (isExpectationSummary(match.metadata)) {
        players.push(match.metadata);
      }
    }
  
    return players;
  }
