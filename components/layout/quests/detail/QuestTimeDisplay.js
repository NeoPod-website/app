"use client";

import React, { useEffect, useState } from "react";

// UTC-based recurrence countdown (matches our availability logic)
const calculateRecurrenceCountdown = (recurrence) => {
  const now = new Date();

  switch (recurrence?.toLowerCase()) {
    case "daily": {
      // Next reset is tomorrow at 00:00 UTC
      const nextReset = new Date();
      nextReset.setUTCDate(nextReset.getUTCDate() + 1);
      nextReset.setUTCHours(0, 0, 0, 0);

      const timeDiff = nextReset.getTime() - now.getTime();
      const hours = Math.ceil(timeDiff / (1000 * 60 * 60));

      if (hours <= 1) return "1 hour left";
      return `${hours} hours left`;
    }

    case "weekly": {
      // Next reset is next Monday at 00:00 UTC
      const nextMonday = new Date();
      nextMonday.setUTCHours(0, 0, 0, 0);

      const currentDay = nextMonday.getUTCDay();
      let daysUntilMonday;

      if (currentDay === 0) {
        // Today is Sunday, Monday is tomorrow
        daysUntilMonday = 1;
      } else {
        // Calculate days until next Monday
        daysUntilMonday = 8 - currentDay;
      }

      nextMonday.setUTCDate(nextMonday.getUTCDate() + daysUntilMonday);

      const timeDiff = nextMonday.getTime() - now.getTime();
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.ceil(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      if (days <= 1) {
        if (hours <= 1) return "1 hour left";
        return `${hours} hours left`;
      }
      if (days === 1) return "1 day left";
      return `${days} days left`;
    }

    case "monthly": {
      // Next reset is 1st of next month at 00:00 UTC
      const nextMonth = new Date();
      nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
      nextMonth.setUTCDate(1);
      nextMonth.setUTCHours(0, 0, 0, 0);

      const timeDiff = nextMonth.getTime() - now.getTime();
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.ceil(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      if (days <= 1) {
        if (hours <= 1) return "1 hour left";
        return `${hours} hours left`;
      }
      if (days === 1) return "1 day left";
      return `${days} days left`;
    }

    default:
      return "No reset scheduled";
  }
};

// UTC-based due date countdown
const calculateDueDateCountdown = (due_date) => {
  const now = new Date();

  // Parse due date properly
  let dueDate;
  if (due_date.includes("T")) {
    dueDate = new Date(due_date);
  } else {
    // Set to end of day UTC (23:59:59.999)
    dueDate = new Date(due_date + "T23:59:59.999Z");
  }

  // Add 5-minute grace period (same as our availability logic)
  const gracePeriod = 5 * 60 * 1000;
  const effectiveDueDate = new Date(dueDate.getTime() + gracePeriod);

  // Calculate the difference in milliseconds
  const timeDiff = effectiveDueDate.getTime() - now.getTime();

  // If the due date has passed
  if (timeDiff <= 0) {
    return "Expired";
  }

  // Calculate time units
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  // Return appropriate format based on time remaining
  if (days > 0) {
    if (days === 1) {
      return hours > 0 ? `1 day ${hours}h left` : "1 day left";
    }
    return `${days} days left`;
  } else if (hours > 0) {
    if (hours === 1) {
      return minutes > 0 ? `1 hour ${minutes}m left` : "1 hour left";
    }
    return `${hours} hours left`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute left" : `${minutes} minutes left`;
  } else {
    return "Less than 1 minute left";
  }
};

const ClientTimeDisplay = ({ due_date, recurrence }) => {
  const [timeDisplay, setTimeDisplay] = useState("");

  useEffect(() => {
    const updateTimeDisplay = () => {
      if (due_date) {
        const countdown = calculateDueDateCountdown(due_date);
        setTimeDisplay(`Ends in: ${countdown}`);
      } else {
        const countdown = calculateRecurrenceCountdown(recurrence || "monthly");
        setTimeDisplay(`Resets in: ${countdown}`);
      }
    };

    // Update immediately
    updateTimeDisplay();

    // Set up interval to update every minute
    const interval = setInterval(updateTimeDisplay, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [due_date, recurrence]);

  if (!timeDisplay) {
    return <div className="h-4 w-28 animate-pulse rounded bg-gray-500/50" />;
  }

  const isExpired = timeDisplay.includes("Expired");

  return (
    <p className="text-xs text-white">
      <span
        className={`font-medium ${isExpired ? "text-red-400" : "text-yellow-200"}`}
      >
        {timeDisplay}
      </span>
    </p>
  );
};

const QuestTimeDisplay = ({ due_date, recurrence }) => {
  return (
    <div className="min-h-[16px]">
      <ClientTimeDisplay due_date={due_date} recurrence={recurrence} />
    </div>
  );
};

export default QuestTimeDisplay;
