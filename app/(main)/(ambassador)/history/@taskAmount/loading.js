import React from "react";

import HistoryNumberCard from "@/components/layout/ambassadors/history/HistoryNumberCard";

const TaskAmountLoader = () => {
  return (
    <div className="hidden gap-4 lg:flex">
      <HistoryNumberCard
        count={0}
        isLoading={true}
        color="text-green-500"
        title="Total Approved Task"
        href="/submissions/approved"
      />

      <HistoryNumberCard
        count={0}
        isLoading={true}
        color="text-red-500"
        title="Total Rejected Task"
        href="/submissions/rejected"
      />

      <HistoryNumberCard
        count={0}
        isLoading={true}
        color="text-yellow-500"
        title="Total Highlighted Task"
        href="/submissions/highlighted"
      />
    </div>
  );
};

export default TaskAmountLoader;
