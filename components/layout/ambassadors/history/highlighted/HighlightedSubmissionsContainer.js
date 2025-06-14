"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/react";

import HighlightedSubmissionsList from "./HighlightedSubmissionsList";
import HighlightedSubmissionsHeader from "./HighlightedSubmissionsHeader";

const DEMO_MORE_HIGHLIGHTED_SUBMISSIONS = [
  {
    submission_id: "sub_022",
    ambassador_id: "amb_991",
    submitted_at: "2025-01-14T20:10:00Z",
    review_status: "highlighted",
    reviewed_by: "admin_002",
    review_comment:
      "Perfect execution of the brand guidelines with creative flair! The visual design is stunning and the messaging is spot-on. This infographic will be used in our official marketing materials.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Design Official NEO Brand Assets",
  },
  {
    submission_id: "sub_025",
    ambassador_id: "amb_102",
    submitted_at: "2025-01-13T18:30:00Z",
    review_status: "highlighted",
    reviewed_by: "admin_003",
    review_comment:
      "Exceptional educational content! This workshop series exceeded all expectations and received outstanding feedback from participants. The practical approach and real-world examples make complex concepts accessible.",
    is_flagged: "false",
    resubmission_count: 0,
    quest_name: "Blockchain Workshop Series for Beginners",
  },
];

const HighlightedSubmissionsContainer = ({
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
      const newSubmissions = DEMO_MORE_HIGHLIGHTED_SUBMISSIONS;

      if (newSubmissions.length === 0) {
        setHasMore(false);
        addToast({
          color: "default",
          title: "No more submissions",
          description: "You've reached the end of your highlighted submissions",
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
      <HighlightedSubmissionsHeader stats={stats} />

      <HighlightedSubmissionsList
        hasMore={hasMore}
        isLoading={isLoading}
        submissions={submissions}
        onLoadMore={loadMoreSubmissions}
      />
    </div>
  );
};

export default HighlightedSubmissionsContainer;
