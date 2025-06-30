// /**
//  * Utility functions for time calculations
//  */
// const timeUtils = {
//   // Convert cooldown string to milliseconds
//   getCooldownMs: (cooldown) => {
//     const timeMap = {
//       "1h": 60 * 60 * 1000,
//       "2h": 2 * 60 * 60 * 1000,
//       "6h": 6 * 60 * 60 * 1000,
//       "12h": 12 * 60 * 60 * 1000,
//       daily: 24 * 60 * 60 * 1000,
//       weekly: 7 * 24 * 60 * 60 * 1000,
//       monthly: 30 * 24 * 60 * 60 * 1000,
//     };
//     return timeMap[cooldown] || 0;
//   },

//   // Get the start of the current recurrence period
//   getRecurrencePeriodStart: (recurrence) => {
//     const now = new Date();

//     switch (recurrence) {
//       case "daily":
//         return new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       case "weekly":
//         const dayOfWeek = now.getDay();
//         const diff = now.getDate() - dayOfWeek;
//         return new Date(now.getFullYear(), now.getMonth(), diff);
//       case "monthly":
//         return new Date(now.getFullYear(), now.getMonth(), 1);
//       default:
//         return new Date(0); // Beginning of time for one-time quests
//     }
//   },

//   // Check if a date is within current recurrence period
//   isInCurrentRecurrencePeriod: (submissionDate, recurrence) => {
//     const periodStart = timeUtils.getRecurrencePeriodStart(recurrence);
//     const submissionTime = new Date(submissionDate);
//     return submissionTime >= periodStart;
//   },
// };

// /**
//  * Check if user has completed quest in current recurrence period
//  * Only triggers after quest acceptance (approved status)
//  */
// const hasCompletedInCurrentPeriod = (quest, questSubmissions) => {
//   if (!quest.recurrence) return false;

//   const approvedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "approved",
//   );

//   return approvedSubmissions.some((submission) =>
//     timeUtils.isInCurrentRecurrencePeriod(
//       submission.submitted_at,
//       quest.recurrence,
//     ),
//   );
// };

// /**
//  * Check if user is in cooldown period after a rejection
//  * Only triggers after quest rejection
//  */
// const isInCooldownPeriod = (quest, questSubmissions) => {
//   if (!quest.cooldown) return false;

//   const rejectedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "rejected",
//   );

//   if (rejectedSubmissions.length === 0) return false;

//   // Get the most recent rejected submission
//   const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//     new Date(current.reviewed_at || current.submitted_at) >
//     new Date(latest.reviewed_at || latest.submitted_at)
//       ? current
//       : latest,
//   );

//   const rejectionTime = new Date(
//     latestRejection.reviewed_at || latestRejection.submitted_at,
//   );
//   const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);
//   const cooldownEnd = new Date(rejectionTime.getTime() + cooldownMs);

//   return new Date() < cooldownEnd;
// };

// /**
//  * Check if quest has reached its claim limit
//  * questSubmissionCounts: { quest_id: approved_count }
//  */
// const hasReachedClaimLimit = (quest, questSubmissionCounts) => {
//   if (!quest.limit) return false;

//   const approvedCount = questSubmissionCounts[quest.quest_id] || 0;
//   return approvedCount >= quest.limit;
// };

// /**
//  * Check if quest is past its due date
//  */
// const isPastDueDate = (quest) => {
//   if (!quest.due_date) return false;
//   return new Date() > new Date(quest.due_date);
// };

// /**
//  * Check if user has pending submission for this quest
//  */
// const hasPendingSubmission = (quest, questSubmissions) => {
//   return questSubmissions.some((sub) =>
//     ["pending", "in_progress"].includes(sub.review_status),
//   );
// };

// /**
//  * Check if user meets quest conditions
//  * Simplified to only check quest completion and discord roles
//  */
// const meetsConditions = (quest, user, completedQuests) => {
//   if (!quest.conditions || quest.conditions.length === 0) return true;

//   return quest.conditions.every((condition) => {
//     switch (condition.type) {
//       case "discord":
//         // Check if user's role_type matches the required discord role
//         return user.role_type === condition.role;

//       case "quest":
//         if (condition.completed) {
//           // User must have completed this quest
//           return completedQuests.includes(condition.questId);
//         } else {
//           // User must NOT have completed this quest
//           return !completedQuests.includes(condition.questId);
//         }

//       default:
//         return true; // Unknown condition types are ignored
//     }
//   });
// };

// /**
//  * Get next available date for quest (cooldown calculation)
//  */
// const getNextAvailableDate = (quest, questSubmissions) => {
//   if (!isInCooldownPeriod(quest, questSubmissions)) return null;

//   const rejectedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "rejected",
//   );

//   if (rejectedSubmissions.length === 0) return null;

//   const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//     new Date(current.reviewed_at || current.submitted_at) >
//     new Date(latest.reviewed_at || latest.submitted_at)
//       ? current
//       : latest,
//   );

//   const rejectionTime = new Date(
//     latestRejection.reviewed_at || latestRejection.submitted_at,
//   );
//   const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);

//   return new Date(rejectionTime.getTime() + cooldownMs);
// };

// /**
//  * Main function to determine if a quest is available for submission
//  */
// export const isQuestAvailable = (
//   quest,
//   questSubmissions,
//   questSubmissionCounts,
//   user,
//   completedQuests,
// ) => {
//   // Check if past due date
//   if (isPastDueDate(quest)) {
//     return {
//       available: false,
//       reason: "Quest is past due date",
//     };
//   }

//   // Check if quest has reached claim limit
//   if (hasReachedClaimLimit(quest, questSubmissionCounts)) {
//     return {
//       available: false,
//       reason: "Quest has reached maximum submissions",
//     };
//   }

//   // Check if user has pending submission
//   if (hasPendingSubmission(quest, questSubmissions)) {
//     return {
//       available: false,
//       reason: "You have a pending submission for this quest",
//     };
//   }

//   // Check if user is in cooldown period
//   if (isInCooldownPeriod(quest, questSubmissions)) {
//     return {
//       available: false,
//       reason: "You are in cooldown period after rejection",
//     };
//   }

