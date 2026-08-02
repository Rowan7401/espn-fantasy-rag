import { getNthPunchingBagTeam } from "../skills/team/getPunchingBagRankings";

async function runTest() {
  console.log("🏈 --- STARTING PUNCHING BAG SKILL TESTING --- 🏈\n");

  try {
    console.log("🧪 TEST 1: Fetching the league's absolute #1 biggest punching bag...");
    const biggestPunchingBag = await getNthPunchingBagTeam({ n: 1, order: "desc", season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "1st (Most Unlucky)",
      Owner: biggestPunchingBag.owner,
      Team: biggestPunchingBag.team,
      "Points Against": `${biggestPunchingBag.points_against} pts`,
      "Points For": `${biggestPunchingBag.points_for} pts`,
      Record: `${biggestPunchingBag.wins}-${biggestPunchingBag.losses}`
    }]);
    console.log("\n------------------------------------------------------------\n");

    console.log("🧪 TEST 2: Fetching the league's luckiest manager (lowest points against)...");

    const luckiestTeam = await getNthPunchingBagTeam({ n: 1, order: "asc", season: 2025 });
    
    console.log("   ✅ Success!");
    console.table([{
      Rank: "1st (Most Lucky)",
      Owner: luckiestTeam.owner,
      Team: luckiestTeam.team,
      "Points Against": `${luckiestTeam.points_against} pts`,
      "Points For": `${luckiestTeam.points_for} pts`,
      Record: `${luckiestTeam.wins}-${luckiestTeam.losses}`
    }]);

    console.log("\n🏁 --- ALL PUNCHING BAG TESTS COMPLETE --- 🏁");

  } catch (err) {
    console.error("💥 Unhandled Error running punching bag skill test:", err);
  }
}

runTest();