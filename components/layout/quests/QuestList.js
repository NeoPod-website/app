// import React from "react";

// import QuestItem from "./QuestItem";

// const NoQuestsAvailable = () => (
//   <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
//     <div className="space-y-2">
//       <p className="text-xl font-bold text-white">No quests available</p>

//       <p className="text-base text-gray-200">
//         Check back later for new quests in this category
//       </p>
//     </div>
//   </div>
// );

// const QuestList = ({
//   user,
//   categoryId,
//   quests = [],
//   compact = false,
//   scrollable = false,
// }) => {
//   if (!Array.isArray(quests) || quests.length === 0) {
//     return <NoQuestsAvailable />;
//   }

//   return (
//     <ul
//       className={`grid min-w-80 grid-cols-1 gap-8 p-8 ${compact ? "" : "md:grid-cols-2 lg:grid-cols-3"} ${scrollable ? "hide-scroll overflow-auto" : ""}`}
//     >
//       {quests.map((quest) => (
//         <QuestItem
//           title={quest.name}
//           id={quest.quest_id}
//           key={quest.quest_id}
//           categoryId={categoryId}
//           due_date={quest.due_date}
//           tasks={quest.tasks || []}
//           cooldown={quest.cooldown}
//           points={quest.points || 0}
//           recurrence={quest.recurrence}
//           rewards={quest.rewards || "No rewards specified"}
//         />
//       ))}
//     </ul>
//   );
// };

// export default QuestList;

// "use client";

// import React, { useState, useMemo } from "react";

// import QuestItem from "./QuestItem";
// import { processQuestsAvailability } from "./questAvailabilityFilter";

// const NoQuestsAvailable = ({ showAll, onToggleShowAll }) => (
//   <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
//     <div className="space-y-2">
//       <p className="text-xl font-bold text-white">
//         {showAll ? "No quests in this category" : "No available quests"}
//       </p>

//       <p className="text-base text-gray-200">
//         {showAll
//           ? "Check back later for new quests in this category"
//           : "All quests are either completed, in cooldown, or don't meet requirements"}
//       </p>
//     </div>

//     {!showAll && (
//       <button
//         onClick={onToggleShowAll}
//         className="rounded-lg border border-gray-400 bg-gray-800/50 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
//       >
//         Show all quests
//       </button>
//     )}
//   </div>
// );

// const QuestList = ({
//   user,
//   categoryId,
//   quests = [],
//   compact = false,
//   scrollable = false,
//   completedQuests = [],
//   showUnavailable = false,
//   questSubmissionsByQuestId = {},
// }) => {
//   const [showAll, setShowAll] = useState(false);

//   // Process quest availability (simplified - no separate submission counts needed)
//   const { availableQuests, unavailableQuests, questStatuses } = useMemo(() => {
//     if (!Array.isArray(quests) || quests.length === 0) {
//       return { availableQuests: [], unavailableQuests: [], questStatuses: {} };
//     }

//     return processQuestsAvailability(
//       quests,
//       questSubmissionsByQuestId,
//       user,
//       completedQuests,
//     );
//   }, [quests, questSubmissionsByQuestId, user, completedQuests]);

//   // Determine which quests to display
//   const displayQuests = showAll ? quests : availableQuests;

//   // If no quests at all
//   if (!Array.isArray(quests) || quests.length === 0) {
//     return <NoQuestsAvailable showAll={true} />;
//   }

//   // If no available quests but there are quests in the category
//   if (availableQuests.length === 0 && !showAll) {
//     return (
//       <NoQuestsAvailable
//         showAll={false}
//         onToggleShowAll={() => setShowAll(true)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {availableQuests.length > 0 && unavailableQuests.length > 0 && (
//         <div className="flex items-center justify-between px-8 pt-4">
//           <div className="flex items-center gap-4">
//             <p className="text-sm text-gray-300">
//               {availableQuests.length} available, {unavailableQuests.length}{" "}
//               unavailable
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAll(!showAll)}
//             className="rounded-lg border border-gray-400 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
//           >
//             {showAll ? "Show available only" : "Show all quests"}
//           </button>
//         </div>
//       )}

//       <ul
//         className={`grid min-w-80 grid-cols-1 gap-8 p-8 ${
//           compact ? "" : "md:grid-cols-2 lg:grid-cols-3"
//         } ${scrollable ? "hide-scroll overflow-auto" : ""}`}
//       >
//         {displayQuests.map((quest) => {
//           const status = questStatuses[quest.quest_id];

