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
        - **IMPORTANT** Refer to managers by their real name only. DO NOT use their team names. They are slightly explicit and offensive.
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
        weeklyRankingsTool,
        badBenchRankingTool,
        playerRankingsTool,
        valueRankingsTool,
        punchingBagTool,
        teamRecordsTool,
        getTeamScorerRankingsTool, 
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
