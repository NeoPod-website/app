import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  submissions: [],
  lastKey: null,
  hasMore: false,
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
};

const submissionsSlice = createSlice({
  name: "submissions",

  initialState,

  reducers: {
    initializeSubmissions: (state, action) => {
      const { submissions, lastKey, hasMore } = action.payload;

      state.submissions = submissions || [];
      state.lastKey = lastKey;
      state.hasMore = hasMore;
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = Date.now();
    },

    appendSubmissions: (state, action) => {
      const { submissions, lastKey, hasMore } = action.payload;

      // Filter out duplicates based on submission_id
      const existingIds = new Set(
        state.submissions.map((s) => s.submission_id),
      );
      const newSubmissions = submissions.filter(
        (s) => !existingIds.has(s.submission_id),
      );

      state.submissions = [...state.submissions, ...newSubmissions];
      state.lastKey = lastKey;
      state.hasMore = hasMore;
      state.isLoading = false;
      state.lastUpdated = Date.now();
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    removeSubmission: (state, action) => {
      const submissionId = action.payload;
      state.submissions = state.submissions.filter(
        (s) => s.submission_id !== submissionId,
      );
      state.lastUpdated = Date.now();
    },

    updateSubmission: (state, action) => {
      const { submissionId, updatedData } = action.payload;
      const index = state.submissions.findIndex(
        (s) => s.submission_id === submissionId,
      );

      if (index !== -1) {
        state.submissions[index] = {
          ...state.submissions[index],
          ...updatedData,
        };
        state.lastUpdated = Date.now();
      }
    },

    clearAllSubmissions: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  initializeSubmissions,
  appendSubmissions,
  setLoading,
  setError,
  clearError,
  removeSubmission,
  updateSubmission,
  clearAllSubmissions,
} = submissionsSlice.actions;

export default submissionsSlice.reducer;