//           return (
//             <QuestItem
//               title={quest.name}
//               id={quest.quest_id}
//               key={quest.quest_id}
//               categoryId={categoryId}
//               claimLimit={quest.limit}
//               due_date={quest.due_date}
//               tasks={quest.tasks || []}
//               cooldown={quest.cooldown}
//               points={quest.points || 0}
//               recurrence={quest.recurrence}
//               isAvailable={status?.available}
//               unavailableReason={status?.reason}
//               currentClaims={quest.total_submissions || 0}
//               nextAvailableDate={status?.nextAvailableDate}
//               hasCompletedBefore={status?.hasCompletedBefore}
//               lastSubmissionDate={status?.lastSubmissionDate}
//               rewards={quest.rewards || "No rewards specified"}
//             />
//           );
//         })}
//       </ul>

//       {showUnavailable && unavailableQuests.length > 0 && (
//         <div className="mx-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
//           <h4 className="mb-2 text-sm font-medium text-yellow-400">
//             Unavailable Quests ({unavailableQuests.length})
//           </h4>

//           <div className="space-y-1">
//             {unavailableQuests.map((quest) => (
//               <div key={quest.quest_id} className="text-xs text-yellow-300">
//                 <span className="font-medium">{quest.name}</span>:{" "}
//                 {questStatuses[quest.quest_id]?.reason}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestList;

// "use client";

// import React, { useState, useMemo } from "react";
// import QuestItem from "./QuestItem";

// // Quest filtering logic directly in the component
// const timeUtils = {
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
//         return new Date(0);
//     }
//   },

//   isInCurrentRecurrencePeriod: (submissionDate, recurrence) => {
//     const periodStart = timeUtils.getRecurrencePeriodStart(recurrence);
//     const submissionTime = new Date(submissionDate);
//     return submissionTime >= periodStart;
//   },
// };

// const checkQuestAvailability = (
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
//   if (quest.limit && quest.total_submissions >= quest.limit) {
//     console.log(
//       `Quest ${quest.name} reached claim limit: ${quest.total_submissions}/${quest.limit}`,
//     );
//     return {
//       available: false,
//       reason: "Quest has reached maximum submissions",
//     };
//   }

//   // Check if past due date
//   if (quest.due_date && new Date() > new Date(quest.due_date)) {
//     console.log(`Quest ${quest.name} is past due date`);
//     return {
//       available: false,
//       reason: "Quest is past due date",
//     };
//   }

//   // Check if user has pending submission
//   const hasPending = questSubmissions.some((sub) =>
//     ["pending", "in_progress"].includes(sub.review_status),
//   );
//   if (hasPending) {
//     console.log(`Quest ${quest.name} has pending submission`);
//     return {
//       available: false,
//       reason: "You have a pending submission for this quest",
//     };
//   }

//   // Check if user is in cooldown period after rejection
//   if (quest.cooldown) {
//     const rejectedSubmissions = questSubmissions.filter(
//       (sub) => sub.review_status === "rejected",
//     );
//     if (rejectedSubmissions.length > 0) {
//       const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//         new Date(current.reviewed_at || current.submitted_at) >
//         new Date(latest.reviewed_at || latest.submitted_at)
//           ? current
//           : latest,
//       );

//       const rejectionTime = new Date(
//         latestRejection.reviewed_at || latestRejection.submitted_at,
//       );
//       const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);
//       const cooldownEnd = new Date(rejectionTime.getTime() + cooldownMs);

//       if (new Date() < cooldownEnd) {
//         console.log(`Quest ${quest.name} is in cooldown period`);
//         return {
//           available: false,
//           reason: "You are in cooldown period after rejection",
//         };
//       }
//     }
//   }

//   // Check if user has completed in current recurrence period
//   if (quest.recurrence) {
//     const approvedSubmissions = questSubmissions.filter(
//       (sub) => sub.review_status === "approved",
//     );
//     const completedInPeriod = approvedSubmissions.some((submission) =>
//       timeUtils.isInCurrentRecurrencePeriod(
//         submission.submitted_at,
//         quest.recurrence,
//       ),
//     );

