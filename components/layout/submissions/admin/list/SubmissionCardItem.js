// "use client";

// import {
//   EyeIcon,
//   StarIcon,
//   FlagIcon,
//   ListIcon,
//   ClockIcon,
//   XCircleIcon,
//   CalendarIcon,
//   CheckCircleIcon,
// } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { memo, useEffect, useState, useCallback } from "react";
// import { Card, CardBody, Checkbox, Avatar, Chip } from "@heroui/react";

// import { setCurrentQuest } from "@/redux/slice/questSlice";

// import SubmissionItemLoader from "@/components/ui/loader/submission/admin/SubmissionItemLoader";

// const getTimeAgo = (timestamp) => {
//   const now = new Date();
//   const submittedDate = new Date(timestamp);
//   const diffInMs = now.getTime() - submittedDate.getTime();
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInHours < 1) {
//     const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
//     return `${diffInMinutes}m ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours}h ago`;
//   } else {
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays}d ago`;
//   }
// };

// const getStatusConfig = (status) => {
//   const configs = {
//     pending: {
//       icon: ClockIcon,
//       color: "text-gray-400",
//       borderColor: "border-l-gray-400 border-gray-500",
//       chipColor: "warning",
//       label: "Pending Review",
//     },

//     approved: {
//       icon: CheckCircleIcon,
//       color: "text-green-400",
//       borderColor: "border-l-green-500 border-green-500/50",
//       chipColor: "success",
//       label: "Approved",
//     },

//     rejected: {
//       icon: XCircleIcon,
//       color: "text-red-400",
//       borderColor: "border-l-red-500 border-red-500/50",
//       chipColor: "danger",
//       label: "Rejected",
//     },

//     highlighted: {
//       icon: StarIcon,
//       color: "text-yellow-400",
//       borderColor: "border-l-yellow-500 border-yellow-500/50",
//       chipColor: "warning",
//       label: "Highlighted",
//     },

//     flagged: {
//       icon: FlagIcon,
//       color: "text-red-500",
//       borderColor: "border-l-red-500 border-red-500/50",
//       chipColor: "danger",
//       label: "Flagged",
//     },
//   };

//   return configs[status] || configs.pending;
// };

// const getTaskCount = (submissionData) => {
//   if (!submissionData || typeof submissionData !== "object") {
//     return 0;
//   }

//   // Count the number of task responses in submission_data
//   return Object.keys(submissionData).length;
// };

// const apiRequest = async (url, options = {}) => {
//   try {
//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       credentials: "include",
//       cache: "no-store",
//       ...options,
//     });

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status} - ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`Failed to fetch ${url}:`, error);
//     throw error;
//   }
// };

// const SubmissionCardItem = memo(
//   ({
//     submission,
//     setSubmissions,
//     selectedSubmission,
//     setSelectedSubmission,
//   }) => {
//     const dispatch = useDispatch();

//     const [quest, setQuest] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [ambassador, setAmbassador] = useState(null);

//     const isSelected =
//       selectedSubmission?.submission_id === submission.submission_id;
//     const statusConfig = getStatusConfig(submission.review_status);

//     const StatusIcon = statusConfig.icon;

//     const isUnread = submission.is_read_by_admin !== "true";

//     const taskCount = getTaskCount(submission.submission_data);

//     // Use fetched data or fallback values
//     const ambassadorName =
//       ambassador?.username || ambassador?.name || "Unknown Ambassador";
//     const questName = quest?.name || quest?.title || "Unknown Quest";
//     const questDescription = quest?.description || "";

//     useEffect(() => {
//       const fetchData = async () => {
//         if (!submission?.ambassador_id || !submission?.quest_id) {
//           setLoading(false);
//           return;
//         }

//         try {
//           setLoading(true);
//           setError(null);

//           // Fetch both ambassador and quest data in parallel
//           const [ambassadorResponse, questResponse] = await Promise.all([
//             apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${submission.ambassador_id}`,
//             ),
//             apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`,
//             ),
//           ]);

//           // Handle different response structures
//           const ambassadorData =
//             ambassadorResponse?.data?.ambassador ||
//             ambassadorResponse?.ambassador ||
//             ambassadorResponse;
//           const questData =
//             questResponse?.data?.quest || questResponse?.quest || questResponse;

//           setAmbassador(ambassadorData);
//           setQuest(questData);

//           dispatch(setCurrentQuest(questData));
//         } catch (err) {
//           console.error("Failed to fetch data:", err);
//           setError(err);

//           // Set fallback data to prevent UI breaks
//           setAmbassador({ username: "Unknown Ambassador" });
//           setQuest({ name: "Unknown Quest" });
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData();
//     }, [submission?.ambassador_id, submission?.quest_id]);

