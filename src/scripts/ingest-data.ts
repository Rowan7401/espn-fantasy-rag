import 'dotenv/config';
import OpenAI from "openai";
import { Pinecone } from '@pinecone-database/pinecone';
import { CONFIG } from '../config';

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

/**
 * 1. Matchup data array that will be text value of pinecone records
 */
const matchupSentences = [
  "Week 1: Team: 'Start Diggs in yo butt twin' won against Team: 'Aidan’s Maidens'. Winner 'Start Diggs in yo butt twin' scored 129.32 and Loser 'Aidan’s Maidens' scored 87.72.",

  "Week 1: Team: 'Tyler's Top Team' won against Team: 'Njigbas in Paris'. Winner 'Tyler's Top Team' scored 134.42 and Loser 'Njigbas in Paris' scored 126.62.",
  "Week 1: Team: 'The Super Soakers' won against Team: 'Steam rivers'. Winner 'The Super Soakers' scored 128.16 and Loser 'Steam rivers' scored 69.58.",
  "Week 1: Team: 'Lamar Jack0ff' won against Team: 'TOBENATORS'. Winner 'Lamar Jack0ff' scored 125.46 and Loser 'TOBENATORS' scored 94.58.",
  "Week 2: Team: 'Tyler's Top Team' won against Team: 'Aidan’s Maidens'. Winner 'Tyler's Top Team' scored 104.98 and Loser 'Aidan’s Maidens' scored 96.74.",
  "Week 2: Team: 'Steam rivers' won against Team: 'Start Diggs in yo butt twin'. Winner 'Steam rivers' scored 141.94 and Loser 'Start Diggs in yo butt twin' scored 127.2.",
  "Week 2: Team: 'Lamar Jack0ff' won against Team: 'Njigbas in Paris'. Winner 'Lamar Jack0ff' scored 134.9 and Loser 'Njigbas in Paris' scored 100.3.",
  "Week 2: Team: 'TOBENATORS' won against Team: 'The Super Soakers'. Winner 'TOBENATORS' scored 134.28 and Loser 'The Super Soakers' scored 98.82.",
  "Week 3: Team: 'Aidan’s Maidens' won against Team: 'Steam rivers'. Winner 'Aidan’s Maidens' scored 146.02 and Loser 'Steam rivers' scored 129.84.",
  "Week 3: Team: 'Lamar Jack0ff' won against Team: 'Tyler's Top Team'. Winner 'Lamar Jack0ff' scored 122.62 and Loser 'Tyler's Top Team' scored 103.86.",
  "Week 3: Team: 'Start Diggs in yo butt twin' won against Team: 'TOBENATORS'. Winner 'Start Diggs in yo butt twin' scored 116.96 and Loser 'TOBENATORS' scored 91.44.",
  "Week 3: Team: 'Njigbas in Paris' won against Team: 'The Super Soakers'. Winner 'Njigbas in Paris' scored 139.42 and Loser 'The Super Soakers' scored 113.22.",
  "Week 4: Team: 'Aidan’s Maidens' won against Team: 'Lamar Jack0ff'. Winner 'Aidan’s Maidens' scored 138.08 and Loser 'Lamar Jack0ff' scored 135.38.",
  "Week 4: Team: 'TOBENATORS' won against Team: 'Steam rivers'. Winner 'TOBENATORS' scored 127.32 and Loser 'Steam rivers' scored 101.9.",
  "Week 4: Team: 'Tyler's Top Team' won against Team: 'The Super Soakers'. Winner 'Tyler's Top Team' scored 166.9 and Loser 'The Super Soakers' scored 138.26.",
  "Week 4: Team: 'Start Diggs in yo butt twin' won against Team: 'Njigbas in Paris'. Winner 'Start Diggs in yo butt twin' scored 140.08 and Loser 'Njigbas in Paris' scored 104.86.",
  "Week 5: Team: 'Aidan’s Maidens' won against Team: 'TOBENATORS'. Winner 'Aidan’s Maidens' scored 134.02 and Loser 'TOBENATORS' scored 110.34.",
  "Week 5: Team: 'The Super Soakers' won against Team: 'Lamar Jack0ff'. Winner 'The Super Soakers' scored 168.34 and Loser 'Lamar Jack0ff' scored 139.28.",
  "Week 5: Team: 'Steam rivers' won against Team: 'Njigbas in Paris'. Winner 'Steam rivers' scored 162.7 and Loser 'Njigbas in Paris' scored 120.34.",
  "Week 5: Team: 'Start Diggs in yo butt twin' won against Team: 'Tyler's Top Team'. Winner 'Start Diggs in yo butt twin' scored 108.18 and Loser 'Tyler's Top Team' scored 66.22.",
  "Week 6: Team: 'The Super Soakers' won against Team: 'Aidan’s Maidens'. Winner 'The Super Soakers' scored 107.4 and Loser 'Aidan’s Maidens' scored 80.24.",
  "Week 6: Team: 'Njigbas in Paris' won against Team: 'TOBENATORS'. Winner 'Njigbas in Paris' scored 126.34 and Loser 'TOBENATORS' scored 93.44.",
  "Week 6: Team: 'Lamar Jack0ff' won against Team: 'Start Diggs in yo butt twin'. Winner 'Lamar Jack0ff' scored 103.76 and Loser 'Start Diggs in yo butt twin' scored 87.28.",
  "Week 6: Team: 'Steam rivers' won against Team: 'Tyler's Top Team'. Winner 'Steam rivers' scored 147.02 and Loser 'Tyler's Top Team' scored 144.58.",

  "Week 7: Team: 'Aidan’s Maidens' won against Team: 'Njigbas in Paris'. Winner 'Aidan’s Maidens' scored 155.68 and Loser 'Njigbas in Paris' scored 137.34.",
  "Week 7: Team: 'The Super Soakers' won against Team: 'Start Diggs in yo butt twin'. Winner 'The Super Soakers' scored 86.66 and Loser 'Start Diggs in yo butt twin' scored 86.62.",
  "Week 7: Team: 'TOBENATORS' won against Team: 'Tyler's Top Team'. Winner 'TOBENATORS' scored 150.78 and Loser 'Tyler's Top Team' scored 75.94.",
  "Week 7: Team: 'Steam rivers' won against Team: 'Lamar Jack0ff'. Winner 'Steam rivers' scored 150.24 and Loser 'Lamar Jack0ff' scored 148.36.",
  "Week 8: Team: 'Start Diggs in yo butt twin' won against Team: 'Aidan’s Maidens'. Winner 'Start Diggs in yo butt twin' scored 142.58 and Loser 'Aidan’s Maidens' scored 95.46.",
  "Week 8: Team: 'Njigbas in Paris' won against Team: 'Tyler's Top Team'. Winner 'Njigbas in Paris' scored 125.38 and Loser 'Tyler's Top Team' scored 49.36.",
  "Week 8: Team: 'The Super Soakers' won against Team: 'Steam rivers'. Winner 'The Super Soakers' scored 121.52 and Loser 'Steam rivers' scored 114.86.",
  "Week 8: Team: 'TOBENATORS' won against Team: 'Lamar Jack0ff'. Winner 'TOBENATORS' scored 112.18 and Loser 'Lamar Jack0ff' scored 111.02.",
  "Week 9: Team: 'Aidan’s Maidens' won against Team: 'Tyler's Top Team'. Winner 'Aidan’s Maidens' scored 143.54 and Loser 'Tyler's Top Team' scored 78.6.",
  "Week 9: Team: 'Start Diggs in yo butt twin' won against Team: 'Steam rivers'. Winner 'Start Diggs in yo butt twin' scored 113.48 and Loser 'Steam rivers' scored 98.42.",
  "Week 9: Team: 'Lamar Jack0ff' won against Team: 'Njigbas in Paris'. Winner 'Lamar Jack0ff' scored 148.06 and Loser 'Njigbas in Paris' scored 90.32.",
  "Week 9: Team: 'TOBENATORS' won against Team: 'The Super Soakers'. Winner 'TOBENATORS' scored 131.0 and Loser 'The Super Soakers' scored 130.2.",

  "Week 10: Team: 'Steam rivers' won against Team: 'Aidan’s Maidens'. Winner 'Steam rivers' scored 161.62 and Loser 'Aidan’s Maidens' scored 137.2.",
  "Week 10: Team: 'Lamar Jack0ff' won against Team: 'Tyler's Top Team'. Winner 'Lamar Jack0ff' scored 117.04 and Loser 'Tyler's Top Team' scored 97.4.",
  "Week 10: Team: 'TOBENATORS' won against Team: 'Start Diggs in yo butt twin'. Winner 'TOBENATORS' scored 150.68 and Loser 'Start Diggs in yo butt twin' scored 101.6.",
  "Week 10: Team: 'Njigbas in Paris' won against Team: 'The Super Soakers'. Winner 'Njigbas in Paris' scored 132.32 and Loser 'The Super Soakers' scored 123.94.",
  "Week 11: Team: 'Lamar Jack0ff' won against Team: 'Aidan’s Maidens'. Winner 'Lamar Jack0ff' scored 102.22 and Loser 'Aidan’s Maidens' scored 91.2.",
  "Week 11: Team: 'Steam rivers' won against Team: 'TOBENATORS'. Winner 'Steam rivers' scored 136.9 and Loser 'TOBENATORS' scored 82.94.",
  "Week 11: Team: 'The Super Soakers' won against Team: 'Tyler's Top Team'. Winner 'The Super Soakers' scored 129.68 and Loser 'Tyler's Top Team' scored 108.84.",
  "Week 11: Team: 'Njigbas in Paris' won against Team: 'Start Diggs in yo butt twin'. Winner 'Njigbas in Paris' scored 133.42 and Loser 'Start Diggs in yo butt twin' scored 129.54.",
  "Week 12: Team: 'TOBENATORS' won against Team: 'Aidan’s Maidens'. Winner 'TOBENATORS' scored 154.16 and Loser 'Aidan’s Maidens' scored 142.22.",
  "Week 12: Team: 'Lamar Jack0ff' won against Team: 'The Super Soakers'. Winner 'Lamar Jack0ff' scored 111.42 and Loser 'The Super Soakers' scored 89.82.",
  "Week 12: Team: 'Njigbas in Paris' won against Team: 'Steam rivers'. Winner 'Njigbas in Paris' scored 204.46 and Loser 'Steam rivers' scored 98.16.",
  "Week 12: Team: 'Tyler's Top Team' won against Team: 'Start Diggs in yo butt twin'. Winner 'Tyler's Top Team' scored 119.08 and Loser 'Start Diggs in yo butt twin' scored 92.9.",
  "Week 13: Team: 'Aidan’s Maidens' won against Team: 'The Super Soakers'. Winner 'Aidan’s Maidens' scored 114.72 and Loser 'The Super Soakers' scored 110.62.",
  "Week 13: Team: 'Njigbas in Paris' won against Team: 'TOBENATORS'. Winner 'Njigbas in Paris' scored 143.74 and Loser 'TOBENATORS' scored 114.18.",
  "Week 13: Team: 'Lamar Jack0ff' won against Team: 'Start Diggs in yo butt twin'. Winner 'Lamar Jack0ff' scored 146.34 and Loser 'Start Diggs in yo butt twin' scored 80.84.",
  "Week 13: Team: 'Steam rivers' won against Team: 'Tyler's Top Team'. Winner 'Steam rivers' scored 131.2 and Loser 'Tyler's Top Team' scored 124.24.",
  "Week 14: Team: 'TOBENATORS' won against Team: 'Lamar Jack0ff'. Winner 'TOBENATORS' scored 299.66 and Loser 'Lamar Jack0ff' scored 273.44.",
  "Week 14: Team: 'Njigbas in Paris' won against Team: 'Steam rivers'. Winner 'Njigbas in Paris' scored 286.28 and Loser 'Steam rivers' scored 238.9.",
  "Week 14: Team: 'The Super Soakers' won against Team: 'Aidan’s Maidens'. Winner 'The Super Soakers' scored 239.36 and Loser 'Aidan’s Maidens' scored 213.86.",
  "Week 14: Team: 'Tyler's Top Team' won against Team: 'Start Diggs in yo butt twin'. Winner 'Tyler's Top Team' scored 205.06 and Loser 'Start Diggs in yo butt twin' scored 202.6.",
  "Week 15: Team: 'TOBENATORS' won against Team: 'Njigbas in Paris'. Winner 'TOBENATORS' scored 301.94 and Loser 'Njigbas in Paris' scored 260.34.",
  "Week 15: Team: 'Lamar Jack0ff' won against Team: 'Steam rivers'. Winner 'Lamar Jack0ff' scored 244.72 and Loser 'Steam rivers' scored 238.5.",
  "Week 15: Team: 'Tyler's Top Team' won against Team: 'The Super Soakers'. Winner 'Tyler's Top Team' scored 218.4 and Loser 'The Super Soakers' scored 196.38.",
  "Week 15: Team: 'Aidan’s Maidens' won against Team: 'Start Diggs in yo butt twin'. Winner 'Aidan’s Maidens' scored 209.44 and Loser 'Start Diggs in yo butt twin' scored 182.2."
];

