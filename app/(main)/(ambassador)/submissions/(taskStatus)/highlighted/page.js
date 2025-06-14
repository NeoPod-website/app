import HighlightedSubmissionsContainer from "@/components/layout/ambassadors/history/highlighted/HighlightedSubmissionsContainer";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Highlighted Submissions | NEO POD",
  description:
    "Your outstanding work that has been recognized for exceptional quality.",
};

// Demo data for highlighted submissions
const DEMO_HIGHLIGHTED_SUBMISSIONS = [
  {
    submission_id: "sub_009",
    ambassador_id: "amb_789",
    submitted_at: "2025-01-18T16:20:00Z",
    review_status: "highlighted",
    reviewed_by: "admin_001",
    review_comment:
      "Outstanding work! This submission goes above and beyond expectations. The creativity, technical accuracy, and presentation quality are exceptional. This will be featured in our community showcase as an example of excellence.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Create Interactive NEO Blockchain Demo",
  },
  {
    submission_id: "sub_013",
    ambassador_id: "amb_445",
    submitted_at: "2025-01-17T09:15:00Z",
    review_status: "highlighted",
    reviewed_by: "admin_002",
    review_comment:
      "Incredible content! This video tutorial is comprehensive, well-structured, and professionally produced. The explanations are clear and the examples are perfect. This will definitely help many developers in our community.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Advanced Smart Contract Tutorial Series",
  },
  {
    submission_id: "sub_016",
    ambassador_id: "amb_667",
    submitted_at: "2025-01-16T14:30:00Z",
    review_status: "highlighted",
    reviewed_by: "admin_003",
    review_comment:
      "Phenomenal research and analysis! The depth of insight and the quality of data presentation is remarkable. This research paper will be valuable for the entire NEO ecosystem. Truly exceptional work!",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "NEO Ecosystem Market Analysis Report",
  },
  {
    submission_id: "sub_019",
    ambassador_id: "amb_889",
    submitted_at: "2025-01-15T11:45:00Z",
    review_status: "highlighted",
    reviewed_by: "admin_001",
    review_comment:
      "Amazing community engagement! Your discussion post generated over 200 meaningful comments and helped several developers solve complex problems. The way you facilitated the conversation was masterful.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Lead Technical Discussion on Gas Optimization",
  },
];

async function fetchHighlightedSubmissions() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Calculate stats from actual data
  const thisMonth = DEMO_HIGHLIGHTED_SUBMISSIONS.filter((s) => {
    const submittedDate = new Date(s.submitted_at);
    const now = new Date();
    return (
      submittedDate.getMonth() === now.getMonth() &&
      submittedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return {
    submissions: DEMO_HIGHLIGHTED_SUBMISSIONS,
    pagination: {
      hasMore: true,
      lastEvaluatedKey: { submission_id: "sub_019" },
    },
    stats: {
      currentCount: DEMO_HIGHLIGHTED_SUBMISSIONS.length,
      thisMonth: thisMonth,
      hasMore: true,
    },
  };
}

const HighlightedSubmissionsPage = async () => {
  const initialData = await fetchHighlightedSubmissions();

  return (
    <Suspense>
      <HighlightedSubmissionsContainer
        initialStats={initialData.stats}
        initialSubmissions={initialData.submissions}
        initialHasMore={initialData.pagination.hasMore}
        initialLastKey={initialData.pagination.lastEvaluatedKey}
      />
    </Suspense>
  );
};

export default HighlightedSubmissionsPage;
