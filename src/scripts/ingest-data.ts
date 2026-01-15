import "dotenv/config";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { CONFIG } from "../config";

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });
const index = pc.index("fantasy-football");

/**
 * 1. Matchup data array that will be text value of pinecone records
 */
const ingestableSentences = [
  // "In round 1, pick 1, the team Steam rivers selected Ja'Marr Chase during the fantasy football draft.",
  // "In round 1, pick 2, the team Aidan’s Maidens selected Christian McCaffrey during the fantasy football draft.",
  // "In round 1, pick 3, the team Start Diggs in yo butt twin selected Saquon Barkley during the fantasy football draft.",
  // "In round 1, pick 4, the team Njigbas in Paris selected Jahmyr Gibbs during the fantasy football draft.",
  // "In round 1, pick 5, the team Tyler's Top Team selected Bijan Robinson during the fantasy football draft.",
  // "In round 1, pick 6, the team The Super Soakers selected Justin Jefferson during the fantasy football draft.",
  // "In round 1, pick 7, the team Lamar Jack0ff selected CeeDee Lamb during the fantasy football draft.",
  // "In round 1, pick 8, the team TOBENATORS selected Amon-Ra St. Brown during the fantasy football draft.",

  // "In round 2, pick 1, the team TOBENATORS selected Malik Nabers during the fantasy football draft.",
  // "In round 2, pick 2, the team Lamar Jack0ff selected Puka Nacua during the fantasy football draft.",
  // "In round 2, pick 3, the team The Super Soakers selected De'Von Achane during the fantasy football draft.",
  // "In round 2, pick 4, the team Tyler's Top Team selected Ashton Jeanty during the fantasy football draft.",
  // "In round 2, pick 5, the team Njigbas in Paris selected A.J. Brown during the fantasy football draft.",
  // "In round 2, pick 6, the team Start Diggs in yo butt twin selected Tee Higgins during the fantasy football draft.",
  // "In round 2, pick 7, the team Aidan’s Maidens selected Tyreek Hill during the fantasy football draft.",
  // "In round 2, pick 8, the team Steam rivers selected Jonathan Taylor during the fantasy football draft.",

  // "In round 3, pick 1, the team Steam rivers selected Nico Collins during the fantasy football draft.",
  // "In round 3, pick 2, the team Aidan’s Maidens selected Breece Hall during the fantasy football draft.",
  // "In round 3, pick 3, the team Start Diggs in yo butt twin selected Bucky Irving during the fantasy football draft.",
  // "In round 3, pick 4, the team Njigbas in Paris selected Derrick Henry during the fantasy football draft.",
  // "In round 3, pick 5, the team Tyler's Top Team selected Brock Bowers during the fantasy football draft.",
  // "In round 3, pick 6, the team The Super Soakers selected Josh Allen during the fantasy football draft.",
  // "In round 3, pick 7, the team Lamar Jack0ff selected Trey McBride during the fantasy football draft.",
  // "In round 3, pick 8, the team TOBENATORS selected Josh Jacobs during the fantasy football draft.",

  // "In round 4, pick 1, the team TOBENATORS selected Chase Brown during the fantasy football draft.",
  // "In round 4, pick 2, the team Lamar Jack0ff selected Lamar Jackson during the fantasy football draft.",
  // "In round 4, pick 3, the team The Super Soakers selected Sam LaPorta during the fantasy football draft.",
  // "In round 4, pick 4, the team Tyler's Top Team selected Drake London during the fantasy football draft.",
  // "In round 4, pick 5, the team Njigbas in Paris selected Jayden Daniels during the fantasy football draft.",
  // "In round 4, pick 6, the team Start Diggs in yo butt twin selected George Kittle during the fantasy football draft.",
  // "In round 4, pick 7, the team Aidan’s Maidens selected Davante Adams during the fantasy football draft.",
  // "In round 4, pick 8, the team Steam rivers selected Kyren Williams during the fantasy football draft.",

  // "In round 5, pick 1, the team Steam rivers selected Jalen Hurts during the fantasy football draft.",
  // "In round 5, pick 2, the team Aidan’s Maidens selected DeVonta Smith during the fantasy football draft.",
  // "In round 5, pick 3, the team Start Diggs in yo butt twin selected James Cook III during the fantasy football draft.",
  // "In round 5, pick 4, the team Njigbas in Paris selected Jaxon Smith-Njigba during the fantasy football draft.",
  // "In round 5, pick 5, the team Tyler's Top Team selected Alvin Kamara during the fantasy football draft.",
  // "In round 5, pick 6, the team The Super Soakers selected Chuba Hubbard during the fantasy football draft.",
  // "In round 5, pick 7, the team Lamar Jack0ff selected Brian Thomas Jr. during the fantasy football draft.",
  // "In round 5, pick 8, the team TOBENATORS selected Ladd McConkey during the fantasy football draft.",

  // "In round 6, pick 1, the team TOBENATORS selected Omarion Hampton during the fantasy football draft.",
  // "In round 6, pick 2, the team Lamar Jack0ff selected James Conner during the fantasy football draft.",
  // "In round 6, pick 3, the team The Super Soakers selected Terry McLaurin during the fantasy football draft.",
  // "In round 6, pick 4, the team Tyler's Top Team selected Garrett Wilson during the fantasy football draft.",
  // "In round 6, pick 5, the team Njigbas in Paris selected Kenneth Walker III during the fantasy football draft.",
  // "In round 6, pick 6, the team Start Diggs in yo butt twin selected Zay Flowers during the fantasy football draft.",
  // "In round 6, pick 7, the team Aidan’s Maidens selected Joe Burrow during the fantasy football draft.",
  // "In round 6, pick 8, the team Steam rivers selected T.J. Hockenson during the fantasy football draft.",

  // "In round 7, pick 1, the team Steam rivers selected Xavier Worthy during the fantasy football draft.",
  // "In round 7, pick 2, the team Aidan’s Maidens selected Mark Andrews during the fantasy football draft.",
  // "In round 7, pick 3, the team Start Diggs in yo butt twin selected George Pickens during the fantasy football draft.",
  // "In round 7, pick 4, the team Njigbas in Paris selected Mike Evans during the fantasy football draft.",
  // "In round 7, pick 5, the team Tyler's Top Team selected TreVeyon Henderson during the fantasy football draft.",
  // "In round 7, pick 6, the team The Super Soakers selected the Texans D/ST during the fantasy football draft.",
  // "In round 7, pick 7, the team Lamar Jack0ff selected D'Andre Swift during the fantasy football draft.",
  // "In round 7, pick 8, the team TOBENATORS selected Marvin Harrison Jr. during the fantasy football draft.",

  
    "In round 8, pick 1, the team TOBENATORS selected Tony Pollard during the fantasy football draft.",
    "In round 8, pick 2, the team Lamar Jack0ff selected DK Metcalf during the fantasy football draft.",
    "In round 8, pick 3, the team The Super Soakers selected DJ Moore during the fantasy football draft.",
    "In round 8, pick 4, the team Tyler's Top Team selected Courtland Sutton during the fantasy football draft.",
    "In round 8, pick 5, the team Njigbas in Paris selected Jaylen Waddle during the fantasy football draft.",
    "In round 8, pick 6, the team Start Diggs in yo butt twin selected Rashee Rice during the fantasy football draft.",
    "In round 8, pick 7, the team Aidan’s Maidens selected Isiah Pacheco during the fantasy football draft.",
    "In round 8, pick 8, the team Steam rivers selected Jerry Jeudy during the fantasy football draft.",
    
    "In round 9, pick 1, the team Steam rivers selected Calvin Ridley during the fantasy football draft.",
    "In round 9, pick 2, the team Aidan’s Maidens selected Tank Dell during the fantasy football draft.",
    "In round 9, pick 3, the team Start Diggs in yo butt twin selected Kyler Murray during the fantasy football draft.",
    "In round 9, pick 4, the team Njigbas in Paris selected Baker Mayfield during the fantasy football draft.",
    "In round 9, pick 5, the team Tyler's Top Team selected Patrick Mahomes during the fantasy football draft.",
    "In round 9, pick 6, the team The Super Soakers selected David Montgomery during the fantasy football draft.",
    "In round 9, pick 7, the team Lamar Jack0ff selected Aaron Jones Sr. during the fantasy football draft.",
    "In round 9, pick 8, the team TOBENATORS selected Brock Purdy during the fantasy football draft.",
    
    "In round 10, pick 1, the team TOBENATORS selected Jameson Williams during the fantasy football draft.",
    "In round 10, pick 2, the team Lamar Jack0ff selected Rome Odunze during the fantasy football draft.",
    "In round 10, pick 3, the team The Super Soakers selected Chase McLaughlin during the fantasy football draft.",
    "In round 10, pick 4, the team Tyler's Top Team selected Cooper Kupp during the fantasy football draft.",
    "In round 10, pick 5, the team Njigbas in Paris selected Travis Kelce during the fantasy football draft.",
    "In round 10, pick 6, the team Start Diggs in yo butt twin selected RJ Harvey during the fantasy football draft.",
    "In round 10, pick 7, the team Aidan’s Maidens selected Rachaad White during the fantasy football draft.",
    "In round 10, pick 8, the team Steam rivers selected Tyrone Tracy Jr. during the fantasy football draft.",
    
    "In round 11, pick 1, the team Steam rivers selected Travis Hunter during the fantasy football draft.",
    "In round 11, pick 2, the team Aidan’s Maidens selected Jordan Addison during the fantasy football draft.",
    "In round 11, pick 3, the team Start Diggs in yo butt twin selected Austin Ekeler during the fantasy football draft.",
    "In round 11, pick 4, the team Njigbas in Paris selected Jakobi Meyers during the fantasy football draft.",
    "In round 11, pick 5, the team Tyler's Top Team selected Jaylen Warren during the fantasy football draft.",
    "In round 11, pick 6, the team The Super Soakers selected Matthew Golden during the fantasy football draft.",
    "In round 11, pick 7, the team Lamar Jack0ff selected Tetairoa McMillan during the fantasy football draft.",
    "In round 11, pick 8, the team TOBENATORS selected David Njoku during the fantasy football draft.",
    
    "In round 12, pick 1, the team TOBENATORS selected Chris Olave during the fantasy football draft.",
    "In round 12, pick 2, the team Lamar Jack0ff selected the Steelers D/ST during the fantasy football draft.",
    "In round 12, pick 3, the team The Super Soakers selected Jacory Croskey-Merritt during the fantasy football draft.",
    "In round 12, pick 4, the team Tyler's Top Team selected Evan Engram during the fantasy football draft.",
    "In round 12, pick 5, the team Njigbas in Paris selected the Broncos D/ST during the fantasy football draft.",
    "In round 12, pick 6, the team Start Diggs in yo butt twin selected Dalton Kincaid during the fantasy football draft.",
    "In round 12, pick 7, the team Aidan’s Maidens selected Zack Moss during the fantasy football draft.",
    "In round 12, pick 8, the team Steam rivers selected Bo Nix during the fantasy football draft.",
    
    "In round 13, pick 1, the team Steam rivers selected Tyler Warren during the fantasy football draft.",
    "In round 13, pick 2, the team Aidan’s Maidens selected Gabe Davis during the fantasy football draft.",
    "In round 13, pick 3, the team Start Diggs in yo butt twin selected Stefon Diggs during the fantasy football draft.",
    "In round 13, pick 4, the team Njigbas in Paris selected Joe Mixon during the fantasy football draft.",
    "In round 13, pick 5, the team Tyler's Top Team selected Michael Pittman Jr. during the fantasy football draft.",
    "In round 13, pick 6, the team The Super Soakers selected C.J. Stroud during the fantasy football draft.",
    "In round 13, pick 7, the team Lamar Jack0ff selected Kaleb Johnson during the fantasy football draft.",
    "In round 13, pick 8, the team TOBENATORS selected J.K. Dobbins during the fantasy football draft.",
    
    "In round 14, pick 1, the team TOBENATORS selected Chris Godwin Jr. during the fantasy football draft.",
    "In round 14, pick 2, the team Lamar Jack0ff selected Cameron Dicker during the fantasy football draft.",
    "In round 14, pick 3, the team The Super Soakers selected Colston Loveland during the fantasy football draft.",
    "In round 14, pick 4, the team Tyler's Top Team selected the Seahawks D/ST during the fantasy football draft.",
    "In round 14, pick 5, the team Njigbas in Paris selected Jake Bates during the fantasy football draft.",
    "In round 14, pick 6, the team Start Diggs in yo butt twin selected the Lions D/ST during the fantasy football draft.",
    "In round 14, pick 7, the team Aidan’s Maidens selected the Commanders D/ST during the fantasy football draft.",
    "In round 14, pick 8, the team Steam rivers selected the Ravens D/ST during the fantasy football draft.",
    
    "In round 15, pick 1, the team Steam rivers selected Brandon Aubrey during the fantasy football draft.",
    "In round 15, pick 2, the team Aidan’s Maidens selected Jake Elliott during the fantasy football draft.",
    "In round 15, pick 3, the team Start Diggs in yo butt twin selected Zach Charbonnet during the fantasy football draft.",
    "In round 15, pick 4, the team Njigbas in Paris selected Travis Etienne Jr. during the fantasy football draft.",
    "In round 15, pick 5, the team Tyler's Top Team selected Emeka Egbuka during the fantasy football draft.",
    "In round 15, pick 6, the team The Super Soakers selected Deebo Samuel during the fantasy football draft.",
    "In round 15, pick 7, the team Lamar Jack0ff selected Keon Coleman during the fantasy football draft.",
    "In round 15, pick 8, the team TOBENATORS selected the Patriots D/ST during the fantasy football draft.",
    
    "In round 16, pick 1, the team TOBENATORS selected Evan McPherson during the fantasy football draft.",
    "In round 16, pick 2, the team Lamar Jack0ff selected Aaron Rodgers during the fantasy football draft.",
    "In round 16, pick 3, the team The Super Soakers selected Jauan Jennings during the fantasy football draft.",
    "In round 16, pick 4, the team Tyler's Top Team selected Tyler Bass during the fantasy football draft.",
    "In round 16, pick 5, the team Njigbas in Paris selected Tucker Kraft during the fantasy football draft.",
    "In round 16, pick 6, the team Start Diggs in yo butt twin selected Younghoe Koo during the fantasy football draft.",
    "In round 16, pick 7, the team Aidan’s Maidens selected Ty Chandler during the fantasy football draft.",
    "In round 16, pick 8, the team Steam rivers selected Ricky Pearsall during the fantasy football draft."
    
    
];

