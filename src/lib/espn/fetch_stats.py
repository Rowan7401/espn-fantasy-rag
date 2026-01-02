from espn_api.football import League
import pandas as pd

# League Configuration
LEAGUE_ID = 1038575207
YEAR = 2025
SWID = '{6F99240C-DF05-4B91-9924-0CDF057B9189}'
ESPN_S2 = 'AEB1s59QEZt6LuCgFAE%2FqT8VLCi5dheTouHkrhTzlFMKS32Fk9XyO%2Fv3mktNeMMZL%2BkKmq3Pbk0jGNPcf0f1HwunJtRd4SWlJWd%2Febu3vY5DR%2FIqquCkENQQlqlSEDAXms%2Bc9RV%2FmR0mZR2vcrFK04E1cqCdW358%2B6fFrSe7fvjkl5CPJjawdP7g44W%2FopTUwYve2FPbli4ORNAPAUrURHbqIEC5IjBPBmtQ0jXSbInuDStWnjjRlMAGsb9LM6dUCxKAJcr%2F8mAxmY2ZhdZ8cKHX'

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

if __name__ == "__main__":
    get_data()