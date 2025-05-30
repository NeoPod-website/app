import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSocialModalOpen: false,
  isAddTasksModalOpen: false,
  isDeleteConfirmationModalOpen: true,
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

    toggleDeleteConfirmationModal: (state) => {
      state.isDeleteConfirmationModalOpen =
        !state.isDeleteConfirmationModalOpen;
    },
  },
});

export const {
  toggleSocialModal,
  toggleAddTasksModal,
  toggleDeleteConfirmationModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
