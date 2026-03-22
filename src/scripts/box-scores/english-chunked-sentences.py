import csv

sentences = []

with open("/Users/rowandillon/Github-Repos/Fantasy-Football-RAG/espn-fantasy-rag/src/lib/espn/data-csv/league_box_scores.csv", newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    grouped = {}

    for row in reader:
        key = (row["Week"], row["Team"])

        if key not in grouped:
            grouped[key] = {
                "owner": row["Owner"],
                "opponent": row["Opponent"],
                "players": []
            }

        grouped[key]["players"].append(row)

    for (week, team), data in grouped.items():
        owner = data["owner"]
        opponent = data["opponent"]

        starters = [p for p in data["players"] if p["Started"] == "True"]
        bench = [p for p in data["players"] if p["Started"] == "False"]

        # Convert points
        for p in starters + bench:
            p["Points"] = float(p["Points"])

        total_points = sum(p["Points"] for p in starters)

        # 🔥 Top 3 starters
        top_starters = sorted(starters, key=lambda x: x["Points"], reverse=True)[:3]
        top_summary = ", ".join(
            f"{p['Player']} ({p['Points']} pts)" for p in top_starters
        )

        # 💀 Zero starters
        zero_starts = [p for p in starters if p["Points"] == 0]

        # 📉 Worst starter
        worst_starter = min(starters, key=lambda x: x["Points"], default=None)

        # 🪑 Bench opportunity (non-QB, >15 pts)
        strong_bench = [
            p for p in bench
            if p["Points"] > 15 and p["Position"] != "QB"
        ]
        best_bench = sorted(strong_bench, key=lambda x: x["Points"], reverse=True)

        # --- Build sentence ---
        sentence = (
            f"In week {week}, team {team} managed by {owner} played against {opponent} "
            f"and scored {round(total_points, 2)} total points. "
            f"Their top performers were {top_summary}. "
        )

        # 💀 Zero insight
        if zero_starts:
            zero_names = ", ".join(p["Player"] for p in zero_starts[:3])
            sentence += (
                f"They started {len(zero_starts)} players who scored 0 points, including {zero_names}. "
            )

        # 📉 Worst starter always included
        if worst_starter:
            sentence += (
                f"Their worst starter was {worst_starter['Player']} at {worst_starter['Position']} "
                f"with {worst_starter['Points']} points. "
            )

        # 🪑 Bench mistake (fixed logic)
        if best_bench:
            bench_player = best_bench[0]
            sentence += (
                f"On the bench, {bench_player['Player']} scored {bench_player['Points']} points at "
                f"{bench_player['Position']}, suggesting a missed opportunity in the lineup decision. "
            )

        sentences.append(sentence)

# Output for JS ingestion
for sentence in sentences:
    print(f"\"{sentence}\",\n")