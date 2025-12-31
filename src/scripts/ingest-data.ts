import { CONFIG } from "../config";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { fetchLeagueData } from "../lib/espn/fetcher";

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
  await index.upsert([
    {
      id: "test-1",
      values: vector,
      metadata: { text: testText },
    },
  ]);

  // 3. Wait for indexing (Serverless usually takes a few seconds)
  console.log("⏱️  Waiting 5 seconds for Pinecone to index...");
  await new Promise((r) => setTimeout(r, 5000));

  // 4. Query it back
  console.log("🔍 Querying Pinecone to verify...");
  const queryResponse = await index.query({
    vector: vector,
    topK: 1,
    includeMetadata: true,
  });

  if (
    queryResponse.matches &&
    queryResponse.matches[0]?.metadata?.text === testText
  ) {
    console.log("✅ SUCCESS! The data was stored and retrieved correctly.");
  } else {
    console.log("❌ FAILED: Could not retrieve the test data.");
  }
}

async function verifyESPN() {
  console.log("🏀 Testing ESPN 2025 Connection...");

  // Try to fetch with the mSettings view
  const data = await fetchLeagueData([
    'mSettings', 
    'mTeam', 
    'mRoster', 
    'mDraftDetail', 
    'mMatchupScore'
  ]);

  // If we used the history endpoint, 'data' will be an array [ { ...leagueData } ]
  const leagueData = Array.isArray(data) ? data[0] : data;

  if (!leagueData || !leagueData.settings) {
    console.log(
      "❌ Data structure mismatch. Raw response preview:",
      typeof data === "string"
        ? data.substring(0, 100)
        : "Object received but missing settings."
    );
    return;
  }

  const leagueName = leagueData.settings.name;
  const teams = leagueData.teams || [];

  console.log(`✅ Connected to League: "${leagueName}"`);
  console.log(`📊 Found ${teams.length} teams.`);
}

// function processData(data: any) {
//   const leagueData = Array.isArray(data) ? data[0] : data;

//   const leagueName = leagueData.settings?.name || "Unknown League";
//   const teams = leagueData.teams || [];

//   console.log(`✅ Connected to League: "${leagueName}"`);
//   console.log(`📊 Found ${teams.length} teams.`);

//   if (teams.length > 0) {
//     console.log(`🏆 First Team: ${teams[0].location} ${teams[0].nickname}`);
//   } else {
//     console.log(
//       "❌ No teams found. Check if your season ID (2024) matches your league."
//     );
//   }
// }

verifyESPN().catch(console.error);

// smokeTest().catch(console.error);
