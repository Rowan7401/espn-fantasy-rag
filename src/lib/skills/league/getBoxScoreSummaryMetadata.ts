import { index } from "@/lib/clients/pinecone";
import { BoxScoreSummary } from "@/lib/types/box-score-summary-metadata";

function isBoxScoreSummary(m: unknown): m is BoxScoreSummary {
    if (typeof m !== "object" || m === null) return false;
  
    const obj = m as Record<string, unknown>;
  
    return (
      obj.type === "box_scores_summary" &&
      typeof obj.owner === "string" &&
      typeof obj.team === "string" &&
      typeof obj.week === "number" &&
      typeof obj.season === "number" &&
      typeof obj.total_points === "number" &&
      typeof obj.zero_starts_count === "number" &&
      typeof obj.has_zero_start === "boolean" &&
      typeof obj.has_missed_opportunity === "boolean"
    );
  }

export async function getBoxScoreSummaries(
  season: number = 2025,
): Promise<BoxScoreSummary[]> {
  const res = await index.query({
    vector: new Array(1536).fill(0),
    topK: 550,
    includeMetadata: true,
    filter: {
      type: "box_scores_summary",
      season,
    },
  });

  const boxScores: BoxScoreSummary[] = [];

  for (const match of res.matches ?? []) {
    if (isBoxScoreSummary(match.metadata)) {
      boxScores.push(match.metadata);
    }
  }

  return boxScores;
}
