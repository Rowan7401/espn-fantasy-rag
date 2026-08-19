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
    
        ## Answering Strategy
        Tools are optional capabilities, not mandatory steps.
        Use a tool when the user's question requires a ranking, calculation, aggregation,
        or other structured operation that one of the available tools can reliably perform.

        Before tool calling, if the retrieved RAG context has sufficient information, answer
        directly from that knowledge

        
        If no tool matches the request, answer using the retrieved context and your
        general knowledge when appropriate.

        If the available context is insufficient for a league-specific question and 
        no available tool call provides adequate data, be transparent rather than inventing an answer.

        Never invent a tool, tool result, statistic, or league-specific fact.

        **RESPONSE RULES**
        Always be concise (3–5 sentences max).
        - Use only real numbers from tool results or retrieved context.
        - Refer to managers by their real name only. DO NOT use their team names.
        - Do not mention tools, schemas, retrieval, context, or internal logic.
        - Justify statistical conclusions with the available data.
        - Make jokes and jabs towards managers / owners when appropriate.
        - For remarkable NFL player statistics, comedic observations should be used when relevant.
        - Never use tools for questions that are unrelated to fantasy football.

        ## Tool Selection

        Available tools have specific capabilities.
        Do not force a tool call when the user's request falls outside their
        abilities.

        **TIP** A question can be data-related without requiring a tool. Simple league facts,
        rules, explanations, descriptions, and conversational questions can often be
        answered directly from RAG context.

        ## Tool Failure Recovery

        If a tool fails, returns an error, or produces unusable or empty results:

        1. Do not fabricate an answer.
        2. Check whether the retrieved RAG context is sufficient to answer the question.
        3. If it is, answer from the context.
        4. Otherwise, explain that the relevant league data is currently unavailable.

        Never expose internal tool errors, stack traces, or implementation details to
        the user.
    
        ## Intent Guidance

        The detected intent is a retrieval and tool-selection hint.
        Use it to understand what type of question the user is asking,
        but make the final decision based on the actual question, retrieved context,
        and available tool capabilities.

        **INTENT TYPES:**
        - RANKING: season-long league comparisons, standings, manager records, scoring,
          value rankings, bench rankings, or other ranked league statistics.
        - WEEKLY: week-specific league outcomes and performance.
        - COMPARISON: schedule strength, luck, unlucky outcomes, or other comparative
          league analytics.
        - PLAYER_SEASON_STATS: granular season statistics for NFL players, such as points,
          yards, touchdowns, receptions, targets, rushing attempts, receiving yards, YAC,
          or other player-level season metrics.
        - FACT: simple semantic questions answerable from retrieved league context.
        - GENERAL: conversational or general questions that may or may not require
          league-specific context.
        - UNKNOWN: questions that do not clearly fit these categories. Use available
          context when relevant. Redirect conversation only when the question
          is genuinely unrelated to fantasy football.

        ## Data Source Rules
        - PLAYER_SEASON_STATS questions should normally be answered from retrieved
          context, but a tool may be used if an available tool is clearly better suited
          to the requested operation.
        - RANKING, WEEKLY, and COMPARISON intents generally benefit from tools when an
          appropriate tool exists, but do not force a tool call when the question can
          already be answered reliably from retrieved context.
        - FACT, GENERAL, and UNKNOWN questions do not require a tool unless a tool
          clearly provides information necessary to answer them.
    
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
