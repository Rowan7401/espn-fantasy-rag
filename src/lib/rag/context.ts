import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { CONFIG } from '../../config';
import { detectIntent, getRetrievalConfig, logIntent } from '../clients/intent';

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

export async function getContext(query: string): Promise<{ contextText: string; intent: string }> {
  console.log("🔎 getContext() called with query:", query);

  const intent = detectIntent(query);
  const { topK } = getRetrievalConfig(intent);

  logIntent(query, intent, topK);

  // Build dynamic metadata filters based on the detected intent
  const filter: Record<string, any> = {};

  if (intent === "weekly") {
    // Look for patterns like "week 4", "week 12", "w5", etc.
    const weekMatch = query.match(/\b(?:week|w)\s*(\d{1,2})\b/i);
    if (weekMatch) {
      const targetWeek = parseInt(weekMatch[1], 10);
      filter.week = targetWeek; // Isolate the week in question
      console.log(`🎯 Weekly intent detected. Applying hard metadata filter for week: ${targetWeek}`);
    }
  }

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const vector = embeddingResponse.data[0].embedding;

  // Query Pinecone with dynamic topK and metadata filters
  const queryResponse = await index.query({
    vector,
    topK,
    includeMetadata: true,
    filter: Object.keys(filter).length > 0 ? filter : undefined, // Only pass if filter has properties
  });

  // Build context
  const contextText = queryResponse.matches
    ?.map(match => match.metadata?.text)
    .filter(Boolean)
    .join("\n---\n") || "";

  // Return both items back to the API route handler
  return { contextText, intent };
}