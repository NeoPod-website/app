"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice";
import podsReducer from "./slice/podsSlice";
import questsReducer from "./slice/questSlice";
import modalsReducer from "./slice/modalsSlice";
import categoryReducer from "./slice/categorySlice";
import submissionReducer from "./slice/submissionSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    pods: podsReducer,
    quest: questsReducer,
    modals: modalsReducer,
    category: categoryReducer,
    submission: submissionReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
