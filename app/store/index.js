import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import gamesReducer from "./slices/gamesSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    profile: profileReducer,
  },
});
