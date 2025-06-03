import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedQuest: null,
  deleteModalData: null,
  isSocialModalOpen: false,
  isAddTasksModalOpen: false,
  isShareQuestModalOpen: true,
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

    toggleShareQuestModal: (state) => {
      state.isShareQuestModalOpen = !state.isShareQuestModalOpen;
    },

    setSelectedQuest: (state, action) => {
      state.selectedQuest = action.payload;
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
  setSelectedQuest,
  toggleSocialModal,
  setDeleteModalData,
  toggleAddTasksModal,
  clearDeleteModalData,
  toggleShareQuestModal,
  toggleDeleteConfirmationModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
