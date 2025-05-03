import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSocialModalOpen: false,
  isAddTasksModalOpen: false,
};

const modalsSlice = createSlice({
  name: "modals",

  initialState,

  reducers: {
    toggleSocialModal: (state) => {
      state.isSocialModalOpen = !state.isSocialModalOpen;
    },

    toggleAddTasksModal: (state) => {
      state.isAddTasksModalOpen = !state.isAddTasksModalOpen;
    },
  },
});

export const { toggleSocialModal, toggleAddTasksModal } = modalsSlice.actions;

export default modalsSlice.reducer;
