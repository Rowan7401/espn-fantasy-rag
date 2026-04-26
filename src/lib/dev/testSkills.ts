import { getNthScoringPlayer } from "../skills/player/getPlayerScorerRank";

async function run() {
  try {
    const player = await getNthScoringPlayer({
        n: 10,
        order: "desc",
        filter: {
          position: "",
        },
      });


    console.log(player);
  } catch (err) {
    console.error("❌ Error testing skill:", err);
  }
}

run();