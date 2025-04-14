"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice";
import modalsReducer from "./slice/modalsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    modals: modalsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
