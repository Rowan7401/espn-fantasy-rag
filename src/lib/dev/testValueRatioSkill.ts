import { getNthValueRatioPlayer } from "../skills/player/getValueRatioRank";

async function runTest() {
  console.log("🏈 --- STARTING VALUE RATIO SKILL TESTING --- 🏈\n");

  try {
    console.log("🧪 TEST 1: Fetching the overall #1 draft breakout (highest value ratio)...");
    const topSteal = await getNthValueRatioPlayer({ n: 1, order: "desc", season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "1st Steal",
      Player: topSteal.player,
      Position: topSteal.position,
      Team: topSteal.team,
      "Value Ratio": topSteal.value_ratio,
      Projected: `${topSteal.projected_points_total} pts`,
      Actual: `${topSteal.actual_points_total} pts`
    }]);
    console.log("\n------------------------------------------------------------\n");


    console.log("🧪 TEST 2: Fetching the overall #1 draft bust (lowest value ratio)...");
    // Passing order: "asc" sorts lowest value ratios to the front
    const topBust = await getNthValueRatioPlayer({ n: 1, order: "asc", season: 2025 });

    console.log("   ✅ Success!");
    console.table([{
      Rank: "1st Bust",
      Player: topBust.player,
      Position: topBust.position,
      Team: topBust.team,
      "Value Ratio": topBust.value_ratio,
      Projected: `${topBust.projected_points_total} pts`,
      Actual: `${topBust.actual_points_total} pts`
    }]);
    console.log("\n------------------------------------------------------------\n");

    const targetTeam = "Tyler's Top Team";
    console.log(`🧪 TEST 3: Fetching the #1 best value performer on "${targetTeam}"...`);
    
    const teamBestValue = await getNthValueRatioPlayer({
      n: 1,
      order: "desc",
      season: 2025,
      filter: { team: targetTeam }
    });

    console.log("   ✅ Success!");
    console.table([{
      ManagerTeam: targetTeam,
      Player: teamBestValue.player,
      Position: teamBestValue.position,
      "Value Ratio": teamBestValue.value_ratio,
      Actual: `${teamBestValue.actual_points_total} pts`
    }]);

    console.log("\n🏁 --- ALL VALUE RATIO SKILL TESTS COMPLETE --- 🏁");

  } catch (err) {
    console.error("💥 Unhandled Error running value ratio skill test:", err);
  }
}

runTest();