//     if (completedInPeriod) {
//       console.log(
//         `Quest ${quest.name} already completed in current ${quest.recurrence} period`,
//       );
//       return {
//         available: false,
//         reason: "Already completed in current period",
//       };
//     }
//   }

//   // Check if user meets quest conditions
//   if (quest.conditions && quest.conditions.length > 0) {
//     const meetsAllConditions = quest.conditions.every((condition) => {
//       switch (condition.type) {
//         case "discord":
//           const hasRole = user.role_type === condition.role;
//           console.log(
//             `Discord condition check: user role ${user.role_type} === required ${condition.role} = ${hasRole}`,
//           );
//           return hasRole;

//         case "quest":
//           if (condition.completed) {
//             const hasCompleted = completedQuests.includes(condition.questId);
//             console.log(
//               `Quest completion condition: user completed ${condition.questId} = ${hasCompleted}`,
//             );
//             return hasCompleted;
//           } else {
//             const hasNotCompleted = !completedQuests.includes(
//               condition.questId,
//             );
//             console.log(
//               `Quest non-completion condition: user has NOT completed ${condition.questId} = ${hasNotCompleted}`,
//             );
//             return hasNotCompleted;
//           }

//         default:
//           return true;
//       }
//     });

//     if (!meetsAllConditions) {
//       console.log(`Quest ${quest.name} conditions not met`);
//       return {
//         available: false,
//         reason: "You do not meet the quest requirements",
//       };
//     }
//   }

//   console.log(`Quest ${quest.name} is available!`);
//   return {
//     available: true,
//     reason: "Quest is available for submission",
//   };
// };

// const NoQuestsAvailable = ({ showAll, onToggleShowAll }) => (
//   <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
//     <div className="space-y-2">
//       <p className="text-xl font-bold text-white">
//         {showAll ? "No quests in this category" : "No available quests"}
//       </p>
//       <p className="text-base text-gray-200">
//         {showAll
//           ? "Check back later for new quests in this category"
//           : "All quests are either completed, in cooldown, or don't meet requirements"}
//       </p>
//     </div>

//     {!showAll && (
//       <button
//         onClick={onToggleShowAll}
//         className="rounded-lg border border-gray-400 bg-gray-800/50 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
//       >
//         Show all quests
//       </button>
//     )}
//   </div>
// );

// const QuestList = ({
//   categoryId,
//   quests = [],
//   compact = false,
//   scrollable = false,
//   user,
//   questSubmissionsByQuestId = {},
//   completedQuests = [],
//   showUnavailable = false,
// }) => {
//   const [showAll, setShowAll] = useState(false);

//   console.log("QuestList received data:", {
//     questsCount: quests.length,
//     submissionsCount: Object.keys(questSubmissionsByQuestId).length,
//     completedQuestsCount: completedQuests.length,
//     userRole: user?.role_type,
//   });

//   // Process quest availability
//   const { availableQuests, unavailableQuests, questStatuses } = useMemo(() => {
//     if (!Array.isArray(quests) || quests.length === 0) {
//       return { availableQuests: [], unavailableQuests: [], questStatuses: {} };
//     }

//     const available = [];
//     const unavailable = [];
//     const statuses = {};

//     quests.forEach((quest) => {
//       const questSubmissions = questSubmissionsByQuestId[quest.quest_id] || [];
//       const availability = checkQuestAvailability(
//         quest,
//         questSubmissions,
//         user,
//         completedQuests,
//       );

//       // Additional status info
//       const status = {
//         ...availability,
//         hasCompletedBefore: questSubmissions.some(
//           (sub) => sub.review_status === "approved",
//         ),
//         lastSubmissionDate: questSubmissions.reduce(
//           (latest, current) =>
//             !latest ||
//             new Date(current.submitted_at) > new Date(latest.submitted_at)
//               ? current
//               : latest,
//           null,
//         )?.submitted_at,
//         claimLimit: quest.limit || null,
//         currentClaims: quest.total_submissions || 0,
//       };

//       statuses[quest.quest_id] = status;

//       if (availability.available) {
//         available.push(quest);
//       } else {
//         unavailable.push(quest);
//       }
//     });

//     console.log("Quest filtering results:", {
//       available: available.length,
//       unavailable: unavailable.length,
//       availableQuestNames: available.map((q) => q.name),
//       unavailableQuestNames: unavailable.map((q) => q.name),
//     });

