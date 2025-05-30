import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteModalData: null,
  isSocialModalOpen: false,
  isAddTasksModalOpen: false,
  isDeleteConfirmationModalOpen: false,
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

    setDeleteModalData: (state, action) => {
      state.deleteModalData = action.payload;
    },

    clearDeleteModalData: (state) => {
      state.deleteModalData = null;
    },
  },
});

export const {
  toggleSocialModal,
  setDeleteModalData,
  toggleAddTasksModal,
  clearDeleteModalData,
  toggleDeleteConfirmationModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
