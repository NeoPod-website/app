import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";

const highlightedSubmissionsData = [
  {
    submission_id: "sub_001",
    ambassador_id: "amb_123",
    submitted_at: "2025-06-11T10:10:00Z",
    review_status: "highlighted",
    reviewed_by: "admin_001",
    review_comment:
      "Excellent work! Your tweet generated great engagement and perfectly represents the NEO POD values. Keep up the outstanding work.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Share a Tweet on NEO POD Ambassador Program",
  },
];

const page = () => {
  return (
    <WrapperContainer scrollable className="max-w-md flex-1 space-y-6 p-10">
      <h2 className="font-work-sans text-4xl font-bold">Highlighted</h2>

      <div className="space-y-4">
        {highlightedSubmissionsData.map((submission) => (
          <HistoryItemCard
            key={submission.submission_id}
            submission={submission}
            maxCommentLength={100}
          />
        ))}
      </div>
    </WrapperContainer>
  );
};

export default page;
