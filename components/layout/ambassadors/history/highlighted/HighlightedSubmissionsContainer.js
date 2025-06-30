// "use client";

// import React, { useState } from "react";
// import { addToast } from "@heroui/react";

// import HighlightedSubmissionsList from "./HighlightedSubmissionsList";
// import HighlightedSubmissionsHeader from "./HighlightedSubmissionsHeader";

// const DEMO_MORE_HIGHLIGHTED_SUBMISSIONS = [
//   {
//     submission_id: "sub_022",
//     ambassador_id: "amb_991",
//     submitted_at: "2025-01-14T20:10:00Z",
//     review_status: "highlighted",
//     reviewed_by: "admin_002",
//     review_comment:
//       "Perfect execution of the brand guidelines with creative flair! The visual design is stunning and the messaging is spot-on. This infographic will be used in our official marketing materials.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Design Official NEO Brand Assets",
//   },
//   {
//     submission_id: "sub_025",
//     ambassador_id: "amb_102",
//     submitted_at: "2025-01-13T18:30:00Z",
//     review_status: "highlighted",
//     reviewed_by: "admin_003",
//     review_comment:
//       "Exceptional educational content! This workshop series exceeded all expectations and received outstanding feedback from participants. The practical approach and real-world examples make complex concepts accessible.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Blockchain Workshop Series for Beginners",
//   },
// ];

// const HighlightedSubmissionsContainer = ({
//   initialStats,
//   initialLastKey,
//   initialHasMore,
//   initialSubmissions,
// }) => {
//   const [stats, setStats] = useState(initialStats);
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastKey, setLastKey] = useState(initialLastKey);
//   const [hasMore, setHasMore] = useState(initialHasMore);
//   const [submissions, setSubmissions] = useState(initialSubmissions);

//   const loadMoreSubmissions = async () => {
//     if (isLoading || !hasMore) return;

//     setIsLoading(true);

//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Simulate API call with pagination
//       const newSubmissions = DEMO_MORE_HIGHLIGHTED_SUBMISSIONS;

//       if (newSubmissions.length === 0) {
//         setHasMore(false);
//         addToast({
//           color: "default",
//           title: "No more submissions",
//           description: "You've reached the end of your highlighted submissions",
//         });
//         return;
//       }

//       // Update state
//       const updatedSubmissions = [...submissions, ...newSubmissions];
//       setSubmissions(updatedSubmissions);

//       // Update stats
//       const newThisMonth = updatedSubmissions.filter((s) => {
//         const submittedDate = new Date(s.submitted_at);
//         const now = new Date();
//         return (
//           submittedDate.getMonth() === now.getMonth() &&
//           submittedDate.getFullYear() === now.getFullYear()
//         );
//       }).length;

//       setStats({
//         currentCount: updatedSubmissions.length,
//         thisMonth: newThisMonth,
//         hasMore: false,
//       });

//       setHasMore(false);
//       setLastKey(null);
//     } catch (error) {
//       addToast({
//         color: "danger",
//         title: "Error loading more submissions",
//         description: error.message || "Please try again",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-1 flex-col gap-4 overflow-hidden">
//       <HighlightedSubmissionsHeader stats={stats} />

//       <HighlightedSubmissionsList
//         hasMore={hasMore}
//         isLoading={isLoading}
//         submissions={submissions}
//         onLoadMore={loadMoreSubmissions}
//       />
//     </div>
//   );
// };

// export default HighlightedSubmissionsContainer;

"use client";

import { addToast } from "@heroui/react";
import React, { useState, useCallback } from "react";

import HighlightedSubmissionsList from "./HighlightedSubmissionsList";
import HighlightedSubmissionsHeader from "./HighlightedSubmissionsHeader";

const HighlightedSubmissionsContainer = ({
  initialStats,
  initialLastKey,
  initialHasMore,
  initialSubmissions,
}) => {
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [lastKey, setLastKey] = useState(initialLastKey);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  const enrichWithQuestData = useCallback(async (submissions) => {
    if (!submissions || submissions.length === 0) {
      return [];
    }

    try {
      const questIds = [...new Set(submissions.map((sub) => sub.quest_id))];

      const questPromises = questIds.map(async (questId) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          if (response.ok) {
            const questData = await response.json();
            return {
              quest_id: questId,
              quest_data: questData.data?.quest || null,
            };
          }
          return { quest_id: questId, quest_data: null };
        } catch (error) {
          return { quest_id: questId, quest_data: null };
        }
      });

      const questResults = await Promise.all(questPromises);
      const questMap = questResults.reduce((acc, result) => {
        if (result.quest_data) {
          acc[result.quest_id] = result.quest_data;
        }
        return acc;
      }, {});

      const enrichedSubmissions = submissions.map((submission) => {
        const questData = questMap[submission.quest_id];

        return {
          ...submission,
          quest_name: questData?.name || "Unknown Quest",
          quest_description: questData?.description || "",
          quest_tasks: questData?.tasks || [],
          quest_rewards: questData?.rewards || [],
          category_name: questData?.category_name || "Unknown Category",
          pod_name: questData?.pod_name || "Unknown Pod",
          original_quest_data: questData,
        };
      });

      return enrichedSubmissions;
    } catch (error) {
      return submissions;
    }
  }, []);

  const loadMoreSubmissions = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        limit: "10",
        last_key: lastKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/highlighted?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more highlighted: ${response.status}`);
      }

      const data = await response.json();
      const newSubmissions = data.data?.submissions || [];

      if (newSubmissions.length === 0) {
        setHasMore(false);
        setLastKey(null);
        addToast({
          color: "default",
          title: "No more submissions",
          description: "You've reached the end of your highlighted submissions",
        });
        return;
      }

      // Enrich new submissions with quest data
      const enrichedNewSubmissions = await enrichWithQuestData(newSubmissions);

      // Update state
      const updatedSubmissions = [...submissions, ...enrichedNewSubmissions];
      setSubmissions(updatedSubmissions);

      // Update stats
      const newThisMonth = updatedSubmissions.filter((s) => {
        const submittedDate = new Date(s.submitted_at);
        const now = new Date();
        return (
          submittedDate.getMonth() === now.getMonth() &&
          submittedDate.getFullYear() === now.getFullYear()
        );
      }).length;

      setStats({
        currentCount: updatedSubmissions.length,
        thisMonth: newThisMonth,
        hasMore: !!data.data?.next_key,
      });

      setHasMore(!!data.data?.next_key);
      setLastKey(data.data?.next_key || null);

      addToast({
        color: "success",
        title: "More submissions loaded",
        description: `Loaded ${enrichedNewSubmissions.length} more highlighted submissions`,
      });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more submissions",
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, lastKey, submissions, enrichWithQuestData]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <HighlightedSubmissionsHeader stats={stats} hasMore={hasMore} />

      <HighlightedSubmissionsList
        hasMore={hasMore}
        isLoading={isLoading}
        submissions={submissions}
        onLoadMore={loadMoreSubmissions}
      />
    </div>
  );
};

export default HighlightedSubmissionsContainer;
