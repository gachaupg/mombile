import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../services/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const API_KEY = "3"; // Free API key for thesportsdb.com
const BASE_URL = "https://www.thesportsdb.com/api/v1/json";

const initialState = {
  games: [],
  filteredGames: [],
  searchTerm: "",
  favorites: [],
  loading: false,
  error: null,
};

export const fetchUpcomingGames = createAsyncThunk(
  "games/fetchUpcoming",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch Major League Soccer (MLS) games - MLS league ID is 4346
      const response = await fetch(
        `${BASE_URL}/${API_KEY}/eventsnextleague.php?id=4346`
      );

      if (!response.ok) {
        console.error("API request failed with status:", response.status);
        throw new Error("Failed to fetch games");
      }

      const data = await response.json();

      // Check if we actually got events data
      if (!data.events) {
        console.error("API response missing events data:", data);
        throw new Error("No games data available");
      }

      return data.events || [];
    } catch (error) {
      console.error("Error in fetchUpcomingGames:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavoriteGame = createAsyncThunk(
  "games/toggleFavorite",
  async ({ userId, game, isFavorite }, { rejectWithValue }) => {
    try {
      const favoriteRef = doc(db, `users/${userId}/favorites/${game.idEvent}`);

      if (isFavorite) {
        // Remove from favorites
        await deleteDoc(favoriteRef);
      } else {
        // Add to favorites
        await setDoc(favoriteRef, {
          idEvent: game.idEvent,
          strEvent: game.strEvent,
          strHomeTeam: game.strHomeTeam,
          strAwayTeam: game.strAwayTeam,
          strLeague: game.strLeague,
          dateEvent: game.dateEvent,
          strTime: game.strTime,
          strThumb: game.strThumb,
          timestamp: new Date().toISOString(),
        });
      }

      return { game, isFavorite };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFavoriteGames = createAsyncThunk(
  "games/fetchFavorites",
  async (userId, { rejectWithValue }) => {
    try {
      const favoritesQuery = query(collection(db, `users/${userId}/favorites`));
      const querySnapshot = await getDocs(favoritesQuery);

      const favorites = [];
      querySnapshot.forEach((doc) => {
        favorites.push(doc.data());
      });

      return favorites;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      if (action.payload.trim() === "") {
        state.filteredGames = state.games;
      } else {
        const term = action.payload.toLowerCase();
        state.filteredGames = state.games.filter(
          (game) =>
            game.strHomeTeam?.toLowerCase().includes(term) ||
            game.strAwayTeam?.toLowerCase().includes(term) ||
            game.strEvent?.toLowerCase().includes(term) ||
            game.strLeague?.toLowerCase().includes(term)
        );
      }
    },
    clearSearchTerm: (state) => {
      state.searchTerm = "";
      state.filteredGames = state.games;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Upcoming Games
      .addCase(fetchUpcomingGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
        state.filteredGames = action.payload;
      })
      .addCase(fetchUpcomingGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Favorite Game
      .addCase(toggleFavoriteGame.fulfilled, (state, action) => {
        const { game, isFavorite } = action.payload;

        if (isFavorite) {
          // Remove from favorites
          state.favorites = state.favorites.filter(
            (fav) => fav.idEvent !== game.idEvent
          );
        } else {
          // Add to favorites
          state.favorites.push(game);
        }
      })
      // Fetch Favorite Games
      .addCase(fetchFavoriteGames.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavoriteGames.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoriteGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, clearSearchTerm } = gamesSlice.actions;
export default gamesSlice.reducer;
