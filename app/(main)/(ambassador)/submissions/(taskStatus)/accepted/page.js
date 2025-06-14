import React, { Suspense } from "react";

import AcceptedSubmissionsContainer from "@/components/layout/ambassadors/history/accepted/AcceptedSubmissionsContainer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Accepted Submissions | NEO POD",
  description: "View all your approved and successful submissions.",
};

// Demo data for accepted submissions
const DEMO_ACCEPTED_SUBMISSIONS = [
  {
    submission_id: "sub_003",
    ambassador_id: "amb_789",
    submitted_at: "2025-01-17T14:15:00Z",
    review_status: "approved",
    reviewed_by: "admin_001",
    review_comment:
      "Excellent work! Your tweet generated great engagement and perfectly represents the NEO POD values. The content quality is outstanding and shows deep understanding of our mission.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Share a Tweet on NEO POD Ambassador Program",
  },
  {
    submission_id: "sub_006",
    ambassador_id: "amb_987",
    submitted_at: "2025-01-15T13:45:00Z",
    review_status: "approved",
    reviewed_by: "admin_002",
    review_comment:
      "Fantastic community engagement! Your post sparked meaningful discussions and provided valuable insights to the community. The technical accuracy is impressive.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Host Community Discussion on NEO Features",
  },
  {
    submission_id: "sub_008",
    ambassador_id: "amb_222",
    submitted_at: "2025-01-14T19:30:00Z",
    review_status: "approved",
    reviewed_by: "admin_003",
    review_comment:
      "Perfect execution! The infographic is visually appealing and contains accurate, up-to-date information about NEO's roadmap. Professional quality work.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Design Infographic for NEO Roadmap",
  },
  {
    submission_id: "sub_012",
    ambassador_id: "amb_445",
    submitted_at: "2025-01-13T11:20:00Z",
    review_status: "approved",
    reviewed_by: "admin_001",
    review_comment:
      "Great tutorial! Clear explanations, good examples, and excellent production quality. This will be very helpful for new developers.",
    is_flagged: "false",
    resubmission_count: 1,
    quest_name: "Create Video Tutorial on Smart Contracts",
  },
  {
    submission_id: "sub_015",
    ambassador_id: "amb_556",
    submitted_at: "2025-01-12T16:45:00Z",
    review_status: "approved",
    reviewed_by: "admin_002",
    review_comment:
      "Well-researched article with comprehensive coverage of the topic. Good use of examples and clear writing style.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Write Blog Post about NEO Ecosystem",
  },
];

async function fetchAcceptedSubmissions() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Calculate stats from actual data
  const thisMonth = DEMO_ACCEPTED_SUBMISSIONS.filter((s) => {
    const submittedDate = new Date(s.submitted_at);
    const now = new Date();
    return (
      submittedDate.getMonth() === now.getMonth() &&
      submittedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return {
    submissions: DEMO_ACCEPTED_SUBMISSIONS,
    pagination: {
      hasMore: true,
      lastEvaluatedKey: { submission_id: "sub_015" },
    },
    stats: {
      currentCount: DEMO_ACCEPTED_SUBMISSIONS.length,
      thisMonth: thisMonth,
      hasMore: true,
    },
  };
}

const AcceptedSubmissionsPage = async () => {
  const initialData = await fetchAcceptedSubmissions();

  return (
    <Suspense>
      <AcceptedSubmissionsContainer
        initialStats={initialData.stats}
        initialSubmissions={initialData.submissions}
        initialHasMore={initialData.pagination.hasMore}
        initialLastKey={initialData.pagination.lastEvaluatedKey}
      />
    </Suspense>
  );
};

export default AcceptedSubmissionsPage;
