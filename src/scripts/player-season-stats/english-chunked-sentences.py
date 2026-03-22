import csv

sentences = []

with open("/Users/rowandillon/Github-Repos/Fantasy-Football-RAG/espn-fantasy-rag/src/lib/espn/data-csv/player_season_stats.csv", newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        # Convert key numeric fields
        games = int(float(row['games_played']))
        points_total = float(row['points_total'])
        avg_points = float(row['avg_points'])

        rushing_attempts = float(row['rushing_attempts_total'])
        rushing_yards_total = float(row['rushing_yards_total'])
        avg_rushing_yards = float(row['avg_rushing_yards'])

        receptions = float(row['receptions_total'])
        targets = float(row['targets_total'])
        receiving_tds = float(row['receiving_TDs_total'])
        receiving_yards_total = float(row['receiving_yards_total'])
        avg_receiving_yards = float(row['avg_receiving_yards'])

        ypr = float(row['yards_per_reception'])
        yac = float(row['yards_after_catch_total'])

        # Build cleaner, more semantic sentence
        sentence = (
            f"Team {row['team']} is managed by {row['owner']}. "
            f"Their player {row['player']} plays {row['position']} and appeared in {games} games during the season. "
            f"They scored {points_total} total fantasy points with an average of {avg_points} points per game. "
            f"As a rusher, they had {rushing_attempts} attempts for {rushing_yards_total} total rushing yards, "
            f"averaging {avg_rushing_yards} rushing yards per game. "
            f"As a receiver, they recorded {receptions} receptions on {targets} targets for {receiving_yards_total} total receiving yards, "
            f"averaging {avg_receiving_yards} receiving yards per game, and scored {receiving_tds} receiving touchdowns. "
            f"They averaged {ypr} yards per reception and had {yac} total yards after catch."
        )

        sentences.append(sentence)

# Output for JS ingestion
for sentence in sentences:
    print(f"\"{sentence}\",\n")