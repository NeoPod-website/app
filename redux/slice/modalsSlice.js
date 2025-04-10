import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSocialModalOpen: false,
};

const modalsSlice = createSlice({
  name: "modals",

  initialState,

  reducers: {
    toggleSocialModal: (state) => {
      state.isSocialModalOpen = !state.isSocialModalOpen;
    },
  },
});

export const { toggleSocialModal } = modalsSlice.actions;

export default modalsSlice.reducer;
