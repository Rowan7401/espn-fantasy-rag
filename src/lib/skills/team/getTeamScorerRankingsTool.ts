import { tool } from "ai";
import { z } from "zod";

import { getNthBestScoringTeam } from "./getScorerRankings";
import { wait } from "../utils/toolCallWaiter";

const TotalPointsSchema = z.object({
    season: z.number().default(2025),
    n: z.number().default(1),
    order: z.enum(["asc", "desc"]).default("desc"),
});

export const getTeamScorerRankingsTool = tool({
    description: `
      Answers questions about manager rankings by total season Points For (PF).
  
      Use this tool whenever the user asks who scored the most or fewest fantasy points, asks for the highest or lowest scoring managers, or requests rankings based on total Points For.
  
      Examples of questions:
      - Who scored the most points this season?
      - Who has the highest Points For?
      - Who is the highest scoring manager?
      - Who scored the fewest points?
      - Who is the second highest scoring manager?
      - Who is the fifth highest scorer?
      - Show me the top scoring owners.
      - Who has the lowest Points For?
  
      Parameter guidance:
      - n represents the requested rank (1 = first place, 2 = second place, 3 = third place, etc.).
      - Use order = "desc" for highest, best, top, most, leading, first, or highest scoring requests.
      - Use order = "asc" for lowest, least, worst, bottom, last, or fewest points requests.
      - Season defaults to 2025 unless the user specifies another season.
    `,

    inputSchema: TotalPointsSchema,
  
    // inputExamples: [
    //   {
    //     description: "Who scored the most points this season?",
    //     input: {
    //       n: 1,
    //       order: "desc",
    //       season: 2025,
    //     },
    //   },
    //   {
    //     description: "Who is the highest scoring manager?",
    //     input: {
    //       n: 1,
    //       order: "desc",
    //       season: 2025,
    //     },
    //   },
    //   {
    //     description: "Who finished second in total points?",
    //     input: {
    //       n: 2,
    //       order: "desc",
    //       season: 2025,
    //     },
    //   },
    //   {
    //     description: "Who has the fifth most Points For?",
    //     input: {
    //       n: 5,
    //       order: "desc",
    //       season: 2025,
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
    //     description: "Who was the lowest scoring owner?",
    //     input: {
    //       n: 1,
    //       order: "asc",
    //       season: 2025,
    //     },
    //   },
    // ],
  
    execute: async ({ n, order, season }) => {
      console.log("🛠️ TOOL CALLED: getTeamScorerRankings");
      console.log("Arguments:", { n, order, season });

      const teamObject = await getNthBestScoringTeam({ n, order, season });
      console.log("📤 TOOL RESULT:", teamObject);

      await wait(3000);
  
      return {
        rank: n,
        order,
        season,
        result: teamObject,
      };
    },
  });
  