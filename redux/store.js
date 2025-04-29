"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice";
import questsReducer from "./slice/questSlice";
import modalsReducer from "./slice/modalsSlice";
import categoryReducer from "./slice/categorySlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    modals: modalsReducer,
    quest: questsReducer,
    category: categoryReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
