import React from "react";

import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";

const submissionsData = [
  {
    submission_id: "sub_001",
    ambassador_id: "amb_123",
    submitted_at: "2025-06-11T23:30:00Z",
    review_status: "rejected",
    reviewed_by: "admin_001",
    review_comment:
      "Content does not meet quality standards. Please ensure your tweet includes proper hashtags and mentions the NeoPod program clearly. Content does not meet quality standards. Please ensure your tweet includes proper hashtags and mentions the NeoPod program clearly. Content does not meet quality standards. Please ensure your tweet includes proper hashtags and mentions the NeoPod program clearly.",
    is_flagged: "false",
    resubmission_count: 1,
    quest_name: "Share a Tweet on NeoPod Ambassador Program",
  },
  {
    submission_id: "sub_002",
    ambassador_id: "amb_456",
    submitted_at: "2025-06-11T11:45:00Z",
    review_status: "rejected",
    reviewed_by: "admin_002",
    review_comment:
      "Missing required hashtags and the engagement metrics are below the minimum threshold. Please resubmit with proper formatting.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Create Instagram Story for NEO Community",
  },
  {
    submission_id: "sub_003",
    ambassador_id: "amb_789",
    submitted_at: "2025-06-11T14:15:00Z",
    review_status: "approved",
    reviewed_by: "admin_001",
    review_comment:
      "Excellent work! Your tweet generated great engagement and perfectly represents the NeoPod values. Keep up the outstanding work.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Share a Tweet on NeoPod Ambassador Program",
  },
  {
    submission_id: "sub_004",
    ambassador_id: "amb_321",
    submitted_at: "2025-06-10T09:20:00Z",
    review_status: "approved",
    reviewed_by: "admin_003",
    review_comment:
      "Great content with impressive engagement metrics. The video quality is excellent and the message is clear and compelling.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Create Educational Video about NEO Blockchain",
  },
  {
    submission_id: "sub_005",
    ambassador_id: "amb_654",
    submitted_at: "2025-06-09T16:30:00Z",
    review_status: "pending",
    reviewed_by: null,
    review_comment: null,
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Write Blog Post about NEO Ecosystem",
  },
  {
    submission_id: "sub_006",
    ambassador_id: "amb_987",
    submitted_at: "2025-06-08T13:45:00Z",
    review_status: "approved",
    reviewed_by: "admin_002",
    review_comment:
      "Fantastic community engagement! Your post sparked meaningful discussions and provided valuable insights to the community.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Host Community Discussion on NEO Features",
  },
  {
    submission_id: "sub_007",
    ambassador_id: "amb_111",
    submitted_at: "2025-06-07T08:00:00Z",
    review_status: "rejected",
    reviewed_by: "admin_001",
    review_comment:
      "The content lacks depth and doesn't adequately explain the technical concepts. Please provide more detailed explanations and examples.",
    is_flagged: "false",
    resubmission_count: 2,
    quest_name: "Create Tutorial on NEO Smart Contracts",
  },
  {
    submission_id: "sub_008",
    ambassador_id: "amb_222",
    submitted_at: "2025-06-06T19:30:00Z",
    review_status: "approved",
    reviewed_by: "admin_003",
    review_comment:
      "Perfect execution! The infographic is visually appealing and contains accurate, up-to-date information about NEO's roadmap.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Design Infographic for NEO Roadmap",
  },
];

const page = () => {
  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto scrollbar-hide">
      {submissionsData.map((submission) => (
        <HistoryItemCard
          key={submission.submission_id}
          submission={submission}
        />
      ))}
    </div>
  );
};

export default page;
