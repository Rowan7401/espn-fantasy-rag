import { tool } from "ai";
import { z } from "zod";

import { getTotalMissedOpportunities } from "./getBadBenchingOwnerRank";

const ManagerEfficiencySchema = z.object({
  season: z.number().default(2025),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const badBenchRankingTool = tool({
  description: `
      Answers questions about manager rankings based on missed lineup points (bench decisions).
  
      This measures how many fantasy points a manager left on their bench instead of starting those players, representing lineup inefficiency and missed opportunities.
  
      Use this tool whenever the user asks who made the worst lineup decisions, who left the most points on the bench, who had the most wasted points, or who had the most inefficient roster management.
  
      Examples of questions:
      - Who left the most points on their bench this season?
      - Who made the worst lineup decisions?
      - Who is the worst manager?
      - Who wasted the most fantasy points?
      - Who has the most missed opportunities?
      - Who is the second worst at setting lineups?
      - Who is the most optimal manager?
      - Who left the fewest points on their bench?
  
      Parameter guidance:
      - n represents the requested rank (1 = most inefficient / most bench points left, 2 = second most, etc.).
      - Use order = "desc" for most missed bench points (worst lineup management).
      - Use order = "asc" for fewest missed bench points (best lineup management / most optimal decisions).
      - Season defaults to 2025 unless the user specifies another season.
    `,

  inputSchema: ManagerEfficiencySchema,

  // inputExamples: [
  //   {
  //     description: "Who left the most points on their bench?",
  //     input: {
  //       season: 2025,
  //       order: "desc",
  //     } satisfies z.infer<typeof ManagerEfficiencySchema>,
  //   },
  //   {
  //     description: "Who made the worst lineup decisions?",
  //     input: {
  //       season: 2025,
  //       order: "desc",
  //     },
  //   },
  //   {
  //     description: "Who is the worst manager?",
  //     input: {
  //       season: 2025,
  //       order: "desc",
  //     },
  //   },
  //   {
  //     description: "Who wasted the most fantasy points?",
  //     input: {
  //       season: 2025,
  //       order: "desc",
  //     },
  //   },
  //   {
  //     description: "Who is the most optimal manager?",
  //     input: {
  //       season: 2025,
  //       order: "asc",
  //     },
  //   },
  //   {
  //     description: "Who left the fewest points on the bench?",
  //     input: {
  //       season: 2025,
  //       order: "asc",
  //     },
  //   },
  // ],

  execute: async ({ season, order }) => {
    console.log("🛠️ TOOL CALLED: getBadBenchingRankings");
    console.log("Arguments:", { season, order });
    const resultObject = await getTotalMissedOpportunities(season, order);
    console.log("📤 TOOL RESULT:", resultObject);

    return {
      rankType: "missedBenchPoints",
      season,
      order,
      result: resultObject,
    };
  },
});
