import React from "react";
import Link from "next/link";
import { ClockIcon } from "lucide-react";

import SubmissionCard from "./SubmissionCard";
import LoadMoreSubmissionButton from "./LoadMoreSubmissionButton";

const EmptySubmissions = () => (
  <div className="flex flex-1 flex-col items-center justify-start gap-6 p-8 text-center">
    <div className="rounded-full bg-gray-700/50 p-6">
      <ClockIcon className="text-gray-400" size={48} />
    </div>

    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-white">No Pending Submissions</h2>

      <p className="max-w-lg text-gray-100">
        All your submissions have been reviewed or you haven't submitted any
        quests yet. Start exploring quests to make your first submission!
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/quests"
        className="rounded-full border border-gray-400 bg-black/50 px-6 py-2 text-center text-white transition-colors hover:border-gray-600 hover:bg-black/70"
      >
        Back to Quests
      </Link>

      <Link
        href="/"
        className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-center text-white"
      >
        Go Home
      </Link>
    </div>
  </div>
);

const SubmissionsGrid = ({
  hasMore,
  isLoading,
  submissions,
  loadMoreSubmissions,
}) => {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return <EmptySubmissions />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-1 gap-6 px-8 pb-4 md:grid-cols-2 lg:grid-cols-3">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.submission_id}
            submission={submission}
          />
        ))}
      </div>

      <LoadMoreSubmissionButton
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMoreSubmissions}
      />

      {!hasMore && (
        <div className="flex items-center justify-center gap-2 p-4 text-sm text-gray-400">
          No more submissions to load.
        </div>
      )}
    </div>
  );
};

export default SubmissionsGrid;