//   // Check if user has completed in current recurrence period
//   if (hasCompletedInCurrentPeriod(quest, questSubmissions)) {
//     return {
//       available: false,
//       reason: "Already completed in current period",
//     };
//   }

//   // Check if user meets quest conditions
//   if (!meetsConditions(quest, user, completedQuests)) {
//     return {
//       available: false,
//       reason: "You do not meet the quest requirements",
//     };
//   }

//   return {
//     available: true,
//     reason: "Quest is available for submission",
//   };
// };

// /**
//  * Get quest availability status with detailed information
//  */
// export const getQuestAvailabilityStatus = (
//   quest,
//   questSubmissions,
//   questSubmissionCounts,
//   user,
//   completedQuests,
// ) => {
//   const availability = isQuestAvailable(
//     quest,
//     questSubmissions,
//     questSubmissionCounts,
//     user,
//     completedQuests,
//   );

//   // Additional status information
//   const status = {
//     ...availability,
//     hasCompletedBefore: questSubmissions.some(
//       (sub) => sub.review_status === "approved",
//     ),
//     lastSubmissionDate: questSubmissions.reduce(
//       (latest, current) =>
//         !latest ||
//         new Date(current.submitted_at) > new Date(latest.submitted_at)
//           ? current
//           : latest,
//       null,
//     )?.submitted_at,
//     nextAvailableDate: getNextAvailableDate(quest, questSubmissions),
//   };

//   return status;
// };

// /**
//  * Process all quests to get their availability status
//  * questSubmissionsByQuestId: { quest_id: [submissions] }
//  * questSubmissionCounts: { quest_id: approved_count }
//  */
// export const processQuestsAvailability = (
//   quests,
//   questSubmissionsByQuestId,
//   questSubmissionCounts,
//   user,
//   completedQuests,
// ) => {
//   const availableQuests = [];
//   const unavailableQuests = [];
//   const questStatuses = {};

//   quests.forEach((quest) => {
//     const questSubmissions = questSubmissionsByQuestId[quest.quest_id] || [];
//     const status = getQuestAvailabilityStatus(
//       quest,
//       questSubmissions,
//       questSubmissionCounts,
//       user,
//       completedQuests,
//     );

//     questStatuses[quest.quest_id] = status;

//     if (status.available) {
//       availableQuests.push(quest);
//     } else {
//       unavailableQuests.push(quest);
//     }
//   });

//   return {
//     availableQuests,
//     unavailableQuests,
//     questStatuses,
//   };
// };

// Updated quest filtering logic using quest.total_submissions

// /**
//  * Utility functions for time calculations
//  */
// const timeUtils = {
//   // Convert cooldown string to milliseconds
//   getCooldownMs: (cooldown) => {
//     const timeMap = {
//       "1h": 60 * 60 * 1000,
//       "2h": 2 * 60 * 60 * 1000,
//       "6h": 6 * 60 * 60 * 1000,
//       "12h": 12 * 60 * 60 * 1000,
//       daily: 24 * 60 * 60 * 1000,
//       weekly: 7 * 24 * 60 * 60 * 1000,
//       monthly: 30 * 24 * 60 * 60 * 1000,
//     };
//     return timeMap[cooldown] || 0;
//   },

//   // Get the start of the current recurrence period
//   getRecurrencePeriodStart: (recurrence) => {
//     const now = new Date();

//     switch (recurrence) {
//       case "daily":
//         return new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       case "weekly":
//         const dayOfWeek = now.getDay();
//         const diff = now.getDate() - dayOfWeek;
//         return new Date(now.getFullYear(), now.getMonth(), diff);
//       case "monthly":
//         return new Date(now.getFullYear(), now.getMonth(), 1);
//       default:
//         return new Date(0); // Beginning of time for one-time quests
//     }
//   },

//   // Check if a date is within current recurrence period
//   isInCurrentRecurrencePeriod: (submissionDate, recurrence) => {
//     const periodStart = timeUtils.getRecurrencePeriodStart(recurrence);
//     const submissionTime = new Date(submissionDate);
//     return submissionTime >= periodStart;
//   },
// };

// /**
//  * Check if user has completed quest in current recurrence period
//  * Only triggers after quest acceptance (approved status)
//  */
// const hasCompletedInCurrentPeriod = (quest, questSubmissions) => {
//   if (!quest.recurrence) return false;

//   const approvedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "approved",
//   );

//   return approvedSubmissions.some((submission) =>
//     timeUtils.isInCurrentRecurrencePeriod(
//       submission.submitted_at,
//       quest.recurrence,
//     ),
//   );
// };

// /**
//  * Check if user is in cooldown period after a rejection
//  * Only triggers after quest rejection
//  */
// const isInCooldownPeriod = (quest, questSubmissions) => {
//   if (!quest.cooldown) return false;

//   const rejectedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "rejected",
//   );

//   if (rejectedSubmissions.length === 0) return false;

//   // Get the most recent rejected submission
//   const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//     new Date(current.reviewed_at || current.submitted_at) >
//     new Date(latest.reviewed_at || latest.submitted_at)
//       ? current
//       : latest,
//   );

//   const rejectionTime = new Date(
//     latestRejection.reviewed_at || latestRejection.submitted_at,
//   );
//   const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);
//   const cooldownEnd = new Date(rejectionTime.getTime() + cooldownMs);

//   return new Date() < cooldownEnd;
// };

// /**
//  * Check if quest has reached its claim limit
//  * Now uses quest.total_submissions directly from quest data
//  */
// const hasReachedClaimLimit = (quest) => {
//   if (!quest.limit) return false;

//   // Check total_submissions against limit
//   const totalSubmissions = quest.total_submissions || 0;
//   return totalSubmissions >= quest.limit;
// };

// /**
//  * Check if quest is past its due date
//  */
// const isPastDueDate = (quest) => {
//   if (!quest.due_date) return false;
//   return new Date() > new Date(quest.due_date);
// };

// /**
//  * Check if user has pending submission for this quest
//  */
// const hasPendingSubmission = (quest, questSubmissions) => {
//   return questSubmissions.some((sub) =>
//     ["pending", "in_progress"].includes(sub.review_status),
//   );
// };

// /**
//  * Check if user meets quest conditions
//  * Only check quest completion and discord roles (user.role_type)
//  */
// const meetsConditions = (quest, user, completedQuests) => {
//   if (!quest.conditions || quest.conditions.length === 0) return true;

