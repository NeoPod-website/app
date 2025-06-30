import {
  StarIcon,
  CrownIcon,
  FilterIcon,
  TrophyIcon,
  SparklesIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

import WrapperContainer from "@/components/common/WrapperContainer";

import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";
import SubmissionsLoadMoreBtn from "@/components/ui/buttons/submissions/SubmissionsLoadMoreBtn";

const ExcellenceBanner = () => (
  <div className="relative rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 p-6">
    <div className="pointer-events-none absolute inset-0 flex items-start justify-end p-4 opacity-10">
      <SparklesIcon size={60} className="text-yellow-400" />
    </div>

    <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-yellow-500/20 p-3">
          <CrownIcon size={24} className="text-yellow-400" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-yellow-300">
            Excellence Recognized
          </h3>

          <p className="text-yellow-200">
            Your outstanding contributions to the NEO community
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm text-yellow-100">
        <div className="flex items-start gap-2">
          <TrophyIcon
            size={16}
            className="mt-0.5 flex-shrink-0 text-yellow-400"
          />

          <p>
            These submissions represent the highest quality work in our
            community
          </p>
        </div>

        <div className="flex items-start gap-2">
          <StarIcon
            size={16}
            className="mt-0.5 flex-shrink-0 text-yellow-400"
          />

          <p>
            Highlighted work may be featured in official NEO communications and
            showcases
          </p>
        </div>

        <div className="flex items-start gap-2">
          <SparklesIcon
            size={16}
            className="mt-0.5 flex-shrink-0 text-yellow-400"
          />

          <p>
            Your exceptional contributions help elevate the entire NEO ecosystem
          </p>
        </div>

        <div className="flex items-start gap-2">
          <CrownIcon
            size={16}
            className="mt-0.5 flex-shrink-0 text-yellow-400"
          />

          <p>
            You're among the top contributors setting the standard for
            excellence
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href="/quests"
          className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
        >
          Continue Excellence
        </Link>

        <Link
          href="/history"
          className="rounded-lg border border-yellow-500 px-4 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-500/10"
        >
          View All Work
        </Link>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-400/50 bg-gray-800/20 p-8 text-center">
    <div className="rounded-full bg-yellow-500/20 p-8">
      <StarIcon className="h-16 w-16 text-yellow-400" />
    </div>

    <div className="space-y-2">
      <h3 className="text-xl font-bold text-white">
        No Highlighted Submissions Yet
      </h3>

      <p className="text-gray-200">
        Keep creating exceptional work to earn highlights and recognition!
      </p>
    </div>

    <Link
      href="/quests"
      className="rounded-xl bg-yellow-600 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-700"
    >
      Create Outstanding Work
    </Link>
  </div>
);

const HighlightedSubmissionsList = ({
  hasMore,
  isLoading,
  onLoadMore,
  submissions,
}) => {
  return (
    <WrapperContainer className="flex flex-1 flex-col space-y-6 overflow-y-auto p-8 scrollbar-hide">
      <ExcellenceBanner />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          All Highlighted Submissions ({submissions.length})
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FilterIcon size={14} />
          <span>Showing highlighted submissions</span>
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
            <div className="flex justify-center text-sm text-gray-400">
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

export default HighlightedSubmissionsList;
