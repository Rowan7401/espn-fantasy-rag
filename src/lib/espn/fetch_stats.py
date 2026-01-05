from espn_api.football import League
import pandas as pd

# League Configuration
LEAGUE_ID = 1038575207
YEAR = 2025
SWID = '{6F99240C-DF05-4B91-9924-0CDF057B9189}'
ESPN_S2 = 'AEB1s59QEZt6LuCgFAE%2FqT8VLCi5dheTouHkrhTzlFMKS32Fk9XyO%2Fv3mktNeMMZL%2BkKmq3Pbk0jGNPcf0f1HwunJtRd4SWlJWd%2Febu3vY5DR%2FIqquCkENQQlqlSEDAXms%2Bc9RV%2FmR0mZR2vcrFK04E1cqCdW358%2B6fFrSe7fvjkl5CPJjawdP7g44W%2FopTUwYve2FPbli4ORNAPAUrURHbqIEC5IjBPBmtQ0jXSbInuDStWnjjRlMAGsb9LM6dUCxKAJcr%2F8mAxmY2ZhdZ8cKHX'

def export_draft_results():
    try:
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)
        draft_data = []

        # league.draft is a list of Pick objects
        for pick in league.draft:
            draft_data.append({
                "Round": pick.round_num,
                "Pick_Overall": pick.round_pick,
                "Team": pick.team.team_name,
                "Player": pick.playerName,
                "Position": pick.playerId # Or player object attributes
            })

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
        print("Double check your SWID and ESPN_S2 cookies if you get an Authentication Error.")

def export_matchups():
    try:
        league = League(league_id=LEAGUE_ID, year=YEAR, espn_s2=ESPN_S2, swid=SWID)
        
        all_matchups = []
        
        # Determine the last completed week (usually 1-17 or 18)
        # We loop through weeks to gather data
        for week in range(1, 18): 
            matchups = league.scoreboard(week)
            if not matchups:
                break # Stop if we hit a week with no data
                
            for m in matchups:
                # Store the data in a dictionary
                data = {
                    "Week": week,
                    "Home_Team": m.home_team.team_name,
                    "Home_Score": m.home_score,
                    "Away_Team": m.away_team.team_name,
                    "Away_Score": m.away_score,
                    "Winner": m.home_team.team_name if m.home_score > m.away_score else m.away_team.team_name
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
    export_draft_results()