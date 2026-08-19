import { tool } from "ai";
import { z } from "zod";

import { getNthValueRatioPlayer } from "./getValueRatioRank";
import { wait } from "../utils/toolCallWaiter";

const DraftValueSchema = z.object({
  season: z.number().default(2025),
  n: z.number().default(1),
  order: z.enum(["asc", "desc"]).default("desc"),
  position: z
    .enum(["QB", "RB", "WR", "TE", "K", "D"])
    .optional()
    .describe(
      "Filter players by NFL position abbreviations (QB, RB, WR, TE, K, D/ST AKA 'D').",
    ),
});

export const valueRankingsTool = tool({
  description: `
      Answers questions about NFL player value based on how they performed relative to their pre-season projections (Value Ratio).
  
      Value Ratio meaning:
      - A value ratio above 1 means the player exceeded expectations (draft steal / breakout season).
      - A value ratio below 1 means the player underperformed expectations (draft bust / disappointing season).
  
      Use this tool whenever the user asks about draft steals, draft busts, best value picks, worst value picks, overperformers, underperformers, or players who exceeded or fell short of expectations.
      
      **TIP**
      Defense / Special Teams is a fantasy football 'combined player' slot indentified by metadata key 'position' = "D".
      It can be referred to as "D/ST" as well. Filter by "D" if a user asks about this type of 'player'.

      Examples of questions:
      - Who were the biggest draft steals this season?
      - Who were the biggest busts?
      - Who outperformed their draft position the most?
      - Who underperformed expectations the most?
      - Who is the best value player in fantasy?
      - Who is the worst value player in fantasy?
      - Who was the top QB value pick?
      - Who was the biggest WR bust?
      - Who was the most unexpectedly good D/ST?
  
      Parameter guidance:
      - n represents the requested rank (1 = biggest steal or bust, 2 = next biggest, etc.).
      - Use order = "desc" for best value, biggest steals, highest overperformance.
      - Use order = "asc" for worst value, biggest busts, highest underperformance.
      - Position is optional and filters results by NFL position (QB, RB, WR, TE, D/ST).
      - Season defaults to 2025 unless the user specifies another season.
    `,

  inputSchema: DraftValueSchema,

  // inputExamples: [
  //   {
  //     description: "Who were the biggest draft steals?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who were the biggest draft busts?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who was the best value player this season?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who underperformed the most?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who was the second biggest draft steal?",
  //     input: {
  //       n: 2,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who was the biggest QB bust?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //       position: "QB",
  //     },
  //   },
  //   {
  //     description: "Who was the best WR value pick?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //       position: "WR",
  //     },
  //   },
  // ],

  execute: async ({ n, order, season, position }) => {
    console.log("🛠️ TOOL CALLED: getValueRatioRankings");
    console.log("Arguments:", { n, order, season, position });
    const filter = position ? { position } : undefined;

    const playerObject = await getNthValueRatioPlayer({
      n,
      order,
      season,
      filter,
    });

    console.log("📤 TOOL RESULT:", playerObject);
    await wait(3000);
    return {
      rank: n,
      order,
      season,
      result: playerObject,
    };
  },
});
