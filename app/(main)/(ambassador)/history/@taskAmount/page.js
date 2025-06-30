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
    <div className="flex gap-4">
      <HistoryNumberCard
        title="Total Approved Task"
        count={approvedCount}
        href="/submissions/approved"
        color="text-green-500"
      />

      <HistoryNumberCard
        title="Total Rejected Task"
        count={rejectedCount}
        href="/submissions/rejected"
        color="text-red-500"
      />

      <HistoryNumberCard
        title="Total Highlighted Task"
        count={highlightedCount}
        href="/submissions/highlighted"
        color="text-yellow-500"
      />
    </div>
  );
};

export default TaskAmount;
