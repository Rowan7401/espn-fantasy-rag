export type Intent =
  | "weekly"       // Explicit week-by-week lookups (e.g., "Week 3 scores", "Who won in week 6")
  | "ranking"      // Standings, total points, leaderboards, benched metrics, draft ratios
  | "player_season_stats" // Real NFL player granular metrics (yardage, TDs, targets)
  | "comparison"   // Complex schedule analysis, trends, luck/unlucky metrics
  | "fact"         // Simple semantic queries (e.g., "What is the league buy-in?", "Who is the commissioner?")
  | "unknown";

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

  // Default Fallback: General League Rules / Chat Facts
  // If it doesn't fit a structural data skill, it's a semantic text-lookup fact.
  return "fact";
}

export function getRetrievalConfig(intent: Intent): { topK: number } {
  switch (intent) {
    case "player_season_stats": return { topK: 100 }; // Wide net to capture player stat cards
    case "weekly":       return { topK: 75 }; // Pull chunks relevant to that specific matchup frame
    case "comparison":   return { topK: 50 };  
    case "ranking":      return { topK: 30 };  // Heavy tool dependency; lower text context required
    case "fact":         return { topK: 20 };  // Tight, highly relevant vector chunks (rules, dates, history)
    default:             return { topK: 5 };
  }
}

// Logger
export function logIntent(query: string, intent: Intent, topK: number): void {
  // For local development visibility
  console.log(`📊 [INTENT LOG] Query: "${query}" | Detected: [${intent.toUpperCase()}] | Context TopK: ${topK}`);
}
