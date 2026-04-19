import { getNthValueRatioPlayer } from "../skills/player/getValueRatioRank";

async function run() {
  try {
    const player = await getNthValueRatioPlayer({
        n: 3,
        order: "asc",
        filter: {
          position: "QB",
        },
      });


    console.log(player);
  } catch (err) {
    console.error("❌ Error testing skill:", err);
  }
}

run();