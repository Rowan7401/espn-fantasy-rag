import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { CONFIG } from '../../config';
import { detectIntent, getRetrievalConfig, logIntent } from '../clients/intent';
const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

// Adjust your return type to give the route everything it needs
export async function getContext(query: string): Promise<{ contextText: string; intent: string }> {
  console.log("🔎 getContext() called with query:", query);

  // 1. Intent detection
  const intent = detectIntent(query);
  const { topK } = getRetrievalConfig(intent);

  logIntent(query, intent, topK);

  // 2. Generate embedding
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const vector = embeddingResponse.data[0].embedding;

  // 3. Query Pinecone with dynamic topK
  const queryResponse = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  // 4. Build context
  const contextText = queryResponse.matches
    ?.map(match => match.metadata?.text)
    .filter(Boolean)
    .join("\n---\n") || "";

  // Return both items back to the API route handler
  return { contextText, intent };
}