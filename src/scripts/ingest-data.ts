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
const ingestableSentences = [
  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player CeeDee Lamb plays WR and appeared in 14 games during the season. They scored 200.9 total fantasy points with an average of 14.35 points per game. As a rusher, they had 1.0 attempts for 2.0 total rushing yards, averaging 0.14285714 rushing yards per game. As a receiver, they recorded 75.0 receptions on 117.0 targets for 1077.0 total receiving yards, averaging 76.92857143 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 14.36 yards per reception and had 323.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Puka Nacua plays WR and appeared in 16 games during the season. They scored 375.0 total fantasy points with an average of 23.44 points per game. As a rusher, they had 10.0 attempts for 105.0 total rushing yards, averaging 6.5625 rushing yards per game. As a receiver, they recorded 129.0 receptions on 166.0 targets for 1715.0 total receiving yards, averaging 107.1875 receiving yards per game, and scored 10.0 receiving touchdowns. They averaged 13.29457364 yards per reception and had 666.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Trey McBride plays TE and appeared in 17 games during the season. They scored 315.9 total fantasy points with an average of 18.58 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 126.0 receptions on 169.0 targets for 1239.0 total receiving yards, averaging 72.88235294 receiving yards per game, and scored 11.0 receiving touchdowns. They averaged 9.83333333 yards per reception and had 583.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Lamar Jackson plays QB and appeared in 13 games during the season. They scored 214.86 total fantasy points with an average of 16.53 points per game. As a rusher, they had 67.0 attempts for 349.0 total rushing yards, averaging 26.84615385 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Brian Thomas Jr. plays WR and appeared in 14 games during the season. They scored 138.8 total fantasy points with an average of 9.91 points per game. As a rusher, they had 3.0 attempts for 21.0 total rushing yards, averaging 1.5 rushing yards per game. As a receiver, they recorded 48.0 receptions on 91.0 targets for 707.0 total receiving yards, averaging 50.5 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 14.72916667 yards per reception and had 159.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player D'Andre Swift plays RB and appeared in 16 games during the season. They scored 228.6 total fantasy points with an average of 14.29 points per game. As a rusher, they had 223.0 attempts for 1087.0 total rushing yards, averaging 67.9375 rushing yards per game. As a receiver, they recorded 34.0 receptions on 48.0 targets for 299.0 total receiving yards, averaging 18.6875 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 8.79411765 yards per reception and had 357.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player DK Metcalf plays WR and appeared in 15 games during the season. They scored 187.2 total fantasy points with an average of 12.48 points per game. As a rusher, they had 2.0 attempts for 12.0 total rushing yards, averaging 0.8 rushing yards per game. As a receiver, they recorded 59.0 receptions on 99.0 targets for 850.0 total receiving yards, averaging 56.66666667 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 14.40677966 yards per reception and had 414.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Aaron Jones Sr. plays RB and appeared in 12 games during the season. They scored 118.7 total fantasy points with an average of 9.89 points per game. As a rusher, they had 132.0 attempts for 548.0 total rushing yards, averaging 45.66666667 rushing yards per game. As a receiver, they recorded 28.0 receptions on 41.0 targets for 199.0 total receiving yards, averaging 16.58333333 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 7.10714286 yards per reception and had 227.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Rome Odunze plays WR and appeared in 12 games during the season. They scored 146.1 total fantasy points with an average of 12.18 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 44.0 receptions on 90.0 targets for 661.0 total receiving yards, averaging 55.08333333 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 15.02272727 yards per reception and had 214.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Javonte Williams plays RB and appeared in 15 games during the season. They scored 242.8 total fantasy points with an average of 15.18 points per game. As a rusher, they had 252.0 attempts for 1125.94 total rushing yards, averaging 75.0625 rushing yards per game. As a receiver, they recorded 35.0 receptions on 51.0 targets for 128.44 total receiving yards, averaging 8.5625 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 3.91428571 yards per reception and had 206.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Keenan Allen plays WR and appeared in 17 games during the season. They scored 182.7 total fantasy points with an average of 10.75 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 81.0 receptions on 122.0 targets for 777.0 total receiving yards, averaging 45.70588235 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 9.59259259 yards per reception and had 231.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Dak Prescott plays QB and appeared in 16 games during the season. They scored 313.78 total fantasy points with an average of 18.46 points per game. As a rusher, they had 53.0 attempts for 166.59 total rushing yards, averaging 10.41176471 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Rashee Rice plays WR and appeared in 8 games during the season. They scored 150.1 total fantasy points with an average of 18.76 points per game. As a rusher, they had 5.0 attempts for 20.0 total rushing yards, averaging 2.5 rushing yards per game. As a receiver, they recorded 53.0 receptions on 78.0 targets for 571.0 total receiving yards, averaging 71.375 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 10.77358491 yards per reception and had 414.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Kyle Monangai plays RB and appeared in 17 games during the season. They scored 146.7 total fantasy points with an average of 8.63 points per game. As a rusher, they had 169.0 attempts for 783.0 total rushing yards, averaging 46.05882353 rushing yards per game. As a receiver, they recorded 18.0 receptions on 30.0 targets for 164.0 total receiving yards, averaging 9.64705882 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 9.11111111 yards per reception and had 162.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Chris Boswell plays K and appeared in 17 games during the season. They scored 147.0 total fantasy points with an average of 8.65 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Patriots D/ST plays D/ST and appeared in 17 games during the season. They scored 133.0 total fantasy points with an average of 7.82 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Lamar Jack0ff is managed by Chazdawg01 (Chaz Morton). Their player Omarion Hampton plays RB and appeared in 9 games during the season. They scored 135.7 total fantasy points with an average of 15.08 points per game. As a rusher, they had 124.0 attempts for 545.0 total rushing yards, averaging 60.55555556 rushing yards per game. As a receiver, they recorded 32.0 receptions on 35.0 targets for 192.0 total receiving yards, averaging 21.33333333 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 6.0 yards per reception and had 245.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Saquon Barkley plays RB and appeared in 16 games during the season. They scored 232.3 total fantasy points with an average of 14.52 points per game. As a rusher, they had 280.0 attempts for 1140.0 total rushing yards, averaging 71.25 rushing yards per game. As a receiver, they recorded 37.0 receptions on 50.0 targets for 273.0 total receiving yards, averaging 17.0625 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 7.37837838 yards per reception and had 296.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Tee Higgins plays WR and appeared in 15 games during the season. They scored 211.6 total fantasy points with an average of 14.11 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 59.0 receptions on 98.0 targets for 846.0 total receiving yards, averaging 56.4 receiving yards per game, and scored 11.0 receiving touchdowns. They averaged 14.33898305 yards per reception and had 166.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Bucky Irving plays RB and appeared in 10 games during the season. They scored 138.5 total fantasy points with an average of 13.85 points per game. As a rusher, they had 173.0 attempts for 588.0 total rushing yards, averaging 58.8 rushing yards per game. As a receiver, they recorded 30.0 receptions on 35.0 targets for 277.0 total receiving yards, averaging 27.7 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 9.23333333 yards per reception and had 360.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player George Kittle plays TE and appeared in 11 games during the season. They scored 161.5 total fantasy points with an average of 14.68 points per game. As a rusher, they had 1.0 attempts for -3.0 total rushing yards, averaging -0.27272727 rushing yards per game. As a receiver, they recorded 57.0 receptions on 69.0 targets for 628.0 total receiving yards, averaging 57.09090909 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 11.01754386 yards per reception and had 252.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player James Cook III plays RB and appeared in 17 games during the season. They scored 302.2 total fantasy points with an average of 17.78 points per game. As a rusher, they had 309.0 attempts for 1621.0 total rushing yards, averaging 95.35294118 rushing yards per game. As a receiver, they recorded 33.0 receptions on 40.0 targets for 291.0 total receiving yards, averaging 17.11764706 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 8.81818182 yards per reception and had 272.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Zay Flowers plays WR and appeared in 17 games during the season. They scored 243.3 total fantasy points with an average of 14.31 points per game. As a rusher, they had 10.0 attempts for 62.0 total rushing yards, averaging 3.64705882 rushing yards per game. As a receiver, they recorded 86.0 receptions on 118.0 targets for 1211.0 total receiving yards, averaging 71.23529412 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 14.08139535 yards per reception and had 458.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player George Pickens plays WR and appeared in 16 games during the season. They scored 291.9 total fantasy points with an average of 17.17 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 93.0 receptions on 137.0 targets for 1344.94 total receiving yards, averaging 84.05882353 receiving yards per game, and scored 9.0 receiving touchdowns. They averaged 15.3655914 yards per reception and had 479.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Dalton Kincaid plays TE and appeared in 12 games during the season. They scored 126.1 total fantasy points with an average of 10.51 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 39.0 receptions on 49.0 targets for 571.0 total receiving yards, averaging 47.58333333 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 14.64102564 yards per reception and had 259.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Stefon Diggs plays WR and appeared in 17 games during the season. They scored 210.3 total fantasy points with an average of 12.37 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 85.0 receptions on 102.0 targets for 1013.0 total receiving yards, averaging 59.58823529 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 11.91764706 yards per reception and had 354.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Lions D/ST plays D/ST and appeared in 17 games during the season. They scored 91.0 total fantasy points with an average of 5.35 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Zach Charbonnet plays RB and appeared in 16 games during the season. They scored 181.4 total fantasy points with an average of 11.34 points per game. As a rusher, they had 184.0 attempts for 730.0 total rushing yards, averaging 45.625 rushing yards per game. As a receiver, they recorded 20.0 receptions on 24.0 targets for 144.0 total receiving yards, averaging 9.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 7.2 yards per reception and had 123.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Daniel Jones plays QB and appeared in 13 games during the season. They scored 226.44 total fantasy points with an average of 17.42 points per game. As a rusher, they had 45.0 attempts for 164.0 total rushing yards, averaging 12.61538462 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Romeo Doubs plays WR and appeared in 15 games during the season. They scored 165.4 total fantasy points with an average of 10.34 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 55.0 receptions on 85.0 targets for 678.75 total receiving yards, averaging 45.25 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 13.16363636 yards per reception and had 163.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Jordan Mason plays RB and appeared in 16 games during the season. They scored 128.9 total fantasy points with an average of 8.06 points per game. As a rusher, they had 159.0 attempts for 758.0 total rushing yards, averaging 47.375 rushing yards per game. As a receiver, they recorded 14.0 receptions on 16.0 targets for 51.0 total receiving yards, averaging 3.1875 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 3.64285714 yards per reception and had 102.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player Jake Elliott plays K and appeared in 17 games during the season. They scored 109.0 total fantasy points with an average of 6.41 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Start Diggs in yo butt twin is managed by Rowdog7401 (Rowan Dillon). Their player AJ Barner plays TE and appeared in 17 games during the season. They scored 147.3 total fantasy points with an average of 8.66 points per game. As a rusher, they had 10.0 attempts for 14.0 total rushing yards, averaging 0.82352941 rushing yards per game. As a receiver, they recorded 52.0 receptions on 68.0 targets for 519.0 total receiving yards, averaging 30.52941176 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 9.98076923 yards per reception and had 271.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Bijan Robinson plays RB and appeared in 17 games during the season. They scored 370.8 total fantasy points with an average of 21.81 points per game. As a rusher, they had 287.0 attempts for 1478.0 total rushing yards, averaging 86.94117647 rushing yards per game. As a receiver, they recorded 79.0 receptions on 103.0 targets for 820.0 total receiving yards, averaging 48.23529412 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 10.37974684 yards per reception and had 857.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Ashton Jeanty plays RB and appeared in 17 games during the season. They scored 245.1 total fantasy points with an average of 14.42 points per game. As a rusher, they had 266.0 attempts for 975.0 total rushing yards, averaging 57.35294118 rushing yards per game. As a receiver, they recorded 55.0 receptions on 73.0 targets for 346.0 total receiving yards, averaging 20.35294118 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 6.29090909 yards per reception and had 452.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Brock Bowers plays TE and appeared in 12 games during the season. They scored 176.2 total fantasy points with an average of 14.68 points per game. As a rusher, they had 2.0 attempts for 2.0 total rushing yards, averaging 0.16666667 rushing yards per game. As a receiver, they recorded 64.0 receptions on 86.0 targets for 680.0 total receiving yards, averaging 56.66666667 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 10.625 yards per reception and had 303.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Drake London plays WR and appeared in 12 games during the season. They scored 201.9 total fantasy points with an average of 16.82 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 68.0 receptions on 112.0 targets for 919.0 total receiving yards, averaging 76.58333333 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 13.51470588 yards per reception and had 229.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Alvin Kamara plays RB and appeared in 11 games during the season. They scored 100.7 total fantasy points with an average of 9.15 points per game. As a rusher, they had 131.0 attempts for 471.0 total rushing yards, averaging 42.81818182 rushing yards per game. As a receiver, they recorded 33.0 receptions on 39.0 targets for 186.0 total receiving yards, averaging 16.90909091 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 5.63636364 yards per reception and had 202.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Garrett Wilson plays WR and appeared in 8 games during the season. They scored 99.5 total fantasy points with an average of 12.44 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 36.0 receptions on 59.0 targets for 395.0 total receiving yards, averaging 49.375 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 10.97222222 yards per reception and had 100.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player TreVeyon Henderson plays RB and appeared in 17 games during the season. They scored 206.2 total fantasy points with an average of 12.13 points per game. As a rusher, they had 180.0 attempts for 911.0 total rushing yards, averaging 53.58823529 rushing yards per game. As a receiver, they recorded 35.0 receptions on 42.0 targets for 221.0 total receiving yards, averaging 13.0 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 6.31428571 yards per reception and had 244.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Courtland Sutton plays WR and appeared in 17 games during the season. They scored 219.7 total fantasy points with an average of 12.92 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 74.0 receptions on 124.0 targets for 1017.0 total receiving yards, averaging 59.82352941 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 13.74324324 yards per reception and had 222.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Patrick Mahomes plays QB and appeared in 14 games during the season. They scored 285.68 total fantasy points with an average of 20.41 points per game. As a rusher, they had 64.0 attempts for 422.0 total rushing yards, averaging 30.14285714 rushing yards per game. As a receiver, they recorded 1.0 receptions on 1.0 targets for -10.0 total receiving yards, averaging -0.71428571 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged -10.0 yards per reception and had -2.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Cooper Kupp plays WR and appeared in 16 games during the season. They scored 116.3 total fantasy points with an average of 7.27 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 47.0 receptions on 70.0 targets for 593.0 total receiving yards, averaging 37.0625 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 12.61702128 yards per reception and had 293.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Jaylen Warren plays RB and appeared in 16 games during the season. They scored 217.1 total fantasy points with an average of 13.57 points per game. As a rusher, they had 211.0 attempts for 958.0 total rushing yards, averaging 59.875 rushing yards per game. As a receiver, they recorded 40.0 receptions on 45.0 targets for 333.0 total receiving yards, averaging 20.8125 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 8.325 yards per reception and had 429.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Evan Engram plays TE and appeared in 16 games during the season. They scored 102.8 total fantasy points with an average of 6.43 points per game. As a rusher, they had 1.0 attempts for 7.0 total rushing yards, averaging 0.4375 rushing yards per game. As a receiver, they recorded 50.0 receptions on 76.0 targets for 461.0 total receiving yards, averaging 28.8125 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 9.22 yards per reception and had 302.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Michael Pittman Jr. plays WR and appeared in 17 games during the season. They scored 202.4 total fantasy points with an average of 11.91 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 80.0 receptions on 111.0 targets for 784.0 total receiving yards, averaging 46.11764706 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 9.8 yards per reception and had 259.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Emeka Egbuka plays WR and appeared in 17 games during the season. They scored 195.7 total fantasy points with an average of 11.51 points per game. As a rusher, they had 2.0 attempts for 9.0 total rushing yards, averaging 0.52941176 rushing yards per game. As a receiver, they recorded 63.0 receptions on 127.0 targets for 938.0 total receiving yards, averaging 55.17647059 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 14.88888889 yards per reception and had 335.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Harrison Mevis plays K and appeared in 9 games during the season. They scored 81.0 total fantasy points with an average of 9.0 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Tyler's Top Team is managed by Tyler Morton. Their player Eagles D/ST plays D/ST and appeared in 17 games during the season. They scored 126.0 total fantasy points with an average of 7.41 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Justin Jefferson plays WR and appeared in 17 games during the season. They scored 201.5 total fantasy points with an average of 11.85 points per game. As a rusher, they had 2.0 attempts for 7.0 total rushing yards, averaging 0.41176471 rushing yards per game. As a receiver, they recorded 84.0 receptions on 141.0 targets for 1048.0 total receiving yards, averaging 61.64705882 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 12.47619048 yards per reception and had 451.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player De'Von Achane plays RB and appeared in 16 games during the season. They scored 322.8 total fantasy points with an average of 20.18 points per game. As a rusher, they had 238.0 attempts for 1350.0 total rushing yards, averaging 84.375 rushing yards per game. As a receiver, they recorded 67.0 receptions on 85.0 targets for 488.0 total receiving yards, averaging 30.5 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 7.28358209 yards per reception and had 552.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Josh Allen plays QB and appeared in 17 games during the season. They scored 364.62 total fantasy points with an average of 21.45 points per game. As a rusher, they had 112.0 attempts for 579.0 total rushing yards, averaging 34.05882353 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Sam LaPorta plays TE and appeared in 9 games during the season. They scored 106.9 total fantasy points with an average of 11.88 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 40.0 receptions on 49.0 targets for 489.0 total receiving yards, averaging 54.33333333 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 12.225 yards per reception and had 274.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Chuba Hubbard plays RB and appeared in 15 games during the season. They scored 125.4 total fantasy points with an average of 8.36 points per game. As a rusher, they had 134.0 attempts for 511.0 total rushing yards, averaging 34.06666667 rushing yards per game. As a receiver, they recorded 30.0 receptions on 39.0 targets for 223.0 total receiving yards, averaging 14.86666667 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 7.43333333 yards per reception and had 291.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Terry McLaurin plays WR and appeared in 10 games during the season. They scored 114.2 total fantasy points with an average of 11.42 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 38.0 receptions on 60.0 targets for 582.0 total receiving yards, averaging 58.2 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 15.31578947 yards per reception and had 93.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player DJ Moore plays WR and appeared in 17 games during the season. They scored 170.18 total fantasy points with an average of 10.01 points per game. As a rusher, they had 15.0 attempts for 79.0 total rushing yards, averaging 4.64705882 rushing yards per game. As a receiver, they recorded 50.0 receptions on 85.0 targets for 682.0 total receiving yards, averaging 40.11764706 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 13.64 yards per reception and had 222.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player David Montgomery plays RB and appeared in 17 games during the season. They scored 166.92 total fantasy points with an average of 9.82 points per game. As a rusher, they had 158.0 attempts for 716.0 total rushing yards, averaging 42.11764706 rushing yards per game. As a receiver, they recorded 24.0 receptions on 29.0 targets for 192.0 total receiving yards, averaging 11.29411765 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 8.0 yards per reception and had 199.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Chase McLaughlin plays K and appeared in 17 games during the season. They scored 151.0 total fantasy points with an average of 8.88 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Matthew Golden plays WR and appeared in 13 games during the season. They scored 70.0 total fantasy points with an average of 5.0 points per game. As a rusher, they had 10.0 attempts for 45.5 total rushing yards, averaging 3.5 rushing yards per game. As a receiver, they recorded 29.0 receptions on 44.0 targets for 335.21 total receiving yards, averaging 25.78571429 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 12.44827586 yards per reception and had 101.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Jacory Croskey-Merritt plays RB and appeared in 17 games during the season. They scored 140.3 total fantasy points with an average of 8.25 points per game. As a rusher, they had 175.0 attempts for 805.0 total rushing yards, averaging 47.35294118 rushing yards per game. As a receiver, they recorded 9.0 receptions on 13.0 targets for 68.0 total receiving yards, averaging 4.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 7.55555556 yards per reception and had 77.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player C.J. Stroud plays QB and appeared in 14 games during the season. They scored 208.54 total fantasy points with an average of 14.9 points per game. As a rusher, they had 48.0 attempts for 209.0 total rushing yards, averaging 14.92857143 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Colston Loveland plays TE and appeared in 16 games during the season. They scored 165.1 total fantasy points with an average of 10.32 points per game. As a rusher, they had 1.0 attempts for -2.0 total rushing yards, averaging -0.125 rushing yards per game. As a receiver, they recorded 58.0 receptions on 82.0 targets for 713.0 total receiving yards, averaging 44.5625 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 12.29310345 yards per reception and had 250.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Deebo Samuel plays WR and appeared in 16 games during the season. They scored 188.2 total fantasy points with an average of 11.76 points per game. As a rusher, they had 17.0 attempts for 75.0 total rushing yards, averaging 4.6875 rushing yards per game. As a receiver, they recorded 72.0 receptions on 99.0 targets for 727.0 total receiving yards, averaging 45.4375 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 10.09722222 yards per reception and had 466.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Jauan Jennings plays WR and appeared in 15 games during the season. They scored 173.3 total fantasy points with an average of 11.55 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 55.0 receptions on 90.0 targets for 643.0 total receiving yards, averaging 42.86666667 receiving yards per game, and scored 9.0 receiving touchdowns. They averaged 11.69090909 yards per reception and had 181.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Harold Fannin Jr. plays TE and appeared in 16 games during the season. They scored 186.4 total fantasy points with an average of 11.65 points per game. As a rusher, they had 7.0 attempts for 13.0 total rushing yards, averaging 0.8125 rushing yards per game. As a receiver, they recorded 72.0 receptions on 107.0 targets for 731.0 total receiving yards, averaging 45.6875 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 10.15277778 yards per reception and had 352.0 total yards after catch.",

  "Team The Super Soakers is managed by Michael Shipley. Their player Ravens D/ST plays D/ST and appeared in 17 games during the season. They scored 77.0 total fantasy points with an average of 4.53 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Ja'Marr Chase plays WR and appeared in 16 games during the season. They scored 313.6 total fantasy points with an average of 19.6 points per game. As a rusher, they had 3.0 attempts for 14.0 total rushing yards, averaging 0.875 rushing yards per game. As a receiver, they recorded 125.0 receptions on 185.0 targets for 1412.0 total receiving yards, averaging 88.25 receiving yards per game, and scored 8.0 receiving touchdowns. They averaged 11.296 yards per reception and had 640.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Jonathan Taylor plays RB and appeared in 17 games during the season. They scored 362.3 total fantasy points with an average of 21.31 points per game. As a rusher, they had 323.0 attempts for 1585.0 total rushing yards, averaging 93.23529412 rushing yards per game. As a receiver, they recorded 46.0 receptions on 55.0 targets for 378.0 total receiving yards, averaging 22.23529412 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 8.2173913 yards per reception and had 434.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Nico Collins plays WR and appeared in 15 games during the season. They scored 226.2 total fantasy points with an average of 15.08 points per game. As a rusher, they had 2.0 attempts for 15.0 total rushing yards, averaging 1.0 rushing yards per game. As a receiver, they recorded 71.0 receptions on 120.0 targets for 1117.0 total receiving yards, averaging 74.46666667 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 15.73239437 yards per reception and had 324.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Kyren Williams plays RB and appeared in 17 games during the season. They scored 263.3 total fantasy points with an average of 15.49 points per game. As a rusher, they had 259.0 attempts for 1252.0 total rushing yards, averaging 73.64705882 rushing yards per game. As a receiver, they recorded 36.0 receptions on 50.0 targets for 281.0 total receiving yards, averaging 16.52941176 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 7.80555556 yards per reception and had 155.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Jalen Hurts plays QB and appeared in 16 games during the season. They scored 299.06 total fantasy points with an average of 18.69 points per game. As a rusher, they had 105.0 attempts for 421.0 total rushing yards, averaging 26.3125 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Xavier Worthy plays WR and appeared in 14 games during the season. They scored 109.9 total fantasy points with an average of 7.85 points per game. As a rusher, they had 11.0 attempts for 87.0 total rushing yards, averaging 6.21428571 rushing yards per game. As a receiver, they recorded 42.0 receptions on 73.0 targets for 532.0 total receiving yards, averaging 38.0 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 12.66666667 yards per reception and had 193.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Travis Hunter plays WR and appeared in 7 games during the season. They scored 63.8 total fantasy points with an average of 9.11 points per game. As a rusher, they had 1.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 28.0 receptions on 45.0 targets for 298.0 total receiving yards, averaging 42.57142857 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 10.64285714 yards per reception and had 140.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Bo Nix plays QB and appeared in 17 games during the season. They scored 304.84 total fantasy points with an average of 17.93 points per game. As a rusher, they had 83.0 attempts for 356.0 total rushing yards, averaging 20.94117647 rushing yards per game. As a receiver, they recorded 0.0 receptions on 1.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Brandon Aubrey plays K and appeared in 16 games during the season. They scored 184.6 total fantasy points with an average of 10.86 points per game. As a rusher, they had 1.0 attempts for 5.65 total rushing yards, averaging 0.35294118 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Tyler Warren plays TE and appeared in 17 games during the season. They scored 188.5 total fantasy points with an average of 11.09 points per game. As a rusher, they had 6.0 attempts for 8.0 total rushing yards, averaging 0.47058824 rushing yards per game. As a receiver, they recorded 76.0 receptions on 112.0 targets for 817.0 total receiving yards, averaging 48.05882353 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 10.75 yards per reception and had 474.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Woody Marks plays RB and appeared in 16 games during the season. They scored 151.1 total fantasy points with an average of 9.44 points per game. As a rusher, they had 196.0 attempts for 703.0 total rushing yards, averaging 43.9375 rushing yards per game. As a receiver, they recorded 24.0 receptions on 36.0 targets for 208.0 total receiving yards, averaging 13.0 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 8.66666667 yards per reception and had 223.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Tre Tucker plays WR and appeared in 17 games during the season. They scored 161.7 total fantasy points with an average of 9.51 points per game. As a rusher, they had 11.0 attempts for 51.0 total rushing yards, averaging 3.0 rushing yards per game. As a receiver, they recorded 57.0 receptions on 92.0 targets for 696.0 total receiving yards, averaging 40.94117647 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 12.21052632 yards per reception and had 291.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Rico Dowdle plays RB and appeared in 17 games during the season. They scored 216.3 total fantasy points with an average of 12.72 points per game. As a rusher, they had 236.0 attempts for 1076.0 total rushing yards, averaging 63.29411765 rushing yards per game. As a receiver, they recorded 39.0 receptions on 50.0 targets for 297.0 total receiving yards, averaging 17.47058824 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 7.61538462 yards per reception and had 350.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Tetairoa McMillan plays WR and appeared in 17 games during the season. They scored 211.4 total fantasy points with an average of 12.44 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 70.0 receptions on 122.0 targets for 1014.0 total receiving yards, averaging 59.64705882 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 14.48571429 yards per reception and had 269.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Khalil Shakir plays WR and appeared in 16 games during the season. They scored 166.4 total fantasy points with an average of 10.4 points per game. As a rusher, they had 1.0 attempts for 5.0 total rushing yards, averaging 0.3125 rushing yards per game. As a receiver, they recorded 72.0 receptions on 95.0 targets for 719.0 total receiving yards, averaging 44.9375 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 9.98611111 yards per reception and had 541.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Theo Johnson plays TE and appeared in 15 games during the season. They scored 127.8 total fantasy points with an average of 8.52 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 45.0 receptions on 74.0 targets for 528.0 total receiving yards, averaging 35.2 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 11.73333333 yards per reception and had 187.0 total yards after catch.",

  "Team Steam rivers  is managed by Ian Streams. Their player Saints D/ST plays D/ST and appeared in 17 games during the season. They scored 123.0 total fantasy points with an average of 7.24 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Jahmyr Gibbs plays RB and appeared in 17 games during the season. They scored 366.9 total fantasy points with an average of 21.58 points per game. As a rusher, they had 243.0 attempts for 1223.0 total rushing yards, averaging 71.94117647 rushing yards per game. As a receiver, they recorded 77.0 receptions on 94.0 targets for 616.0 total receiving yards, averaging 36.23529412 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 8.0 yards per reception and had 615.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player A.J. Brown plays WR and appeared in 15 games during the season. They scored 220.3 total fantasy points with an average of 14.69 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 78.0 receptions on 121.0 targets for 1003.0 total receiving yards, averaging 66.86666667 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 12.85897436 yards per reception and had 268.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Derrick Henry plays RB and appeared in 17 games during the season. They scored 279.5 total fantasy points with an average of 16.44 points per game. As a rusher, they had 307.0 attempts for 1595.0 total rushing yards, averaging 93.82352941 rushing yards per game. As a receiver, they recorded 15.0 receptions on 21.0 targets for 150.0 total receiving yards, averaging 8.82352941 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 10.0 yards per reception and had 135.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Jaxon Smith-Njigba plays WR and appeared in 17 games during the season. They scored 359.9 total fantasy points with an average of 21.17 points per game. As a rusher, they had 7.0 attempts for 36.0 total rushing yards, averaging 2.11764706 rushing yards per game. As a receiver, they recorded 119.0 receptions on 163.0 targets for 1793.0 total receiving yards, averaging 105.47058824 receiving yards per game, and scored 10.0 receiving touchdowns. They averaged 15.06722689 yards per reception and had 528.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Kenneth Walker III plays RB and appeared in 17 games during the season. They scored 191.9 total fantasy points with an average of 11.29 points per game. As a rusher, they had 221.0 attempts for 1027.0 total rushing yards, averaging 60.41176471 rushing yards per game. As a receiver, they recorded 31.0 receptions on 36.0 targets for 282.0 total receiving yards, averaging 16.58823529 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 9.09677419 yards per reception and had 339.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Jaylen Waddle plays WR and appeared in 16 games during the season. They scored 194.12 total fantasy points with an average of 12.13 points per game. As a rusher, they had 2.0 attempts for 28.0 total rushing yards, averaging 1.75 rushing yards per game. As a receiver, they recorded 64.0 receptions on 100.0 targets for 910.0 total receiving yards, averaging 56.875 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 14.21875 yards per reception and had 228.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Baker Mayfield plays QB and appeared in 17 games during the season. They scored 271.92 total fantasy points with an average of 16.0 points per game. As a rusher, they had 55.0 attempts for 382.0 total rushing yards, averaging 22.47058824 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Travis Kelce plays TE and appeared in 17 games during the season. They scored 193.2 total fantasy points with an average of 11.36 points per game. As a rusher, they had 1.0 attempts for 1.0 total rushing yards, averaging 0.05882353 rushing yards per game. As a receiver, they recorded 76.0 receptions on 108.0 targets for 851.0 total receiving yards, averaging 50.05882353 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 11.19736842 yards per reception and had 424.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Broncos D/ST plays D/ST and appeared in 17 games during the season. They scored 144.0 total fantasy points with an average of 8.47 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Jake Bates plays K and appeared in 17 games during the season. They scored 145.0 total fantasy points with an average of 8.53 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Travis Etienne Jr. plays RB and appeared in 17 games during the season. They scored 253.9 total fantasy points with an average of 14.94 points per game. As a rusher, they had 260.0 attempts for 1107.0 total rushing yards, averaging 65.11764706 rushing yards per game. As a receiver, they recorded 36.0 receptions on 52.0 targets for 292.0 total receiving yards, averaging 17.17647059 receiving yards per game, and scored 6.0 receiving touchdowns. They averaged 8.11111111 yards per reception and had 339.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Rashid Shaheed plays WR and appeared in 18 games during the season. They scored 156.6 total fantasy points with an average of 8.7 points per game. As a rusher, they had 9.0 attempts for 69.0 total rushing yards, averaging 3.83333333 rushing yards per game. As a receiver, they recorded 59.0 receptions on 92.0 targets for 687.0 total receiving yards, averaging 38.16666667 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 11.6440678 yards per reception and had 177.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Wan'Dale Robinson plays WR and appeared in 16 games during the season. They scored 217.9 total fantasy points with an average of 13.62 points per game. As a rusher, they had 3.0 attempts for 5.0 total rushing yards, averaging 0.3125 rushing yards per game. As a receiver, they recorded 92.0 receptions on 140.0 targets for 1014.0 total receiving yards, averaging 63.375 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 11.02173913 yards per reception and had 386.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Kyle Pitts Sr. plays TE and appeared in 17 games during the season. They scored 210.8 total fantasy points with an average of 12.4 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 88.0 receptions on 118.0 targets for 928.0 total receiving yards, averaging 54.58823529 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 10.54545455 yards per reception and had 400.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Seahawks D/ST plays D/ST and appeared in 17 games during the season. They scored 185.0 total fantasy points with an average of 10.88 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Njigbas in Paris  is managed by devenchat (Deven Chaterjee) . Their player Jared Goff plays QB and appeared in 17 games during the season. They scored 297.06 total fantasy points with an average of 17.47 points per game. As a rusher, they had 19.0 attempts for 45.0 total rushing yards, averaging 2.64705882 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Amon-Ra St. Brown plays WR and appeared in 17 games during the season. They scored 324.0 total fantasy points with an average of 19.06 points per game. As a rusher, they had 3.0 attempts for 9.0 total rushing yards, averaging 0.52941176 rushing yards per game. As a receiver, they recorded 117.0 receptions on 172.0 targets for 1401.0 total receiving yards, averaging 82.41176471 receiving yards per game, and scored 11.0 receiving touchdowns. They averaged 11.97435897 yards per reception and had 570.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Josh Jacobs plays RB and appeared in 14 games during the season. They scored 237.1 total fantasy points with an average of 15.81 points per game. As a rusher, they had 234.0 attempts for 867.07 total rushing yards, averaging 61.93333333 rushing yards per game. As a receiver, they recorded 36.0 receptions on 44.0 targets for 263.2 total receiving yards, averaging 18.8 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 7.83333333 yards per reception and had 304.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Chase Brown plays RB and appeared in 17 games during the season. They scored 282.6 total fantasy points with an average of 16.62 points per game. As a rusher, they had 232.0 attempts for 1019.0 total rushing yards, averaging 59.94117647 rushing yards per game. As a receiver, they recorded 69.0 receptions on 88.0 targets for 437.0 total receiving yards, averaging 25.70588235 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 6.33333333 yards per reception and had 450.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Marvin Harrison Jr. plays WR and appeared in 12 games during the season. They scored 127.8 total fantasy points with an average of 10.65 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 41.0 receptions on 73.0 targets for 608.0 total receiving yards, averaging 50.66666667 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 14.82926829 yards per reception and had 119.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Drake Maye plays QB and appeared in 17 games during the season. They scored 351.96 total fantasy points with an average of 20.7 points per game. As a rusher, they had 103.0 attempts for 450.0 total rushing yards, averaging 26.47058824 rushing yards per game. As a receiver, they recorded 1.0 receptions on 1.0 targets for 2.0 total receiving yards, averaging 0.11764706 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 2.0 yards per reception and had 10.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Chris Olave plays WR and appeared in 16 games during the season. They scored 268.0 total fantasy points with an average of 16.75 points per game. As a rusher, they had 1.0 attempts for -3.0 total rushing yards, averaging -0.1875 rushing yards per game. As a receiver, they recorded 100.0 receptions on 156.0 targets for 1163.0 total receiving yards, averaging 72.6875 receiving yards per game, and scored 9.0 receiving touchdowns. They averaged 11.63 yards per reception and had 289.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Jason Myers plays K and appeared in 17 games during the season. They scored 195.0 total fantasy points with an average of 11.47 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Michael Wilson plays WR and appeared in 17 games during the season. They scored 220.6 total fantasy points with an average of 12.98 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 78.0 receptions on 126.0 targets for 1006.0 total receiving yards, averaging 59.17647059 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 12.8974359 yards per reception and had 273.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player RJ Harvey plays RB and appeared in 17 games during the season. They scored 206.6 total fantasy points with an average of 12.15 points per game. As a rusher, they had 146.0 attempts for 540.0 total rushing yards, averaging 31.76470588 rushing yards per game. As a receiver, they recorded 47.0 receptions on 58.0 targets for 356.0 total receiving yards, averaging 20.94117647 receiving yards per game, and scored 5.0 receiving touchdowns. They averaged 7.57446809 yards per reception and had 360.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Texans D/ST plays D/ST and appeared in 17 games during the season. They scored 173.0 total fantasy points with an average of 10.18 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Juwan Johnson plays TE and appeared in 17 games during the season. They scored 179.9 total fantasy points with an average of 10.58 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 77.0 receptions on 102.0 targets for 889.0 total receiving yards, averaging 52.29411765 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 11.54545455 yards per reception and had 362.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Colby Parkinson plays TE and appeared in 15 games during the season. They scored 129.8 total fantasy points with an average of 8.65 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 43.0 receptions on 56.0 targets for 408.0 total receiving yards, averaging 27.2 receiving yards per game, and scored 8.0 receiving touchdowns. They averaged 9.48837209 yards per reception and had 271.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Mike Evans plays WR and appeared in 8 games during the season. They scored 84.8 total fantasy points with an average of 10.6 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 30.0 receptions on 61.0 targets for 368.0 total receiving yards, averaging 46.0 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 12.26666667 yards per reception and had 37.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Jakobi Meyers plays WR and appeared in 16 games during the season. They scored 175.8 total fantasy points with an average of 10.99 points per game. As a rusher, they had 5.0 attempts for 13.0 total rushing yards, averaging 0.8125 rushing yards per game. As a receiver, they recorded 75.0 receptions on 110.0 targets for 835.0 total receiving yards, averaging 52.1875 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 11.13333333 yards per reception and had 282.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Quinshon Judkins plays RB and appeared in 14 games during the season. They scored 169.8 total fantasy points with an average of 12.13 points per game. As a rusher, they had 230.0 attempts for 827.0 total rushing yards, averaging 59.07142857 rushing yards per game. As a receiver, they recorded 26.0 receptions on 36.0 targets for 171.0 total receiving yards, averaging 12.21428571 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 6.57692308 yards per reception and had 194.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Emanuel Wilson plays RB and appeared in 16 games during the season. They scored 94.5 total fantasy points with an average of 5.56 points per game. As a rusher, they had 125.0 attempts for 466.82 total rushing yards, averaging 29.17647059 rushing yards per game. As a receiver, they recorded 15.0 receptions on 17.0 targets for 93.18 total receiving yards, averaging 5.82352941 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 6.6 yards per reception and had 133.0 total yards after catch.",

  "Team TOBENATORS is managed by Conner Tobey. Their player Rhamondre Stevenson plays RB and appeared in 14 games during the season. They scored 178.8 total fantasy points with an average of 12.77 points per game. As a rusher, they had 130.0 attempts for 603.0 total rushing yards, averaging 43.07142857 rushing yards per game. As a receiver, they recorded 32.0 receptions on 37.0 targets for 345.0 total receiving yards, averaging 24.64285714 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 10.78125 yards per reception and had 263.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Christian McCaffrey plays RB and appeared in 17 games during the season. They scored 416.6 total fantasy points with an average of 24.51 points per game. As a rusher, they had 311.0 attempts for 1202.0 total rushing yards, averaging 70.70588235 rushing yards per game. As a receiver, they recorded 102.0 receptions on 129.0 targets for 924.0 total receiving yards, averaging 54.35294118 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 9.05882353 yards per reception and had 720.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Breece Hall plays RB and appeared in 16 games during the season. They scored 207.66 total fantasy points with an average of 12.98 points per game. As a rusher, they had 243.0 attempts for 1065.0 total rushing yards, averaging 66.5625 rushing yards per game. As a receiver, they recorded 36.0 receptions on 48.0 targets for 350.0 total receiving yards, averaging 21.875 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 9.72222222 yards per reception and had 321.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Davante Adams plays WR and appeared in 14 games during the season. They scored 222.9 total fantasy points with an average of 15.92 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 60.0 receptions on 114.0 targets for 789.0 total receiving yards, averaging 56.35714286 receiving yards per game, and scored 14.0 receiving touchdowns. They averaged 13.15 yards per reception and had 117.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player DeVonta Smith plays WR and appeared in 17 games during the season. They scored 201.8 total fantasy points with an average of 11.87 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 77.0 receptions on 113.0 targets for 1008.0 total receiving yards, averaging 59.29411765 receiving yards per game, and scored 4.0 receiving touchdowns. They averaged 13.09090909 yards per reception and had 293.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Joe Burrow plays QB and appeared in 8 games during the season. They scored 134.46 total fantasy points with an average of 16.81 points per game. As a rusher, they had 14.0 attempts for 41.0 total rushing yards, averaging 5.125 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Jordan Addison plays WR and appeared in 14 games during the season. They scored 135.1 total fantasy points with an average of 9.65 points per game. As a rusher, they had 2.0 attempts for 81.0 total rushing yards, averaging 5.78571429 rushing yards per game. As a receiver, they recorded 42.0 receptions on 79.0 targets for 610.0 total receiving yards, averaging 43.57142857 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 14.52380952 yards per reception and had 134.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Caleb Williams plays QB and appeared in 17 games during the season. They scored 318.18 total fantasy points with an average of 18.72 points per game. As a rusher, they had 77.0 attempts for 383.0 total rushing yards, averaging 22.52941176 rushing yards per game. As a receiver, they recorded 2.0 receptions on 2.0 targets for 22.0 total receiving yards, averaging 1.29411765 receiving yards per game, and scored 1.0 receiving touchdowns. They averaged 11.0 yards per reception and had 25.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Jake Ferguson plays TE and appeared in 16 games during the season. They scored 188.1 total fantasy points with an average of 11.06 points per game. As a rusher, they had 1.0 attempts for 0.94 total rushing yards, averaging 0.05882353 rushing yards per game. As a receiver, they recorded 82.0 receptions on 102.0 targets for 564.71 total receiving yards, averaging 35.29411765 receiving yards per game, and scored 8.0 receiving touchdowns. They averaged 7.31707317 yards per reception and had 311.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Rams D/ST plays D/ST and appeared in 17 games during the season. They scored 125.0 total fantasy points with an average of 7.35 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Matthew Stafford plays QB and appeared in 17 games during the season. They scored 350.38 total fantasy points with an average of 20.61 points per game. As a rusher, they had 29.0 attempts for 1.0 total rushing yards, averaging 0.05882353 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Cameron Dicker plays K and appeared in 17 games during the season. They scored 167.0 total fantasy points with an average of 9.82 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Tyrone Tracy Jr. plays RB and appeared in 15 games during the season. They scored 160.8 total fantasy points with an average of 10.72 points per game. As a rusher, they had 176.0 attempts for 740.0 total rushing yards, averaging 49.33333333 rushing yards per game. As a receiver, they recorded 36.0 receptions on 48.0 targets for 288.0 total receiving yards, averaging 19.2 receiving yards per game, and scored 2.0 receiving touchdowns. They averaged 8.0 yards per reception and had 314.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Jameson Williams plays WR and appeared in 17 games during the season. They scored 219.9 total fantasy points with an average of 12.94 points per game. As a rusher, they had 6.0 attempts for 12.0 total rushing yards, averaging 0.70588235 rushing yards per game. As a receiver, they recorded 65.0 receptions on 102.0 targets for 1117.0 total receiving yards, averaging 65.70588235 receiving yards per game, and scored 7.0 receiving touchdowns. They averaged 17.18461538 yards per reception and had 441.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Packers D/ST plays D/ST and appeared in 16 games during the season. They scored 77.0 total fantasy points with an average of 4.53 points per game. As a rusher, they had 0.0 attempts for 0.0 total rushing yards, averaging 0.0 rushing yards per game. As a receiver, they recorded 0.0 receptions on 0.0 targets for 0.0 total receiving yards, averaging 0.0 receiving yards per game, and scored 0.0 receiving touchdowns. They averaged 0.0 yards per reception and had 0.0 total yards after catch.",

  "Team Aidan’s Maidens is managed by Aidan Miller. Their player Kenneth Gainwell plays RB and appeared in 17 games during the season. They scored 221.3 total fantasy points with an average of 13.02 points per game. As a rusher, they had 114.0 attempts for 537.0 total rushing yards, averaging 31.58823529 rushing yards per game. As a receiver, they recorded 73.0 receptions on 85.0 targets for 486.0 total receiving yards, averaging 28.58823529 receiving yards per game, and scored 3.0 receiving touchdowns. They averaged 6.65753425 yards per reception and had 528.0 total yards after catch.",
];

