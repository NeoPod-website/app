import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pods: [],
  lastKey: null,
  hasMore: false,
  currentPod: null,
  isLoading: false,
};

const podsSlice = createSlice({
  name: "pods",

  initialState,

  reducers: {
    initializePods: (state, action) => {
      state.pods = action.payload.pods;
      state.lastKey = action.payload.lastKey;
      state.hasMore = action.payload.hasMore;
    },

    setPods: (state, action) => {
      state.pods = action.payload;
    },

    appendPods: (state, action) => {
      state.pods = [...state.pods, ...action.payload.pods];
      state.lastKey = action.payload.lastKey;
      state.hasMore = action.payload.hasMore;
    },

    removePod: (state, action) => {
      state.pods = state.pods.filter((pod) => pod.pod_id !== action.payload);
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    updatePod: (state, action) => {
      const index = state.pods.findIndex(
        (pod) => pod.pod_id === action.payload.pod_id,
      );
      if (index !== -1) {
        state.pods[index] = { ...state.pods[index], ...action.payload };
      }
    },

    setCurrentPod: (state, action) => {
      state.currentPod = action.payload;
    },

    resetCurrentPod: (state) => {
      state.currentPod = null;
    },
  },
});

export const {
  setPods,
  removePod,
  updatePod,
  appendPods,
  setLoading,
  setCurrentPod,
  initializePods,
  resetCurrentPod,
} = podsSlice.actions;

export default podsSlice.reducer;
