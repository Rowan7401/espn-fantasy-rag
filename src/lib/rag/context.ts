import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { CONFIG } from '../../config';
import { detectIntent, getRetrievalConfig, logIntent } from '../clients/intent';
const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

export async function getContext(query: string) {
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

  console.log("Generated embedding vector length:", vector.length);
  console.log("🔥 FINAL topK being used:", topK);

  // 3. Query Pinecone with dynamic topK
  const queryResponse = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  console.log("Pinecone matches:", queryResponse.matches?.length);

  // 4. Build context
  const contextText = queryResponse.matches
    ?.map(match => match.metadata?.text)
    .filter(Boolean)
    .join("\n---\n");

  console.log("Context text assembled:", contextText);

  return contextText;
}