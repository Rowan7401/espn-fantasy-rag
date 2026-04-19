import { index } from "@/lib/clients/pinecone";

async function run() {
  const res = await index.query({
    vector: new Array(1536).fill(0),
    topK: 300,
    includeMetadata: true,
  });

  for (const match of res.matches ?? []) {
    console.log(match.metadata?.type);
  }

  console.log("Matches length:", res.matches?.length);

  res.matches?.forEach((m, i) => {
    console.log(`\n--- MATCH ${i} ---`);
    console.log("ID:", m.id);
    console.log("Metadata:", m.metadata);
  });
}

run();
