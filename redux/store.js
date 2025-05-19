"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice";
import questsReducer from "./slice/questSlice";
import modalsReducer from "./slice/modalsSlice";
import categoryReducer from "./slice/categorySlice";
import podsReducer from "./slice/podsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    pods: podsReducer,
    quest: questsReducer,
    modals: modalsReducer,
    category: categoryReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