//     const handleSelectSubmission = useCallback(
//       async (submissionData) => {
//         if (
//           submissionData.submission_id === selectedSubmission?.submission_id
//         ) {
//           return;
//         }

//         // Create enhanced submission object with fetched data
//         const enhancedSubmission = {
//           ...submissionData,
//           ambassador_data: ambassador,
//           quest_data: quest,
//           computed: {
//             ambassador_name: ambassadorName,
//             quest_name: questName,
//             quest_description: questDescription,
//             is_unread: isUnread,
//             task_count: taskCount,
//             status_config: statusConfig,
//           },
//         };

//         setSelectedSubmission(enhancedSubmission);

//         // Mark as read when selected (only if unread)
//         if (isUnread) {
//           try {
//             await apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionData.submission_id}/read-by-admin`,
//               { method: "PATCH" },
//             );

//             // Update local state optimistically
//             setSubmissions((prev) =>
//               prev.map((sub) =>
//                 sub.submission_id === submissionData.submission_id
//                   ? { ...sub, is_read_by_admin: "true" }
//                   : sub,
//               ),
//             );
//           } catch (error) {
//             console.error("Failed to mark submission as read:", error);
//             // Note: We don't revert the selection on read failure
//           }
//         }
//       },
//       [
//         selectedSubmission?.submission_id,
//         ambassador,
//         quest,
//         ambassadorName,
//         questName,
//         questDescription,
//         isUnread,
//         taskCount,
//         statusConfig,
//         setSelectedSubmission,
//         setSubmissions,
//       ],
//     );

//     const handlePress = useCallback(() => {
//       if (!loading) {
//         handleSelectSubmission(submission);
//       }
//     }, [handleSelectSubmission, submission, loading]);

//     if (loading) {
//       return <SubmissionItemLoader />;
//     }

//     return (
//       <Card
//         isPressable={!loading}
//         onPress={handlePress}
//         className={`mb-2 w-full border border-l-5 transition-all duration-200 ${statusConfig.borderColor} ${
//           isSelected
//             ? "scale-[1.02] ring-1 ring-white"
//             : isUnread
//               ? "bg-content2 font-medium shadow-md"
//               : "bg-content1 hover:bg-content2"
//         } ${loading ? "pointer-events-none" : ""}`}
//       >
//         <CardBody className="p-4">
//           <div className="flex items-start gap-4">
//             <Checkbox
//               size="sm"
//               color="primary"
//               isDisabled={loading}
//               isSelected={isSelected}
//               className="mt-1 flex-shrink-0 pr-0 pt-0"
//               aria-label={`Select submission from ${ambassadorName}`}
//             />

//             <Avatar
//               size="sm"
//               isBordered={isUnread}
//               className="flex-shrink-0"
//               color={isUnread ? "primary" : "default"}
//               name={ambassadorName?.charAt(0)?.toUpperCase() || "A"}
//               src={ambassador?.avatar_url || ambassador?.profile_picture}
//               showFallback
//             />

//             <div className="min-w-0 flex-1">
//               <div className="mb-2 flex items-start justify-between">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span
//                     className={`text-sm font-semibold ${
//                       isUnread ? "text-foreground" : "text-foreground-600"
//                     }`}
//                   >
//                     {ambassadorName}
//                   </span>

//                   <span className="text-xs text-foreground-400">submitted</span>

//                   <div className="flex items-center gap-1 text-xs text-foreground-500">
//                     <CalendarIcon className="h-3 w-3" />
//                     <span>{getTimeAgo(submission.submitted_at)}</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-shrink-0 items-center gap-2">
//                   <StatusIcon size={16} className={statusConfig.color} />

//                   {isUnread && (
//                     <EyeIcon
//                       size={16}
//                       className="animate-pulse text-gray-200"
//                     />
//                   )}
//                 </div>
//               </div>

//               <h3
//                 className={`mb-2 line-clamp-2 text-sm ${
//                   isUnread
//                     ? "font-medium text-foreground"
//                     : "text-foreground-700"
//                 }`}
//                 title={questName}
//               >
//                 {questName}
//               </h3>

//               <div className="mb-3 flex flex-wrap items-center gap-2">
//                 {taskCount > 0 && (
//                   <Chip
//                     size="sm"
//                     variant="flat"
//                     color="default"
//                     startContent={<ListIcon className="h-3 w-3" />}
//                   >
//                     {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
//                   </Chip>
//                 )}

//                 {submission.resubmission_count > 0 && (
//                   <Chip size="sm" variant="flat" color="warning">
//                     {submission.resubmission_count} Resubmission
//                   </Chip>
//                 )}

//                 <Chip
//                   size="sm"
//                   color={statusConfig.chipColor}
//                   variant="flat"
//                   startContent={<StatusIcon className="h-3 w-3" />}
//                 >
//                   {statusConfig.label}
//                 </Chip>

