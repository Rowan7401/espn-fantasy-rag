from espn_api.football import League
import pandas as pd
import os
from dotenv import load_dotenv
from pathlib import Path

script_dir = Path(__file__).resolve().parent
# loading .env.local from root folder
base_dir = script_dir.parents[2]
dotenv_path = base_dir / ".env.local"
load_dotenv(dotenv_path=dotenv_path)

# Browser cookies used on ESPN fantasy sites to get and display data
# Private keys last 2 weeks or so before they need refresh (find in network tab while on ESPN fantasy site)
LEAGUE_ID = int(os.getenv("LEAGUE_ID"))
YEAR = int(os.getenv("YEAR"))
SWID = os.getenv("SWID")
ESPN_S2 = os.getenv("ESPN_S2")

def export_expectation_vs_reality():
    try:
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)

        data = []

        for team in league.teams:

            owner_name = "Unknown"
            if team.owners:
                owner_name = team.owners[0].get("displayName", "Unknown")

            for player in team.roster:

                if not player.stats:
                    continue

                season = player.stats[0]

                actual_points_total = season.get("points", 0)
                projected_points_total = season.get("projected_points", 0)

                actual_points_per_game = season.get("avg_points", 0)
                projected_points_per_game = season.get("projected_avg_points", 0)

                points_difference_total = actual_points_total - projected_points_total
                points_difference_per_game = actual_points_per_game - projected_points_per_game

                value_ratio = 0
                if projected_points_total != 0:
                    value_ratio = actual_points_total / projected_points_total

                data.append({
                    "Team": team.team_name,
                    "Owner": owner_name,
                    "Player": player.name,
                    "Position": player.position,

                    "Actual_Points_Total": actual_points_total,
                    "Projected_Points_Total": projected_points_total,

                    "Actual_Points_Per_Game": actual_points_per_game,
                    "Projected_Points_Per_Game": projected_points_per_game,

                    "Points_Difference_Total": points_difference_total,
                    "Points_Difference_Per_Game": points_difference_per_game,

                    "Value_Ratio": value_ratio
                })

        df = pd.DataFrame(data)
        df.to_csv("expectation_vs_reality.csv", index=False)

        print("✅ Exported expectation vs reality stats")

    except Exception as e:
        print(f"Error exporting projection stats: {e}")

def inspect_first_player_stats():
    try:
        league = League(
            league_id=LEAGUE_ID,
            year=YEAR,
            espn_s2=ESPN_S2,
            swid=SWID
        )

        team = league.teams[0]
        player = team.roster[0]

        print(f"\nTeam: {team.team_name}")
        print(f"Player: {player.name}")
        print(f"Position: {player.position}")

        print("\n--- RAW PLAYER STATS ---")

        if hasattr(player, "stats"):
            for key, value in player.stats.items():
                print(f"{key}: {value}")
        else:
            print("Player has no stats attribute.")

    except Exception as e:
        print(f"Error inspecting player stats: {e}")

def export_player_season_stats():
    try:
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)

        data = []

        for team in league.teams:

            owner_name = "Unknown"
            if team.owners:
                owner_name = team.owners[0].get("displayName", "Unknown")

            for player in team.roster:

                if not player.stats:
                    continue

                season = player.stats[0]
                breakdown = season.get("breakdown", {})

                data.append({
                    "Team": team.team_name,
                    "Owner": owner_name,
                    "Player": player.name,
                    "Position": player.position,

                    "Fantasy_Points_Total": season.get("points", 0),

                    # Rushing
                    "Rushing_Attempts_Total": breakdown.get("rushingAttempts", 0),
                    "Rushing_Yards_Per_Game": breakdown.get("rushingYards", 0),
                    "Rushing_Yards_Per_Attempt": breakdown.get("rushingYardsPerAttempt", 0),

                    # Receiving
                    "Receptions_Total": breakdown.get("receivingReceptions", 0),
                    "Receiving_Targets_Total": breakdown.get("receivingTargets", 0),
                    "Receiving_TDs_Total": breakdown.get("receivingTouchdowns", 0),

                    "Receiving_Yards_Per_Game": breakdown.get("receivingYards", 0),

                    # Efficiency metrics
                    "Yards_Per_Reception": breakdown.get("receivingYardsPerReception", 0),

                    # Advanced stat
                    "Yards_After_Catch_Total": breakdown.get("receivingYardsAfterCatch", 0)
                })

        df = pd.DataFrame(data)
        df.to_csv("player_season_stats.csv", index=False)

        print("✅ Exported player season stats")

    except Exception as e:
        print(f"Error exporting stats: {e}")


def export_teams():
    try:
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)
        teams_data = []

        for team in league.teams:
            owner_name = "Unknown"
            if team.owners:
                owner_name = team.owners[0].get("displayName", "Unknown")

            teams_data.append(
                {
                    "Team_ID": team.team_id,
                    "Team_Name": team.team_name,
                    "Abbreviation": team.team_abbrev,
                    "Owner": owner_name,  
                    "Wins": team.wins,
                    "Losses": team.losses,
                    "Points_For": team.points_for,
                    "Points_Against": team.points_against,
                }
            )

        df = pd.DataFrame(teams_data)
        df.to_csv("league_teams.csv", index=False)
        print("✅ Team data exported to 'league_teams.csv'")

    except Exception as e:
        print(f"Error fetching teams: {e}")


def export_draft_results():
    try:
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)
        draft_data = []

        # league.draft is a list of Pick objects
        for pick in league.draft:
            draft_data.append(
                {
                    "Round": pick.round_num,
                    "Pick_Overall": pick.round_pick,
                    "Team": pick.team.team_name,
                    "Player": pick.playerName,
                    "Position": pick.playerId,  # Or player object attributes
                }
            )

        df = pd.DataFrame(draft_data)
        df.to_csv("draft_results.csv", index=False)
        print("✅ Draft results exported to 'draft_results.csv'")

    except Exception as e:
        print(f"Error fetching draft: {e}")


def get_data():
    try:
        # Initialize the League object
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)

        print(f"Successfully connected to: {league.settings.name}")

        # Example: Pull all teams
        teams = league.teams
        for team in teams:
            print(f"Team: {team.team_name} | Record: {team.wins}-{team.losses}")

    except Exception as e:
        print(f"Error: {e}")
        print(
            "Double check your SWID and ESPN_S2 cookies if you get an Authentication Error."
        )


def export_matchups():
    try:
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)

        all_matchups = []

        # Determine the last completed week (usually 1-17 or 18)
        # We loop through weeks to gather data
        for week in range(1, 18):
            matchups = league.scoreboard(week)
            if not matchups:
                break  # Stop if we hit a week with no data

            for m in matchups:
                # Store the data in a dictionary
                data = {
                    "Week": week,
                    "Home_Team": m.home_team.team_name,
                    "Home_Score": m.home_score,
                    "Away_Team": m.away_team.team_name,
                    "Away_Score": m.away_score,
                    "Winner": m.home_team.team_name
                    if m.home_score > m.away_score
                    else m.away_team.team_name,
                }
                all_matchups.append(data)

        # Convert to a Pandas DataFrame
        df = pd.DataFrame(all_matchups)

        # Save to CSV
        df.to_csv("league_matchups.csv", index=False)
        print("✅ Export complete! Saved to 'league_matchups.csv'")

        # Show a preview in the terminal
        print("\n--- Recent Matchups Preview ---")
        print(df.tail(10))

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    # get_data()
    # export_matchups()
    # export_draft_results()
    # export_teams()
    # export_player_season_stats()
    # inspect_first_player_stats()
    export_expectation_vs_reality()
