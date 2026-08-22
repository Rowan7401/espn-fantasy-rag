import { ExpectationSummary } from "@/lib/types/expectation-vs-reality-metadata";
import { getExpectationSummary } from "../../types/getExpectationMetadata";

export function sortPlayerByValueRatio(
  players: ExpectationSummary[],
  order: "asc" | "desc" = "desc"
): ExpectationSummary[] {
  return [...players].sort((a, b) => {
    return order === "desc"
      ? b.value_ratio - a.value_ratio
      : a.value_ratio - b.value_ratio;
  });
}

type PlayerFilter = {
  position?: string;
  team?: string;
};

export async function getNthValueRatioPlayer({
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

  let filtered = players.filter((p) => {
    // 0 projected points causes unhelpful divide by 0 metrics, so guard
    const hasValidProjection = p.projected_points_total !== 0 && p.projected_points_total !== null;
    
    // Also guard against bad data entries where value_ratio is 0 but they scored points
    const isGlitchedZeroRatio = p.value_ratio === 0 && p.actual_points_total > 0;

    return hasValidProjection && !isGlitchedZeroRatio;
  });

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

  const sorted = sortPlayerByValueRatio(filtered, order);

  if (n < 1 || n > sorted.length) {
    throw new Error("Invalid rank requested");
  }

  return sorted[n - 1];
}