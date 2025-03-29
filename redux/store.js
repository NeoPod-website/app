"use client";

import { configureStore } from "@reduxjs/toolkit";

import modalsReducer from "./slice/modalsSlice";

export const store = configureStore({
  reducer: {
    modals: modalsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
