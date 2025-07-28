"use client";

import React from "react";
import Link from "next/link";
import { FilterIcon, XCircleIcon, BookOpenIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";
import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";
import SubmissionsLoadMoreBtn from "@/components/ui/buttons/submissions/SubmissionsLoadMoreBtn";

const ImprovementTips = () => (
  <div className="hidden rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 sm:block">
    <div className="mb-4 flex items-center gap-2">
      <BookOpenIcon size={20} className="text-yellow-400" />
      <h3 className="text-lg font-bold text-yellow-300">Improvement Tips</h3>
    </div>

    <div className="space-y-3 text-sm text-yellow-200">
      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400"></div>
        <p>
          Review the feedback carefully and address each point mentioned by the
          reviewer
        </p>
      </div>

      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400"></div>
        <p>
          Check the quest requirements again to ensure you haven't missed any
          details
        </p>
      </div>

      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400"></div>
        <p>Look at approved submissions for inspiration and best practices</p>
      </div>

      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400"></div>
        <p>
          Don't hesitate to ask for clarification if the feedback is unclear
        </p>
      </div>
    </div>

    <div className="mt-4 flex gap-3">
      <Link
        href="/submissions/approved"
        className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
      >
        View Approved Examples
      </Link>

      <Link
        href="/quests"
        className="rounded-lg border border-yellow-500 px-4 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-500/10"
      >
        Try New Quest
      </Link>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-400/50 bg-gray-800/20 p-8 text-center">
    <div className="rounded-full bg-red-500/20 p-8">
      <XCircleIcon className="h-16 w-16 text-red-400" />
    </div>

    <div className="space-y-2">
      <h3 className="text-xl font-bold text-white">No Rejected Submissions</h3>

      <p className="text-gray-200">
        Great job! You don't have any rejected submissions. Keep up the
        excellent work!
      </p>
    </div>

    <Link
      href="/submissions/approved"
      className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
    >
      View Approved Work
    </Link>
  </div>
);

const RejectedSubmissionsList = ({
  hasMore,
  isLoading,
  onLoadMore,
  submissions,
}) => {
  return (
    <WrapperContainer className="flex flex-1 flex-col px-2 py-4 scrollbar-hide sm:space-y-6 md:overflow-y-auto md:p-5 3xl:p-8">
      <ImprovementTips />

      <div className="mb-4 flex items-center justify-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">
          All Rejected Submissions ({submissions.length})
        </h2>

        <div className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
          <FilterIcon size={14} />
          <span>Showing rejected submissions</span>
        </div>
      </div>

      {submissions.length > 0 ? (
        <>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <HistoryItemCard
                key={submission.submission_id}
                submission={submission}
              />
            ))}
          </div>

          <SubmissionsLoadMoreBtn
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={onLoadMore}
          />

          {!hasMore && (
            <div className="mt-4 flex justify-center text-sm text-gray-400 sm:mt-0">
              No more submissions
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </WrapperContainer>
  );
};

export default RejectedSubmissionsList;
