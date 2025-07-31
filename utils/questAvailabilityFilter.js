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
// export const checkQuestAvailabilityWithTiming = (
//   quest,
//   questSubmissions,
//   user,
//   completedQuests,
// ) => {
//   // Get availability info with proper priority order
//   const availability = improvedTimeUtils.getQuestNextAvailability(
//     quest,
//     questSubmissions,
//   );

//   // Check requirements/conditions
//   if (quest.conditions && quest.conditions.length > 0) {
//     const meetsAllRequirements = quest.conditions.every((requirement) => {
//       switch (requirement.type) {
//         case "ambassador":
//           return user.role_type === requirement.role;
//         case "quest_completion":
//           return completedQuests.includes(requirement.quest_id);
//         case "pod_membership":
//           return user.pod_id === requirement.pod_id;
//         case "points_minimum":
//           return (user.total_points || 0) >= requirement.minimum_points;
//         default:
//           return true;
//       }
//     });

//     if (!meetsAllRequirements) {
//       return {
//         available: false,
//         reason: "Requirements not met",
//         nextAvailableDate: null,
//       };
//     }
//   }

//   // Return the availability result
//   return {
//     available: availability.type === "available",
//     reason: availability.reason,
//     nextAvailableDate: availability.availableAt,
//   };
// };

export const checkQuestAvailabilityWithTiming = (
  quest,
  questSubmissions,
  user,
  completedQuests,
) => {
  // STEP 1: Check requirements FIRST (before any timing checks)
  if (quest.conditions && quest.conditions.length > 0) {
    for (const requirement of quest.conditions) {
      switch (requirement.type) {
        case "ambassador":
          const roleHierarchy = {
            initiate: 1,
            operator: 2,
            sentinel: 3,
            architect: 4,
          };

          const userRoleLevel =
            roleHierarchy[user.role_type?.toLowerCase()] || 0;
          const requiredRoleLevel =
            roleHierarchy[requirement.role?.toLowerCase()] || 0;

          if (userRoleLevel < requiredRoleLevel) {
            return {
              available: false,
              reason: `Requires ${requirement.role} ambassador role or higher`,
              nextAvailableDate: null,
            };
          }
          break;

        case "quest":
          if (!completedQuests.includes(requirement.questId)) {
            return {
              available: false,
              reason: `Must complete quest: ${requirement.questId}`,
              nextAvailableDate: null,
            };
          }
          break;

        // Add other requirement types with specific messages
        default:
          break;
      }
    }
  }

  // STEP 2: Only check timing availability if requirements are met
  const availability = improvedTimeUtils.getQuestNextAvailability(
    quest,
    questSubmissions,
  );

  // Return the timing-based result
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