/**
 * 2. ID HELPER
 */
function createReadableId(sentence: string): string {
  const roundMatch = sentence.match(/round\s(\d+)/i);
  const pickMatch = sentence.match(/pick\s(\d+)/i);
  const teamMatch = sentence.match(/the team (.+?) selected/i);
  const playerMatch = sentence.match(/selected (.+?) during/i);

  const round = roundMatch ? `R${roundMatch[1]}` : "R0";
  const pick = pickMatch ? `P${pickMatch[1]}` : "P0";

  const team = teamMatch
    ? teamMatch[1]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 12)
    : "unknownteam";

  const player = playerMatch
    ? playerMatch[1]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 12)
    : "unknownplayer";

  return `draft-2025-${round}-${pick}-${team}-${player}`;
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

      const roundMatch = sentence.match(/round\s(\d+)/i);
      const pickMatch = sentence.match(/pick\s(\d+)/i);
      const teamMatch = sentence.match(/the team (.+?) selected/i);
      const playerMatch = sentence.match(/selected (.+?) during/i);

      const round = roundMatch ? parseInt(roundMatch[1]) : null;
      const pick = pickMatch ? parseInt(pickMatch[1]) : null;

      const metadata: Record<string, any> = {
        text: sentence,
        type: "fantasy_draft_pick",
        league: "fantasy_football",
        season: 2025,
      };

      if (round !== null) metadata.round = round;
      if (pick !== null) metadata.pick = pick;
      if (round !== null && pick !== null) {
        metadata.overall_pick = (round - 1) * 8 + pick;
      }
      if (teamMatch) metadata.team = teamMatch[1];
      if (playerMatch) metadata.player = playerMatch[1];

      return {
        id: createReadableId(sentence),
        values: item.embedding,
        metadata,
      };
    });

    console.log(`📡 Upserting ${vectors.length} draft vectors to Pinecone...`);
    await index.upsert(vectors);
  }

  console.log(
    "✅ DONE! Fantasy draft data successfully upserted into Pinecone."
  );
}

// Execute
manuallyUpsertData().catch(console.error);
