"use client";

import React from "react";
import { useSelector } from "react-redux";
import HistoryNumberCard from "@/components/layout/ambassadors/history/HistoryNumberCard";

const TaskAmount = () => {
  const { history, highlighted } = useSelector((state) => state.history);

  // Count by status from Redux state
  const approvedCount = history.filter(
    (item) => item.review_status === "approved",
  ).length;
  const rejectedCount = history.filter(
    (item) => item.review_status === "rejected",
  ).length;
  const highlightedCount = highlighted.length;

  return (
    <div className="hidden gap-4 lg:flex">
      <HistoryNumberCard
        count={approvedCount}
        color="text-green-500"
        title="Approved Task"
        href="/submissions/approved"
      />

      <HistoryNumberCard
        color="text-red-500"
        count={rejectedCount}
        title="Rejected Task"
        href="/submissions/rejected"
      />

      <HistoryNumberCard
        color="text-yellow-500"
        count={highlightedCount}
        title="Highlighted Task"
        href="/submissions/highlighted"
      />
    </div>
  );
};

export default TaskAmount;
