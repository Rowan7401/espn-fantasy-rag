import { getNthBestScoringTeam } from "../skills/team/getScorerRankings";
async function runTest() {
  console.log("🏈 --- STARTING TEAM SCORING SKILL TESTING --- 🏈\n");

  try {
    console.log("🧪 TEST 1: Fetching the league's absolute #1 highest scoring team...");
    const topScorer = await getNthBestScoringTeam({ n: 1, order: "desc", season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "1st (Points For)",
      Owner: topScorer.owner,
      Team: topScorer.team,
      "Points For": `${topScorer.points_for} pts`,
      "Points Against": `${topScorer.points_against} pts`,
      Record: `${topScorer.wins}-${topScorer.losses}`
    }]);
    console.log("\n------------------------------------------------------------\n");

    console.log("🧪 TEST 2: Fetching the league's lowest scoring team...");
 
    const lowestScorer = await getNthBestScoringTeam({ n: 1, order: "asc", season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "Last (Points For)",
      Owner: lowestScorer.owner,
      Team: lowestScorer.team,
      "Points For": `${lowestScorer.points_for} pts`,
      "Points Against": `${lowestScorer.points_against} pts`,
      Record: `${lowestScorer.wins}-${lowestScorer.losses}`
    }]);

    console.log("\n🏁 --- ALL TEAM SCORING SKILL TESTS COMPLETE --- 🏁");

  } catch (err) {
    console.error("💥 Unhandled Error running team scoring skill test:", err);
  }
}

runTest();