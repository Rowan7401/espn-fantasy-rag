export const CONFIG = {
    PORT: process.env.PORT || 3000,
    ESPN_SWID: process.env.ESPN_SWID,
    ESPN_S2: process.env.ESPN_S2,
    NEXT_PUBLIC_LEAGUE_ID: process.env.NEXT_PUBLIC_LEAGUE_ID,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY as string,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL as string,
  };
  
  if (!CONFIG.PINECONE_API_KEY) {
    throw new Error("Missing pine cone key in environment variables");
  }
  if (!CONFIG.NEXT_PUBLIC_LEAGUE_ID) {
    throw new Error("Missing ESPN League ID in environment variables");
  }
  if (!CONFIG.OPENAI_API_KEY) {
    throw new Error("Missing open AI api key in environment variables");
  }
  if (!CONFIG.DATABASE_URL) {
    throw new Error("Missing data base Url in environment variables");
  }
  if (!CONFIG.ESPN_S2) {
    throw new Error("Missing ESPN S2 key in environment variables");
  }
  if (!CONFIG.ESPN_SWID) {
    throw new Error("Missing ESPN SWID in environment variables");
  }