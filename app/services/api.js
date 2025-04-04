const API_KEY = "3"; // Free API key for thesportsdb.com
const BASE_URL = "https://www.thesportsdb.com/api/v1/json";

export const fetchMajorLeagueSoccerGames = async () => {
  try {
    // Major League Soccer League ID: 4346
    const response = await fetch(
      `${BASE_URL}/${API_KEY}/eventsnextleague.php?id=4346`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching MLS games:", error);
    throw error;
  }
};

export const fetchTeamDetails = async (teamId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${API_KEY}/lookupteam.php?id=${teamId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch team details");
    }

    const data = await response.json();
    return data.teams?.[0] || null;
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw error;
  }
};

export const fetchGameDetails = async (eventId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${API_KEY}/lookupevent.php?id=${eventId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch game details");
    }

    const data = await response.json();
    return data.events?.[0] || null;
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
};

export const searchTeamsByName = async (teamName) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${API_KEY}/searchteams.php?t=${encodeURIComponent(teamName)}`
    );

    if (!response.ok) {
      throw new Error("Failed to search teams");
    }

    const data = await response.json();
    return data.teams || [];
  } catch (error) {
    console.error("Error searching teams:", error);
    throw error;
  }
};
