export type BoxScoreSummary = {
  // REQUIRED (core identity)
  type: "box_scores_summary";
  /** Owner full name */
  owner: string;
  /** Fantasy Team Name */
  team: string;
  week: number;
  season: number;
  league: string;
  /** Points scored that week */
  total_points: number;

  // BEHAVIOR SIGNALS
  /** Player was benched that scored 15+ pts */
  has_missed_opportunity: boolean;
  /** Benched players score that week */
  missed_bench_points?: number;
  missed_bench_player?: string;
  missed_bench_position?: string;

  /** worst performing player's score that week */
  worst_points?: number;
  /**  */
  worst_position?: string;
  /** Worst player's name */
  worst_starter?: string;

  // OPTIONAL ENRICHMENT
  /** Best players name + rounded score in last 2 characters of string. ex: "Patrick Mahomes (22" */
  top_players?: string;
  /** Fantasy Team the featured owner was playing */
  opponent?: string;
  /** Number of 0 pt scorers that week for owner */
  zero_starts_count?: number;
  /** True/False if owner started a zero scorer */
  has_zero_start?: boolean
  /** Description of the box score that week which was vectorized */
  text?: string;

};