//   return quest.conditions.every((condition) => {
//     switch (condition.type) {
//       case "discord":
//         // Check if user's role_type matches the required discord role
//         return user.role_type === condition.role;

//       case "quest":
//         if (condition.completed) {
//           // User must have completed this quest
//           return completedQuests.includes(condition.questId);
//         } else {
//           // User must NOT have completed this quest
//           return !completedQuests.includes(condition.questId);
//         }

//       default:
//         return true; // Unknown condition types are ignored
//     }
//   });
// };

// /**
//  * Get next available date for quest (cooldown calculation)
//  */
// const getNextAvailableDate = (quest, questSubmissions) => {
//   if (!isInCooldownPeriod(quest, questSubmissions)) return null;

//   const rejectedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "rejected",
//   );

//   if (rejectedSubmissions.length === 0) return null;

//   const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//     new Date(current.reviewed_at || current.submitted_at) >
//     new Date(latest.reviewed_at || latest.submitted_at)
//       ? current
//       : latest,
//   );

//   const rejectionTime = new Date(
//     latestRejection.reviewed_at || latestRejection.submitted_at,
//   );
//   const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);

//   return new Date(rejectionTime.getTime() + cooldownMs);
// };

// /**
//  * Main function to determine if a quest is available for submission
//  * Updated to use quest.total_submissions
//  */
// export const isQuestAvailable = (
//   quest,
//   questSubmissions,
//   user,
//   completedQuests,
// ) => {
//   // Check if quest has reached claim limit
//   if (hasReachedClaimLimit(quest)) {
//     return {
//       available: false,
//       reason: "Quest has reached maximum submissions",
//     };
//   }

//   // Check if past due date
//   if (isPastDueDate(quest)) {
//     return {
//       available: false,
//       reason: "Quest is past due date",
//     };
//   }

//   // Check if user has pending submission
//   if (hasPendingSubmission(quest, questSubmissions)) {
//     return {
//       available: false,
//       reason: "You have a pending submission for this quest",
//     };
//   }

//   // Check if user is in cooldown period
//   if (isInCooldownPeriod(quest, questSubmissions)) {
//     return {
//       available: false,
//       reason: "You are in cooldown period after rejection",
//     };
//   }

//   // Check if user has completed in current recurrence period
//   if (hasCompletedInCurrentPeriod(quest, questSubmissions)) {
//     return {
//       available: false,
//       reason: "Already completed in current period",
//     };
//   }

//   // Check if user meets quest conditions
//   if (!meetsConditions(quest, user, completedQuests)) {
//     return {
//       available: false,
//       reason: "You do not meet the quest requirements",
//     };
//   }

//   return {
//     available: true,
//     reason: "Quest is available for submission",
//   };
// };

// /**
//  * Get quest availability status with detailed information
//  * Updated to include claim limit info using quest.total_submissions
//  */
// export const getQuestAvailabilityStatus = (
//   quest,
//   questSubmissions,
//   user,
//   completedQuests,
// ) => {
//   const availability = isQuestAvailable(
//     quest,
//     questSubmissions,
//     user,
//     completedQuests,
//   );

//   // Additional status information
//   const status = {
//     ...availability,
//     hasCompletedBefore: questSubmissions.some(
//       (sub) => sub.review_status === "approved",
//     ),
//     lastSubmissionDate: questSubmissions.reduce(
//       (latest, current) =>
//         !latest ||
//         new Date(current.submitted_at) > new Date(latest.submitted_at)
//           ? current
//           : latest,
//       null,
//     )?.submitted_at,
//     nextAvailableDate: getNextAvailableDate(quest, questSubmissions),
//     // Claim limit information using quest.total_submissions
//     claimLimit: quest.limit || null,
//     currentClaims: quest.total_submissions || 0,
//     claimsRemaining: quest.limit
//       ? Math.max(0, quest.limit - (quest.total_submissions || 0))
//       : null,
//   };

//   return status;
// };

// /**
//  * Process all quests to get their availability status
//  * Updated to work without separate submission counts
//  */
// export const processQuestsAvailability = (
//   quests,
//   questSubmissionsByQuestId,
//   user,
//   completedQuests,
// ) => {
//   const availableQuests = [];
//   const unavailableQuests = [];
//   const questStatuses = {};

//   quests.forEach((quest) => {
//     const questSubmissions = questSubmissionsByQuestId[quest.quest_id] || [];
//     const status = getQuestAvailabilityStatus(
//       quest,
//       questSubmissions,
//       user,
//       completedQuests,
//     );

//     questStatuses[quest.quest_id] = status;

//     if (status.available) {
//       availableQuests.push(quest);
//     } else {
//       unavailableQuests.push(quest);
//     }
//   });

//   return {
//     availableQuests,
//     unavailableQuests,
//     questStatuses,
//   };
// };

// utils/questFilterUtils.js
// Centralized quest filtering logic

// /**
//  * Utility functions for time calculations
//  */
// const timeUtils = {
//   // Convert cooldown string to milliseconds
//   getCooldownMs: (cooldown) => {
//     const timeMap = {
//       "1h": 60 * 60 * 1000,
//       "2h": 2 * 60 * 60 * 1000,
//       "6h": 6 * 60 * 60 * 1000,
//       "12h": 12 * 60 * 60 * 1000,
//       daily: 24 * 60 * 60 * 1000,
//       weekly: 7 * 24 * 60 * 60 * 1000,
//       monthly: 30 * 24 * 60 * 60 * 1000,
//     };
//     return timeMap[cooldown] || 0;
//   },

//   // Get the start of the current recurrence period
//   getRecurrencePeriodStart: (recurrence) => {
//     const now = new Date();

//     switch (recurrence) {
//       case "daily":
//         return new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       case "weekly":
//         const dayOfWeek = now.getDay();
//         const diff = now.getDate() - dayOfWeek;
//         return new Date(now.getFullYear(), now.getMonth(), diff);
//       case "monthly":
//         return new Date(now.getFullYear(), now.getMonth(), 1);
//       default:
//         return new Date(0); // Beginning of time for one-time quests
//     }
//   },

