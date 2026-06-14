import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, tool } from "ai";
import { getContext } from "@/lib/rag/context";
import { z } from "zod";

import { getTotalMissedOpportunities } from "@/lib/skills/league/getBadBenchingOwnerRank";
import { getWeeklyRankingsAndAwards } from "@/lib/skills/league/getWeeklyPtsRank";
import { getNthScoringPlayer } from "@/lib/skills/player/getPlayerScorerRank";
import { getNthValueRatioPlayer } from "@/lib/skills/player/getValueRatioRank";
import { getNthPunchingBagTeam } from "@/lib/skills/team/getPunchingBagRankings";
import { getNthBestRankingTeam } from "@/lib/skills/team/getRecordRankings";
import { getNthBestScoringTeam } from "@/lib/skills/team/getScorerRankings";

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
        You are League Insider AI, an expert analyst for this fantasy football league.
        
        Current Intent Context: The user query matches [${intent.toUpperCase()}].
        
        CRITICAL TOOL USE INSTRUCTIONS:
        - If the intent is [WEEKLY] or [RANKING], check your analytical tools before trusting text context chunks.
        - If the intent is [UNKNOWN], joke about the user's unrelated question. Offer to bring the conversation back to the fantasy football league statistics.

        Use ONLY the provided league data. When interpreting tool results or raw data:
        - Justify your answer with cold hard numbers.
        - Never mention metadata variable names or code terms, just real stats.
        - Be succinct (3-5 sentences).
        - Avoid citing team names in responses. Name the owners / managers of teams instead.
        
        Fallback Semantic Context:
        ${contextText}
      `,
      messages: modelMessages,
      maxSteps: 2, // Crucial: allows the model to process tool results before replying

      tools: {
        getWeeklyRankings: tool({
          description:
            "Calculates league leaderboards, total points, scores, and best-performing players for owners / managers on a week-by-week basis.",
          parameters: z.object({
            season: z.number().default(2025),
            targetWeek: z
              .number()
              .optional()
              .describe("Specific week to isolate (e.g., Week 4)."),
          }),
          execute: async ({ season, targetWeek }) => {
            const data = await getWeeklyRankingsAndAwards(season);
            if (targetWeek)
              return { week: targetWeek, rankings: data.get(targetWeek) ?? [] };
            return Object.fromEntries(data);
          },
        }),

        getBadBenchingRankings: tool({
          description:
            "Ranks league owners / managers based on who left the most points off the board, sitting impactful players their bench instead of starting them (missed opportunities/lineup mistakes). Use 'desc' for worst managers (most benched points), 'asc' for optimal managers.",
          parameters: z.object({
            season: z.number().default(2025),
            order: z.enum(["asc", "desc"]).default("desc"),
          }),
          execute: async ({ season, order }) => {
            return {
              leaderboard: await getTotalMissedOpportunities(season, order),
            };
          },
        }),

        getPlayerScorerRankings: tool({
          description:
            "Retrieves a specific NFL player and their season total points scored. Use 'desc' for top scorers, 'asc' for lowest scorers. The skill retrieves by rank (1 = 1st best, 2 = 2nd, 3 = 3rd, etc...) and includes an optional player position filter (Best scoring WR, RB, QB, etc...).",
          parameters: z.object({
            n: z.number().default(1),
            order: z.enum(["asc", "desc"]).default("desc"),
            season: z.number().default(2025),
            position: z
              .string()
              .optional()
              .describe(
                "Optional position filter like 'QB', 'RB', 'WR', 'TE'.",
              ),
          }),
          execute: async ({ n, order, season, position }) => {
            const filter = position ? { position } : undefined;
            const player = await getNthScoringPlayer({
              n,
              order,
              season,
              filter,
            });
            return { rank: n, player };
          },
        }),

        getValueRatioRankings: tool({
          description:
            "Retrieves a specific ranked NFL player based on how much they exceeded or missed their pre-season projections (Value Ratio). Ratios above 1 indicate a player exceeded expectactions, while being below 1 is a disappointing season. Use n: The rank index to fetch. Use 'desc' for draft steals, 'asc' for major draft busts. 1 for the ultimate value/steal OR bust, 2 for the next best OR next largest bust. There is also an optional player position filter available to help with more specific queries as well (QB, TE, D/ST).",
          parameters: z.object({
            n: z.number().default(1),
            order: z.enum(["asc", "desc"]).default("desc"),
            season: z.number().default(2025),
            position: z
              .string()
              .optional()
              .describe(
                "Optional position filter like 'QB', 'RB', 'WR', 'TE'.",
              ),
          }),
          execute: async ({ n, order, season, position }) => {
            const filter = position ? { position } : undefined;
            const player = await getNthValueRatioPlayer({
              n,
              order,
              season,
              filter,
            });
            return { rank: n, player };
          },
        }),

        getPunchingBagRankings: tool({
          description:
            "Retrieves a specific ranked owner / manager by calculating who had the most total points scored AGAINST them by opponents over the season (unlucky vs lucky matchups). (1 = most unlucky punching bag). Use 'desc' for most points against (unlucky). Use 'asc' for fewest points against (lucky)..",
          parameters: z.object({
            n: z.number().default(1),
            order: z.enum(["asc", "desc"]).default("desc"),
            season: z.number().default(2025),
          }),
          execute: async ({ n, order, season }) => {
            const team = await getNthPunchingBagTeam({ n, order, season });
            return { rank: n, team };
          },
        }),

        getManagerWinLossRecords: tool({
          description:
            "Retrieves a specific ranked manager by wins, losses, and percentages. (1 = league champion/best record). Use 'desc' to count down from first place.",
          parameters: z.object({
            n: z.number().default(1),
            order: z.enum(["asc", "desc"]).default("desc"),
            season: z.number().default(2025),
          }),
          execute: async ({ n, order, season }) => {
            const team = await getNthBestRankingTeam({ n, order, season });
            return { standingRank: n, team };
          },
        }),

        getTeamScorerRankings: tool({
          description:
            "Retrieves a specific ranked manager by total points scored 'Points For' (1 = highest powerhouse squad). Use 'desc' for highest point totals.",
          parameters: z.object({
            n: z.number().default(1),
            order: z.enum(["asc", "desc"]).default("desc"),
            season: z.number().default(2025),
          }),
          execute: async ({ n, order, season }) => {
            const team = await getNthBestScoringTeam({ n, order, season });
            return { scoringRank: n, team };
          },
        }),
      },
    });

    console.log("Streaming response back to client");
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("❌ Chat route error:", err);
    throw err;
  }
}
