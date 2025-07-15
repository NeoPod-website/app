// import { v4 as uuidv4 } from "uuid";
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   quests: [],
//   currentQuest: {
//     name: "",
//     tasks: [],
//     rewards: [],
//     podId: null,
//     description: "",
//     categoryId: null,
//     isInitialized: false,
//   },
//   loading: false,
//   error: null,
//   lastUpdated: Date.now(),
// };

// const questSlice = createSlice({
//   name: "quest",

//   initialState,

//   reducers: {
//     setCurrentQuest: (state, action) => {
//       state.currentQuest = {
//         ...state.currentQuest,
//         ...action.payload,
//       };
//       state.lastUpdated = Date.now();
//     },

//     addCurrentQuestTask: (state, action) => {
//       const taskWithId = {
//         id: uuidv4(),
//         name: "text",
//         instruction: "",
//         description: "",
//         placeholder: "",
//         ...action.payload,
//       };

//       state.currentQuest.tasks.push(taskWithId);
//       state.lastUpdated = Date.now();
//     },

//     updateCurrentQuestTask: (state, action) => {
//       const { id, changes } = action.payload;

//       if (!id) {
//         console.error("Task ID is required for updates");
//         return;
//       }

//       const taskIndex = state.currentQuest.tasks.findIndex(
//         (task) => task.id === id,
//       );

//       if (taskIndex !== -1) {
//         state.currentQuest.tasks[taskIndex] = {
//           ...state.currentQuest.tasks[taskIndex],
//           ...changes,
//         };
//         state.lastUpdated = Date.now();
//       } else {
//         console.error(`Task with ID ${id} not found`);
//       }
//     },

//     removeCurrentQuestTask: (state, action) => {
//       const taskId = action.payload;

//       if (!taskId) {
//         console.error("Task ID is required for deletion");
//         return;
//       }

//       state.currentQuest.tasks = state.currentQuest.tasks.filter(
//         (task) => task.id !== taskId,
//       );

//       state.lastUpdated = Date.now();
//     },

//     reorderCurrentQuestTasks: (state, action) => {
//       const { sourceIndex, destinationIndex } = action.payload;

//       if (sourceIndex === destinationIndex) return;

//       const taskToMove = state.currentQuest.tasks[sourceIndex];

//       state.currentQuest.tasks.splice(sourceIndex, 1);

//       state.currentQuest.tasks.splice(destinationIndex, 0, taskToMove);

//       state.lastUpdated = Date.now();
//     },

//     setQuests: (state, action) => {
//       state.quests = action.payload;
//       state.lastUpdated = Date.now();
//     },

//     resetCurrentQuest: (state) => {
//       state.currentQuest = { ...initialState.currentQuest };
//       state.lastUpdated = Date.now();
//     },

//     publishCurrentQuest: (state) => {
//       state.currentQuest.isPublished = true;

//       state.lastUpdated = Date.now();
//     },
//   },
// });

// export const {
//   setQuests,
//   setCurrentQuest,
//   resetCurrentQuest,
//   addCurrentQuestTask,
//   publishCurrentQuest,
//   removeCurrentQuestTask,
//   updateCurrentQuestTask,
//   reorderCurrentQuestTasks,
// } = questSlice.actions;

// export default questSlice.reducer;

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
    isInitialized: false,
    highlighted_submissions: [],
  },

  // Global highlighted submissions data cache
  error: null,
  loading: false,
  highlightedSubmissionsData: [],
  lastUpdated: Date.now(),
};

const questSlice = createSlice({
  name: "quest",
  initialState,
  reducers: {
    setCurrentQuest: (state, action) => {
      const newQuest = {
        ...state.currentQuest,
        ...action.payload,
      };

      // If highlighted_submissions changed, clear the cached data to force refetch
      if (
        JSON.stringify(state.currentQuest.highlighted_submissions) !==
        JSON.stringify(newQuest.highlighted_submissions)
      ) {
        state.highlightedSubmissionsData = [];
      }

      state.currentQuest = newQuest;
      state.lastUpdated = Date.now();
    },

    // NEW: Update highlighted submissions array
    updateHighlightedSubmissions: (state, action) => {
      state.currentQuest.highlighted_submissions = action.payload;
      state.lastUpdated = Date.now();
    },

    // NEW: Add submission to highlights
    addHighlightedSubmission: (state, action) => {
      const submissionId = action.payload;
      if (!state.currentQuest.highlighted_submissions.includes(submissionId)) {
        state.currentQuest.highlighted_submissions.push(submissionId);
        state.lastUpdated = Date.now();
      }
    },

    // NEW: Remove submission from highlights
    removeHighlightedSubmission: (state, action) => {
      const submissionId = action.payload;
      state.currentQuest.highlighted_submissions =
        state.currentQuest.highlighted_submissions.filter(
          (id) => id !== submissionId,
        );
      // Also remove from cached data
      state.highlightedSubmissionsData =
        state.highlightedSubmissionsData.filter(
          (sub) => sub.submission_id !== submissionId,
        );
      state.lastUpdated = Date.now();
    },

    // NEW: Cache highlighted submissions data
    setHighlightedSubmissionsData: (state, action) => {
      state.highlightedSubmissionsData = action.payload;
      state.lastUpdated = Date.now();
    },

    // NEW: Update single highlighted submission in cache
    updateHighlightedSubmissionData: (state, action) => {
      const updatedSubmission = action.payload;
      const index = state.highlightedSubmissionsData.findIndex(
        (sub) => sub.submission_id === updatedSubmission.submission_id,
      );

      if (index !== -1) {
        state.highlightedSubmissionsData[index] = updatedSubmission;
      } else {
        state.highlightedSubmissionsData.push(updatedSubmission);
      }
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
      state.highlightedSubmissionsData = [];
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
  resetCurrentQuest,
  addCurrentQuestTask,
  publishCurrentQuest,
  removeCurrentQuestTask,
  updateCurrentQuestTask,
  reorderCurrentQuestTasks,
  updateHighlightedSubmissions,
  addHighlightedSubmission,
  removeHighlightedSubmission,
  setHighlightedSubmissionsData,
  updateHighlightedSubmissionData,
} = questSlice.actions;

export default questSlice.reducer;
