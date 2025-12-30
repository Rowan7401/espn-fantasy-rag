import { Pinecone } from '@pinecone-database/pinecone';
import { CONFIG } from '../../config';

console.log(`Connecting to: ${CONFIG.DATABASE_URL}`);


// Following Pinecone 'Get Started' tutorial

const pc = new Pinecone({
  apiKey: CONFIG.PINECONE_API_KEY
});

const indexName = 'developer-quickstart-js';
await pc.createIndexForModel({
  name: indexName,
  cloud: 'aws',
  region: 'us-east-1',
  embed: {
    model: 'llama-text-embed-v2',
    fieldMap: { text: 'chunk_text' },
  },
  waitUntilReady: true,
});

const query = 'Famous historical structures and monuments';

// Target the index
const index = pc.index(indexName).namespace("example-namespace");

// Upsert the records into a namespace
await index.upsertRecords(records);

const results = await index.searchRecords({
  query: {
    topK: 5,
    inputs: { text: query },
  },
});

console.log(results);

const rerankedResults = await index.searchRecords({
    query: {
      topK: 5,
      inputs: { text: query },
    },
    rerank: {
      model: 'bge-reranker-v2-m3',
      topN: 5,
      rankFields: ['chunk_text'],
    },
  });
  
  console.log(rerankedResults);
