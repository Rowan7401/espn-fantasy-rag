import { Pinecone } from '@pinecone-database/pinecone';
import { CONFIG } from '../../config';

const pc = new Pinecone({ apiKey: CONFIG.PINECONE_API_KEY });

export const index = pc.index("fantasy-football");