/**
 * 2. ID HELPER
 */

function createReadableIdFromMetadata(metadata: Record<string, any>): string {
  const normalize = (val: string, fallback: string) =>
    (val || fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20);

  const team = normalize(metadata.team, "unknownteam");
  const player = normalize(metadata.player, "unknownplayer");
  const position = (metadata.position || "unk").toLowerCase();

  return `playerstats-2025-${team}-${player}-${position}`;
}

/**
 * 3. MAIN INGESTION FUNCTION
 */
async function manuallyUpsertData() {
  const DRY_RUN = false;
  let totalMatched = 0;

  console.log(
    `🚀 Starting ingestion for ${ingestableSentences.length} records...`
  );

  const batchSize = 100;

  for (let i = 0; i < ingestableSentences.length; i += batchSize) {
    const currentBatch = ingestableSentences.slice(i, i + batchSize);

    console.log(`🧠 Embedding batch ${i / batchSize + 1}...`);
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: currentBatch,
    });

    const vectors = embeddingResponse.data.map((item, idx) => {
      const sentence = currentBatch[idx];

      const metadata: Record<string, any> = {
        text: sentence,
        type: "player_season_stats",
        league: "fantasy_football",
        season: 2025,
      };

      // ✅ NEW REGEX (aligned with your Python sentence builder)

      const teamMatch = sentence.match(/Team (.+?) is managed/i);
      const ownerMatch = sentence.match(/managed by (.+?)\./i);
      const playerMatch = sentence.match(/Their player (.+?) plays/i);
      const positionMatch = sentence.match(/plays (\w+)/i);

      const gamesMatch = sentence.match(/appeared in (\d+) games/i);

      const totalPointsMatch = sentence.match(/scored ([\d.]+) total fantasy points/i);
      const avgPointsMatch = sentence.match(/average of ([\d.]+) points per game/i);

      const rushingAttemptsMatch = sentence.match(/had ([\d.]+) attempts/i);
      const rushingTotalMatch = sentence.match(/for ([\d.]+) total rushing yards/i);
      const avgRushingMatch = sentence.match(/averaging ([\d.]+) rushing yards per game/i);

      const receptionsMatch = sentence.match(/recorded ([\d.]+) receptions/i);
      const targetsMatch = sentence.match(/on ([\d.]+) targets/i);
      const receivingTotalMatch = sentence.match(/for ([\d.]+) total receiving yards/i);
      const avgReceivingMatch = sentence.match(/averaging ([\d.]+) receiving yards per game/i);
      const receivingTDsMatch = sentence.match(/scored ([\d.]+) receiving touchdowns/i);

      const yprMatch = sentence.match(/averaged ([\d.]+) yards per reception/i);
      const yacMatch = sentence.match(/had ([\d.]+) total yards after catch/i);

      // ✅ Assign metadata
      if (teamMatch) metadata.team = teamMatch[1];
      if (ownerMatch) metadata.owner = ownerMatch[1].trim();
      if (playerMatch) metadata.player = playerMatch[1];
      if (positionMatch) metadata.position = positionMatch[1];

      if (gamesMatch) metadata.games_played = parseInt(gamesMatch[1]);

      if (totalPointsMatch) metadata.points_total = parseFloat(totalPointsMatch[1]);
      if (avgPointsMatch) metadata.avg_points = parseFloat(avgPointsMatch[1]);

      if (rushingAttemptsMatch) metadata.rushing_attempts_total = parseFloat(rushingAttemptsMatch[1]);
      if (rushingTotalMatch) metadata.rushing_yards_total = parseFloat(rushingTotalMatch[1]);
      if (avgRushingMatch) metadata.avg_rushing_yards = parseFloat(avgRushingMatch[1]);

      if (receptionsMatch) metadata.receptions_total = parseFloat(receptionsMatch[1]);
      if (targetsMatch) metadata.targets_total = parseFloat(targetsMatch[1]);
      if (receivingTotalMatch) metadata.receiving_yards_total = parseFloat(receivingTotalMatch[1]);
      if (avgReceivingMatch) metadata.avg_receiving_yards = parseFloat(avgReceivingMatch[1]);
      if (receivingTDsMatch) metadata.receiving_TDs_total = parseFloat(receivingTDsMatch[1]);

      if (yprMatch) metadata.yards_per_reception = parseFloat(yprMatch[1]);
      if (yacMatch) metadata.yards_after_catch_total = parseFloat(yacMatch[1]);

      return {
        id: createReadableIdFromMetadata(metadata),
        values: item.embedding,
        metadata,
      };
    });

    // ✅ LOGGING (correct placement)
    console.log(`🧪 Batch ${i / batchSize + 1} preview:`);

    const playerStatsCount = vectors.filter(
      (v) => v.metadata.type === "player_season_stats"
    ).length;

    console.log(`📊 Player stats in this batch: ${playerStatsCount}`);

    vectors.slice(0, 5).forEach((v, idx) => {
      console.log(`Sample ${idx + 1}:`, {
        id: v.id,
        player: v.metadata.player,
        team: v.metadata.team,
      });
    });

    totalMatched += vectors.length;

    // ✅ DRY RUN CONTROL
    if (DRY_RUN) {
      console.log(`🚫 DRY RUN: Skipping upsert for this batch`);
    } else {
      console.log(`📡 Upserting ${vectors.length} vectors to Pinecone...`);
      await index.upsert(vectors);
    }
  }

  console.log(`\n🔍 TOTAL RECORDS IDENTIFIED: ${totalMatched}`);

  if (DRY_RUN) {
    console.log("🧪 DRY RUN COMPLETE — No data was written.");
  } else {
    console.log("✅ DONE! Data successfully upserted.");
  }
}

// Execute
manuallyUpsertData().catch(console.error);
