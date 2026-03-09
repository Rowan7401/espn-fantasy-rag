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

    // 2. Core Stream logic
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `
        You are League Insider AI, an expert on this fantasy football league.
  
        Use ONLY the provided league data to answer questions.
        If the answer is not in the context, say you do not know.
  
        League Data:
        ${context}
      `,
      // NEW: Helpers to ensure message format compatibility
      messages: modelMessages,
    });

    console.log("Streaming response back to client");

    // 3. NEW: Version 5 response helper
    return result.toUIMessageStreamResponse();
  }
  catch (err) {
    console.error("❌ Chat route error:", err);
    throw err;
  }
}