/**
 * 2. ID HELPER
 * Creates: 2025-W11-LamarJack-vs-AidansMaid
 */
function createReadableId(sentence: string): string {
  const weekMatch = sentence.match(/Week\s(\d+)/i);
  const week = weekMatch ? `W${weekMatch[1]}` : 'W0';
  
  // Get teams between 'Team: ' and the next quote
  const teams = [...sentence.matchAll(/Team:\s'([^']+)'/g)].map(m => 
    m[1].replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)
  );

  return `2025-${week}-${teams[0] || 'T1'}-vs-${teams[1] || 'T2'}`;
}

/**
 * 3. MAIN INGESTION FUNCTION
 */
async function ingestMatchups() {
  console.log(`🚀 Starting ingestion for ${matchupSentences.length} records...`);

  // Process all at once since 61 is well under the 1000 limit
  const batchSize = 100;
  
  for (let i = 0; i < matchupSentences.length; i += batchSize) {
    const currentBatch = matchupSentences.slice(i, i + batchSize);
    
    console.log(`🧠 Embedding batch...`);
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: currentBatch,
    });

    const vectors = embeddingResponse.data.map((item, idx) => {
      const sentence = currentBatch[idx];
      const weekMatch = sentence.match(/Week\s(\d+)/i);
      
      return {
        id: createReadableId(sentence),
        values: item.embedding,
        metadata: {
          text: sentence,
          week: weekMatch ? parseInt(weekMatch[1]) : 0,
          type: "matchup_recap",
          year: 2025
        }
      };
    });

    console.log(`📡 Upserting vectors to Pinecone...`);
    await index.upsert(vectors);
  }

  console.log("✅ DONE! All matchups are successfully in Pinecone with unique IDs.");
}

// Execute
ingestMatchups().catch(console.error);