//     return {
//       availableQuests: available,
//       unavailableQuests: unavailable,
//       questStatuses: statuses,
//     };
//   }, [quests, questSubmissionsByQuestId, user, completedQuests]);

//   // Determine which quests to display
//   const displayQuests = showAll ? quests : availableQuests;

//   // If no quests at all
//   if (!Array.isArray(quests) || quests.length === 0) {
//     return <NoQuestsAvailable showAll={true} />;
//   }

//   // If no available quests but there are quests in the category
//   if (availableQuests.length === 0 && !showAll) {
//     return (
//       <NoQuestsAvailable
//         showAll={false}
//         onToggleShowAll={() => setShowAll(true)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Filter Toggle */}
//       {availableQuests.length > 0 && unavailableQuests.length > 0 && (
//         <div className="flex items-center justify-between px-8 pt-4">
//           <div className="flex items-center gap-4">
//             <p className="text-sm text-gray-300">
//               {availableQuests.length} available, {unavailableQuests.length}{" "}
//               unavailable
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAll(!showAll)}
//             className="rounded-lg border border-gray-400 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
//           >
//             {showAll ? "Show available only" : "Show all quests"}
//           </button>
//         </div>
//       )}

//       {/* Quest Grid */}
//       <ul
//         className={`grid min-w-80 grid-cols-1 gap-8 p-8 ${
//           compact ? "" : "md:grid-cols-2 lg:grid-cols-3"
//         } ${scrollable ? "hide-scroll overflow-auto" : ""}`}
//       >
//         {displayQuests.map((quest) => {
//           const status = questStatuses[quest.quest_id];

//           return (
//             <QuestItem
//               key={quest.quest_id}
//               id={quest.quest_id}
//               title={quest.name}
//               categoryId={categoryId}
//               due_date={quest.due_date}
//               tasks={quest.tasks || []}
//               cooldown={quest.cooldown}
//               points={quest.points || 0}
//               recurrence={quest.recurrence}
//               rewards={quest.rewards || "No rewards specified"}
//               // Quest limit information
//               claimLimit={quest.limit}
//               currentClaims={quest.total_submissions || 0}
//               // Pass availability status to QuestItem
//               isAvailable={status?.available}
//               unavailableReason={status?.reason}
//               hasCompletedBefore={status?.hasCompletedBefore}
//               nextAvailableDate={status?.nextAvailableDate}
//               lastSubmissionDate={status?.lastSubmissionDate}
//             />
//           );
//         })}
//       </ul>

//       {/* Debug/Admin Info */}
//       {showUnavailable && unavailableQuests.length > 0 && (
//         <div className="mx-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
//           <h4 className="mb-2 text-sm font-medium text-yellow-400">
//             Unavailable Quests ({unavailableQuests.length})
//           </h4>
//           <div className="space-y-1">
//             {unavailableQuests.map((quest) => (
//               <div key={quest.quest_id} className="text-xs text-yellow-300">
//                 <span className="font-medium">{quest.name}</span>:{" "}
//                 {questStatuses[quest.quest_id]?.reason}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestList;

// "use client";

// import React, { useState, useMemo } from "react";

// import QuestItem from "./QuestItem";

// // Quest filtering logic directly in the component
// const timeUtils = {
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
//         return new Date(0);
//     }
//   },

//   isInCurrentRecurrencePeriod: (submissionDate, recurrence) => {
//     const periodStart = timeUtils.getRecurrencePeriodStart(recurrence);
//     const submissionTime = new Date(submissionDate);
//     return submissionTime >= periodStart;
//   },
// };

// const checkQuestAvailability = (
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
//   if (quest.limit && quest.total_submissions >= quest.limit) {
//     console.log(
//       `Quest ${quest.name} reached claim limit: ${quest.total_submissions}/${quest.limit}`,
//     );
//     return {
//       available: false,
//       reason: "Quest has reached maximum submissions",
//     };
//   }

//   // Check if past due date
//   if (quest.due_date && new Date() > new Date(quest.due_date)) {
//     console.log(`Quest ${quest.name} is past due date`);
//     return {
//       available: false,
//       reason: "Quest is past due date",
//     };
//   }

//   // Check if user has pending submission
//   const hasPending = questSubmissions.some((sub) =>
//     ["pending", "in_progress"].includes(sub.review_status),
//   );
//   if (hasPending) {
//     console.log(`Quest ${quest.name} has pending submission`);
//     return {
//       available: false,
//       reason: "You have a pending submission for this quest",
//     };
//   }

