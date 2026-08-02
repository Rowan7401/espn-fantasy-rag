import { tool } from "ai";
import { z } from "zod";

import { getNthBestRankingTeam } from "./getRecordRankings";

const ManagerStandingsSchema = z.object({
  season: z.number().default(2025),
  n: z.number(),
  order: z.enum(["asc", "desc"]),
});

export const teamRecordsTool = tool({
  description: `
      Answers questions about manager rankings based on season wins, losses, winning percentage, and league standings.
  
      Use this tool whenever the user asks who has the best or worst record, asks about league standings, or requests rankings based on wins, losses, or winning percentage.
  
      Examples of questions:
      - Who has the best record?
      - Who is in first place?
      - Who has the worst record?
      - Who is in last place?
      - Who is second in the standings?
      - Who has the third best record?
      - Show me the league standings.
      - Which manager has the highest winning percentage?
  
      Parameter guidance:
      - n represents the requested rank (1 = first place, 2 = second place, 3 = third place, etc.).
      - Use order = "desc" for highest, best, top, first, leading, winning, or strongest record requests.
      - Use order = "asc" for lowest, worst, bottom, last, losing, or weakest record requests.
      - Season defaults to 2025 unless the user specifies another season.
    `,

  inputSchema: ManagerStandingsSchema,

  // inputExamples: [
  //   {
  //     description: "Who has the best record?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is in first place?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who has the second best record?",
  //     input: {
  //       n: 2,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is third in the standings?",
  //     input: {
  //       n: 3,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who has the worst record?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is in last place?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //     },
  //   },
  // ] satisfies {
  //   description: string;
  //   input: z.input<typeof ManagerStandingsSchema>;
  // }[],

  execute: async (args: z.output<typeof ManagerStandingsSchema>) => {
    console.log("🛠️ TOOL CALLED: getManagerWinLossRecords");
    // console.log("Arguments:", { n, order, season });

    const teamObject = await getNthBestRankingTeam(args);
    console.log("📤 TOOL RESULT:", teamObject);
    return {
      rank: args.n,
      order: args.order,
      season: args.season,
      result: teamObject,
    };
  },
});
