import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLang: "en",
};

const languageSlice = createSlice({
  name: "language",

  initialState,

  reducers: {
    setLanguage: (state, action) => {
      state.currentLang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