//   // Check if user is in cooldown period after rejection
//   if (quest.cooldown) {
//     const rejectedSubmissions = questSubmissions.filter(
//       (sub) => sub.review_status === "rejected",
//     );
//     if (rejectedSubmissions.length > 0) {
//       const latestRejection = rejectedSubmissions.reduce((latest, current) =>
//         new Date(current.reviewed_at || current.submitted_at) >
//         new Date(latest.reviewed_at || latest.submitted_at)
//           ? current
//           : latest,
//       );

//       const rejectionTime = new Date(
//         latestRejection.reviewed_at || latestRejection.submitted_at,
//       );
//       const cooldownMs = timeUtils.getCooldownMs(quest.cooldown);
//       const cooldownEnd = new Date(rejectionTime.getTime() + cooldownMs);

//       if (new Date() < cooldownEnd) {
//         console.log(`Quest ${quest.name} is in cooldown period`);
//         return {
//           available: false,
//           reason: "You are in cooldown period after rejection",
//         };
//       }
//     }
//   }

//   // Check if user has completed in current recurrence period OR if it's a one-time quest
//   if (quest.recurrence) {
//     // Quest has recurrence - check if completed in current period
//     const approvedSubmissions = questSubmissions.filter(
//       (sub) => sub.review_status === "approved",
//     );
//     const completedInPeriod = approvedSubmissions.some((submission) =>
//       timeUtils.isInCurrentRecurrencePeriod(
//         submission.submitted_at,
//         quest.recurrence,
//       ),
//     );

//     if (completedInPeriod) {
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
//   if (quest.conditions && quest.conditions.length > 0) {
//     const meetsAllConditions = quest.conditions.every((condition) => {
//       switch (condition.type) {
//         case "discord":
//           const hasRole = user.role_type === condition.role;
//           console.log(
//             `Discord condition check: user role ${user.role_type} === required ${condition.role} = ${hasRole}`,
//           );
//           return hasRole;

//         case "quest":
//           if (condition.completed) {
//             const hasCompleted = completedQuests.includes(condition.questId);
//             console.log(
//               `Quest completion condition: user completed ${condition.questId} = ${hasCompleted}`,
//             );
//             return hasCompleted;
//           } else {
//             const hasNotCompleted = !completedQuests.includes(
//               condition.questId,
//             );
//             console.log(
//               `Quest non-completion condition: user has NOT completed ${condition.questId} = ${hasNotCompleted}`,
//             );
//             return hasNotCompleted;
//           }

//         default:
//           return true;
//       }
//     });

//     if (!meetsAllConditions) {
//       console.log(`Quest ${quest.name} conditions not met`);
//       return {
//         available: false,
//         reason: "You do not meet the quest requirements",
//       };
//     }
//   }

//   console.log(`Quest ${quest.name} is available!`);
//   return {
//     available: true,
//     reason: "Quest is available for submission",
//   };
// };

// const NoQuestsAvailable = ({ showAll, onToggleShowAll }) => (
//   <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
//     <div className="space-y-2">
//       <p className="text-xl font-bold text-white">
//         {showAll ? "No quests in this category" : "No available quests"}
//       </p>
//       <p className="text-base text-gray-200">
//         {showAll
//           ? "Check back later for new quests in this category"
//           : "All quests are either completed, in cooldown, or don't meet requirements"}
//       </p>
//     </div>

//     {!showAll && (
//       <button
//         onClick={onToggleShowAll}
//         className="rounded-lg border border-gray-400 bg-gray-800/50 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
//       >
//         Show all quests
//       </button>
//     )}
//   </div>
// );

// const QuestList = ({
//   categoryId,
//   quests = [],
//   compact = false,
//   scrollable = false,
//   user,
//   questSubmissionsByQuestId = {},
//   completedQuests = [],
//   showUnavailable = false,
// }) => {
//   const [showAll, setShowAll] = useState(false);

//   console.log("QuestList received data:", {
//     questsCount: quests.length,
//     submissionsCount: Object.keys(questSubmissionsByQuestId).length,
//     completedQuestsCount: completedQuests.length,
//     userRole: user?.role_type,
//   });

