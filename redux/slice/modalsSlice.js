import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isInboxOpen: false,
  selectedQuest: null,
  deleteModalData: null,
  isMobileMenuOpen: false,
  isSocialModalOpen: false,
  isAddTasksModalOpen: false,
  isShareQuestModalOpen: false,
  isSupportedWalletModalOpen: false,
  isDeleteConfirmationModalOpen: false,
  isDisconnectedSocialModalOpen: false,
  isRemoveAmbassadorWalletModalOpen: false,
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

    toggleInboxModal: (state) => {
      state.isInboxOpen = !state.isInboxOpen;
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

    toggleSupportedWalletModal: (state) => {
      state.isSupportedWalletModalOpen = !state.isSupportedWalletModalOpen;
    },

    toggleRemoveAmbassadorWalletModal: (state) => {
      state.isRemoveAmbassadorWalletModalOpen =
        !state.isRemoveAmbassadorWalletModalOpen;
    },

    toggleDisconnectedSocialModal: (state) => {
      state.isDisconnectedSocialModalOpen =
        !state.isDisconnectedSocialModalOpen;
    },

    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
  },
});

export const {
  toggleInboxModal,
  setSelectedQuest,
  toggleMobileMenu,
  toggleSocialModal,
  setDeleteModalData,
  toggleAddTasksModal,
  clearDeleteModalData,
  toggleShareQuestModal,
  toggleSupportedWalletModal,
  toggleDeleteConfirmationModal,
  toggleDisconnectedSocialModal,
  toggleRemoveAmbassadorWalletModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
