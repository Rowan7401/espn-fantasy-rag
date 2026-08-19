import { tool } from "ai";
import { z } from "zod";
import { wait } from "../utils/toolCallWaiter";

import { getNthPunchingBagTeam } from "./getPunchingBagRankings";

const LuckScheduleSchema = z.object({
  season: z.number().default(2025),
  n: z.number().default(1),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const punchingBagTool = tool({
  description: `
      Answers questions about manager rankings based on total Points Against (PA), which measures how many fantasy points opponents have scored against a manager over the season.
  
      Use this tool whenever the user asks who has been the most unlucky, who has allowed the most points, who has the toughest schedule, or who has been the "punching bag" of the league.
  
      Examples of questions:
      - Who has allowed the most points this season?
      - Who is the most unlucky manager?
      - Who is the biggest punching bag in the league?
      - Who has the toughest schedule?
      - Who has the most points scored against them?
      - Who is the second most unlucky manager?
      - Who has the fewest points against?
      - Who has been the luckiest manager?
  
      Parameter guidance:
      - n represents the requested rank (1 = most unlucky / highest points against, 2 = second most unlucky, etc.).
      - Use order = "desc" for most points against (unlucky, toughest schedule, punching bag).
      - Use order = "asc" for fewest points against (lucky, easiest schedule, least scored against).
      - Season defaults to 2025 unless the user specifies another season.
    `,

  inputSchema: LuckScheduleSchema,

  // inputExamples: [
  //   {
  //     description: "Who is the most unlucky manager?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who has allowed the most points this season?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is the second most unlucky manager?",
  //     input: {
  //       n: 2,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who has the toughest schedule?",
  //     input: {
  //       n: 1,
  //       order: "desc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who is the luckiest manager?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "Who has allowed the fewest points?",
  //     input: {
  //       n: 1,
  //       order: "asc",
  //       season: 2025,
  //     },
  //   },
  // ],

  execute: async ({ n, order, season }) => {
    console.log("🛠️ TOOL CALLED: getPunchingBagRankings");

    console.log("Arguments:", { n, order, season });

    const teamObject = await getNthPunchingBagTeam({ n, order, season });
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
