import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { getContext } from '@/lib/rag/context';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // 1. Fetch RAG Context
  const context = await getContext(lastMessage);

  const modelMessages = await convertToModelMessages(messages);

  // 2. Core Stream logic
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a fantasy football expert. 
    Use the following league data to answer: 
    ${context}`,
    // NEW: Helpers to ensure message format compatibility
    messages: modelMessages,
  });

  // 3. NEW: Version 5 response helper
  return result.toUIMessageStreamResponse();
}