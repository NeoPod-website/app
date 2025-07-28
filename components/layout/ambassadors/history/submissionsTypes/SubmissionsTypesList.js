"use client";

import React from "react";
import { FilterIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";
import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";
import SubmissionsLoadMoreBtn from "@/components/ui/buttons/submissions/SubmissionsLoadMoreBtn";

import SubmissionsTypesBanner from "./SubmissionsTypesBanner";
import SubmissionsTypesEmptyState from "./SubmissionsTypesEmptyState";

const SUBMISSION_CONFIGS = {
  accepted: {
    title: "All Accepted Submissions",
    filterText: "Showing approved submissions",
    noMoreText: "No more submissions to load.",
  },

  highlighted: {
    title: "All Highlighted Submissions",
    filterText: "Showing highlighted submissions",
    noMoreText: "No more submissions to load.",
  },

  rejected: {
    title: "All Rejected Submissions",
    filterText: "Showing rejected submissions",
    noMoreText: "No more submissions",
  },
};

const SubmissionsTypesList = ({
  type,
  hasMore,
  isLoading,
  onLoadMore,
  submissions,
}) => {
  const config = SUBMISSION_CONFIGS[type];

  if (!config) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        `Invalid submission type: ${type}. Valid types: accepted, highlighted, rejected`,
      );
    }
    return null;
  }

  return (
    <WrapperContainer className="flex flex-1 flex-col px-2 py-4 scrollbar-hide sm:space-y-6 md:overflow-y-auto md:p-5 3xl:p-8">
      <SubmissionsTypesBanner type={type} />

      <div className="mb-4 flex items-center justify-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">
          {config.title} ({submissions.length})
        </h2>

        <div className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
          <FilterIcon size={14} />
          <span>{config.filterText}</span>
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
              {config.noMoreText}
            </div>
          )}
        </>
      ) : (
        <SubmissionsTypesEmptyState type={type} />
      )}
    </WrapperContainer>
  );
};

export default SubmissionsTypesList;
