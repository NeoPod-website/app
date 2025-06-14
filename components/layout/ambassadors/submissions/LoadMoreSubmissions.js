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

export default function LoadMoreSubmissions({
  initialLastKey,
  initialHasMore,
  initialSubmissions,
}) {
  const dispatch = useDispatch();

  const { submissions, lastKey, hasMore, isLoading } = useSelector(
    (state) => state.submissions,
  );

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize submissions on component mount - only once
  useEffect(() => {
    if (!isInitialized && initialSubmissions) {
      const initialData = {
        submissions: initialSubmissions || [],
        lastKey: initialLastKey ? JSON.stringify(initialLastKey) : null,
        hasMore: initialHasMore && initialSubmissions?.length > 0,
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

  /**
   * Fetches more submissions with pagination (DEMO VERSION)
   */
  const fetchMoreSubmissions = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      dispatch(setLoading(true));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo pagination logic
      const startIndex = submissions.length;
      const remainingSubmissions = DEMO_SUBMISSIONS.slice(
        startIndex,
        startIndex + 3,
      );

      if (remainingSubmissions.length === 0) {
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

      // Update hasMore flag
      const effectiveHasMore =
        startIndex + remainingSubmissions.length < DEMO_SUBMISSIONS.length;
      const newLastKey = effectiveHasMore
        ? JSON.stringify({
            id: remainingSubmissions[remainingSubmissions.length - 1]
              .submission_id,
          })
        : null;

      // Update submissions in state - always append for load more
      dispatch(
        appendSubmissions({
          submissions: remainingSubmissions,
          lastKey: newLastKey,
          hasMore: effectiveHasMore,
        }),
      );
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more submissions",
        description: error.message || "Please try again",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, hasMore, isLoading, lastKey, submissions.length, addToast]);

  // Demo data - same as in page.js
  const DEMO_SUBMISSIONS = [
    {
      submission_id: "sub_1",
      quest_id: "quest_123",
      quest_name: "Complete Twitter Engagement Challenge",
      submitted_at: "2025-01-19T10:30:00Z",
      category_name: "Social Media",
      pod_name: "Content Creators",
      review_status: "pending",
      submission_data: {
        task_1:
          "Check out this amazing NEO ecosystem! The future of blockchain is here 🚀 #NEO #Blockchain #Web3",
        task_2: "https://twitter.com/user/status/123456789",
        task_3: true,
      },
      quest_tasks: [
        { id: "task_1", name: "text", instruction: "Write a tweet about NEO" },
        { id: "task_2", name: "url", instruction: "Share your tweet URL" },
        { id: "task_3", name: "x", instruction: "Follow @NEO_Blockchain" },
      ],
    },
    {
      submission_id: "sub_2",
      quest_id: "quest_456",
      quest_name: "Upload Portfolio Documentation",
      submitted_at: "2025-01-18T15:45:00Z",
      category_name: "Development",
      pod_name: "Developers Hub",
      review_status: "pending",
      submission_data: {
        task_1: {
          fileName: "portfolio.pdf",
          fileSize: 2548000,
          fileType: "application/pdf",
          fileUrl: "https://example.com/files/portfolio.pdf",
          uploaded: true,
          category: "Document",
        },
        task_2: 5,
      },
      quest_tasks: [
        {
          id: "task_1",
          name: "file-upload",
          instruction: "Upload your portfolio",
        },
        { id: "task_2", name: "number", instruction: "Years of experience" },
      ],
    },
    {
      submission_id: "sub_3",
      quest_id: "quest_789",
      quest_name: "Join Community Channels",
      submitted_at: "2025-01-17T09:15:00Z",
      category_name: "Community",
      pod_name: "Ambassadors",
      review_status: "pending",
      submission_data: {
        task_1: { joined: true, verified: true },
        task_2: { joined: true, verified: false },
        task_3: "https://neopod.org/learn-more",
      },
      quest_tasks: [
        { id: "task_1", name: "discord", instruction: "Join NEO Discord" },
        { id: "task_2", name: "telegram", instruction: "Join NEO Telegram" },
        { id: "task_3", name: "url", instruction: "Visit NEO website" },
      ],
    },
    {
      submission_id: "sub_4",
      quest_id: "quest_101",
      quest_name: "Write Technical Article",
      submitted_at: "2025-01-16T14:20:00Z",
      category_name: "Content Creation",
      pod_name: "Writers Guild",
      review_status: "pending",
      submission_data: {
        task_1:
          "Understanding Smart Contracts in NEO: A Comprehensive Guide for Developers...",
        task_2: 1250,
        task_3: {
          fileName: "article-cover.jpg",
          fileSize: 856000,
          fileType: "image/jpeg",
          fileUrl: "https://example.com/images/cover.jpg",
          uploaded: true,
          category: "Image",
        },
      },
      quest_tasks: [
        { id: "task_1", name: "text", instruction: "Write article content" },
        { id: "task_2", name: "number", instruction: "Word count" },
        {
          id: "task_3",
          name: "file-upload",
          instruction: "Upload cover image",
        },
      ],
    },
    {
      submission_id: "sub_5",
      quest_id: "quest_202",
      quest_name: "NFT Collection Analysis",
      submitted_at: "2025-01-15T11:30:00Z",
      category_name: "Research",
      pod_name: "Analytics Team",
      review_status: "pending",
      submission_data: {
        task_1: "https://docs.google.com/document/d/analysis-report-123",
        task_2: 25,
        task_3:
          "The NFT market shows significant growth in utility-based collections...",
      },
      quest_tasks: [
        { id: "task_1", name: "url", instruction: "Submit analysis document" },
        { id: "task_2", name: "number", instruction: "Collections analyzed" },
        { id: "task_3", name: "text", instruction: "Key findings summary" },
      ],
    },
    {
      submission_id: "sub_6",
      quest_id: "quest_303",
      quest_name: "Video Tutorial Creation",
      submitted_at: "2025-01-14T16:45:00Z",
      category_name: "Education",
      pod_name: "Educators",
      review_status: "pending",
      submission_data: {
        task_1: {
          fileName: "neo-tutorial.mp4",
          fileSize: 45800000,
          fileType: "video/mp4",
          fileUrl: "https://example.com/videos/tutorial.mp4",
          uploaded: true,
          category: "Video",
        },
        task_2: "https://youtube.com/watch?v=demo123",
        task_3: 15,
      },
      quest_tasks: [
        {
          id: "task_1",
          name: "file-upload",
          instruction: "Upload tutorial video",
        },
        { id: "task_2", name: "url", instruction: "YouTube link" },
        {
          id: "task_3",
          name: "number",
          instruction: "Video duration (minutes)",
        },
      ],
    },
  ];

  return (
    <WrapperContainer scrollable={true}>
      <SubmissionsHeader count={submissions.length} hasMore={hasMore} />

      <Suspense>
        <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
          <SubmissionsGrid
            submissions={submissions}
            hasMore={hasMore}
            isLoading={isLoading}
            loadMoreSubmissions={fetchMoreSubmissions}
          />
        </div>
      </Suspense>
    </WrapperContainer>
  );
}