//                 {submission.review_status === "highlighted" && (
//                   <Chip
//                     size="sm"
//                     color="warning"
//                     variant="solid"
//                     startContent={<StarIcon className="h-3 w-3" />}
//                   >
//                     Featured
//                   </Chip>
//                 )}
//               </div>

//               {error && (
//                 <div className="mt-2">
//                   <Chip size="sm" color="danger" variant="flat">
//                     ⚠️ Failed to load complete details
//                   </Chip>
//                 </div>
//               )}
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     );
//   },
// );

// SubmissionCardItem.displayName = "SubmissionCardItem";

// export default SubmissionCardItem;

"use client";

import {
  EyeIcon,
  StarIcon,
  FlagIcon,
  ListIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { memo, useEffect, useState, useCallback } from "react";
import { Card, CardBody, Checkbox, Avatar, Chip } from "@heroui/react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

import SubmissionItemLoader from "@/components/ui/loader/submission/admin/SubmissionItemLoader";

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const submittedDate = new Date(timestamp);
  const diffInMs = now.getTime() - submittedDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      icon: ClockIcon,
      color: "text-gray-400",
      borderColor: "border-l-gray-400 border-gray-500",
      chipColor: "warning",
      label: "Pending Review",
    },

    approved: {
      icon: CheckCircleIcon,
      color: "text-green-400",
      borderColor: "border-l-green-500 border-green-500/50",
      chipColor: "success",
      label: "Approved",
    },

    rejected: {
      icon: XCircleIcon,
      color: "text-red-400",
      borderColor: "border-l-red-500 border-red-500/50",
      chipColor: "danger",
      label: "Rejected",
    },

    highlighted: {
      icon: StarIcon,
      color: "text-yellow-400",
      borderColor: "border-l-yellow-500 border-yellow-500/50",
      chipColor: "warning",
      label: "Highlighted",
    },

    flagged: {
      icon: FlagIcon,
      color: "text-red-500",
      borderColor: "border-l-red-500 border-red-500/50",
      chipColor: "danger",
      label: "Flagged",
    },
  };

  return configs[status] || configs.pending;
};

const getTaskCount = (submissionData) => {
  if (!submissionData || typeof submissionData !== "object") {
    return 0;
  }

  // Count the number of task responses in submission_data
  return Object.keys(submissionData).length;
};

const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      cache: "no-store",
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
};

