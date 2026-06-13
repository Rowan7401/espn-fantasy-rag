import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { getContext } from "@/lib/rag/context";
import { z } from "zod";

// Import analytical skills
import { getTotalMissedOpportunities } from "@/lib/skills/league/getBadBenchingOwnerRank";
import { getWeeklyRankingsAndAwards } from "@/lib/skills/league/getWeeklyPtsRank";
import { sortPlayerByScoring } from "@/lib/skills/player/getPlayerScorerRank";
import { sortPlayerByValueRatio } from "@/lib/skills/player/getValueRatioRank";
import { sortTeamForPunchingBag } from "@/lib/skills/team/getPunchingBagRankings";
import { sortTeamByWins } from "@/lib/skills/team/getRecordRankings";
import { sortTeamByScoring } from "@/lib/skills/team/getScorerRankings";

export async function POST(req: Request) {
  try {
    console.log("📩 /api/chat endpoint hit");
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.parts?.[0]?.text ?? "";

    // Unpack everything safely in one simple, asynchronous step
    const { contextText, intent } = await getContext(lastMessage);
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `
        You are League Insider AI, an expert analyst for this fantasy football league.
        
        Current Intent Context: The user query matches [${intent.toUpperCase()}].
        
        CRITICAL TOOL USE INSTRUCTIONS:
        - If the intent is [WEEKLY] or [RANKING], check your analytical tools before trusting text context chunks.
        - If the intent is [UNKNOWN], politely guide the conversation back to the fantasy football league statistics.

        Use ONLY the provided league data. 
        ...
        
        Fallback Semantic Context:
        ${contextText}
      `,
      messages: modelMessages,
      maxSteps: 2, // Crucial: allows the model to process tool results before replying
      
      // 2. Clear, distinct English instructions for the model's router
      tools: {
        
        getWeeklyRankings: {
          description: "Calculates league leaderboards, total points, scores, and best-performing players for managers on a week-by-week basis.",
          parameters: z.object({
            season: z.number().default(2025),
            targetWeek: z.number().optional().description("Specific week to isolate (e.g., Week 4).")
          }),
          execute: async ({ season, targetWeek }) => {
            const data = await getWeeklyRankingsAndAwards(season);
            if (targetWeek) return { week: targetWeek, rankings: data.get(targetWeek) ?? [] };
            return Object.fromEntries(data);
          }
        },

        getBadBenchingRankings: {
          description: "Ranks league managers based on who left the most points sitting on their bench instead of starting them (missed opportunities/lineup mistakes).",
          parameters: z.object({
            season: z.number().default(2025),
            order: z.enum(["asc", "desc"]).default("desc").description("Use 'desc' for worst managers (most benched points), 'asc' for optimal managers.")
          }),
          execute: async ({ season, order }) => {
            return { leaderboard: await getTotalMissedOpportunities(season, order) };
          }
        },

        getPlayerScorerRankings: {
          description: "Ranks individual NFL football players by their total fantasy point production over the course of the entire season.",
          parameters: z.object({ season: z.number().default(2025) }),
          execute: async ({ season }) => {
            return { players: await sortPlayerByScoring(season) };
          }
        },

        getValueRatioRankings: {
          description: "Ranks NFL football players by how much they exceeded or missed their pre-season expectations using a value ratio. A ratio above 1.0 means a draft steal / breakout star. Below 1.0 means a major draft bust.",
          parameters: z.object({ season: z.number().default(2025) }),
          execute: async ({ season }) => {
            return { rankings: await sortPlayerByValueRatio(season) };
          }
        },

        getPunchingBagRankings: {
          description: "Ranks the most unlucky managers by calculating who had the most total points scored AGAINST them by opponents over the season.",
          parameters: z.object({ season: z.number().default(2025) }),
          execute: async ({ season }) => {
            return { leaders: await sortTeamForPunchingBag(season) };
          }
        },

        getManagerWinLossRecords: {
          description: "Ranks league managers by their basic standings: total wins, losses, win percentages, and overall league table ranking.",
          parameters: z.object({ season: z.number().default(2025) }),
          execute: async ({ season }) => {
            return { standings: await sortTeamByWins(season) };
          }
        },

        getTeamScorerRankings: {
          description: "Ranks league managers by their total points scored ('Points For') across the entire duration of the season.",
          parameters: z.object({ season: z.number().default(2025) }),
          execute: async ({ season }) => {
            return { scores: await sortTeamByScoring(season) };
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