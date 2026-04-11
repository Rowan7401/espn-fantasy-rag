// intent.ts

export type Intent =
  | "comparison"   // unlucky, consistency, trends
  | "ranking"      // best, worst, top
  | "weekly"       // week-specific queries
  | "fact"         // simple stat lookups
  | "unknown";     // fallback / non-league questions

/**
 * Detects user intent from a query string
 */
export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();

  // Comparison / analysis-heavy queries
  if (
    q.includes("unlucky") ||
    q.includes("luck") ||
    q.includes("close loss") ||
    q.includes("closest loss") ||
    q.includes("consistent") ||
    q.includes("consistency") ||
    q.includes("trend")
  ) {
    return "comparison";
  }

  // Rankings
  if (
    q.includes("best") ||
    q.includes("top") ||
    q.includes("worst") ||
    q.includes("rank")
  ) {
    return "ranking";
  }

  // Weekly queries
  if (q.includes("week")) {
    return "weekly";
  }

  // Simple fact-based queries
  if (
    q.includes("how many") ||
    q.includes("points") ||
    q.includes("score") ||
    q.includes("record") ||
    q.includes("did") ||
    q.includes("wins") ||
    q.includes("losses")
  ) {
    return "fact";
  }

  // Fallback
  return "unknown";
}

/**
 * Maps intent → Pinecone retrieval strategy
 */
export function getRetrievalConfig(intent: Intent): {
  topK: number;
} {
  switch (intent) {
    case "comparison":
      return { topK: 30 }; // needs broad dataset for analysis

    case "ranking":
      return { topK: 12 };

    case "weekly":
      return { topK: 5 };

    case "fact":
      return { topK: 3 };

    case "unknown":
    default:
      return { topK: 1 }; // minimal retrieval for irrelevant queries
  }
}

/**
 * Helper for debugging + observability
 */
export function logIntent(query: string, intent: Intent, topK: number) {
  console.log("[Intent Detection]", {
    query,
    intent,
    topK,
  });
}