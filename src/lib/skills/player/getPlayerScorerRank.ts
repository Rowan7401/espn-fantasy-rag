import { ExpectationSummary } from "@/lib/types/expectation-vs-reality-metadata";
import { getExpectationSummary } from "./getExpectationMetadata";


export function sortPlayerByScoring(
  players: ExpectationSummary[],
  order: "asc" | "desc" = "desc"
): ExpectationSummary[] {
  return [...players].sort((a, b) => {
    return order === "desc"
      ? b.actual_points_total - a.actual_points_total
      : a.actual_points_total - b.actual_points_total;
  });
}

type PlayerFilter = {
  position?: string;
  team?: string;
};

export async function getNthScoringPlayer({
  n,
  order = "desc",
  season = 2025,
  filter,
}: {
  n: number;
  order?: "asc" | "desc";
  season?: number;
  filter?: PlayerFilter;
}) {
  const players = await getExpectationSummary(season);

  let filtered = players;

  if (filter?.position) {
    const pos = filter.position.toLowerCase();
    filtered = filtered.filter(
      (p) => p.position.toLowerCase() === pos
    );
  }

  if (filter?.team) {
    filtered = filtered.filter(
      (p) => p.team === filter.team
    );
  }

  const sorted = sortPlayerByScoring(filtered, order);

  if (n < 1 || n > sorted.length) {
    throw new Error("Invalid rank requested");
  }

  return sorted[n - 1];
}