//   // Process quest availability
//   const { availableQuests, unavailableQuests, questStatuses } = useMemo(() => {
//     if (!Array.isArray(quests) || quests.length === 0) {
//       return { availableQuests: [], unavailableQuests: [], questStatuses: {} };
//     }

//     const available = [];
//     const unavailable = [];
//     const statuses = {};

//     quests.forEach((quest) => {
//       const questSubmissions = questSubmissionsByQuestId[quest.quest_id] || [];
//       const availability = checkQuestAvailability(
//         quest,
//         questSubmissions,
//         user,
//         completedQuests,
//       );

//       // Additional status info
//       const status = {
//         ...availability,
//         hasCompletedBefore: questSubmissions.some(
//           (sub) => sub.review_status === "approved",
//         ),
//         lastSubmissionDate: questSubmissions.reduce(
//           (latest, current) =>
//             !latest ||
//             new Date(current.submitted_at) > new Date(latest.submitted_at)
//               ? current
//               : latest,
//           null,
//         )?.submitted_at,
//         claimLimit: quest.limit || null,
//         currentClaims: quest.total_submissions || 0,
//       };

//       statuses[quest.quest_id] = status;

//       if (availability.available) {
//         available.push(quest);
//       } else {
//         unavailable.push(quest);
//       }
//     });

//     console.log("Quest filtering results:", {
//       available: available.length,
//       unavailable: unavailable.length,
//       availableQuestNames: available.map((q) => q.name),
//       unavailableQuestNames: unavailable.map((q) => q.name),
//     });

//     return {
//       availableQuests: available,
//       unavailableQuests: unavailable,
//       questStatuses: statuses,
//     };
//   }, [quests, questSubmissionsByQuestId, user, completedQuests]);

//   // Determine which quests to display
//   const displayQuests = showAll ? quests : availableQuests;

//   // If no quests at all
//   if (!Array.isArray(quests) || quests.length === 0) {
//     return <NoQuestsAvailable showAll={true} />;
//   }

//   // If no available quests but there are quests in the category
//   if (availableQuests.length === 0 && !showAll) {
//     return (
//       <NoQuestsAvailable
//         showAll={false}
//         onToggleShowAll={() => setShowAll(true)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Filter Toggle */}
//       {availableQuests.length > 0 && unavailableQuests.length > 0 && (
//         <div className="flex items-center justify-between px-8 pt-4">
//           <div className="flex items-center gap-4">
//             <p className="text-sm text-gray-300">
//               {availableQuests.length} available, {unavailableQuests.length}{" "}
//               unavailable
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAll(!showAll)}
//             className="rounded-lg border border-gray-400 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
//           >
//             {showAll ? "Show available only" : "Show all quests"}
//           </button>
//         </div>
//       )}

//       {/* Quest Grid */}
//       <ul
//         className={`grid min-w-80 grid-cols-1 gap-8 p-8 ${
//           compact ? "" : "md:grid-cols-2 lg:grid-cols-3"
//         } ${scrollable ? "hide-scroll overflow-auto" : ""}`}
//       >
//         {displayQuests.map((quest) => {
//           const status = questStatuses[quest.quest_id];

//           return (
//             <QuestItem
//               key={quest.quest_id}
//               id={quest.quest_id}
//               title={quest.name}
//               categoryId={categoryId}
//               due_date={quest.due_date}
//               tasks={quest.tasks || []}
//               cooldown={quest.cooldown}
//               points={quest.points || 0}
//               recurrence={quest.recurrence}
//               rewards={quest.rewards || "No rewards specified"}
//               // Quest limit information
//               claimLimit={quest.limit}
//               currentClaims={quest.total_submissions || 0}
//               // Pass availability status to QuestItem
//               isAvailable={status?.available}
//               unavailableReason={status?.reason}
//               hasCompletedBefore={status?.hasCompletedBefore}
//               nextAvailableDate={status?.nextAvailableDate}
//               lastSubmissionDate={status?.lastSubmissionDate}
//             />
//           );
//         })}
//       </ul>

//       {/* Debug/Admin Info */}
//       {showUnavailable && unavailableQuests.length > 0 && (
//         <div className="mx-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
//           <h4 className="mb-2 text-sm font-medium text-yellow-400">
//             Unavailable Quests ({unavailableQuests.length})
//           </h4>
//           <div className="space-y-1">
//             {unavailableQuests.map((quest) => (
//               <div key={quest.quest_id} className="text-xs text-yellow-300">
//                 <span className="font-medium">{quest.name}</span>:{" "}
//                 {questStatuses[quest.quest_id]?.reason}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestList;