//   // Check if a date is within current recurrence period
//   isInCurrentRecurrencePeriod: (submissionDate, recurrence) => {
//     const periodStart = timeUtils.getRecurrencePeriodStart(recurrence);
//     const submissionTime = new Date(submissionDate);
//     return submissionTime >= periodStart;
//   },
// };

// /**
//  * Check if user has completed quest in current recurrence period
//  * Only triggers after quest acceptance (approved status)
//  */
// const hasCompletedInCurrentPeriod = (quest, questSubmissions) => {
//   if (!quest.recurrence) return false;

//   const approvedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "approved",
//   );

//   return approvedSubmissions.some((submission) =>
//     timeUtils.isInCurrentRecurrencePeriod(
//       submission.submitted_at,
//       quest.recurrence,
//     ),
//   );
// };

// /**
//  * Check if user is in cooldown period after a rejection
//  * Only triggers after quest rejection
//  */
// const isInCooldownPeriod = (quest, questSubmissions) => {
//   if (!quest.cooldown) return false;

//   const rejectedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "rejected",
//   );

//   if (rejectedSubmissions.length === 0) return false;

//   // Get the most recent rejected submission
//   const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//     new Date(current.reviewed_at || current.submitted_at) >
//     new Date(latest.reviewed_at || latest.submitted_at)
//       ? current
//       : latest,
//   );

//   const rejectionTime = new Date(
//     latestRejection.reviewed_at || latestRejection.submitted_at,
//   );
//   const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);
//   const cooldownEnd = new Date(rejectionTime.getTime() + cooldownMs);

//   return new Date() < cooldownEnd;
// };

// /**
//  * Check if quest has reached its claim limit
//  * Uses quest.total_submissions directly from quest data
//  */
// const hasReachedClaimLimit = (quest) => {
//   if (!quest.limit) return false;

//   // Check total_submissions against limit
//   const totalSubmissions = quest.total_submissions || 0;
//   return totalSubmissions >= quest.limit;
// };

// /**
//  * Check if quest is past its due date
//  */
// const isPastDueDate = (quest) => {
//   if (!quest.due_date) return false;
//   return new Date() > new Date(quest.due_date);
// };

// /**
//  * Check if user has pending submission for this quest
//  */
// const hasPendingSubmission = (quest, questSubmissions) => {
//   return questSubmissions.some((sub) =>
//     ["pending", "in_progress"].includes(sub.review_status),
//   );
// };

// /**
//  * Check if user meets quest conditions
//  * Only check quest completion and discord roles (user.role_type)
//  */
// const meetsConditions = (quest, user, completedQuests) => {
//   if (!quest.conditions || quest.conditions.length === 0) return true;

//   return quest.conditions.every((condition) => {
//     switch (condition.type) {
//       case "discord":
//         // Check if user's role_type matches the required discord role
//         return user.role_type === condition.role;

//       case "quest":
//         if (condition.completed) {
//           // User must have completed this quest
//           return completedQuests.includes(condition.questId);
//         } else {
//           // User must NOT have completed this quest
//           return !completedQuests.includes(condition.questId);
//         }

//       default:
//         return true; // Unknown condition types are ignored
//     }
//   });
// };

// /**
//  * Get next available date for quest (cooldown calculation)
//  */
// const getNextAvailableDate = (quest, questSubmissions) => {
//   if (!isInCooldownPeriod(quest, questSubmissions)) return null;

//   const rejectedSubmissions = questSubmissions.filter(
//     (sub) => sub.review_status === "rejected",
//   );

//   if (rejectedSubmissions.length === 0) return null;

//   const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//     new Date(current.reviewed_at || current.submitted_at) >
//     new Date(latest.reviewed_at || latest.submitted_at)
//       ? current
//       : latest,
//   );

//   const rejectionTime = new Date(
//     latestRejection.reviewed_at || latestRejection.submitted_at,
//   );
//   const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);

//   return new Date(rejectionTime.getTime() + cooldownMs);
// };

// /**
//  * Main function to determine if a quest is available for submission
//  * This is the core function that checks all conditions
//  */
// export const checkQuestAvailability = (
//   quest,
//   questSubmissions,
//   user,
//   completedQuests,
// ) => {
//   console.log(`Checking availability for quest: ${quest.name}`, {
//     questSubmissions,
//     userRole: user.role_type,
//     questConditions: quest.conditions,
//   });

//   // Check if quest has reached claim limit
//   if (hasReachedClaimLimit(quest)) {
//     console.log(
//       `Quest ${quest.name} reached claim limit: ${quest.total_submissions}/${quest.limit}`,
//     );
//     return {
//       available: false,
//       reason: "Quest has reached maximum submissions",
//     };
//   }

//   // Check if past due date
//   if (isPastDueDate(quest)) {
//     console.log(`Quest ${quest.name} is past due date`);
//     return {
//       available: false,
//       reason: "Quest is past due date",
//     };
//   }

//   // Check if user has pending submission
//   if (hasPendingSubmission(quest, questSubmissions)) {
//     console.log(`Quest ${quest.name} has pending submission`);
//     return {
//       available: false,
//       reason: "You have a pending submission for this quest",
//     };
//   }

//   // Check if user is in cooldown period
//   if (isInCooldownPeriod(quest, questSubmissions)) {
//     console.log(`Quest ${quest.name} is in cooldown period`);
//     return {
//       available: false,
//       reason: "You are in cooldown period after rejection",
//     };
//   }

//   // Check if user has completed in current recurrence period OR if it's a one-time quest
//   if (quest.recurrence) {
//     // Quest has recurrence - check if completed in current period
//     if (hasCompletedInCurrentPeriod(quest, questSubmissions)) {
//       console.log(
//         `Quest ${quest.name} already completed in current ${quest.recurrence} period`,
//       );
//       return {
//         available: false,
//         reason: "Already completed in current period",
//       };
//     }
//   } else {
//     // Quest has NO recurrence - it's a one-time quest
//     const hasEverCompleted = questSubmissions.some(
//       (sub) => sub.review_status === "approved",
//     );

//     if (hasEverCompleted) {
//       console.log(
//         `Quest ${quest.name} is a one-time quest and already completed`,
//       );
//       return {
//         available: false,
//         reason: "Quest already completed (one-time only)",
//       };
//     }
//   }

