import React from "react";

import HistoryNumberCard from "@/components/layout/ambassadors/history/HistoryNumberCard";

const page = () => {
  return (
    <div className="flex gap-4">
      <HistoryNumberCard
        title="Total Accepted Task"
        count={24}
        href="/submissions/accepted"
        color="text-green-500"
      />

      <HistoryNumberCard
        title="Total Rejected Task"
        count={24}
        href="/submissions/rejected"
        color="text-red-500"
      />

      <HistoryNumberCard
        title="Total Highlighted Task"
        count={24}
        href="/submissions/highlighted"
        color="text-yellow-500"
      />
    </div>
  );
};

export default page;
