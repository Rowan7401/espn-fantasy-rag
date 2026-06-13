// intent.ts

export type Intent =
  | "weekly"       // week-specific metrics (getWeeklyPtsRank)
  | "ranking"      // aggregate leaderboards, draft picks, custom ranks
  | "comparison"   // heavy cross-referencing, unlucky teams, trends
  | "player_stats" // deep lookups on touchdowns, yardage, metrics
  | "fact"         // fast single-stat questions
  | "unknown";     // outside league scope

export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();

  if (q.includes("week")) return "weekly";
  
  if (
    q.includes("best") || q.includes("worst") || q.includes("top") || 
    q.includes("rank") || q.includes("leaderboard") || q.includes("ratio")
  ) {
    return "ranking";
  }

  if (
    q.includes("unlucky") || q.includes("luck") || q.includes("punching bag") ||
    q.includes("close loss") || q.includes("trend") || q.includes("consistency")
  ) {
    return "comparison";
  }

  if (
    q.includes("touchdown") || q.includes("td") || q.includes("yard") || 
    q.includes("yac") || q.includes("rushing") || q.includes("receiving")
  ) {
    return "player_stats";
  }

  if (
    q.includes("how many") || q.includes("points") || q.includes("score") || 
    q.includes("record") || q.includes("wins") || q.includes("losses")
  ) {
    return "fact";
  }

  return "unknown";
}

export function getRetrievalConfig(intent: Intent): { topK: number } {
  switch (intent) {
    case "comparison":   return { topK: 150 }; // massive context for heavy trends
    case "player_stats": return { topK: 350 }; // moderate context for player cards
    case "ranking":      return { topK: 100 };
    case "weekly":       return { topK: 250 };
    case "fact":         return { topK: 75 };
    default:             return { topK: 1 };
  }
}