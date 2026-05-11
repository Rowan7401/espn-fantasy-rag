import { getTotalMissedOpportunities } from "../skills/league/getBadBenchingOwnerRank";

async function run() {
  try {
    const result = await getTotalMissedOpportunities(2025, "desc");

    const simplified = result.map((r) => ({
      owner: r.owner,
      team: r.team,
      missed_opportunity_count: r.missedOpportunityCount,
    }));

    console.log("🏈 Missed Opportunity Leaderboard:");
    console.table(simplified);

  } catch (err) {
    console.error("❌ Error testing skill:", err);
  }
}

run();