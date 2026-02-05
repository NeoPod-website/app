"use client";

import { addToast } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, Suspense } from "react";

import {
  setLoading,
  appendSubmissions,
  initializeSubmissions,
} from "@/redux/slice/submissionsSlice";

import SubmissionsGrid from "./SubmissionsGrid";
import SubmissionsHeader from "./SubmissionsHeader";

import WrapperContainer from "@/components/common/WrapperContainer";
import SubmissionCardLoader from "@/components/ui/loader/submission/SubmissionCardLoader";

const LoadMoreSubmissions = ({
  initialLastKey,
  initialHasMore,
  initialSubmissions,
}) => {
  const dispatch = useDispatch();

  const { submissions, lastKey, hasMore, isLoading } = useSelector(
    (state) => state.submissions,
  );

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const initialData = {
        submissions: initialSubmissions || [],
        lastKey: initialLastKey || null,
        hasMore: initialHasMore,
      };

      dispatch(initializeSubmissions(initialData));
      setIsInitialized(true);
    }
  }, [
    dispatch,
    initialSubmissions,
    initialLastKey,
    initialHasMore,
    isInitialized,
  ]);

  const fetchMoreSubmissions = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      dispatch(setLoading(true));

      const params = new URLSearchParams({
        limit: "10",
        last_key: lastKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/pending?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();
      const newSubmissions = data.data?.submissions || [];

      if (newSubmissions.length === 0) {
        dispatch(
          appendSubmissions({
            submissions: [],
            lastKey: null,
            hasMore: false,
          }),
        );
        addToast({
          color: "default",
          title: "No more submissions",
          description: "You've reached the end of your pending submissions",
        });
        return;
      }

      dispatch(
        appendSubmissions({
          submissions: newSubmissions,
          lastKey: data.data?.next_key || null,
          hasMore: !!data.data?.next_key,
        }),
      );
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more submissions",
        description: error.message || "Please try again",
      });

      dispatch(
        appendSubmissions({
          submissions: [],
          lastKey: null,
          hasMore: false,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, hasMore, isLoading, lastKey]);

  const handleRefreshSubmissions = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/pending?limit=10`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to refresh submissions: ${response.status}`);
      }

      const data = await response.json();
      const refreshedSubmissions = data.data?.submissions || [];

      dispatch(
        initializeSubmissions({
          submissions: refreshedSubmissions,
          lastKey: data.data?.next_key || null,
          hasMore: !!data.data?.next_key,
        }),
      );

      addToast({
        color: "success",
        title: "Submissions updated",
        description: `Loaded ${refreshedSubmissions.length} pending submissions`,
      });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error refreshing submissions",
        description: error.message || "Please try again",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return (
    <WrapperContainer
      scrollable={false}
      className="hide-scroll flex flex-col overflow-y-auto p-3 md:overflow-hidden md:p-4 lg:p-6 3xl:p-8"
    >
      <SubmissionsHeader
        hasMore={hasMore}
        isLoading={isLoading}
        count={submissions.length}
        onRefresh={handleRefreshSubmissions}
      />

      <Suspense>
        <div className="flex flex-1 flex-col md:overflow-y-auto">
          {isInitialized ? (
            <SubmissionsGrid
              hasMore={hasMore}
              isLoading={isLoading}
              submissions={submissions}
              onRefresh={handleRefreshSubmissions}
              loadMoreSubmissions={fetchMoreSubmissions}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 px-8 pb-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <SubmissionCardLoader key={index} />
              ))}
            </div>
          )}
        </div>
      </Suspense>
    </WrapperContainer>
  );
};

export default LoadMoreSubmissions;
