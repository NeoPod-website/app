"use client";

import {
  XIcon,
  BellIcon,
  WifiIcon,
  LoaderIcon,
  WifiOffIcon,
  RefreshCwIcon,
  CheckCheckIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Button, Spinner } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useInbox } from "@/hooks/useInbox";

import { toggleInboxModal } from "@/redux/slice/modalsSlice";

import InboxItem from "@/components/layout/ambassadors/inbox/InboxItem";

const CLOSE_ANIMATION_DURATION = 300;

const LoadingSpinner = ({
  size = "lg",
  message = "Loading notifications...",
}) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12">
    <Spinner size={size} color="white" />
    <p className="text-base text-gray-300">{message}</p>
  </div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
      <div className="mb-2 flex items-center gap-2">
        <WifiOffIcon className="h-4 w-4 text-red-400" />
        <p className="text-sm font-medium text-red-400">Connection Error</p>
      </div>
      <p className="text-xs text-red-300">{error}</p>
    </div>

    <Button
      onPress={onRetry}
      className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
    >
      Try Again
    </Button>
  </div>
);

const EmptyInbox = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 rounded-full bg-gray-700/50 p-6">
      <BellIcon className="h-12 w-12 text-gray-500" />
    </div>

    <h3 className="mb-2 text-lg font-semibold text-gray-300">All caught up!</h3>
    <p className="max-w-sm text-sm text-gray-500">
      No new notifications. Your reviewed submissions will appear here.
    </p>
  </div>
);

// Main Modal Component
export default function InboxModal() {
  const dispatch = useDispatch();

  const { isInboxOpen } = useSelector((state) => state.modals);

  const [isOnline, setIsOnline] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const {
    error,
    loading,
    loadingMore,
    refreshing,
    markAsRead,
    submissions,
    markAllAsRead,
    markingAllRead,
    loadSubmissions,
    loadMoreSubmissions,
    refreshSubmissions,
    startPolling,
    stopPolling,
    hasMore,
    canLoadMore,
    lastFetchTime,
    cacheAge,
  } = useInbox();

  const unreadCount = useMemo(
    () => submissions.filter((s) => !s.is_read_by_ambassador).length,
    [submissions],
  );

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load data when modal opens and start polling
  useEffect(() => {
    if (isInboxOpen) {
      setIsVisible(true);
      loadSubmissions();
      startPolling();
    } else {
      stopPolling();
    }
  }, [isInboxOpen, loadSubmissions, startPolling, stopPolling]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    stopPolling();

    setTimeout(() => dispatch(toggleInboxModal()), CLOSE_ANIMATION_DURATION);
  }, [dispatch, stopPolling]);

  const handleRefresh = useCallback(() => {
    refreshSubmissions();
  }, [refreshSubmissions]);

  const handleLoadMore = useCallback(() => {
    if (canLoadMore) {
      loadMoreSubmissions();
    }
  }, [canLoadMore, loadMoreSubmissions]);

  const toggleExpanded = useCallback((submissionId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [submissionId]: !prev[submissionId],
    }));
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isInboxOpen) {
        handleClose();
      }
    };

    if (isInboxOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isInboxOpen, handleClose]);

  // Format last fetch time
  const formatLastFetch = useCallback(() => {
    if (!lastFetchTime) return "Never";
    const now = new Date();

    const fetchTime = new Date(lastFetchTime);
    const diffMinutes = Math.floor((now - fetchTime) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return fetchTime.toLocaleDateString();
  }, [lastFetchTime]);

  if (!isInboxOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed left-0 top-0 z-50 h-full w-full max-w-2xl bg-black/30 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-gradient-black/50 absolute inset-0 backdrop-blur-sm" />

        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-400/30 bg-gradient-dark/60 px-4 py-3 backdrop-blur-xl xl:px-6 xl:py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-white xl:h-6 xl:w-6" />

                <h2 className="text-lg font-bold text-white lg:text-xl">
                  Your Inbox
                </h2>
              </div>

              {unreadCount > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 ring-1 ring-red-500/30">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                  <span className="text-sm font-medium text-red-400">
                    {unreadCount} unread
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <WifiIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <WifiOffIcon className="h-4 w-4 text-red-400" />
                )}
              </div>

              <Button
                onPress={handleRefresh}
                isDisabled={refreshing}
                className="min-w-0 rounded-lg bg-transparent p-2 text-gray-400 transition-all duration-200 hover:bg-gray-700/50 hover:text-white disabled:opacity-50"
                title={`Refresh inbox (Last: ${formatLastFetch()})`}
              >
                <RefreshCwIcon
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </Button>

              {unreadCount > 0 && (
                <Button
                  onPress={markAllAsRead}
                  isDisabled={markingAllRead}
                  startContent={
                    markingAllRead ? (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCheckIcon className="h-4 w-4" />
                    )
                  }
                  className="rounded-lg bg-gray-600/80 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none disabled:opacity-50"
                >
                  {markingAllRead ? "Marking..." : "Mark all read"}
                </Button>
              )}

              <Button
                onPress={handleClose}
                className="min-w-0 rounded-lg bg-transparent text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-700/50 hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && submissions.length === 0 ? (
              <LoadingSpinner />
            ) : error && submissions.length === 0 ? (
              <ErrorMessage error={error} onRetry={handleRefresh} />
            ) : submissions.length === 0 ? (
              <EmptyInbox />
            ) : (
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {submissions.map((submission, index) => (
                    <InboxItem
                      key={submission.submission_id}
                      submission={submission}
                      index={index}
                      isVisible={isVisible}
                      isExpanded={expandedItems[submission.submission_id]}
                      onToggleExpanded={toggleExpanded}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      onPress={handleLoadMore}
                      isDisabled={loadingMore}
                      startContent={
                        loadingMore ? (
                          <LoaderIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )
                      }
                      className="rounded-lg bg-gray-700/80 px-6 py-2 text-white transition-colors duration-200 hover:bg-gray-700 disabled:opacity-50"
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}

                {error && submissions.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      onPress={handleRefresh}
                      className="rounded-lg bg-gray-700/80 px-6 py-2 text-white transition-colors duration-200 hover:bg-gray-700 disabled:opacity-50"
                    >
                      Retry loading
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {submissions.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-400/30 bg-gray-900/60 px-6 py-3 text-xs text-gray-200 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span>
                  {submissions.length} notification
                  {submissions.length !== 1 ? "s" : ""}
                </span>

                {hasMore && (
                  <span className="text-blue-400">+ more available</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span>Last updated: {formatLastFetch()}</span>
                {cacheAge > 0 && cacheAge < 60000 && (
                  <span className="text-green-400">📦 Cached</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
