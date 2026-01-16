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
    export_teams()
