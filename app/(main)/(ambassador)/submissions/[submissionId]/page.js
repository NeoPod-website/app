import React from "react";
import { notFound } from "next/navigation";

import SubmissionDetailMain from "@/components/layout/ambassadors/submissions/details/SubmissionDetailMain";
import SubmissionDetailSidebar from "@/components/layout/ambassadors/submissions/details/SubmissionDetailSidebar";

export const dynamic = "force-dynamic";

// Demo data for testing - replace with actual API call
const DEMO_SUBMISSION = {
  submission_id: "sub_1",
  pod_id: "pod_123",
  quest_id: "quest_123",
  category_id: "cat_123",
  quest_name: "Complete Twitter Engagement Challenge",
  pod_name: "Content Creators",
  category_name: "Social Media",
  submitted_at: "2025-01-19T10:30:00Z",
  review_status: "pending",
  submission_data: {
    task_1:
      "Check out this amazing NEO ecosystem! The future of blockchain is here 🚀 #NEO #Blockchain #Web3",
    task_2: "https://twitter.com/user/status/123456789",
    task_3: true,
    task_4: {
      fileName: "screenshot.png",
      fileSize: 1024000,
      fileType: "image/png",
      fileUrl: "https://example.com/files/screenshot.png",
      uploaded: true,
      category: "Image",
    },
  },
  quest_tasks: [
    {
      id: "task_1",
      name: "text",
      instruction: "Write a tweet about NEO ecosystem",
      description:
        "Create an engaging tweet that showcases the benefits of NEO blockchain technology",
    },
    {
      id: "task_2",
      name: "url",
      instruction: "Share your tweet URL",
      description: "Provide the direct link to your published tweet",
    },
    {
      id: "task_3",
      name: "x",
      instruction: "Follow @NEO_Blockchain",
      description: "Follow the official NEO account on X (Twitter)",
    },
    {
      id: "task_4",
      name: "file-upload",
      instruction: "Upload screenshot",
      description: "Take a screenshot showing you completed the follow action",
    },
  ],
};

async function fetchSubmission(submissionId) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For demo, return demo data if ID matches
  if (submissionId === "sub_1") {
    return DEMO_SUBMISSION;
  }

  // Return null for not found
  return null;
}

const SubmissionViewPage = async ({ params }) => {
  const { submissionId } = await params;

  const submission = await fetchSubmission(submissionId);

  if (!submission) {
    notFound();
  }

  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <SubmissionDetailMain submission={submission} />
      <SubmissionDetailSidebar submission={submission} />
    </div>
  );
};

export default SubmissionViewPage;
