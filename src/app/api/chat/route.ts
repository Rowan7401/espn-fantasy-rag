import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { getContext } from "@/lib/rag/context";
import { z } from "zod";

import { getTotalMissedOpportunities } from "@/lib/skills/league/getBadBenchingOwnerRank";
import { getWeeklyRankingsAndAwards } from "@/lib/skills/league/getWeeklyPtsRank";
import { getNthScoringPlayer } from "@/lib/skills/player/getPlayerScorerRank";
import { getNthValueRatioPlayer } from "@/lib/skills/player/getValueRatioRank";
import { getNthPunchingBagTeam } from "@/lib/skills/team/getPunchingBagRankings";
import { getNthBestRankingTeam } from "@/lib/skills/team/getRecordRankings";
import { getNthBestScoringTeam } from "@/lib/skills/team/getScorerRankings";

const SEASON_STRING = "The fantasy football season year (defaults to 2025).";
const RANK_STRING = "The requested rank.";

const WeeklyPerformanceSchema = z.object({
  season: z.number().default(2025).describe(SEASON_STRING),
  targetWeek: z.number().describe("The week number (1–18) to return rankings for."),
});

const ManagerEfficiencySchema = z.object({
  season: z.number().default(2025).describe(SEASON_STRING),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const PlayerScoringSchema = z.object({
  season: z.number().default(2025).describe(SEASON_STRING),
  n: z.number().default(1).describe(RANK_STRING),
  order: z.enum(["asc", "desc"]).default("desc"),
  position: z.enum(["QB", "RB", "WR", "TE", "K", "D/ST"]).optional().describe("Filter players by NFL position abbreviations (QB, RB, WR, TE, K, D/ST)."),
});

const DraftValueSchema = z.object({
  season: z.number().default(2025).describe(SEASON_STRING),
  n: z.number().default(1).describe(RANK_STRING),
  order: z.enum(["asc", "desc"]).default("desc"),
  position: z.enum(["QB", "RB", "WR", "TE", "K", "DEF"]).optional().describe("Filter players by NFL position abbreviations (QB, RB, WR, TE, K, D/ST)."),
});

const LuckScheduleSchema = z.object({
  season: z.number().default(2025).describe(SEASON_STRING),
  n: z.number().default(1).describe(RANK_STRING),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const ManagerStandingsSchema = z.object({
  season: z.number().default(2025).describe(SEASON_STRING),
  n: z.number().describe(RANK_STRING),
  order: z.enum(["asc", "desc"]),
});

const TotalPointsSchema = z.object({
  season: z.number().default(2025).describe(SEASON_STRING),
  n: z.number().default(1).describe(RANK_STRING),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export async function POST(req: Request) {
  try {
    console.log("📩 /api/chat endpoint hit");
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.parts?.[0]?.text ?? "";

    // Unpack context text and structural classification intent cleanly
    const { contextText, intent } = await getContext(lastMessage);
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `
        You are League Insider AI, a fantasy football analytics engine for a private league.

        You answer questions using ONLY tool outputs and provided league context. Do not guess or hallucinate stats.

        INTENT CLASSIFICATION:
        - RANKING: season-long comparisons (best/worst managers, players, records, value)
        - WEEKLY: week-specific outcomes and performance
        - ANALYTICS: inefficiency, luck, bench decisions, projections
        - UNKNOWN: unrelated questions (respond briefly, humorous redirect back to fantasy football)

        TOOL USAGE RULES:
        - ALWAYS use tools when available for RANKING, WEEKLY, or ANALYTICS intent.
        - Never rely on contextText alone if a tool exists that can answer the question.
        - If multiple tools could apply, choose the most specific one.

        RESPONSE RULES:
        - Be concise (3–5 sentences max).
        - Use only real numbers from tool results.
        - Refer to managers only (not team names).
        - Do not mention tool names, schemas, or internal logic.
        - Always justify conclusions using statistics.
        - Make jokes and jabs towards managers / owners when appropriate. 
        - For remarkable statistics about NFL players, make comedic observations / comments if relevant.
        - Never attempt to utilize tools to answer questions that are not related to fantasy football or the league. Politely redirect the conversation back to fantasy football.

        DATA SOURCES:
        - tool results are authoritative
        - contextText is fallback-only when no tool applies

        CURRENT INTENT: ${intent.toUpperCase()}
        `,
      messages: modelMessages,

      tools: {
        getWeeklyRankings: tool({
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
            return {
              type: "fullSeason",
              season,
              result: resultObject,
            };
          },
        }),

        getBadBenchingRankings: tool({
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
        }),

        getPlayerScorerRankings: tool({
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
        }),

        getValueRatioRankings: tool({
          description: `
            Answers questions about NFL player value based on how they performed relative to their pre-season projections (Value Ratio).
        
            Value Ratio meaning:
            - A value ratio above 1 means the player exceeded expectations (draft steal / breakout season).
            - A value ratio below 1 means the player underperformed expectations (draft bust / disappointing season).
        
            Use this tool whenever the user asks about draft steals, draft busts, best value picks, worst value picks, overperformers, underperformers, or players who exceeded or fell short of expectations.
        
            Examples of questions:
            - Who were the biggest draft steals this season?
            - Who were the biggest busts?
            - Who outperformed their draft position the most?
            - Who underperformed expectations the most?
            - Who is the best value player in fantasy?
            - Who is the worst value player in fantasy?
            - Who was the top QB value pick?
            - Who was the biggest WR bust?
        
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
            return {
              rank: n,
              order,
              season,
              result: playerObject,
            };
          },
        }),

        getPunchingBagRankings: tool({
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

            return {
              rank: n,
              order,
              season,
              result: teamObject,
            };
          },
        }),

        getManagerWinLossRecords: tool({
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
        }),

        getTeamScorerRankings: tool({
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
        
            return {
              rank: n,
              order,
              season,
              result: teamObject,
            };
          },
        }),
      },

      stopWhen: stepCountIs(2)
      
    });

    console.log("Streaming response back to client");
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("❌ Chat route error:", err);
    throw err;
  }
}
