import { getWeeklyRankingsAndAwards } from "../skills/league/getWeeklyPtsRank";

async function run() {
  try {
    const allWeeklyRankings = await getWeeklyRankingsAndAwards(2025);

    console.log("🏈 --- FULL SEASON WEEKLY LOOKUP TEST --- 🏈\n");

    // Grab the week numbers from the Map keys and sort them numerically
    const sortedWeeks = Array.from(allWeeklyRankings.keys()).sort((a, b) => a - b);

    for (const week of sortedWeeks) {
      const rankings = allWeeklyRankings.get(week)!;
      
      console.log(`📅 WEEK ${week} (${rankings.length} teams processed):`);
      console.log("   ------------------------------------------------------------");

      // Loop through every single ranked player for this week
      rankings.forEach((player) => {
        // Formats the rank prefix (e.g., "1st:", "2nd:", "10th:")
        const rankSuffix = player.rank === 1 ? "st" : player.rank === 2 ? "nd" : player.rank === 3 ? "rd" : "th";
        const rankStr = `${player.rank}${rankSuffix}:`.padEnd(5, " ");
        
        // Padded owner and team names to keep the terminal looking neat
        const ownerStr = `${player.owner}`.padEnd(25, " ");
        const teamStr = `(${player.team})`.padEnd(40, " ");
        
        console.log(`   👉 ${rankStr} ${ownerStr} ${teamStr} -> ${player.totalPoints} pts`);
      });

      console.log("   ------------------------------------------------------------\n");
    }

  } catch (err) {
    console.error("❌ Error testing weekly rankings skill:", err);
  }
}

run();