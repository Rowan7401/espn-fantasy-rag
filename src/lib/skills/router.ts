export function routeQuery(query: string): string {
    const q = query.toLowerCase();
  
    if (q.includes("worst") || q.includes("lowest record")) {
      return "worst_team";
    }
  
    if (q.includes("best") || q.includes("top team")) {
      return "best_team";
    }
  
    return "rag";
  }
  