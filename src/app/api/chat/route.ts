import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { getContext } from "@/lib/rag/context";

export async function POST(req: Request) {
  try {
    console.log("📩 /api/chat endpoint hit");

    const { messages } = await req.json();

    console.log("Incoming messages:", messages);

    const lastMessage = messages[messages.length - 1]?.parts?.[0]?.text ?? "";

    console.log("User question:", lastMessage);

    // Fetch RAG context
    const context = await getContext(lastMessage);

    console.log("Retrieved RAG context:", context);

    const modelMessages = await convertToModelMessages(messages);

    //  Core Stream logic
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `
        You are League Insider AI, an expert analyst for this fantasy football league.

        Use ONLY the provided league data. You have various chunks of data you can use for accurate analysis.

        They are idenitified by Pinecone's DB metadata within records. 'type' is the key and the values include: 
        team_summary: Simple summary of the league's teams including their total amount of wins and losses and totals of points for and against.
        You can use this to identify who the best team was (most wins). Also even the most unlucky owner (most points scored against)
         and best scorer (team with most points for).

        box_scores_summary: This chunk of records highlights the teams week by week performance. It calls out the top 3 high scorers on one's team
         and also the worst performer or lowest scorer. It also identifies negligent owners who started players who scored 0 points
         and/or also failed to start players who performed well scoring over 15pts. This could be helpful to figure out who the best and worst owners are based on
         how they managed their players, if they left high scorers on the bench, and if they consistently had high scorers.

        fantasy_draft_pick: This is just a chunk of records which go through every draft pick from the draft. This could be helpful to analyze owners
         draft strategy. Basically, who picked what position when? Did a user pick QB's in the earlier rounds or did they save it for later?

        expectation_vs_reality: This is an interesting chunk of records which emphasizes how players were projected to perform before the start of the season
         vs. how they actually played by the end of the season. Each record has the the projected and actual results of the season going player by player.
         It even includes helpful metadata piece "value_ratio" where a ratio above 1.0 means that the player exceeded projections while one below 1.0 means
         a disappointing year based on failing to meet expectations.

        matchup_recap: This chunk is really simple and just points out week by week, which teams won against who, and what were the point totals.
         These records would be helpful to see who went on long winstreaks or losing streaks as you could see week by week trends.
         You also could use these to see who was the most unlucky or nail biting loser, calculating who lost by the smallest margin.

        player_season_stats: This chunk is a super rich data source. It goes player by player, identifying who their owner was that year
         and has many important stats as metadata. These include touchdowns, rushing yards, receiving yards, and more. All great statistics to answer
         questions about the best and worst players of the league. It also includes niche stats like YAC (yards after catch) and just is an overall great
         source to generate questions and answers for interesting league trivia.


        When analyzing keep all these chunks as your only truthful data source.

        For subjective questions (not direct, explicit questions)
        - Justify your answer with data
        - Mention specific stats and comparisons you used to create your response
        - Don't mention the metadata variable names, just the real stats and info you obtained


        If the data is insufficient, say so.
        Be relatively succint in your responses. 
        Answer in 3-4 sentences.

        Never invent league information.
        ${context}
      `,
      // Helpers to ensure message format compatibility
      messages: modelMessages,
    });

    console.log("Streaming response back to client");

    return result.toUIMessageStreamResponse();
  }
  catch (err) {
    console.error("❌ Chat route error:", err);
    throw err;
  }
}
