import 'dotenv/config'; 
import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(process.cwd(), '.env.local') });

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  ESPN_SWID: process.env.ESPN_SWID,
  ESPN_S2: process.env.ESPN_S2,
  NEXT_PUBLIC_LEAGUE_ID: process.env.NEXT_PUBLIC_LEAGUE_ID,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
};

console.log("ENV CHECK", {
  league: process.env.NEXT_PUBLIC_LEAGUE_ID,
  pinecone: process.env.PINECONE_API_KEY ? "loaded" : "missing",
  openai: process.env.OPENAI_API_KEY ? "loaded" : "missing",
});
