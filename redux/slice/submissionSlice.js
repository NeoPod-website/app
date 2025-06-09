import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  submitting: false,
  questMetadata: {},
  submittedQuests: [],
  activeSubmissions: {},
  lastUpdated: Date.now(),
  recentlySubmittedQuests: [],
};

const submissionSlice = createSlice({
  name: "submission",

  initialState,

  reducers: {
    // NEW: Initialize quest with all its tasks
    initializeQuestSubmission: (state, action) => {
      const { questId, totalTasks, taskIds } = action.payload;

      if (!state.activeSubmissions[questId]) {
        state.activeSubmissions[questId] = {
          answers: {},
          taskStatus: {},
          isComplete: false,
        };
      }

      // Store quest metadata
      state.questMetadata[questId] = {
        totalTasks,
        taskIds,
      };

      // Initialize all task statuses as incomplete
      const submission = state.activeSubmissions[questId];
      taskIds.forEach((taskId) => {
        if (!submission.taskStatus[taskId]) {
          submission.taskStatus[taskId] = {
            completed: false,
            required: true,
          };
        }
      });

      state.lastUpdated = Date.now();
    },

    updateTaskAnswer: (state, action) => {
      const { questId, taskId, answer } = action.payload;

      // Auto-create submission if it doesn't exist
      if (!state.activeSubmissions[questId]) {
        state.activeSubmissions[questId] = {
          answers: {},
          taskStatus: {},
          isComplete: false,
        };
      }

      const submission = state.activeSubmissions[questId];

      // Update answer
      submission.answers[taskId] = answer;

      // Update task status
      submission.taskStatus[taskId] = {
        completed: isAnswerComplete(answer),
        required: true,
      };

      // Check if all tasks are completed - FIXED LOGIC
      const questMetadata = state.questMetadata[questId];
      if (questMetadata) {
        // Check all required tasks from metadata
        submission.isComplete = questMetadata.taskIds.every(
          (id) => submission.taskStatus[id]?.completed === true,
        );
      } else {
        // Fallback: only check existing task statuses (old behavior)
        submission.isComplete = Object.values(submission.taskStatus).every(
          (status) => status.completed,
        );
      }

      state.lastUpdated = Date.now();
    },

    markTaskCompleted: (state, action) => {
      const { questId, taskId, completed = true } = action.payload;

      // Auto-create submission if it doesn't exist
      if (!state.activeSubmissions[questId]) {
        state.activeSubmissions[questId] = {
          answers: {},
          taskStatus: {},
          isComplete: false,
        };
      }

      const submission = state.activeSubmissions[questId];

      // Mark task as completed
      submission.taskStatus[taskId] = {
        completed,
        required: true,
      };

      // Set answer to true for completed tasks
      if (completed) {
        submission.answers[taskId] = true;
      }

      // Check if all tasks are completed - FIXED LOGIC
      const questMetadata = state.questMetadata[questId];
      if (questMetadata) {
        // Check all required tasks from metadata
        submission.isComplete = questMetadata.taskIds.every(
          (id) => submission.taskStatus[id]?.completed === true,
        );
      } else {
        // Fallback: only check existing task statuses (old behavior)
        submission.isComplete = Object.values(submission.taskStatus).every(
          (status) => status.completed,
        );
      }

      state.lastUpdated = Date.now();
    },

    setSubmitting: (state, action) => {
      state.submitting = action.payload;
      state.error = null;
    },

    setSubmissionError: (state, action) => {
      state.error = action.payload;
      state.submitting = false;
    },

    clearSubmissionError: (state) => {
      state.error = null;
    },

    addSubmittedQuest: (state, action) => {
      const { questId } = action.payload;

      // Add to permanent submitted quests list
      if (!state.submittedQuests.includes(questId)) {
        state.submittedQuests.push(questId);
      }

      // Remove from active submissions and metadata after successful submit
      delete state.activeSubmissions[questId];
      delete state.questMetadata[questId];
      state.submitting = false;
      state.lastUpdated = Date.now();
    },

    // NEW: Mark quest as recently submitted (for showing success state)
    markQuestAsSubmitted: (state, action) => {
      const { questId } = action.payload;

      // Add to recently submitted list if not already there
      if (!state.recentlySubmittedQuests.includes(questId)) {
        state.recentlySubmittedQuests.push(questId);
      }
    },

    // NEW: Clear recently submitted state
    clearQuestSubmitted: (state, action) => {
      const { questId } = action.payload;

      // Remove from recently submitted list
      state.recentlySubmittedQuests = state.recentlySubmittedQuests.filter(
        (id) => id !== questId,
      );
    },

    resetQuestSubmission: (state, action) => {
      const questId = action.payload;
      delete state.activeSubmissions[questId];
      delete state.questMetadata[questId];
      state.lastUpdated = Date.now();
    },

    clearAllSubmissions: (state) => {
      state.error = null;
      state.questMetadata = {};
      state.submitting = false;
      state.activeSubmissions = {};
      state.lastUpdated = Date.now();
      state.recentlySubmittedQuests = [];
    },
  },
});

