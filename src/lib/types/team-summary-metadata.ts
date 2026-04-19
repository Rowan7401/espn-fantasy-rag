export interface TeamSummary {
    /** The type of metadata record, usually a constant like 'team_summary' */
    type: "team_summary";
    /** The year of the season (e.g., 2025) */
    season: number;
    /** The name of the league (e.g., "fantasy_football") */
    league: string;
    /** The display name of the team */
    team: string;
    /** The name of the team owner */
    owner: string;
    /** Total games won */
    wins: number;
    /** Total games lost */
    losses: number;
    /** Total points scored by this team */
    points_for: number;
    /** Total points scored against this team */
    points_against: number;
    /** A generated narrative description of the team's performance */
    text: string;
  }
