"use client";

import { memo } from "react";

import SubmissionCardItem from "./SubmissionCardItem";
import LoadMoreAdminSubmissions from "./LoadMoreAdminSubmissions";

import SubmissionListSkeleton from "@/components/ui/loader/submission/admin/SubmissionListLoader";
import { NoSubmissionsFound } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";

const SubmissionsListContent = memo(
  ({
    loading,
    hasMore,
    onLoadMore,
    loadingMore,
    submissions,
    setSubmissions,
    selectedSubmission,
    setSelectedSubmission,
  }) => {
    // Show initial loading skeleton
    if (loading) {
      return <SubmissionListSkeleton count={6} />;
    }

    // Show empty state
    if (submissions.length === 0) {
      return <NoSubmissionsFound />;
    }

    return (
      <div className="p-2">
        <div className="space-y-3">
          {submissions.map((submission) => (
            <SubmissionCardItem
              submission={submission}
              key={submission.submission_id}
              setSubmissions={setSubmissions}
              selectedSubmission={selectedSubmission}
              setSelectedSubmission={setSelectedSubmission}
            />
          ))}
        </div>

        <LoadMoreAdminSubmissions
          onLoadMore={onLoadMore}
          loading={loadingMore}
          hasMore={hasMore}
        />
      </div>
    );
  },
);

SubmissionsListContent.displayName = "SubmissionsListContent";

export default SubmissionsListContent;
