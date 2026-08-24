import { tool } from "ai";
import { z } from "zod";

import { getWeeklyRankingsAndAwards } from "./getWeeklyPtsRank";
import { wait } from "../utils/toolCallWaiter";

const WeeklyPerformanceSchema = z.object({
  season: z.number().default(2025),
  targetWeek: z
    .number()
    .describe("The week number (1–18) to return rankings for."),
});

export const weeklyRankingsTool = tool({
  description: `
      Answers questions about weekly fantasy football performance, including weekly leaderboards, weekly points, and week-by-week rankings of managers and players.
  
      This tool is used for time-specific analysis (single week or full season breakdown by week), not season-long totals.
  
      Use this tool whenever the user asks about a specific week, weekly winners, weekly scores, or how managers performed in a given week.
  
      Two modes:
      1. Single-week mode (when targetWeek is provided): returns rankings for that specific week.
      2. Full-season mode (when no week is provided): returns weekly rankings for all weeks in the season.
  
      Examples of questions:
      - Who won Week 4?
      - Who had the highest score in Week 7?
      - Who were the top performers in Week 10?
      - What were the Week 3 rankings?
      - Show me Week 6 results.
      - How did managers perform in Week 12?
      - Who has been the most consistent weekly performer?
      - Give me weekly rankings for the season.
  
      Parameter guidance:
      - season represents the fantasy season (defaults to 2025).
      - targetWeek selects a specific week (e.g., 1–18). If omitted, returns all weekly data.
    `,

  inputSchema: WeeklyPerformanceSchema,

  // inputExamples: [
  //   {
  //     description: "Who won Week 4?",
  //     input: {
  //       season: 2025,
  //       targetWeek: 4,
  //     },
  //   },
  //   {
  //     description: "Who had the highest score in Week 7?",
  //     input: {
  //       season: 2025,
  //       targetWeek: 7,
  //     },
  //   },
  //   {
  //     description: "Who were the top performers in Week 10?",
  //     input: {
  //       season: 2025,
  //       targetWeek: 10,
  //     },
  //   },
  //   {
  //     description: "What were the Week 3 rankings?",
  //     input: {
  //       season: 2025,
  //       targetWeek: 3,
  //     },
  //   },
  //   {
  //     description: "Show me Week 6 results",
  //     input: {
  //       season: 2025,
  //       targetWeek: 6,
  //     },
  //   },
  //   {
  //     description: "Give me weekly rankings for the season",
  //     input: {
  //       season: 2025,
  //     },
  //   },
  //   {
  //     description: "How did managers perform across all weeks?",
  //     input: {
  //       season: 2025,
  //     },
  //   },
  // ],

  execute: async ({ season, targetWeek }) => {
    console.log("🛠️ TOOL CALLED: getWeeklyRankings");
    const data = await getWeeklyRankingsAndAwards(season);

    console.log("Arguments:", { season, targetWeek });
    if (targetWeek) {
      return {
        type: "singleWeek",
        season,
        week: targetWeek,
        result: data.get(targetWeek) ?? [],
      };
    }

    const resultObject = Object.fromEntries(data);
    console.log("📤 TOOL RESULT:", resultObject);
    await wait(3000);
    return {
      type: "fullSeason",
      season,
      result: resultObject,
    };
  },
});
