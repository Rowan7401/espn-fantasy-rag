import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { CONFIG } from '../../config';

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

export async function getContext(query: string) {

  console.log("🔎 getContext() called with query:", query);

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const vector = embeddingResponse.data[0].embedding;

  console.log("Generated embedding vector length:", vector.length);

  const queryResponse = await index.query({
    vector,
    topK: 8,
    includeMetadata: true,
    // Optional: Add logic here to filter by 'type' if the query contains certain keywords
  });

  console.log("Pinecone matches:", queryResponse.matches?.length);

  const contextText = queryResponse.matches
    ?.map(match => match.metadata?.text)
    .filter(Boolean)
    .join("\n---\n");

  console.log("Context text assembled:", contextText);

  return contextText;
}