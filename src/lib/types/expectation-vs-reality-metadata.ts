export interface ExpectationSummary {
// metadata type ID
  type: "expectation_vs_reality";
// Points actually averaged 
  actual_avg_points: number;
// Total actual points
  actual_points_total: number;
// Difference between average and expected points
  avg_points_difference: number;
// League sport type?
  league: string;
// Team owner
  owner: string;
// Outperformed or underperformed expectations?
  performance: string;
// Player full name
  player: string;
// Total points difference between expectations and reality
  points_difference: number;
// Football position
  position: string;
// expected average points
  projected_avg_points: number;
// total expected points
  projected_points_total: number;
// Year season occurred
  season: number;
// team name
  team: string;
// English readable sentence summary
  text: string;
// Calculated number above 1 is outperforming below, under
  value_ratio: number;
}
