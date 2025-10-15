"use client";

import SubmissionsListHeader from "./list/SubmissionsListHeader";
import SubmissionsListContent from "./list/SubmissionsListContent";

const SubmissionsList = ({
  // Loading states
  hasMore,
  loading,
  loadingMore,

  // Data
  submissions,
  selectedSubmission,

  // Filter states
  currentStatus,
  activeFilters,

  // Callbacks
  onLoadMore,
  onFiltersChange,
  setSubmissions,
  setSelectedSubmission,
}) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-divider p-6">
        <SubmissionsListHeader
          currentStatus={currentStatus}
          activeFilters={activeFilters}
          loadedCount={submissions.length}
          onFiltersChange={onFiltersChange}
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
};

export default SubmissionsList;
