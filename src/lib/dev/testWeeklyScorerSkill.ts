import { getWeeklyRankingsAndAwards } from "../skills/league/getWeeklyPtsRank";

async function run() {
  try {
    const allWeeklyRankings = await getWeeklyRankingsAndAwards(2025);

    console.log("🏈 --- FULL SEASON WEEKLY LOOKUP TEST --- 🏈\n");

    // Grab the week numbers from the Map keys and sort them numerically
    const sortedWeeks = Array.from(allWeeklyRankings.keys()).sort((a, b) => a - b);

    for (const week of sortedWeeks) {
      const rankings = allWeeklyRankings.get(week)!;
      
      // Since our function already handles the sorting, index 0 is 1st place
      const best = rankings[0];
      // The last element in the array is the lowest score
      const worst = rankings[rankings.length - 1];

      console.log(`📅 WEEK ${week}: (${rankings.length} teams processed)`);
      console.log(`   🏆 Top Scorer:  ${best.owner} (${best.team}) - ${best.totalPoints} pts`);
      console.log(`   💀 Worst Scorer: ${worst.owner} (${worst.team}) - ${worst.totalPoints} pts`);
      console.log("   ------------------------------------------------------------");
    }

  } catch (err) {
    console.error("❌ Error testing weekly rankings skill:", err);
  }
}

run();