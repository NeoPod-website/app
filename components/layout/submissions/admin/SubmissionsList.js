"use client";

import { memo } from "react";

import StatusFilterChips from "./list/StatusFilterChips";
import SubmissionsListHeader from "./list/SubmissionsListHeader";
import SubmissionsListContent from "./list/SubmissionsListContent";

const SubmissionsList = memo(
  ({
    loading,
    hasMore,
    onLoadMore,
    loadingMore,
    submissions,
    currentStatus,
    setSubmissions,
    onStatusChange,
    selectedSubmission,
    setSelectedSubmission,
  }) => {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="space-y-4 border-b border-divider p-6">
          <SubmissionsListHeader
            currentStatus={currentStatus}
            loadedCount={submissions.length}
          />

          <StatusFilterChips
            currentStatus={currentStatus}
            onStatusChange={onStatusChange}
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <SubmissionsListContent
            loading={loading}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            loadingMore={loadingMore}
            submissions={submissions}
            setSubmissions={setSubmissions}
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
          />
        </div>
      </div>
    );
  },
);

SubmissionsList.displayName = "SubmissionsList";

export default SubmissionsList;
