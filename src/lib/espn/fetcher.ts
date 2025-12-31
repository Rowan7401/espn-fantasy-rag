import axios from "axios";
import { CONFIG } from "../../config";

// The base URL for the ESPN Fantasy API v3
// Using year 2025, url modeled after network tab requests when on my team's page view
const BASE_URL = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/2025/segments/0/leagues/${CONFIG.NEXT_PUBLIC_LEAGUE_ID}`;
// Historical Endpoint (Often more stable for finished seasons)
// const BASE_URL = `https://fantasy.espn.com/apis/v3/games/ffl/leagueHistory/${CONFIG.NEXT_PUBLIC_LEAGUE_ID}?seasonId=2025`;

/**
 * Fetcher for ESPN Data
 * This handles the authentication cookies automatically.
 */
export const fetchLeagueData = async (views: string[]) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { view: views.join(",") },
      headers: {
        Cookie: `swid=${CONFIG.ESPN_SWID}; espn_s2=${CONFIG.ESPN_S2};`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    // Check if we actually got JSON
    if (
      typeof response.data === "string" &&
      response.data.includes("<!DOCTYPE html>")
    ) {
      throw new Error(
        "AUTH_FAILURE: ESPN returned a login page. Check your cookies!"
      );
    }

    return response.data;
  } catch (error: any) {
    if (error.message.includes("AUTH_FAILURE")) {
      console.error("🔑 Cookie Error: Your ESPN session has expired.");
    } else {
      console.error(
        "❌ ESPN Fetch Error:",
        error.response?.status || error.message
      );
    }
    throw error;
  }
};

/**
 * Specific helper to get all team rosters
 */
export const getRosters = () => fetchLeagueData(["mRoster", "mTeam"]);

/**
 * Specific helper to get league settings (scoring rules, etc.)
 */
export const getSettings = () => fetchLeagueData(["mSettings"]);