//   // Check if user meets quest conditions
//   if (!meetsConditions(quest, user, completedQuests)) {
//     console.log(`Quest ${quest.name} conditions not met`);
//     return {
//       available: false,
//       reason: "You do not meet the quest requirements",
//     };
//   }

//   console.log(`Quest ${quest.name} is available!`);
//   return {
//     available: true,
//     reason: "Quest is available for submission",
//   };
// };

// /**
//  * Get detailed quest availability status with additional information
//  */
// export const getQuestAvailabilityStatus = (
//   quest,
//   questSubmissions,
//   user,
//   completedQuests,
// ) => {
//   const availability = checkQuestAvailability(
//     quest,
//     questSubmissions,
//     user,
//     completedQuests,
//   );

//   // Additional status information
//   const status = {
//     ...availability,
//     hasCompletedBefore: questSubmissions.some(
//       (sub) => sub.review_status === "approved",
//     ),
//     lastSubmissionDate: questSubmissions.reduce(
//       (latest, current) =>
//         !latest ||
//         new Date(current.submitted_at) > new Date(latest.submitted_at)
//           ? current
//           : latest,
//       null,
//     )?.submitted_at,
//     nextAvailableDate: getNextAvailableDate(quest, questSubmissions),
//     // Claim limit information using quest.total_submissions
//     claimLimit: quest.limit || null,
//     currentClaims: quest.total_submissions || 0,
//     claimsRemaining: quest.limit
//       ? Math.max(0, quest.limit - (quest.total_submissions || 0))
//       : null,
//   };

//   return status;
// };

// /**
//  * Process all quests to get their availability status
//  * Main function to filter and categorize quests
//  */
// export const processQuestsAvailability = (
//   quests,
//   questSubmissionsByQuestId,
//   user,
//   completedQuests,
// ) => {
//   const availableQuests = [];
//   const unavailableQuests = [];
//   const questStatuses = {};

//   quests.forEach((quest) => {
//     const questSubmissions = questSubmissionsByQuestId[quest.quest_id] || [];
//     const status = getQuestAvailabilityStatus(
//       quest,
//       questSubmissions,
//       user,
//       completedQuests,
//     );

//     questStatuses[quest.quest_id] = status;

//     if (status.available) {
//       availableQuests.push(quest);
//     } else {
//       unavailableQuests.push(quest);
//     }
//   });

//   console.log("Quest filtering results:", {
//     available: availableQuests.length,
//     unavailable: unavailableQuests.length,
//     availableQuestNames: availableQuests.map((q) => q.name),
//     unavailableQuestNames: unavailableQuests.map((q) => q.name),
//   });

//   return {
//     availableQuests,
//     unavailableQuests,
//     questStatuses,
//   };
// };

// // Export timeUtils for external use if needed
// export { timeUtils };

// Improved quest timing system with proper timezone handling and next availability calculation

// Improved quest timing system with proper timezone handling and next availability calculation

// /**
//  * Enhanced time utilities with timezone support and better calculations
//  */
// const improvedTimeUtils = {
//   // Convert cooldown string to milliseconds
//   getCooldownMs: (cooldown) => {
//     const timeMap = {
//       "1h": 60 * 60 * 1000,
//       "2h": 2 * 60 * 60 * 1000,
//       "6h": 6 * 60 * 60 * 1000,
//       "12h": 12 * 60 * 60 * 1000,
//       daily: 24 * 60 * 60 * 1000,
//       weekly: 7 * 24 * 60 * 60 * 1000,
//       monthly: 30 * 24 * 60 * 60 * 1000,
//     };
//     return timeMap[cooldown] || 0;
//   },

//   // Get UTC-based recurrence period start (consistent across timezones)
//   getRecurrencePeriodStart: (recurrence, timezone = "UTC") => {
//     const now = new Date();

//     // Convert to UTC to ensure consistency across users
//     const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

//     switch (recurrence) {
//       case "daily":
//         // Reset at midnight UTC (or specified timezone)
//         return new Date(
//           Date.UTC(
//             utcNow.getUTCFullYear(),
//             utcNow.getUTCMonth(),
//             utcNow.getUTCDate(),
//           ),
//         );

//       case "weekly":
//         // Reset every Monday at midnight UTC (ISO week starts Monday)
//         const dayOfWeek = utcNow.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
//         const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days since last Monday
//         const mondayDate = new Date(
//           utcNow.getTime() - daysToMonday * 24 * 60 * 60 * 1000,
//         );
//         return new Date(
//           Date.UTC(
//             mondayDate.getUTCFullYear(),
//             mondayDate.getUTCMonth(),
//             mondayDate.getUTCDate(),
//           ),
//         );

//       case "monthly":
//         // Reset on 1st of month at midnight UTC
//         return new Date(
//           Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), 1),
//         );

//       default:
//         return new Date(0); // Beginning of time for one-time quests
//     }
//   },

//   // Get when the next recurrence period starts
//   getNextRecurrencePeriodStart: (recurrence, timezone = "UTC") => {
//     const currentPeriodStart = improvedTimeUtils.getRecurrencePeriodStart(
//       recurrence,
//       timezone,
//     );

//     switch (recurrence) {
//       case "daily":
//         return new Date(currentPeriodStart.getTime() + 24 * 60 * 60 * 1000);

//       case "weekly":
//         return new Date(currentPeriodStart.getTime() + 7 * 24 * 60 * 60 * 1000);

//       case "monthly":
//         const nextMonth = new Date(currentPeriodStart);
//         nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
//         return nextMonth;

//       default:
//         return null; // One-time quests never reset
//     }
//   },

//   // Check if a date is within current recurrence period
//   isInCurrentRecurrencePeriod: (
//     submissionDate,
//     recurrence,
//     timezone = "UTC",
//   ) => {
//     const periodStart = improvedTimeUtils.getRecurrencePeriodStart(
//       recurrence,
//       timezone,
//     );
//     const submissionTime = new Date(submissionDate);
//     return submissionTime >= periodStart;
//   },

//   // Format time remaining until next availability
//   formatTimeRemaining: (targetDate) => {
//     if (!targetDate) return null;

//     const now = new Date();
//     const diffMs = targetDate.getTime() - now.getTime();

//     if (diffMs <= 0) return "Available now";

