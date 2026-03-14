import "dotenv/config";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { CONFIG } from "../config";

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

/**
 * 1. Data array that will be text value of pinecone records
 */

/**
 * 2. ID HELPER
 */
// function createReadableIdDraft(sentence: string): string {
//   const roundMatch = sentence.match(/round\s(\d+)/i);
//   const pickMatch = sentence.match(/pick\s(\d+)/i);
//   const teamMatch = sentence.match(/the team (.+?) selected/i);
//   const playerMatch = sentence.match(/selected (.+?) during/i);

//   const round = roundMatch ? `R${roundMatch[1]}` : "R0";
//   const pick = pickMatch ? `P${pickMatch[1]}` : "P0";

//   const team = teamMatch
//     ? teamMatch[1]
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "")
//         .substring(0, 12)
//     : "unknownteam";

//   const player = playerMatch
//     ? playerMatch[1]
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "")
//         .substring(0, 12)
//     : "unknownplayer";

//   return `draft-2025-${round}-${pick}-${team}-${player}`;
// }

/**
 * 2. ID HELPER (TEAM SUMMARY)
 */
function createReadableId(sentence: string): string {
  const teamMatch = sentence.match(/the team (.+?), owned/i);

  const team = teamMatch
    ? teamMatch[1]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 16)
    : "unknownteam";

  return `team-2025-${team}`;
}
/**
 * 3. MAIN INGESTION FUNCTION
 */
async function manuallyUpsertData() {
  console.log(
    `🚀 Starting draft ingestion for ${ingestableSentences.length} records...`
  );

  const batchSize = 100;

  for (let i = 0; i < ingestableSentences.length; i += batchSize) {
    const currentBatch = ingestableSentences.slice(i, i + batchSize);

    console.log(`🧠 Embedding batch...`);
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: currentBatch,
    });

    const vectors = embeddingResponse.data.map((item, idx) => {
      const sentence = currentBatch[idx];

      // const draftMetadata: Record<string, any> = {
      //   text: sentence,
      //   type: "fantasy_draft_pick",
      //   league: "fantasy_football",
      //   season: 2025,
      // };

      const metadata: Record<string, any> = {
        text: sentence,
        type: "team_summary",
        league: "fantasy_football",
        season: 2025,
      };

      const teamMatch = sentence.match(/the team (.+?), owned/i);
      const ownerMatch = sentence.match(/owned by (.+?),/i);
      const winsMatch = sentence.match(/finished with a (\d+) win/i);
      const lossesMatch = sentence.match(/and (\d+) loss/i);
      const pointsForMatch = sentence.match(/scored ([\d.]+) total points/i);
      const pointsAgainstMatch = sentence.match(/allowing ([\d.]+) points/i);

      if (teamMatch) metadata.team = teamMatch[1];
      if (ownerMatch) metadata.owner = ownerMatch[1];
      if (winsMatch) metadata.wins = parseInt(winsMatch[1]);
      if (lossesMatch) metadata.losses = parseInt(lossesMatch[1]);
      if (pointsForMatch) metadata.points_for = parseFloat(pointsForMatch[1]);
      if (pointsAgainstMatch) metadata.points_against = parseFloat(pointsAgainstMatch[1]);

      return {
        id: createReadableId(sentence),
        values: item.embedding,
        metadata,
      };
    });

    console.log(`📡 Upserting ${vectors.length} vectors to Pinecone...`);
    await index.upsert(vectors);
  }

  console.log(
    "✅ DONE! Fantasy data successfully upserted into Pinecone."
  );
}

// Execute
manuallyUpsertData().catch(console.error);
