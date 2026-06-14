import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
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
        getWeeklyRankings: {
          description: "Calculates league leaderboards, total points, scores, and best-performing players for owners / managers on a week-by-week basis.",
          parameters: z.object({
            season: z.number().default(2025),
            targetWeek: z.number().describe("Specific week to isolate (e.g., Week 4).").optional()
          }),
          execute: async ({ season, targetWeek }) => {
            const data = await getWeeklyRankingsAndAwards(season);
            if (targetWeek) return { week: targetWeek, rankings: data.get(targetWeek) ?? [] };
            return Object.fromEntries(data);
          }
        },

        getBadBenchingRankings: {
          description: "Ranks league managers based on who left the most points off the board, sitting impactful players their bench instead of starting them (missed opportunities/lineup mistakes).",
          parameters: z.object({
            season: z.number().default(2025),
            order: z.enum(["asc", "desc"]).describe("Use 'desc' for worst managers (most benched points), 'asc' for optimal managers.").default("desc")
          }),
          execute: async ({ season, order }) => {
            return { leaderboard: await getTotalMissedOpportunities(season, order) };
          }
        },

        getPlayerScorerRankings: {
          description: "Retrieves a specific NFL player and their season total points scored. The skill retrieves by rank (1 = 1st best, 2 = 2nd, 3 = 3rd, etc...) and includes an optional player position filter (Best scoring WR, RB, QB, etc...).",
          parameters: z.object({
            n: z.number().describe("The rank index to retrieve. e.g. 1 for the highest scorer, 2 for the second highest.").default(1),
            order: z.enum(["asc", "desc"]).describe("Use 'desc' for top scorers, 'asc' for lowest scorers.").default("desc"),
            season: z.number().default(2025),
            position: z.string().describe("Optional position filter like 'QB', 'RB', 'WR', 'TE', 'D/ST', 'K'.").optional()
          }),
          execute: async ({ n, order, season, position }) => {
            const filter = position ? { position } : undefined;
            const player = await getNthScoringPlayer({ n, order, season, filter });
            return { rank: n, player };
          }
        },

        getValueRatioRankings: {
          description: "Retrieves a specific ranked NFL player based on how much they exceeded or missed their pre-season projections (Value Ratio). Ratios above 1 indicate a player exceeded expectactions, while being below 1 is a disappointing season. Optional player position filter is available to help with more specific queries as well (QB, TE, D/ST).",
          parameters: z.object({
            n: z.number().describe("The rank index to fetch. 1 for the ultimate value/steal or bust depending on ordering, 2 for the next best or next largest bust.").default(1),
            order: z.enum(["asc", "desc"]).describe("Use 'desc' for draft steals, 'asc' for major draft busts.").default("desc"),
            season: z.number().default(2025),
            position: z.string().describe("Optional position filter like 'QB', 'RB', 'WR', 'TE', 'D/ST', 'K'.").optional()
          }),
          execute: async ({ n, order, season, position }) => {
            const filter = position ? { position } : undefined;
            const player = await getNthValueRatioPlayer({ n, order, season, filter });
            return { rank: n, player };
          }
        },

        getPunchingBagRankings: {
          description: "Retrieves a specific ranked owner / manager by calculating who had the most total points scored AGAINST them by opponents over the season (unlucky vs lucky matchups).",
          parameters: z.object({
            n: z.number().describe("The rank index to fetch. 1 for the absolute most unlucky punching bag owner / manager.").default(1),
            order: z.enum(["asc", "desc"]).describe("Use 'desc' for most points against (unlucky), 'asc' for fewest points against (lucky).").default("desc"),
            season: z.number().default(2025)
          }),
          execute: async ({ n, order, season }) => {
            const team = await getNthPunchingBagTeam({ n, order, season });
            return { rank: n, team };
          }
        },

        getManagerWinLossRecords: {
          description: "Retrieves a specific ranked owner / manager by their basic standings: total wins, losses, and win percentages.",
          parameters: z.object({
            n: z.number().describe("The standing rank to pull. 1 for 1st place / league's best record, 2 for second place.").default(1),
            order: z.enum(["asc", "desc"]).describe("Use 'desc' to count down from first place, 'asc' to count up from last place.").default("desc"),
            season: z.number().default(2025)
          }),
          execute: async ({ n, order, season }) => {
            const team = await getNthBestRankingTeam({ n, order, season });
            return { standingRank: n, team };
          }
        },

        getTeamScorerRankings: {
          description: "Retrieves a specific ranked manager by their total points scored ('Points For') across the entire duration of the season.",
          parameters: z.object({
            n: z.number().describe("The scoring rank to look up. 1 for the highest scoring powerhouse squad.").default(1),
            order: z.enum(["asc", "desc"]).describe("Use 'desc' for highest point totals, 'asc' for the lowest scoring squads.").default("desc"),
            season: z.number().default(2025)
          }),
          execute: async ({ n, order, season }) => {
            const team = await getNthBestScoringTeam({ n, order, season });
            return { scoringRank: n, team };
          }
        }
      }
    });

    console.log("Streaming response back to client");
    return result.toUIMessageStreamResponse();
  }
  catch (err) {
    console.error("❌ Chat route error:", err);
    throw err;
  }
}