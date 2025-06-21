import React from "react";
import { notFound } from "next/navigation";

import SubmissionEditMain from "@/components/layout/ambassadors/submissions/details/edit/SubmissionEditMain";
import SubmissionEditSidebar from "@/components/layout/ambassadors/submissions/details/edit/SubmissionEditSidebar";

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
  quest: {
    quest_id: "quest_123",
    name: "Complete Twitter Engagement Challenge",
    description: "Engage with NEO community on Twitter",
    tasks: [
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
        twitterTaskType: "follow",
        username: "NEO_Blockchain",
      },
      {
        id: "task_4",
        name: "file-upload",
        instruction: "Upload screenshot",
        description:
          "Take a screenshot showing you completed the follow action",
        acceptedCategories: ["image"],
      },
    ],
  },
};

const DEMO_USER = {
  twitter: {
    username: "demo_user",
    connected: true,
  },
  telegram: {
    username: "demo_user",
    connected: true,
  },
  discord: {
    username: "demo_user",
    connected: true,
  },
};

async function fetchSubmissionForEdit(submissionId) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For demo, return demo data if ID matches
  // if (submissionId === "sub_1") {
  return DEMO_SUBMISSION;
  // }

  // Return null for not found
  // return null;
}

const SubmissionEditPage = async ({ params }) => {
  const { submissionId } = await params;

  const submission = await fetchSubmissionForEdit(submissionId);

  if (!submission) {
    notFound();
  }

  return (
    <div className="flex h-full flex-1 gap-4">
      <SubmissionEditMain submission={submission} user={DEMO_USER} />
      <SubmissionEditSidebar submission={submission} />
    </div>
  );
};

export default SubmissionEditPage;
