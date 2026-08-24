export type Intent =
  | "weekly"       // Explicit week-by-week lookups (e.g., "Week 3 scores", "Who won in week 6")
  | "ranking"      // Standings, total points, leaderboards, benched metrics, draft ratios
  | "player_season_stats" // Real NFL player granular metrics (yardage, TDs, targets)
  | "comparison"   // Complex schedule analysis, trends, luck/unlucky metrics
  | "fact"         // Classic RAG lookup
  | "unknown";    // Unclear request; retrieve a small amount and let the model figure it out

export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();

  // Schedule luck and trends
  if (
    q.includes("unlucky") || q.includes("luck") || q.includes("lucky") ||
    q.includes("punching bag") || q.includes("schedule strength") || q.includes("sos")
  ) {
    return "comparison";
  }

  // Weekly Context (Check for explicit structural patterns like "week 4" or "w3")
  if (q.includes("week") || /\bw\d{1,2}\b/.test(q)) {
    return "weekly";
  }

  // Macro League Leaderboards / Records
  if (
    q.includes("best") || q.includes("worst") || q.includes("top") ||
    q.includes("rank") || q.includes("leaderboard") || q.includes("standing") ||
    q.includes("record") || q.includes("win") || q.includes("loss") ||
    q.includes("scrappy") || q.includes("bench") || q.includes("ratio") ||
    q.includes("most points") || q.includes("highest scoring")
  ) {
    return "ranking";
  }

  // Granular Player Stats (NFL specific attributes)
  // If they are asking about yardage/TDs, we immediately want a wide player vector context.
  if (
    /\b(td|tds|touchdown|touchdowns|yard|yards|yac|rushing|receiving|passing|target|targets|reception|receptions|points)\b/.test(q)
  ) {
    return "player_season_stats";
  }

  // Known league facts / semantic lookups
  if (
    q.includes("commissioner") ||
    q.includes("commish") ||
    q.includes("rules") ||
    q.includes("scoring") ||
    q.includes("draft") ||
    q.includes("trade") ||
    q.includes("waiver") ||
    q.includes("league") ||
    q.includes("season")
  ) {
    return "fact";
  }

  // Default Fallback: General League Rules / Chat Facts
  // If it doesn't fit skills or relate to fantasy football, fallback to unknown.
  return "unknown";
}

export function getRetrievalConfig(intent: Intent): { topK: number } {
  switch (intent) {
    case "player_season_stats": return { topK: 100 };
    case "weekly": return { topK: 75 };
    case "comparison": return { topK: 50 };
    case "ranking": return { topK: 30 };
    case "fact": return { topK: 20 };
    case "unknown": return { topK: 10 };
    default: return { topK: 3 };
  }
}

// Logger
export function logIntent(query: string, intent: Intent, topK: number): void {
  // For local development visibility
  console.log(`📊 [INTENT LOG] Query: "${query}" | Detected: [${intent.toUpperCase()}] | Context TopK: ${topK}`);
}