// Helper function
// function isAnswerComplete(answer) {
//   if (answer === null || answer === undefined) return false;
//   if (typeof answer === "string") return answer.trim().length > 0;
//   if (typeof answer === "boolean") return answer;
//   if (typeof answer === "number") return !isNaN(answer) && answer !== null;
//   return Boolean(answer);
// }

function isAnswerComplete(answer) {
  if (answer === null || answer === undefined) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  if (typeof answer === "boolean") return answer;
  if (typeof answer === "number") return !isNaN(answer) && answer !== null;

  // Handle file upload tasks
  if (answer && typeof answer === "object" && answer.file) {
    return Boolean(answer.file); // Complete when file is selected
  }

  // Handle Discord tasks
  if (
    answer &&
    typeof answer === "object" &&
    (answer.hasOwnProperty("joined") || answer.hasOwnProperty("verified"))
  ) {
    // If the answer has verified property, it means verification was required
    if (answer.hasOwnProperty("verified")) {
      return answer.verified === true;
    }

    // If no verified property but joined is true, task is complete (no verification required)
    return answer.joined === true;
  }

  return Boolean(answer);
}

// Basic selectors (these are fine as they return primitives)
export const selectSubmissionState = (state) => state.submission;
export const selectActiveSubmissions = (state) =>
  state.submission.activeSubmissions;
export const selectQuestMetadataState = (state) =>
  state.submission.questMetadata;
export const selectRecentlySubmittedQuests = (state) =>
  state.submission.recentlySubmittedQuests;
export const selectIsSubmitting = (state) => state.submission.submitting;
export const selectSubmissionError = (state) => state.submission.error;

// Memoized selectors for objects/arrays
export const selectActiveSubmission = createSelector(
  [selectActiveSubmissions, (state, questId) => questId],
  (activeSubmissions, questId) => activeSubmissions[questId] || null,
);

export const selectIsQuestComplete = createSelector(
  [selectActiveSubmission],
  (submission) => submission?.isComplete || false,
);

export const selectTaskAnswer = createSelector(
  [selectActiveSubmission, (state, questId, taskId) => taskId],
  (submission, taskId) => submission?.answers?.[taskId],
);

export const selectIsTaskCompleted = createSelector(
  [selectActiveSubmission, (state, questId, taskId) => taskId],
  (submission, taskId) => submission?.taskStatus?.[taskId]?.completed || false,
);

export const selectSubmissionAnswers = createSelector(
  [selectActiveSubmission],
  (submission) => submission?.answers || {},
);

export const selectQuestMetadata = createSelector(
  [selectQuestMetadataState, (state, questId) => questId],
  (questMetadata, questId) => questMetadata[questId] || null,
);

export const selectIsQuestSubmitted = createSelector(
  [selectRecentlySubmittedQuests, (state, questId) => questId],
  (recentlySubmittedQuests, questId) =>
    recentlySubmittedQuests.includes(questId),
);

export const selectWasQuestEverSubmitted = createSelector(
  [(state) => state.submission.submittedQuests, (state, questId) => questId],
  (submittedQuests, questId) => submittedQuests.includes(questId),
);

export const {
  setSubmitting,
  updateTaskAnswer,
  addSubmittedQuest,
  markTaskCompleted,
  setSubmissionError,
  clearAllSubmissions,
  clearQuestSubmitted,
  clearSubmissionError,
  resetQuestSubmission,
  markQuestAsSubmitted,
  initializeQuestSubmission,
} = submissionSlice.actions;

export default submissionSlice.reducer;
