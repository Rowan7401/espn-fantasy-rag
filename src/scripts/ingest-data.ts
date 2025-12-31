import { CONFIG } from '../config';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

async function smokeTest() {
  console.log("🚀 Starting Smoke Test...");

  const testText = "Christian McCaffrey is the top pick for the 2025 season.";

  // 1. Generate Embedding from OpenAI
  console.log("☁️  Fetching embedding from OpenAI...");
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: testText,
  });
  const vector = embeddingResponse.data[0].embedding;

  // 2. Upsert to Pinecone
  console.log("🌲 Upserting to Pinecone...");
  await index.upsert([{
    id: "test-1",
    values: vector,
    metadata: { text: testText }
  }]);

  // 3. Wait for indexing (Serverless usually takes a few seconds)
  console.log("⏱️  Waiting 5 seconds for Pinecone to index...");
  await new Promise(r => setTimeout(r, 5000));

  // 4. Query it back
  console.log("🔍 Querying Pinecone to verify...");
  const queryResponse = await index.query({
    vector: vector,
    topK: 1,
    includeMetadata: true
  });

  if (queryResponse.matches && queryResponse.matches[0]?.metadata?.text === testText) {
    console.log("✅ SUCCESS! The data was stored and retrieved correctly.");
  } else {
    console.log("❌ FAILED: Could not retrieve the test data.");
  }
}

smokeTest().catch(console.error);
