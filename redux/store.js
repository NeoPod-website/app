"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice";
import modalsReducer from "./slice/modalsSlice";
import categoryReducer from "./slice/categorySlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    modals: modalsReducer,
    category: categoryReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
