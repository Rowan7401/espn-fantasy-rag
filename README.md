*** Genesis of the app
This is a side project I came up with after my ESPN Fantasy Football team, "Start Diggs in yo butt twin", was brutally diddied
I lost a game by 0.2 points and that got me thinking... Am I the unluckiest player in the league statically?
I wondered how you could calculate this mathmatically and realized there were too many variables to compare.
Unless... we have AI do it! 
We can utilize Open AI's endpoints to create a Retrieval Augmented Generated (RAG) answer which can ingest all of the available statistics of our league. 
Then, we can segment / chunk the raw data into readable data for the AI to comprehend and crunch the numbers.
This can be accomplished through Vector Databases. We are using Pinecone for this app.
Finally, with the data sorted, AI has a strong context of our League. 
Now, we can chat with it like any other Chatbot and ask even the most specific nuanced questions. We can expect AI to utilize the power of Open AI's LLM to respond with accurate answers in natural language.
***



***
Chat with Gemini Pro that solidfied App's Architecture:
https://gemini.google.com/share/b34d3f090fa1
Summary of App Creation:
Phase 1: Setup Environment variables

Phase 2: Data Ingestion
"You can fetch the data directly in a Next.js API route or a standalone script.
The Endpoint: https://fantasy.espn.com/apis/v3/games/ffl/seasons/2024/segments/0/leagues/${LEAGUE_ID}"

Phase 3: Semantic Chunking of Raw Data and Embedding 
"Standard chunking splits text blindly (e.g., every 500 characters). Semantic chunking is smarter: it splits text only when the topic changes.
Since you are ingesting structured JSON data (stats, rosters), you want to convert data to natural sentences then chunk distinct topics.
TLDR: turn the JSON into readable text.

Phase 3.1: Calculate Semantic Distance
True semantic chunking involves calculating the "semantic distance" between sentences. If the distance is high (meaning the topic shifted), we break the chunk.
Here is how to implement this using OpenAI in TypeScript:
Split text into sentences.
Embed every sentence individually.
Compare adjacent sentences (Cosine Similarity).
Group sentences until the similarity drops below a threshold.

Step 3.3: Final Embedding for Pinecone
Once you have your chunks (strings), you need to create the final vector for each chunk to store in Pinecone.

Summary of the Workflow:
1. Ingest: espnFetcher.ts pulls JSON using cookies.
2. Transform: Convert JSON -> Natural Language Narratives (e.g., "Team A beat Team B").
3. Chunk: Run semanticChunking to group these sentences intelligently by topic.
4. Embed: Run createVectorsForPinecone to turn chunks into numbers.
5. Store: Push to Pinecone. "
***


************   SETUP DEPENDENICES   *************
Mac commands. Windows may be different
1. npm install (I used node version 22.19.0)
2. npm install @pinecone-database/pinecone openai axios dotenv
3. npm install -D tsx      
4. Create .env.local (create the file then copy what's in .env.example and input keys I sent you)
5. npm install pinecone
