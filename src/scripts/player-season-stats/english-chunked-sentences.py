import csv

sentences = []

with open("/Users/rowandillon/Github-Repos/Fantasy-Football-RAG/espn-fantasy-rag/src/lib/espn/player_season_stats.csv", newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Build a readable sentence for each player
        sentence = (
            f"Team {row['Team']} is managed by {row['Owner']}. "
            f"The player {row['Player']} plays {row['Position']}. "
            f"They scored {row['Total_Points']} total points. "
            f"They had {row['Rushing_Attempts']} rushing attempts for {row['Rushing_Yards']} yards "
            f"with an average of {row['Rushing_Yards_Per_Attempt']} yards per attempt. "
            f"They made {row['Receptions']} receptions totaling {row['Receiving_Yards']} yards "
            f"with {row['Receiving_TDs']} receiving touchdowns on {row['Receiving_Targets']} targets. "
            f"Yards after catch: {row['YAC']}, average yards per reception: {row['Yards_Per_Reception']}."
        )
        sentences.append(sentence)

# Output array format
for sentence in sentences:
    print("\"" + sentence + "\",")
    print()