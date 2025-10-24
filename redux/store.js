"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice";
import podsReducer from "./slice/podsSlice";
import questsReducer from "./slice/questSlice";
import modalsReducer from "./slice/modalsSlice";
import historyReducer from "./slice/historySlice";
import categoryReducer from "./slice/categorySlice";
import languageReducer from "./slice/languageSlice";
import submissionReducer from "./slice/submissionSlice";
import submissionsReducer from "./slice/submissionsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    pods: podsReducer,
    quest: questsReducer,
    modals: modalsReducer,
    history: historyReducer,
    language: languageReducer,
    category: categoryReducer,
    submission: submissionReducer,
    submissions: submissionsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
