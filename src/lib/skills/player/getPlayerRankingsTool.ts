import { tool } from "ai";
import { z } from "zod";

import { getNthScoringPlayer } from "./getPlayerScorerRank";

const PlayerScoringSchema = z.object({
  season: z.number().default(2025),
  n: z.number().default(1),
  order: z.enum(["asc", "desc"]).default("desc"),
  position: z
    .enum(["QB", "RB", "WR", "TE", "K", "D/ST"])
    .optional()
});

export const playerRankingsTool = tool({
  description: `
      Answers questions about NFL player rankings based on total season fantasy points scored.
  
      Use this tool whenever the user asks who the highest scoring players are, who scored the most or fewest fantasy points, or requests rankings of players by total points.

      If a user asks for a ranked list of players, the max length of the list should not exceed 20 players. If a user asks for more than 20 players, provide an explanation about the limit.
  
      Examples of questions:
      - Who scored the most fantasy points this season?
      - Who is the highest scoring player?
      - Who is the top QB scorer?
      - Who is the top RB scorer?
      - Who is the third highest scoring player?
      - Who are the top 5 scorers?
      - Who scored the fewest fantasy points?
      - Who is the worst scoring WR?
  
      Parameter guidance:
      - n represents the requested rank (1 = highest scorer, 2 = second highest, etc.).
      - Use order = "desc" for highest scoring players (best fantasy producers).
      - Use order = "asc" for lowest scoring players.
      - Position is optional and filters players by NFL position (QB, RB, WR, TE, D/ST).
      - Season defaults to 2025 unless otherwise specified.
    `,

  inputSchema: PlayerScoringSchema,

  // inputExamples: [
  //   {
  //     description: "Who scored the most fantasy points?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is the highest scoring player?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is the second highest scoring player?",
  //     input: {
  //       n: 2,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is the third best QB scorer?",
  //     input: {
  //       n: 3,
  //       order: "desc",
  //       season: 2025,
  //       position: "QB",
  //     },
  //   },
  //   {
  //     description: "Who are the top RB scorers?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //       position: "RB",
  //     },
  //   },
  //   {
  //     description: "Who scored the fewest fantasy points?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is the lowest scoring WR?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //       position: "WR",
  //     },
  //   },
  // ],

  execute: async ({ n, order, season, position }) => {
    console.log("🛠️ TOOL CALLED: getPlayerScorerRankings");
    const filter = position ? { position } : undefined;

    const playerObject = await getNthScoringPlayer({
      n,
      order,
      season,
      filter,
    });

    console.log("Arguments:", { n, order, season, position });
    console.log("📤 TOOL RESULT:", playerObject);
    return {
      rank: n,
      order,
      season,
      result: playerObject,
    };
  },
});
