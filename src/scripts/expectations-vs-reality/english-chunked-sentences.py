import csv

sentences = []

with open("/Users/rowandillon/Github-Repos/Fantasy-Football-RAG/espn-fantasy-rag/src/lib/espn/data-csv/expectation_vs_reality.csv", newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        actual_total = float(row["Actual_Total_Points"])
        projected_total = float(row["Projected_Total_Points"])
        actual_avg = float(row["Actual_Avg_Points"])
        projected_avg = float(row["Projected_Avg_Points"])
        diff_total = float(row["Points_Difference"])
        diff_avg = float(row["Avg_Points_Difference"])
        value_ratio = float(row["Value_Ratio"])

        # Determine over/under performance label (nice semantic boost)
        performance_label = "outperformed" if diff_total > 0 else "underperformed"

        sentence = (
            f"Team {row['Team']} is managed by {row['Owner']}. "
            f"Their player {row['Player']} plays {row['Position']}. "
            f"They scored {actual_total} actual total fantasy points compared to a projection of {projected_total}. "
            f"This means they {performance_label} expectations by {diff_total} total points. "
            f"On a per game basis, they averaged {actual_avg} points compared to a projected average of {projected_avg}, "
            f"a difference of {diff_avg} points per game. "
            f"Their overall value ratio was {value_ratio}."
        )

        sentences.append(sentence)

# Output for JS ingestion
for sentence in sentences:
    print(f"\"{sentence}\",\n")