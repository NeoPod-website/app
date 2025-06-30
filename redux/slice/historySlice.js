// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   history: [],
//   lastKey: null,
//   hasMore: false,
//   isLoading: false,
//   error: null,
// };

// const historySlice = createSlice({
//   name: "history",

//   initialState,

//   reducers: {
//     initializeHistory: (state, action) => {
//       const { history, lastKey, hasMore } = action.payload;
//       state.history = history || [];
//       state.lastKey = lastKey;
//       state.hasMore = hasMore || false;
//       state.isLoading = false;
//       state.error = null;
//     },

//     appendHistory: (state, action) => {
//       const { history, lastKey, hasMore } = action.payload;

//       // Avoid duplicates by filtering out existing submission IDs
//       const existingIds = new Set(state.history.map((h) => h.submission_id));
//       const newHistory = (history || []).filter(
//         (h) => !existingIds.has(h.submission_id),
//       );

//       state.history = [...state.history, ...newHistory];
//       state.lastKey = lastKey;
//       state.hasMore = hasMore || false;
//       state.isLoading = false;
//       state.error = null;
//     },

//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//       if (action.payload) {
//         state.error = null;
//       }
//     },

//     setError: (state, action) => {
//       state.error = action.payload;
//       state.isLoading = false;
//     },

//     clearHistory: (state) => {
//       state.history = [];
//       state.lastKey = null;
//       state.hasMore = false;
//       state.isLoading = false;
//       state.error = null;
//     },

//     updateHistoryItem: (state, action) => {
//       const { submission_id, updates } = action.payload;
//       const index = state.history.findIndex(
//         (h) => h.submission_id === submission_id,
//       );

//       if (index !== -1) {
//         state.history[index] = { ...state.history[index], ...updates };
//       }
//     },

//     removeHistoryItem: (state, action) => {
//       const submission_id = action.payload;
//       state.history = state.history.filter(
//         (h) => h.submission_id !== submission_id,
//       );
//     },
//   },
// });

// export const {
//   setError,
//   setLoading,
//   clearHistory,
//   appendHistory,
//   initializeHistory,
//   updateHistoryItem,
//   removeHistoryItem,
// } = historySlice.actions;

// export default historySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // History section (accepted + rejected)
  history: [],
  historyLastKey: null,
  historyHasMore: false,
  historyLoading: false,

  // Highlighted section
  highlighted: [],
  highlightedLastKey: null,
  highlightedHasMore: false,
  highlightedLoading: false,

  error: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    // History actions
    initializeHistory: (state, action) => {
      const { history, lastKey, hasMore } = action.payload;
      state.history = history || [];
      state.historyLastKey = lastKey;
      state.historyHasMore = hasMore || false;
      state.historyLoading = false;
      state.error = null;
    },

    appendHistory: (state, action) => {
      const { history, lastKey, hasMore } = action.payload;

      const existingIds = new Set(state.history.map((h) => h.submission_id));
      const newHistory = (history || []).filter(
        (h) => !existingIds.has(h.submission_id),
      );

      state.history = [...state.history, ...newHistory];
      state.historyLastKey = lastKey;
      state.historyHasMore = hasMore || false;
      state.historyLoading = false;
      state.error = null;
    },

    setHistoryLoading: (state, action) => {
      state.historyLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Highlighted actions
    initializeHighlighted: (state, action) => {
      const { highlighted, lastKey, hasMore } = action.payload;
      state.highlighted = highlighted || [];
      state.highlightedLastKey = lastKey;
      state.highlightedHasMore = hasMore || false;
      state.highlightedLoading = false;
      state.error = null;
    },

    appendHighlighted: (state, action) => {
      const { highlighted, lastKey, hasMore } = action.payload;

      const existingIds = new Set(
        state.highlighted.map((h) => h.submission_id),
      );
      const newHighlighted = (highlighted || []).filter(
        (h) => !existingIds.has(h.submission_id),
      );

      state.highlighted = [...state.highlighted, ...newHighlighted];
      state.highlightedLastKey = lastKey;
      state.highlightedHasMore = hasMore || false;
      state.highlightedLoading = false;
      state.error = null;
    },

    setHighlightedLoading: (state, action) => {
      state.highlightedLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
      state.historyLoading = false;
      state.highlightedLoading = false;
    },

    // Clear all
    clearAll: (state) => {
      return initialState;
    },
  },
});

export const {
  setError,
  clearAll,
  appendHistory,
  initializeHistory,
  setHistoryLoading,
  appendHighlighted,
  initializeHighlighted,
  setHighlightedLoading,
} = historySlice.actions;

export default historySlice.reducer;
