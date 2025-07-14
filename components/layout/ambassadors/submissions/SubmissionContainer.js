import React, { Suspense } from "react";
import SubmissionList from "./SubmissionList";
import WrapperContainer from "@/components/common/WrapperContainer";
// import SubmissionListLoader from "@/components/ui/loader/submission/SubmissionListLoader";

// Empty state components
const EmptyStateMessage = ({ title, description }) => (
  <div className="space-y-2 text-center">
    <p className="text-xl font-bold text-white">{title}</p>
    <p className="text-base text-gray-200">{description}</p>
  </div>
);

const SubmissionLoadError = ({ error }) => (
  <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6">
    <EmptyStateMessage
      title="Failed to load submissions"
      description={
        error || "An error occurred while loading your pending submissions"
      }
    />
  </div>
);

// Header component for pending submissions
const PendingSubmissionsHeader = ({ count }) => (
  <div className="space-y-4 p-8 pb-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Pending Submissions</h1>
        <p className="mt-1 text-gray-300">
          {count > 0
            ? `You have ${count} submission${count !== 1 ? "s" : ""} awaiting review`
            : "All your submissions have been reviewed"}
        </p>
      </div>

      {count > 0 && (
        <div className="bg-blue-500/20 flex items-center gap-2 rounded-full px-3 py-1 ring-1 ring-blue-500/30">
          <div className="bg-blue-500 h-2 w-2 animate-pulse rounded-full" />
          <span className="text-sm font-medium text-blue-400">
            {count} pending
          </span>
        </div>
      )}
    </div>
  </div>
);

// Validate and filter submissions - only show pending submissions
const validateSubmissions = (submissionsData) => {
  if (
    !submissionsData?.submissions ||
    !Array.isArray(submissionsData.submissions)
  ) {
    return [];
  }

  return submissionsData.submissions.filter(
    (submission) =>
      submission &&
      typeof submission === "object" &&
      submission.submission_id &&
      submission.quest_id &&
      submission.review_status === "pending",
  );
};

const SubmissionContainer = async ({
  compact = false,
  scrollable = true,
  submissionsData,
}) => {
  const validSubmissions = validateSubmissions(submissionsData);

  return (
    <>
      <PendingSubmissionsHeader count={validSubmissions.length} />

      <Suspense>
        <SubmissionList
          compact={compact}
          submissions={validSubmissions}
          scrollable={scrollable}
        />
      </Suspense>
    </>
  );
};

export default SubmissionContainer;
