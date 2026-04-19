import { ExpectationSummary } from "@/lib/types/expectation-vs-reality-metadata";
import { getExepectationSummary } from "./getExpectationMetadata";


export function sortPlayerByValueRatio(
  teams: ExpectationSummary[],
  order: "asc" | "desc" = "desc"
): ExpectationSummary[] {
  return [...teams].sort((a, b) => {
    return order === "desc"
      ? b.value_ratio - a.value_ratio
      : a.value_ratio - b.value_ratio;
  });
}

export async function getNthBestValueRatioPlayer(
    n: number,
    season: number = 2025
  ) {
    const teams = await getExepectationSummary(season);
  
    const sorted = sortPlayerByValueRatio(teams, "desc");
  
    if (n < 1 || n > sorted.length) {
      throw new Error("Invalid rank requested");
    }
  
    return sorted[n - 1]; 
  }
