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
    // Ref for intersection observer trigger
    const observerTarget = useRef(null);
    const hasTriggeredRef = useRef(false);

    /**
     * Intersection Observer for auto-loading when user scrolls near bottom
     */
    useEffect(() => {
      if (!observerTarget.current || loading || !hasMore || loadingMore) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          // When the trigger element is visible and we haven't triggered yet
          if (entries[0].isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onAutoLoadMore();

            // Reset after a short delay to allow multiple triggers
            setTimeout(() => {
              hasTriggeredRef.current = false;
            }, 1000);
          }
        },
        {
          root: null, // viewport
          rootMargin: "200px", // Trigger 200px before reaching the element
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
              onSubmissionDataLoaded={onSubmissionDataLoaded}
            />
          ))}
        </div>

        {/* Intersection Observer Trigger - placed before the load more button */}
        {hasMore && !loadingMore && (
          <div ref={observerTarget} className="h-4 w-full" aria-hidden="true" />
        )}

        {/* Manual Load More Button (still available for user control) */}
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
