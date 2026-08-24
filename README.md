*** Genesis of the app
This is a side project I came up with after my ESPN Fantasy Football team lost a very close game. Extremely close one at that.
I was beaten by 0.2 points and that got me thinking... Am I the unluckiest player in the league statically?
I wondered how you could calculate this mathmatically and realized there were too many variables to compare.
Unless... we have AI do it! 
We can utilize Open AI's endpoints to create a Retrieval Augmented Generated (RAG) answer which can ingest all of the available statistics of our league. 
Then, we can segment / chunk the raw data into readable data for the AI to comprehend and crunch the numbers.
This can be accomplished through Vector Databases. We are using Pinecone for this app.
Finally, with the data sorted, AI has a strong context of our League. 
Now, we can chat with it like any other Chatbot and ask even the most specific nuanced questions. We can expect AI to utilize the power of Open AI's LLM to respond with accurate answers in natural language.
***



***
Architecture Decision I Made:

I witnessed on multiple answers how poorly my RAG bot was doing in answering specific statistical comparisons and aggregations.
After researching what is best for RAG in terms of solving this, I created some deterministic tools calls for various question types 
I found myself asking and getting non-deterministic unreliably results on. The RAG bot can use these when appropriate via the `espn-fantasy-rag/src/lib/clients/intent.ts` hint logic. Or, it can fall back to classic RAG and use the `espn-fantasy-rag/src/lib/rag/context.ts` file. The best of both worlds.
Created Tools:
- `espn-fantasy-rag/src/lib/skills/team/getPunchingBagTool.ts` Punching Bag of the League
A tool which helps answer the genesis question of this app. Who is the most unlucky manager? Ranks each team in terms of points against (PA).
Also equipped with 'n' rank parameter.
- `espn-fantasy-rag/src/lib/skills/team/getTeamRecordsTool.ts` Team Rankings
A tool which defines the rankings of each team in our league by the end of the season. Utilizes overall record and sorts the list asc or desc.
Also equipped with 'n' rank parameter.
- `espn-fantasy-rag/src/lib/skills/team/getTeamScorerRankingsTool.ts`
A tool which identifies the order of teams in terms of points scored overall.
Also equipped with 'n' rank parameter.
- `espn-fantasy-rag/src/lib/skills/player/getValueRankingsTool.ts` Steals and Busts of the Draft
A tool which utilizes a mathmatically derived statistic "Value Ratio" which determines how a player performed relative to their pre-season expectations.
Value ratios above 1 mean the player outperformed their expected point totals while below mean underperforming.
An optional player filter is included to help tool filter through long list of players faster. (Uses enum of all position names and metadata key `postion`)
Also equipped with 'n' rank parameter.
- `espn-fantasy-rag/src/lib/skills/player/getPlayerRankingsTool.ts` Player Scoring Ranked
A tool which ranks players based on how many points they scored. Can be lowest or highest scorers with asc and desc.
Also equipped with positional enum filter.
Also equipped with 'n' rank parameter.
- `espn-fantasy-rag/src/lib/skills/league/getWeeklyRankingsTool.ts`
A tool which keys in on weekly intent related questions. It helps parse and sort the week summary chunk of records.
It indentifies the top scoring player on each team, and ranks the total scoring output of the teams.
Uses 'targetWeek' to filter records based on metadata key `box_scores_summary`
- `espn-fantasy-rag/src/lib/skills/league/getManagerRankingTool.ts`
A tool assisting in definition of worst and best team owners / managers.
Utilizes `missedOpportunityCount` (benching a player who scored over ~15pts) and `missedBenchPoints` to define which managers left most points on the board.
Ranks teams in terms of how the size of total `missedOpportunityCount`.
 

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
1. Ingest: lib/fetch_stats.py pulls JSON using cookies.
2. Transform: Convert JSON -> Natural Language Narratives (e.g., "Team A beat Team B").
3. Chunk: Run semanticChunking to group these sentences intelligently by topic.
4. Embed: Run /src/scripts/ingest-data.ts to turn chunks into numbers.
5. Store: Push to Pinecone. "
***


************   SETUP DEPENDENICES   *************
Mac commands. Windows may be different
1. npm install (I used node version 22.19.0)
2. npm install @pinecone-database/pinecone openai axios dotenv
3. npm install -D tsx      
4. Create .env.local (create the file then copy what's in .env.example and input keys I sent you)
5. npm install pinecone

************   SETTING UP PYTHON FETCH SCRIPT  *************
(Install Python for your OS)
*** Could be different syntax for powershell...

# Create virtual environment (will create many files so creating outside of project can be helpful)
1. python3 -m venv venv  
# Activate and use your virtual environment
2. source /{{file-path-to-your-venv}}/venv/bin/activate 
# Install .env variable helper within the virtual environment 
3. pip install python-dotenv    
# Install libraries for exporting data to CSV and custom ESPN api
4. python3 -m pip install espn_api pandas            
# Run the fetcher script (ex: from project root)
5. python3 src/lib/espn/fetch_stats.py     