"use client";

import React, { useState, useMemo } from "react";

import QuestItem from "./QuestItem";
import { processQuestsAvailability } from "@/utils/questAvailabilityFilter";

const NoQuestsAvailable = ({ showAll, onToggleShowAll }) => (
  <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
    <div className="space-y-2">
      <p className="text-xl font-bold text-white">
        {showAll ? "No quests in this category" : "No available quests"}
      </p>

      <p className="text-base text-gray-200">
        {showAll
          ? "Check back later for new quests in this category"
          : "All quests are either completed, in cooldown, or don't meet requirements"}
      </p>
    </div>

    {!showAll && (
      <button
        type="button"
        onClick={onToggleShowAll}
        className="rounded-lg border border-gray-400 bg-gray-800/50 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
      >
        Show all quests
      </button>
    )}
  </div>
);

const QuestList = ({
  user,
  categoryId,
  quests = [],
  compact = false,
  scrollable = false,
  completedQuests = [],
  showUnavailable = false,
  questSubmissionsByQuestId = {},
}) => {
  const [showAll, setShowAll] = useState(false);

  // Process quest availability using utility function
  const { availableQuests, unavailableQuests, questStatuses } = useMemo(() => {
    if (!Array.isArray(quests) || quests.length === 0) {
      return { availableQuests: [], unavailableQuests: [], questStatuses: {} };
    }

    return processQuestsAvailability(
      quests,
      questSubmissionsByQuestId,
      user,
      completedQuests,
    );
  }, [quests, questSubmissionsByQuestId, user, completedQuests]);

  // Determine which quests to display
  const displayQuests = showAll ? quests : availableQuests;

  // If no quests at all
  if (!Array.isArray(quests) || quests.length === 0) {
    return <NoQuestsAvailable showAll={true} />;
  }

  // If no available quests but there are quests in the category
  if (availableQuests.length === 0 && !showAll) {
    return (
      <NoQuestsAvailable
        showAll={false}
        onToggleShowAll={() => {
          setShowAll(true);
        }}
      />
    );
  }

  return (
    <>
      {availableQuests.length > 0 && unavailableQuests.length > 0 && (
        <div className="flex items-center justify-between px-8 pt-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-300">
              {availableQuests.length} available, {unavailableQuests.length}{" "}
              unavailable
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="rounded-lg border border-gray-400 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-700/50"
          >
            {showAll ? "Show available only" : "Show all quests"}
          </button>
        </div>
      )}

      <ul
        className={`grid min-w-80 grid-cols-1 gap-8 p-8 ${
          compact ? "" : "md:grid-cols-2 lg:grid-cols-3"
        } ${scrollable ? "hide-scroll overflow-auto" : ""}`}
      >
        {displayQuests.map((quest) => {
          const status = questStatuses[quest.quest_id];

          return (
            <QuestItem
              key={quest.quest_id}
              id={quest.quest_id}
              title={quest.name}
              categoryId={categoryId}
              due_date={quest.due_date}
              tasks={quest.tasks || []}
              cooldown={quest.cooldown}
              points={quest.points || 0}
              recurrence={quest.recurrence}
              rewards={quest.rewards || "No rewards specified"}
              // Quest limit information
              claimLimit={quest.limit}
              currentClaims={quest.total_submissions || 0}
              // Pass availability status to QuestItem
              isAvailable={status?.available}
              unavailableReason={status?.reason}
              hasCompletedBefore={status?.hasCompletedBefore}
              nextAvailableDate={status?.nextAvailableDate}
              lastSubmissionDate={status?.lastSubmissionDate}
            />
          );
        })}
      </ul>

      {showUnavailable && unavailableQuests.length > 0 && (
        <div className="mx-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <h4 className="mb-2 text-sm font-medium text-yellow-400">
            Unavailable Quests ({unavailableQuests.length})
          </h4>

          <div className="space-y-1">
            {unavailableQuests.map((quest) => (
              <div key={quest.quest_id} className="text-xs text-yellow-300">
                <span className="font-medium">{quest.name}</span>:{" "}
                {questStatuses[quest.quest_id]?.reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestList;
