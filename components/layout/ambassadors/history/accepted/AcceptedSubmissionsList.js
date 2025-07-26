"use client";

import React from "react";
import Link from "next/link";
import { FilterIcon, TrophyIcon, CheckCircleIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";
import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";
import SubmissionsLoadMoreBtn from "@/components/ui/buttons/submissions/SubmissionsLoadMoreBtn";

const SuccessBanner = () => (
  <div className="hidden rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/10 p-6 sm:block">
    <div className="mb-4 flex items-center gap-2">
      <TrophyIcon size={20} className="text-green-400" />
      <h3 className="text-lg font-bold text-green-300">Great Work!</h3>
    </div>

    <div className="space-y-3 text-sm text-green-200">
      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>

        <p>
          Your accepted submissions demonstrate excellent quality and
          understanding
        </p>
      </div>

      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>

        <p>Keep up the outstanding work to maintain your high success rate</p>
      </div>

      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>

        <p>
          Consider helping other ambassadors by sharing your successful
          approaches
        </p>
      </div>

      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></div>

        <p>
          Your quality submissions contribute to the growth of the NEO ecosystem
        </p>
      </div>
    </div>

    <div className="mt-4 flex gap-3">
      <Link
        href="/quests"
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
      >
        Continue Excellence
      </Link>

      <Link
        href="/submissions/highlighted"
        className="rounded-lg border border-green-500 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/10"
      >
        View Highlighted Work
      </Link>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-400/50 bg-gray-800/20 p-8 text-center">
    <div className="rounded-full bg-green-500/20 p-8">
      <CheckCircleIcon className="h-16 w-16 text-green-400" />
    </div>

    <div className="space-y-2">
      <h3 className="text-xl font-bold text-white">
        No Accepted Submissions Yet
      </h3>

      <p className="text-gray-200">
        Complete some quests and get them approved to see them here!
      </p>
    </div>

    <Link
      href="/quests"
      className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
    >
      Start a Quest
    </Link>
  </div>
);

const AcceptedSubmissionsList = ({
  hasMore,
  isLoading,
  onLoadMore,
  submissions,
}) => {
  return (
    <WrapperContainer className="flex flex-1 flex-col px-2 py-4 scrollbar-hide sm:space-y-6 md:overflow-y-auto md:p-5 3xl:p-8">
      <SuccessBanner />

      <div className="mb-4 flex items-center justify-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">
          All Accepted Submissions ({submissions.length})
        </h2>

        <div className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
          <FilterIcon size={14} />
          <span>Showing approved submissions</span>
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
              No more submissions to load.
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </WrapperContainer>
  );
};

export default AcceptedSubmissionsList;
