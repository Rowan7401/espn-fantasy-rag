import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { getContext } from "@/lib/rag/context";

import { weeklyRankingsTool } from "@/lib/skills/league/getWeeklyRankingsTool";
import { playerRankingsTool } from "@/lib/skills/player/getPlayerRankingsTool";
import { valueRankingsTool } from "@/lib/skills/player/getValueRankingsTool";
import { punchingBagTool } from "@/lib/skills/team/getPunchingBagTool";
import { getTeamScorerRankingsTool } from "@/lib/skills/team/getTeamScorerRankingsTool";
import { badBenchRankingTool } from "@/lib/skills/league/getManagerRankingTool";
import { teamRecordsTool } from "@/lib/skills/team/getTeamRecordsTool";

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
    
        You answer questions using the provided league context and, when appropriate, tool results.
        Tool call results are preferred and should be more commonly used.
        Never invent league statistics or numbers.
    
        INTENT TYPES:
        - RANKING: season-long league comparisons, standings, manager records, scoring,
          value rankings, bench rankings, or other ranked league statistics.
        - WEEKLY: week-specific league outcomes and performance.
        - COMPARISON: schedule strength, luck, unlucky outcomes, or other comparative
          league analytics.
        - PLAYER_SEASON_STATS: granular season statistics for NFL players, such as points, yards,
          touchdowns, receptions, targets, rushing attempts, receiving yards, or
          other player-level season metrics.
        - FACT: simple semantic questions answerable from retrieved league context.
        - UNKNOWN: unrelated questions; briefly redirect back to fantasy football.
    
        DATA SOURCE RULES:
        - PLAYER_SEASON_STATS questions must be answered using retrieved contextText.
          Do NOT use a tool for PLAYER_SEASON_STATS questions.
        - RANKING, WEEKLY, and COMPARISON questions should use the most appropriate
          tool when one exists.
        - FACT questions should use the provided contextText.
        - Tool results are authoritative for calculations and rankings performed by tools.
        - Retrieved context is authoritative for player season records contained within it.
        - Never invent a statistic that is not present in the available data.
    
        RESPONSE RULES:
        - Be concise (3–5 sentences max).
        - Use only real numbers from tool results or retrieved context.
        - Refer to managers by their real name only. DO NOT use their team names.
        - Do not mention tools, schemas, retrieval, context, or internal logic.
        - Justify statistical conclusions with the available data.
        - Make jokes and jabs towards managers / owners when appropriate.
        - For remarkable NFL player statistics, comedic observations are encouraged when relevant.
        - Never use tools for questions that are unrelated to fantasy football.
    
        RETRIEVED LEAGUE CONTEXT:
        ${contextText}
    
        CURRENT INTENT: ${intent.toUpperCase()}
      `,
    
      messages: modelMessages,
    
      tools: {
        weeklyRankingsTool,
        badBenchRankingTool,
        playerRankingsTool,
        valueRankingsTool,
        punchingBagTool,
        teamRecordsTool,
        getTeamScorerRankingsTool,
      },
    
      stopWhen: stepCountIs(3)
    });

    console.log("Streaming response back to client");
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("❌ Chat route error:", err);
    throw err;
  }
}
