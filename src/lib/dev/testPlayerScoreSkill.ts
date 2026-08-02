import { getNthScoringPlayer } from "../skills/player/getPlayerScorerRank";

async function runTest() {
  console.log("🏈 --- STARTING PLAYER SCORER SKILL TESTING --- 🏈\n");

  try {
    console.log("🧪 TEST 1: Fetching the overall #1 top scoring player...");
    const topPlayer = await getNthScoringPlayer({ n: 1, season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "1st Overall",
      Player: topPlayer.player,
      Position: topPlayer.position,
      Team: topPlayer.team,
      Points: `${topPlayer.actual_points_total} pts`,
      Projected: `${topPlayer.projected_points_total} pts`
    }]);
    console.log("\n------------------------------------------------------------\n");


    console.log("🧪 TEST 2: Fetching the #3 highest scoring Wide Receiver (WR)...");
    const fifthBestQb = await getNthScoringPlayer({ 
      n: 5, 
      season: 2025, 
      filter: { position: "QB" } 
    });

    console.log("   ✅ Success!");
    console.table([{
      Rank: "5th QB",
      Player: fifthBestQb.player,
      Position: fifthBestQb.position,
      Team: fifthBestQb.team,
      Points: `${fifthBestQb.actual_points_total} pts`
    }]);
    console.log("\n------------------------------------------------------------\n");

    console.log("🧪 TEST 3: Fetching the #3 highest scoring Wide Receiver (WR)...");
    const thirdBestWR = await getNthScoringPlayer({ 
      n: 3, 
      season: 2025, 
      filter: { position: "WR" } 
    });

    console.log("   ✅ Success!");
    console.table([{
      Rank: "3rd WR",
      Player: thirdBestWR.player,
      Position: thirdBestWR.position,
      Team: thirdBestWR.team,
      Points: `${thirdBestWR.actual_points_total} pts`
    }]);
    console.log("\n------------------------------------------------------------\n");


    console.log("🧪 TEST 4: Boundary verification (Requesting rank 0)...");
    try {
      await getNthScoringPlayer({ n: 0, season: 2025 });
      console.log("   ❌ Fail: The function should have thrown an 'Invalid rank requested' error but didn't.");
    } catch (error: any) {
      console.log(`   ✅ Success! Function defensively blocked the call with error: "${error.message}"`);
    }

    console.log("\n🏁 --- ALL PLAYER SCORER TESTS COMPLETE --- 🏁");

  } catch (err) {
    console.error("💥 Unhandled Error running player scoring skill test:", err);
  }
}

runTest();