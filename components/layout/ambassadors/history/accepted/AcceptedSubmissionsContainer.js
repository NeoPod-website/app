"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/react";

import AcceptedSubmissionsList from "./AcceptedSubmissionsList";
import AcceptedSubmissionsHeader from "./AcceptedSubmissionsHeader";

const DEMO_MORE_ACCEPTED_SUBMISSIONS = [
  {
    submission_id: "sub_018",
    ambassador_id: "amb_667",
    submitted_at: "2025-01-11T10:30:00Z",
    review_status: "approved",
    reviewed_by: "admin_003",
    review_comment:
      "Outstanding research and analysis! The market insights are valuable and well-presented. This will help many community members understand the current trends.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Market Analysis Report",
  },
  {
    submission_id: "sub_021",
    ambassador_id: "amb_778",
    submitted_at: "2025-01-10T15:15:00Z",
    review_status: "approved",
    reviewed_by: "admin_001",
    review_comment:
      "Excellent code quality and documentation. The smart contract examples are well-structured and the explanations are clear for developers.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Smart Contract Development Guide",
  },
  {
    submission_id: "sub_024",
    ambassador_id: "amb_889",
    submitted_at: "2025-01-09T12:45:00Z",
    review_status: "approved",
    reviewed_by: "admin_002",
    review_comment:
      "Creative and engaging content! The social media campaign successfully reached the target audience and generated positive community response.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Social Media Campaign Launch",
  },
];

const AcceptedSubmissionsContainer = ({
  initialStats,
  initialLastKey,
  initialHasMore,
  initialSubmissions,
}) => {
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [lastKey, setLastKey] = useState(initialLastKey);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  const loadMoreSubmissions = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate API call with pagination
      const newSubmissions = DEMO_MORE_ACCEPTED_SUBMISSIONS;

      if (newSubmissions.length === 0) {
        setHasMore(false);
        addToast({
          color: "default",
          title: "No more submissions",
          description: "You've reached the end of your accepted submissions",
        });
        return;
      }

      // Update state
      const updatedSubmissions = [...submissions, ...newSubmissions];
      setSubmissions(updatedSubmissions);

      // Update stats
      const newThisMonth = updatedSubmissions.filter((s) => {
        const submittedDate = new Date(s.submitted_at);
        const now = new Date();
        return (
          submittedDate.getMonth() === now.getMonth() &&
          submittedDate.getFullYear() === now.getFullYear()
        );
      }).length;

      setStats({
        currentCount: updatedSubmissions.length,
        thisMonth: newThisMonth,
        hasMore: false,
      });

      setHasMore(false);
      setLastKey(null);
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more submissions",
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <AcceptedSubmissionsHeader stats={stats} />

      <AcceptedSubmissionsList
        submissions={submissions}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMoreSubmissions}
      />
    </div>
  );
};

export default AcceptedSubmissionsContainer;