//     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(
//       (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
//     );
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

//     if (days > 0) {
//       return `${days}d ${hours}h`;
//     } else if (hours > 0) {
//       return `${hours}h ${minutes}m`;
//     } else {
//       return `${minutes}m`;
//     }
//   },

//   // Check if quest is past due date with grace period
//   isPastDueDate: (quest, gracePeriodMinutes = 5) => {
//     if (!quest.due_date) return false;

//     const dueDate = new Date(quest.due_date);
//     const gracePeriod = gracePeriodMinutes * 60 * 1000;
//     const effectiveDueDate = new Date(dueDate.getTime() + gracePeriod);

//     return new Date() > effectiveDueDate;
//   },

//   // Get the exact time when quest becomes available again
//   getQuestNextAvailability: (quest, questSubmissions) => {
//     const now = new Date();

//     // Check cooldown (highest priority)
//     if (quest.cooldown) {
//       const rejectedSubmissions = questSubmissions.filter(
//         (sub) => sub.review_status === "rejected",
//       );
//       if (rejectedSubmissions.length > 0) {
//         const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//           new Date(current.reviewed_at || current.submitted_at) >
//           new Date(latest.reviewed_at || latest.submitted_at)
//             ? current
//             : latest,
//         );

//         const rejectionTime = new Date(
//           latestRejection.reviewed_at || latestRejection.submitted_at,
//         );
//         const cooldownMs = improvedTimeUtils.getCooldownMs(quest.cooldown);
//         const cooldownEnd = new Date(rejectionTime.getTime() + cooldownMs);

//         if (now < cooldownEnd) {
//           return {
//             type: "cooldown",
//             availableAt: cooldownEnd,
//             reason: `Cooldown ends in ${improvedTimeUtils.formatTimeRemaining(cooldownEnd)}`,
//           };
//         }
//       }
//     }

//     // Check recurrence
//     if (quest.recurrence) {
//       const approvedSubmissions = questSubmissions.filter(
//         (sub) => sub.review_status === "approved",
//       );
//       const completedInCurrentPeriod = approvedSubmissions.some((submission) =>
//         improvedTimeUtils.isInCurrentRecurrencePeriod(
//           submission.submitted_at,
//           quest.recurrence,
//         ),
//       );

//       if (completedInCurrentPeriod) {
//         const nextPeriodStart = improvedTimeUtils.getNextRecurrencePeriodStart(
//           quest.recurrence,
//         );
//         return {
//           type: "recurrence",
//           availableAt: nextPeriodStart,
//           reason: `Next ${quest.recurrence} period starts in ${improvedTimeUtils.formatTimeRemaining(nextPeriodStart)}`,
//         };
//       }
//     }

//     // Check due date
//     if (improvedTimeUtils.isPastDueDate(quest)) {
//       return {
//         type: "expired",
//         availableAt: null,
//         reason: "Quest has expired and will not be available again",
//       };
//     }

//     // Check claim limit
//     if (quest.limit && quest.total_submissions >= quest.limit) {
//       return {
//         type: "full",
//         availableAt: null,
//         reason: "Quest has reached maximum submissions",
//       };
//     }

//     // Quest is available now
//     return {
//       type: "available",
//       availableAt: now,
//       reason: "Available for submission",
//     };
//   },
// };

// /**
//  * Enhanced quest availability checking with detailed timing information
//  */
// export const checkQuestAvailabilityWithTiming = (
//   quest,
//   questSubmissions,
//   user,
//   completedQuests,
// ) => {
//   console.log(`Checking availability for quest: ${quest.name}`);

//   // Get next availability info
//   const availability = improvedTimeUtils.getQuestNextAvailability(
//     quest,
//     questSubmissions,
//   );

//   // Check claim limit
//   if (quest.limit && quest.total_submissions >= quest.limit) {
//     return {
//       available: false,
//       reason: "Quest has reached maximum submissions",
//       nextAvailability: {
//         type: "full",
//         availableAt: null,
//         timeRemaining: null,
//         description: "Quest is permanently full",
//       },
//     };
//   }

//   // Check due date with grace period
//   if (improvedTimeUtils.isPastDueDate(quest)) {
//     return {
//       available: false,
//       reason: "Quest is past due date",
//       nextAvailability: {
//         type: "expired",
//         availableAt: null,
//         timeRemaining: null,
//         description: "Quest has expired",
//       },
//     };
//   }

//   // Check pending submission
//   const hasPending = questSubmissions.some((sub) =>
//     ["pending", "in_progress"].includes(sub.review_status),
//   );
//   if (hasPending) {
//     return {
//       available: false,
//       reason: "You have a pending submission for this quest",
//       nextAvailability: {
//         type: "pending",
//         availableAt: null,
//         timeRemaining: null,
//         description: "Wait for current submission to be reviewed",
//       },
//     };
//   }

//   // Check cooldown
//   if (availability.type === "cooldown") {
//     return {
//       available: false,
//       reason: "You are in cooldown period after rejection",
//       nextAvailability: {
//         type: "cooldown",
//         availableAt: availability.availableAt,
//         timeRemaining: improvedTimeUtils.formatTimeRemaining(
//           availability.availableAt,
//         ),
//         description: availability.reason,
//       },
//     };
//   }

//   // Check recurrence
//   if (availability.type === "recurrence") {
//     return {
//       available: false,
//       reason: "Already completed in current period",
//       nextAvailability: {
//         type: "recurrence",
//         availableAt: availability.availableAt,
//         timeRemaining: improvedTimeUtils.formatTimeRemaining(
//           availability.availableAt,
//         ),
//         description: availability.reason,
//       },
//     };
//   }

//   // Check one-time quest completion
//   if (!quest.recurrence) {
//     const hasEverCompleted = questSubmissions.some(
//       (sub) => sub.review_status === "approved",
//     );
//     if (hasEverCompleted) {
//       return {
//         available: false,
//         reason: "Quest already completed (one-time only)",
//         nextAvailability: {
//           type: "completed",
//           availableAt: null,
//           timeRemaining: null,
//           description: "One-time quest already completed",
//         },
//       };
//     }
//   }

