import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeWallet: null,
  isNewContactsModalOpen: false,
};

const modalsSlice = createSlice({
  name: "modals",

  initialState,

  reducers: {
    toggleNewContactsModal: (state) => {
      state.isNewContactsModalOpen = !state.isNewContactsModalOpen;
    },

    setActiveWallet: (state, action) => {
      state.activeWallet = action.payload;
    },
  },
});

export const { toggleNewContactsModal, setActiveWallet } = modalsSlice.actions;

export default modalsSlice.reducer;
