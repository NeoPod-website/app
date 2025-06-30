// utils/timeUtils.js - Simple UTC-based timing

export const getNextResetTime = (recurrence) => {
  const now = new Date();

  switch (recurrence?.toLowerCase()) {
    case "daily":
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      return tomorrow;

    case "weekly":
      const nextMonday = new Date(now);
      nextMonday.setUTCHours(0, 0, 0, 0);
      const daysUntilMonday = (8 - nextMonday.getUTCDay()) % 7 || 7;
      nextMonday.setUTCDate(nextMonday.getUTCDate() + daysUntilMonday);
      return nextMonday;

    case "monthly":
      return new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);

    default:
      return null;
  }
};

export const getLastResetTime = (recurrence) => {
  const now = new Date();

  switch (recurrence?.toLowerCase()) {
    case "daily":
      const today = new Date(now);
      today.setUTCHours(0, 0, 0, 0);
      return today;

    case "weekly":
      const monday = new Date(now);
      monday.setUTCHours(0, 0, 0, 0);
      const daysSinceMonday = (monday.getUTCDay() + 6) % 7;
      monday.setUTCDate(monday.getUTCDate() - daysSinceMonday);
      return monday;

    case "monthly":
      return new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);

    default:
      return null;
  }
};

export const hasSubmittedSinceReset = (submissions, recurrence) => {
  if (!submissions || submissions.length === 0) return false;
  if (recurrence?.toLowerCase() === "one-time") {
    return submissions.some((sub) => sub.review_status === "approved");
  }

  const lastReset = getLastResetTime(recurrence);
  if (!lastReset) return false;

  return submissions.some((sub) => new Date(sub.submitted_at) >= lastReset);
};

export const isQuestExpired = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate + "T23:59:59.999Z");
  return now > due;
};

export const formatTimeRemaining = (futureDate) => {
  if (!futureDate) return null;
  const now = new Date();
  const diff = futureDate.getTime() - now.getTime();
  if (diff <= 0) return "Available now";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