//   // Check conditions
//   if (quest.conditions && quest.conditions.length > 0) {
//     const meetsAllConditions = quest.conditions.every((condition) => {
//       switch (condition.type) {
//         case "discord":
//           return user.role_type === condition.role;
//         case "quest":
//           if (condition.completed) {
//             return completedQuests.includes(condition.questId);
//           } else {
//             return !completedQuests.includes(condition.questId);
//           }
//         default:
//           return true;
//       }
//     });

//     if (!meetsAllConditions) {
//       return {
//         available: false,
//         reason: "You do not meet the quest requirements",
//         nextAvailability: {
//           type: "requirements",
//           availableAt: null,
//           timeRemaining: null,
//           description: "Complete required conditions to unlock",
//         },
//       };
//     }
//   }

//   // Quest is available
//   return {
//     available: true,
//     reason: "Quest is available for submission",
//     nextAvailability: {
//       type: "available",
//       availableAt: new Date(),
//       timeRemaining: "0m",
//       description: "Ready to submit",
//     },
//   };
// };

// /**
//  * Process quest availability for multiple quests
//  * Add this function to your questAvailabilityFilter.js file
//  */
// export const processQuestsAvailability = (
//   quests,
//   questSubmissionsByQuestId,
//   user,
//   completedQuests,
// ) => {
//   const availableQuests = [];
//   const unavailableQuests = [];
//   const questStatuses = {};

//   quests.forEach((quest) => {
//     const questSubmissions = questSubmissionsByQuestId[quest.quest_id] || [];

//     // Use the existing checkQuestAvailabilityWithTiming function
//     const availabilityResult = checkQuestAvailabilityWithTiming(
//       quest,
//       questSubmissions,
//       user,
//       completedQuests,
//     );

//     // Store the status for this quest
//     questStatuses[quest.quest_id] = {
//       available: availabilityResult.available,
//       reason: availabilityResult.reason,
//       hasCompletedBefore: questSubmissions.some(
//         (sub) => sub.review_status === "approved",
//       ),
//       nextAvailableDate: availabilityResult.nextAvailability?.availableAt,
//       lastSubmissionDate:
//         questSubmissions.length > 0
//           ? questSubmissions.reduce((latest, current) =>
//               new Date(current.submitted_at) > new Date(latest.submitted_at)
//                 ? current
//                 : latest,
//             ).submitted_at
//           : null,
//       nextAvailability: availabilityResult.nextAvailability,
//     };

//     // Categorize the quest
//     if (availabilityResult.available) {
//       availableQuests.push(quest);
//     } else {
//       unavailableQuests.push(quest);
//     }
//   });

//   return {
//     availableQuests,
//     unavailableQuests,
//     questStatuses,
//   };
// };

// export { improvedTimeUtils };

// utils/questAvailabilityFilter.js - Fixed UTC calculations and due date checking

/**
 * Fixed time utilities with proper UTC calculations
 */
