"use client";

import { memo, useRef, useEffect } from "react";

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
    onSubmissionDataLoaded,
    onAutoLoadMore,
  }) => {
    const observerTarget = useRef(null);
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
      if (!observerTarget.current || loading || !hasMore || loadingMore) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onAutoLoadMore();

            setTimeout(() => {
              hasTriggeredRef.current = false;
            }, 1000);
          }
        },
        {
          root: null,
          rootMargin: "200px",
          threshold: 0.1,
        },
      );

      observer.observe(observerTarget.current);

      return () => {
        if (observerTarget.current) {
          observer.unobserve(observerTarget.current);
        }
      };
    }, [loading, hasMore, loadingMore, onAutoLoadMore]);

    if (loading) {
      return <SubmissionListSkeleton count={6} />;
    }

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
              onSubmissionDataLoaded={onSubmissionDataLoaded}
            />
          ))}
        </div>

        {hasMore && !loadingMore && (
          <div ref={observerTarget} className="h-4 w-full" aria-hidden="true" />
        )}

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
