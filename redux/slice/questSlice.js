import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quests: [],
  currentQuest: {
    limit: null,
    cooldown: null,
    recurrence: null,
    rewards: [],
    conditions: [],
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

const modalsSlice = createSlice({
  name: "quest",

  initialState,

  reducers: {
    setCurrentQuest: (state, action) => {
      state.currentQuest = {
        ...state.currentQuest,
        ...action.payload,
      };
    },

    setQuests: (state, action) => {
      state.quests = action.payload;
    },
  },
});

export const { setQuests, setCurrentQuest } = modalsSlice.actions;

export default modalsSlice.reducer;
