import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { CONFIG } from '../../config';

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

export async function getContext(query: string) {
  // 1. Convert user's question into a vector
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const vector = embeddingResponse.data[0].embedding;

  // 2. Query Pinecone for the top 5 most relevant records
  // We include metadata so we can get the 'text' property
  const queryResponse = await index.query({
    vector,
    topK: 5,
    includeMetadata: true,
    // Optional: Add logic here to filter by 'type' if the query contains certain keywords
  });

  // 3. Extract the text from the results and join them into one block
  const contextText = queryResponse.matches
    .map(match => match.metadata?.text)
    .filter(Boolean)
    .join("\n---\n");

  return contextText;
}