const SubmissionCardItem = memo(
  ({
    submission,
    setSubmissions,
    selectedSubmission,
    setSelectedSubmission,
    onSubmissionDataLoaded,
  }) => {
    const dispatch = useDispatch();

    const [quest, setQuest] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ambassador, setAmbassador] = useState(null);

    const isSelected =
      selectedSubmission?.submission_id === submission.submission_id;
    const statusConfig = getStatusConfig(submission.review_status);

    const StatusIcon = statusConfig.icon;

    const isUnread = submission.is_read_by_admin !== "true";

    const taskCount = getTaskCount(submission.submission_data);

    // Use fetched data or fallback values
    const ambassadorName =
      ambassador?.username || ambassador?.name || "Unknown Ambassador";
    const questName = quest?.name || quest?.title || "Unknown Quest";
    const questDescription = quest?.description || "";

    /**
     * Fetch ambassador and quest data
     */
    useEffect(() => {
      const fetchData = async () => {
        if (!submission?.ambassador_id || !submission?.quest_id) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(null);

          // Fetch both ambassador and quest data in parallel
          const [ambassadorResponse, questResponse] = await Promise.all([
            apiRequest(
              `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${submission.ambassador_id}`,
            ),
            apiRequest(
              `${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`,
            ),
          ]);

          // Handle different response structures
          const ambassadorData =
            ambassadorResponse?.data?.ambassador ||
            ambassadorResponse?.ambassador ||
            ambassadorResponse;
          const questData =
            questResponse?.data?.quest || questResponse?.quest || questResponse;

          setAmbassador(ambassadorData);
          setQuest(questData);

          dispatch(setCurrentQuest(questData));

          // ✅ NOTIFY PARENT THAT DATA IS LOADED
          if (onSubmissionDataLoaded) {
            onSubmissionDataLoaded(submission.submission_id);
          }
        } catch (err) {
          console.error("Failed to fetch data:", err);
          setError(err);

          // Set fallback data to prevent UI breaks
          setAmbassador({ username: "Unknown Ambassador" });
          setQuest({ name: "Unknown Quest" });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [
      submission?.ambassador_id,
      submission?.quest_id,
      submission?.submission_id,
      dispatch,
      onSubmissionDataLoaded,
    ]);

    /**
     * Handle submission selection
     */
    const handleSelectSubmission = useCallback(
      async (submissionData) => {
        // Don't re-select if already selected
        if (
          submissionData.submission_id === selectedSubmission?.submission_id
        ) {
          return;
        }

        // ✅ WAIT FOR DATA TO LOAD before allowing selection
        if (loading || !ambassador || !quest) {
          console.warn("Data not ready yet, please wait...");
          return;
        }

        // Create enhanced submission object with fetched data
        const enhancedSubmission = {
          ...submissionData,
          ambassador_data: ambassador,
          quest_data: quest,
          computed: {
            ambassador_name: ambassadorName,
            quest_name: questName,
            quest_description: questDescription,
            is_unread: isUnread,
            task_count: taskCount,
            status_config: statusConfig,
          },
        };

        setSelectedSubmission(enhancedSubmission);

        // Mark as read when selected (only if unread)
        if (isUnread) {
          try {
            await apiRequest(
              `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionData.submission_id}/read-by-admin`,
              { method: "PATCH" },
            );

            // Update local state optimistically
            setSubmissions((prev) =>
              prev.map((sub) =>
                sub.submission_id === submissionData.submission_id
                  ? { ...sub, is_read_by_admin: "true" }
                  : sub,
              ),
            );
          } catch (error) {
            console.error("Failed to mark submission as read:", error);
            // Note: We don't revert the selection on read failure
          }
        }
      },
      [
        selectedSubmission?.submission_id,
        loading,
        ambassador,
        quest,
        ambassadorName,
        questName,
        questDescription,
        isUnread,
        taskCount,
        statusConfig,
        setSelectedSubmission,
        setSubmissions,
      ],
    );

    const handlePress = useCallback(() => {
      handleSelectSubmission(submission);
    }, [handleSelectSubmission, submission]);

    if (loading) {
      return <SubmissionItemLoader />;
    }

    return (
      <Card
        isPressable={!loading}
        onPress={handlePress}
        className={`mb-2 w-full border border-l-5 transition-all duration-200 ${statusConfig.borderColor} ${
          isSelected
            ? "scale-[1.02] ring-1 ring-white"
            : isUnread
              ? "bg-content2 font-medium shadow-md"
              : "bg-content1 hover:bg-content2"
        } ${loading ? "pointer-events-none opacity-50" : ""}`}
      >
        <CardBody className="p-4">
          <div className="flex items-start gap-4">
            <Checkbox
              size="sm"
              color="primary"
              isDisabled={loading}
              isSelected={isSelected}
              className="mt-1 flex-shrink-0 pr-0 pt-0"
              aria-label={`Select submission from ${ambassadorName}`}
            />

            <Avatar
              size="sm"
              isBordered={isUnread}
              className="flex-shrink-0"
              color={isUnread ? "primary" : "default"}
              name={ambassadorName?.charAt(0)?.toUpperCase() || "A"}
              src={ambassador?.avatar_url || ambassador?.profile_picture}
              showFallback
            />

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      isUnread ? "text-foreground" : "text-foreground-600"
                    }`}
                  >
                    {ambassadorName}
                  </span>

                  <span className="text-xs text-foreground-400">submitted</span>

                  <div className="flex items-center gap-1 text-xs text-foreground-500">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{getTimeAgo(submission.submitted_at)}</span>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  <StatusIcon size={16} className={statusConfig.color} />

                  {isUnread && (
                    <EyeIcon
                      size={16}
                      className="animate-pulse text-gray-200"
                    />
                  )}
                </div>
              </div>

              <h3
                className={`mb-2 line-clamp-2 text-sm ${
                  isUnread
                    ? "font-medium text-foreground"
                    : "text-foreground-700"
                }`}
                title={questName}
              >
                {questName}
              </h3>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                {taskCount > 0 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="default"
                    startContent={<ListIcon className="h-3 w-3" />}
                  >
                    {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
                  </Chip>
                )}

                {submission.resubmission_count > 0 && (
                  <Chip size="sm" variant="flat" color="warning">
                    {submission.resubmission_count} Resubmission
                  </Chip>
                )}

                <Chip
                  size="sm"
                  color={statusConfig.chipColor}
                  variant="flat"
                  startContent={<StatusIcon className="h-3 w-3" />}
                >
                  {statusConfig.label}
                </Chip>

                {submission.review_status === "highlighted" && (
                  <Chip
                    size="sm"
                    color="warning"
                    variant="solid"
                    startContent={<StarIcon className="h-3 w-3" />}
                  >
                    Featured
                  </Chip>
                )}
              </div>

              {error && (
                <div className="mt-2">
                  <Chip size="sm" color="danger" variant="flat">
                    ⚠️ Failed to load complete details
                  </Chip>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  },
);

SubmissionCardItem.displayName = "SubmissionCardItem";

export default SubmissionCardItem;
