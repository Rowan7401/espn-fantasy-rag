import { getNthBestRankingTeam } from "../skills/team/getRecordRankings";

async function runTest() {
  console.log("🏈 --- STARTING LEAGUE STANDINGS SKILL TESTING --- 🏈\n");

  try {
    console.log("🧪 TEST 1: Fetching the league's #1 top ranked manager...");
    const leagueLeader = await getNthBestRankingTeam({ n: 1, order: "desc", season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "1st Place",
      Owner: leagueLeader.owner,
      Team: leagueLeader.team,
      Record: `${leagueLeader.wins}-${leagueLeader.losses}`,
      "Points For": `${leagueLeader.points_for} pts`,
      "Points Against": `${leagueLeader.points_against} pts`
    }]);
    console.log("\n------------------------------------------------------------\n");

    console.log("🧪 TEST 2: Fetching the league's last place manager (Sacko bracket leader)...");
    
    // Setting order to "asc" means the team with the fewest wins rises to index 0
    const lastPlace = await getNthBestRankingTeam({ n: 1, order: "asc", season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "Last Place",
      Owner: lastPlace.owner,
      Team: lastPlace.team,
      Record: `${lastPlace.wins}-${lastPlace.losses}`,
      "Points For": `${lastPlace.points_for} pts`,
      "Points Against": `${lastPlace.points_against} pts`
    }]);

    console.log("\n🏁 --- ALL STANDINGS SKILL TESTS COMPLETE --- 🏁");

  } catch (err) {
    console.error("💥 Unhandled Error running standings skill test:", err);
  }
}

runTest();