import { v4 as uuidv4 } from "uuid";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quests: [],
  currentQuest: {
    name: "",
    tasks: [],
    rewards: [],
    podId: null,
    description: "",
    categoryId: null,
  },
  loading: false,
  error: null,
  lastUpdated: Date.now(),
};

const questSlice = createSlice({
  name: "quest",

  initialState,

  reducers: {
    setCurrentQuest: (state, action) => {
      state.currentQuest = {
        ...state.currentQuest,
        ...action.payload,
      };
      state.lastUpdated = Date.now();
    },

    addCurrentQuestTask: (state, action) => {
      const taskWithId = {
        id: uuidv4(),
        name: "text",
        instruction: "",
        description: "",
        placeholder: "",
        ...action.payload,
      };

      state.currentQuest.tasks.push(taskWithId);
      state.lastUpdated = Date.now();
    },

    updateCurrentQuestTask: (state, action) => {
      const { id, changes } = action.payload;

      if (!id) {
        console.error("Task ID is required for updates");
        return;
      }

      const taskIndex = state.currentQuest.tasks.findIndex(
        (task) => task.id === id,
      );

      if (taskIndex !== -1) {
        state.currentQuest.tasks[taskIndex] = {
          ...state.currentQuest.tasks[taskIndex],
          ...changes,
        };
        state.lastUpdated = Date.now();
      } else {
        console.error(`Task with ID ${id} not found`);
      }
    },

    removeCurrentQuestTask: (state, action) => {
      const taskId = action.payload;

      if (!taskId) {
        console.error("Task ID is required for deletion");
        return;
      }

      state.currentQuest.tasks = state.currentQuest.tasks.filter(
        (task) => task.id !== taskId,
      );

      state.lastUpdated = Date.now();
    },

    reorderCurrentQuestTasks: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;

      if (sourceIndex === destinationIndex) return;

      const taskToMove = state.currentQuest.tasks[sourceIndex];

      state.currentQuest.tasks.splice(sourceIndex, 1);

      state.currentQuest.tasks.splice(destinationIndex, 0, taskToMove);

      state.lastUpdated = Date.now();
    },

    setQuests: (state, action) => {
      state.quests = action.payload;
      state.lastUpdated = Date.now();
    },

    resetCurrentQuest: (state) => {
      state.currentQuest = { ...initialState.currentQuest };
      state.lastUpdated = Date.now();
    },

    publishCurrentQuest: (state) => {
      state.currentQuest.isPublished = true;

      state.lastUpdated = Date.now();
    },
  },
});

export const {
  setQuests,
  setCurrentQuest,
  addCurrentQuestTask,
  updateCurrentQuestTask,
  removeCurrentQuestTask,
  reorderCurrentQuestTasks,
  resetCurrentQuest,
  publishCurrentQuest,
} = questSlice.actions;

export default questSlice.reducer;