const improvedTimeUtils = {
  // Convert cooldown string to milliseconds
  getCooldownMs: (cooldown) => {
    const timeMap = {
      "1h": 60 * 60 * 1000,
      "2h": 2 * 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "12h": 12 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };
    return timeMap[cooldown] || 0;
  },

  // Get UTC-based recurrence period start (FIXED)
  getRecurrencePeriodStart: (recurrence) => {
    const now = new Date();

    switch (recurrence?.toLowerCase()) {
      case "daily":
        // Reset at midnight UTC today
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return today;

      case "weekly":
        // Reset every Monday at midnight UTC
        const monday = new Date();
        monday.setUTCHours(0, 0, 0, 0);

        // Get current day of week (0 = Sunday, 1 = Monday, etc.)
        const currentDay = monday.getUTCDay();

        // Calculate days since last Monday
        let daysSinceMonday;
        if (currentDay === 0) {
          // If today is Sunday, Monday was 6 days ago
          daysSinceMonday = 6;
        } else {
          // Otherwise, subtract 1 to get days since Monday
          daysSinceMonday = currentDay - 1;
        }

        // Go back to last Monday
        monday.setUTCDate(monday.getUTCDate() - daysSinceMonday);
        return monday;

      case "monthly":
        // Reset on 1st of current month at midnight UTC
        const firstOfMonth = new Date();
        firstOfMonth.setUTCDate(1);
        firstOfMonth.setUTCHours(0, 0, 0, 0);
        return firstOfMonth;

      default:
        return new Date(0); // Beginning of time for one-time quests
    }
  },

  // Get when the next recurrence period starts (FIXED)
  getNextRecurrencePeriodStart: (recurrence) => {
    const now = new Date();

    switch (recurrence?.toLowerCase()) {
      case "daily":
        // Next day at midnight UTC
        const tomorrow = new Date();
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);
        return tomorrow;

      case "weekly":
        // Next Monday at midnight UTC
        const nextMonday = new Date();
        nextMonday.setUTCHours(0, 0, 0, 0);

        // Get current day of week
        const currentDay = nextMonday.getUTCDay();

        // Calculate days until next Monday
        let daysUntilMonday;
        if (currentDay === 0) {
          // If today is Sunday, Monday is tomorrow
          daysUntilMonday = 1;
        } else {
          // Otherwise, calculate days until next Monday
          daysUntilMonday = 8 - currentDay;
        }

        nextMonday.setUTCDate(nextMonday.getUTCDate() + daysUntilMonday);
        return nextMonday;

      case "monthly":
        // 1st of next month at midnight UTC
        const nextMonth = new Date();
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        nextMonth.setUTCDate(1);
        nextMonth.setUTCHours(0, 0, 0, 0);
        return nextMonth;

      default:
        return null; // One-time quests never reset
    }
  },

  // Check if a date is within current recurrence period
  isInCurrentRecurrencePeriod: (submissionDate, recurrence) => {
    const periodStart = improvedTimeUtils.getRecurrencePeriodStart(recurrence);
    const submissionTime = new Date(submissionDate);
    return submissionTime >= periodStart;
  },

  // Format time remaining until next availability
  formatTimeRemaining: (targetDate) => {
    if (!targetDate) return null;

    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Available now";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  // FIXED: Check if quest is past due date
  isPastDueDate: (quest, gracePeriodMinutes = 5) => {
    if (!quest.due_date) return false;

    const now = new Date();

    // Parse due date - assume it's in format "YYYY-MM-DD"
    let dueDate;
    if (quest.due_date.includes("T")) {
      // If it already has time, use as is
      dueDate = new Date(quest.due_date);
    } else {
      // If it's just a date, set to end of day UTC (23:59:59.999)
      dueDate = new Date(quest.due_date + "T23:59:59.999Z");
    }

    // Add grace period
    const gracePeriod = gracePeriodMinutes * 60 * 1000;
    const effectiveDueDate = new Date(dueDate.getTime() + gracePeriod);

    return now > effectiveDueDate;
  },

  // Get the exact time when quest becomes available again
  getQuestNextAvailability: (quest, questSubmissions) => {
    const now = new Date();

    // PRIORITY 1: Check due date FIRST (most important)
    if (improvedTimeUtils.isPastDueDate(quest)) {
      return {
        type: "expired",
        availableAt: null,
        reason: "Quest expired (past due date)",
      };
    }

    // PRIORITY 2: Check claim limit
    if (quest.limit && quest.total_submissions >= quest.limit) {
      return {
        type: "full",
        availableAt: null,
        reason: "Maximum submissions reached",
      };
    }

    // PRIORITY 3: Check pending submission
    const hasPending = questSubmissions.some((sub) =>
      ["pending", "in_progress"].includes(sub.review_status),
    );
    if (hasPending) {
      return {
        type: "pending",
        availableAt: null,
        reason: "Submission pending review",
      };
    }

    // PRIORITY 4: Check cooldown
    if (quest.cooldown && quest.cooldown !== "None") {
      const rejectedSubmissions = questSubmissions.filter(
        (sub) => sub.review_status === "rejected",
      );
      if (rejectedSubmissions.length > 0) {
        const latestRejection = rejectedSubmissions.reduce((latest, current) =>
          new Date(current.reviewed_at || current.submitted_at) >
          new Date(latest.reviewed_at || latest.submitted_at)
            ? current
            : latest,
        );

        const rejectionTime = new Date(
          latestRejection.reviewed_at || latestRejection.submitted_at,
        );
        const cooldownMs = improvedTimeUtils.getCooldownMs(quest.cooldown);
        const cooldownEnd = new Date(rejectionTime.getTime() + cooldownMs);

        if (now < cooldownEnd) {
          return {
            type: "cooldown",
            availableAt: cooldownEnd,
            reason: "Quest in cooldown period",
          };
        }
      }
    }

    // PRIORITY 5: Check recurrence
    if (quest.recurrence && quest.recurrence.toLowerCase() !== "one-time") {
      const approvedSubmissions = questSubmissions.filter(
        (sub) => sub.review_status === "approved",
      );
      const completedInCurrentPeriod = approvedSubmissions.some((submission) =>
        improvedTimeUtils.isInCurrentRecurrencePeriod(
          submission.submitted_at,
          quest.recurrence,
        ),
      );

      if (completedInCurrentPeriod) {
        const nextPeriodStart = improvedTimeUtils.getNextRecurrencePeriodStart(
          quest.recurrence,
        );
        return {
          type: "recurrence",
          availableAt: nextPeriodStart,
          reason: `Already submitted this ${quest.recurrence.toLowerCase()} period`,
        };
      }
    }

    // PRIORITY 6: Check one-time completion
    if (!quest.recurrence || quest.recurrence.toLowerCase() === "one-time") {
      const hasEverCompleted = questSubmissions.some(
        (sub) => sub.review_status === "approved",
      );
      if (hasEverCompleted) {
        return {
          type: "completed",
          availableAt: null,
          reason: "Quest already completed (one-time)",
        };
      }
    }

    // Quest is available now
    return {
      type: "available",
      availableAt: now,
      reason: "Available for submission",
    };
  },
};

/**
 * Enhanced quest availability checking with fixed logic
 */
export const checkQuestAvailabilityWithTiming = (
  quest,
  questSubmissions,
  user,
  completedQuests,
) => {
  // Get availability info with proper priority order
  const availability = improvedTimeUtils.getQuestNextAvailability(
    quest,
    questSubmissions,
  );

  // Check requirements/conditions
  if (quest.requirements && quest.requirements.length > 0) {
    const meetsAllRequirements = quest.requirements.every((requirement) => {
      switch (requirement.type) {
        case "quest_completion":
          return completedQuests.includes(requirement.quest_id);
        case "role_level":
          return (user.role_level || 0) >= requirement.minimum_level;
        case "pod_membership":
          return user.pod_id === requirement.pod_id;
        case "points_minimum":
          return (user.total_points || 0) >= requirement.minimum_points;
        default:
          return true;
      }
    });

    if (!meetsAllRequirements) {
      return {
        available: false,
        reason: "Requirements not met",
        nextAvailableDate: null,
      };
    }
  }

  // Return the availability result
  return {
    available: availability.type === "available",
    reason: availability.reason,
    nextAvailableDate: availability.availableAt,
  };
};

/**
 * Process quest availability for multiple quests
 */
export const processQuestsAvailability = (
  quests,
  questSubmissionsByQuestId,
  user,
  completedQuests,
) => {
  const availableQuests = [];
  const unavailableQuests = [];
  const questStatuses = {};

  quests.forEach((quest) => {
    const questSubmissions = questSubmissionsByQuestId[quest.quest_id] || [];

    // Use the enhanced availability checking
    const availabilityResult = checkQuestAvailabilityWithTiming(
      quest,
      questSubmissions,
      user,
      completedQuests,
    );

    // Store the status for this quest
    questStatuses[quest.quest_id] = {
      available: availabilityResult.available,
      reason: availabilityResult.reason,
      hasCompletedBefore: questSubmissions.some(
        (sub) => sub.review_status === "approved",
      ),
      nextAvailableDate: availabilityResult.nextAvailableDate,
      lastSubmissionDate:
        questSubmissions.length > 0
          ? questSubmissions.reduce((latest, current) =>
              new Date(current.submitted_at) > new Date(latest.submitted_at)
                ? current
                : latest,
            ).submitted_at
          : null,
    };

    // Categorize the quest
    if (availabilityResult.available) {
      availableQuests.push(quest);
    } else {
      unavailableQuests.push(quest);
    }
  });

  return {
    availableQuests,
    unavailableQuests,
    questStatuses,
  };
};
