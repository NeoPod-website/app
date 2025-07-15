// // "use client";

// // import {
// //   ListIcon,
// //   StarIcon,
// //   UserIcon,
// //   CalendarIcon,
// //   ChevronLeftIcon,
// //   HighlighterIcon,
// //   ChevronRightIcon,
// //   TrashIcon,
// //   PlusIcon,
// // } from "lucide-react";
// // import { Button } from "@heroui/react";
// // import { addToast } from "@heroui/react";
// // import React, { useState, useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";

// // import MainModal from "@/components/ui/modals/MainModal";
// // import ReviewDetailsSubmissions from "@/components/layout/submissions/admin/details/ReviewDetailsSubmissions";

// // const getTimeAgo = (timestamp) => {
// //   const now = new Date();
// //   const submittedDate = new Date(timestamp);

// //   const diffInMs = now.getTime() - submittedDate.getTime();
// //   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

// //   if (diffInHours < 1) {
// //     const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
// //     return `${diffInMinutes}m ago`;
// //   } else if (diffInHours < 24) {
// //     return `${diffInHours}h ago`;
// //   } else {
// //     const diffInDays = Math.floor(diffInHours / 24);
// //     return `${diffInDays}d ago`;
// //   }
// // };

// // const HighlightSubmissionBtn = ({
// //   submission,
// //   reviewComment,
// //   onReviewSubmission,
// // }) => {
// //   const dispatch = useDispatch();
// //   const currentQuest = useSelector((state) => state.quest?.currentQuest);

// //   const [loading, setLoading] = useState(false);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [updatingHighlights, setUpdatingHighlights] = useState(false);
// //   const [fetchingSubmissions, setFetchingSubmissions] = useState(false);
// //   const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
// //   const [highlightedSubmissions, setHighlightedSubmissions] = useState([]);

// //   const highlightedSubmissionIds = currentQuest?.highlighted_submissions || [];
// //   const currentHighlightedSubmission =
// //     highlightedSubmissions[currentSubmissionIndex];
// //   const isCurrentSubmissionHighlighted = highlightedSubmissionIds.includes(
// //     submission?.submission_id,
// //   );

// //   // Fetch highlighted submissions when modal opens
// //   useEffect(() => {
// //     if (isModalOpen && highlightedSubmissionIds.length > 0) {
// //       fetchHighlightedSubmissions();
// //     }
// //   }, [isModalOpen, highlightedSubmissionIds]);

// //   const fetchHighlightedSubmissions = async () => {
// //     setFetchingSubmissions(true);
// //     try {
// //       const submissionPromises = highlightedSubmissionIds.map(
// //         async (submissionId) => {
// //           const response = await fetch(
// //             `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
// //             {
// //               credentials: "include",
// //             },
// //           );

// //           if (!response.ok) {
// //             throw new Error(`Failed to fetch submission ${submissionId}`);
// //           }

// //           const data = await response.json();
// //           return data.data?.submission || data.submission || data;
// //         },
// //       );

// //       const submissions = await Promise.all(submissionPromises);

// //       // Fetch ambassador data for each submission
// //       const enrichedSubmissions = await Promise.all(
// //         submissions.map(async (sub) => {
// //           try {
// //             const ambassadorResponse = await fetch(
// //               `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${sub.ambassador_id}`,
// //               { credentials: "include" },
// //             );

// //             if (ambassadorResponse.ok) {
// //               const ambassadorData = await ambassadorResponse.json();
// //               const ambassador =
// //                 ambassadorData?.data?.ambassador ||
// //                 ambassadorData?.ambassador ||
// //                 ambassadorData;

// //               return {
// //                 ...sub,
// //                 ambassador_data: ambassador,
// //                 quest_data: currentQuest,
// //                 computed: {
// //                   ambassador_name:
// //                     ambassador?.username ||
// //                     ambassador?.name ||
// //                     "Unknown Ambassador",
// //                   quest_name: currentQuest?.name || "Unknown Quest",
// //                   task_count: Object.keys(sub.submission_data || {}).length,
// //                 },
// //               };
// //             }

// //             return {
// //               ...sub,
// //               quest_data: currentQuest,
// //               computed: {
// //                 ambassador_name: "Unknown Ambassador",
// //                 quest_name: currentQuest?.name || "Unknown Quest",
// //                 task_count: Object.keys(sub.submission_data || {}).length,
// //               },
// //             };
// //           } catch (error) {
// //             console.error("Error fetching ambassador data:", error);
// //             return {
// //               ...sub,
// //               quest_data: currentQuest,
// //               computed: {
// //                 ambassador_name: "Unknown Ambassador",
// //                 quest_name: currentQuest?.name || "Unknown Quest",
// //                 task_count: Object.keys(sub.submission_data || {}).length,
// //               },
// //             };
// //           }
// //         }),
// //       );

// //       setHighlightedSubmissions(enrichedSubmissions);
// //     } catch (error) {
// //       console.error("Error fetching highlighted submissions:", error);
// //       addToast({
// //         title: "Error",
// //         description: "Failed to fetch highlighted submissions",
// //         color: "danger",
// //       });
// //     } finally {
// //       setFetchingSubmissions(false);
// //     }
// //   };

// //   const updateQuestHighlights = async (newHighlightedIds) => {
// //     setUpdatingHighlights(true);
// //     try {
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/quests/${currentQuest.quest_id}`,
// //         {
// //           method: "PATCH",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           credentials: "include",
// //           body: JSON.stringify({
// //             highlighted_submissions: newHighlightedIds,
// //           }),
// //         },
// //       );

// //       if (!response.ok) {
// //         throw new Error("Failed to update quest highlights");
// //       }

// //       // Update Redux store or trigger refetch
// //       // You might need to dispatch an action here to update the quest in your store

// //       return true;
// //     } catch (error) {
// //       console.error("Error updating quest highlights:", error);
// //       addToast({
// //         title: "Error",
// //         description: "Failed to update highlighted submissions",
// //         color: "danger",
// //       });
// //       return false;
// //     } finally {
// //       setUpdatingHighlights(false);
// //     }
// //   };

// //   const handleHighlight = async () => {
// //     if (highlightedSubmissionIds.length >= 3) {
// //       addToast({
// //         title: "Limit Reached",
// //         description: "You can only highlight up to 3 submissions per quest",
// //         color: "warning",
// //       });
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       // First, highlight the submission (change its status)
// //       await onReviewSubmission(
// //         "highlighted",
// //         reviewComment,
// //         currentQuest?.rewards,
// //       );

// //       // Then, add to quest's highlighted_submissions array
// //       const newHighlightedIds = [
// //         ...highlightedSubmissionIds,
// //         submission.submission_id,
// //       ];
// //       const success = await updateQuestHighlights(newHighlightedIds);

// //       if (success) {
// //         addToast({
// //           title: "Submission highlighted successfully",
// //           color: "success",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error highlighting submission:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleRemoveHighlight = async (submissionIdToRemove) => {
// //     const newHighlightedIds = highlightedSubmissionIds.filter(
// //       (id) => id !== submissionIdToRemove,
// //     );
// //     const success = await updateQuestHighlights(newHighlightedIds);

// //     if (success) {
// //       // Update local state
// //       setHighlightedSubmissions((prev) =>
// //         prev.filter((sub) => sub.submission_id !== submissionIdToRemove),
// //       );

// //       // Adjust current index if necessary
// //       if (currentSubmissionIndex >= newHighlightedIds.length) {
// //         setCurrentSubmissionIndex(Math.max(0, newHighlightedIds.length - 1));
// //       }

// //       addToast({
// //         title: "Highlight removed successfully",
// //         color: "success",
// //       });

// //       // Close modal if no more highlights
// //       if (newHighlightedIds.length === 0) {
// //         handleCloseModal();
// //       }
// //     }
// //   };

// //   const handleAddCurrentSubmission = async () => {
// //     if (highlightedSubmissionIds.length >= 3) {
// //       addToast({
// //         title: "Limit Reached",
// //         description: "You can only highlight up to 3 submissions per quest",
// //         color: "warning",
// //       });

// //       return;
// //     }

// //     if (isCurrentSubmissionHighlighted) {
// //       addToast({
// //         title: "Already Highlighted",
// //         description: "This submission is already highlighted",
// //         color: "warning",
// //       });

// //       return;
// //     }

// //     const newHighlightedIds = [
// //       ...highlightedSubmissionIds,
// //       submission.submission_id,
// //     ];
// //     const success = await updateQuestHighlights(newHighlightedIds);

// //     if (success) {
// //       // Also highlight the submission if it's pending
// //       if (submission.review_status === "pending") {
// //         try {
// //           await onReviewSubmission(
// //             "highlighted",
// //             reviewComment,
// //             currentQuest?.rewards,
// //           );
// //         } catch (error) {
// //           console.error("Error changing submission status:", error);
// //         }
// //       }

// //       addToast({
// //         title: "Submission added to highlights",
// //         color: "success",
// //       });

// //       // Close modal and refresh
// //       handleCloseModal();
// //     }
// //   };

// //   const handleViewHighlighted = () => {
// //     setIsModalOpen(true);
// //     setCurrentSubmissionIndex(0);
// //   };

// //   const handleCloseModal = () => {
// //     setIsModalOpen(false);
// //     setHighlightedSubmissions([]);
// //     setCurrentSubmissionIndex(0);
// //   };

// //   const handlePrevious = () => {
// //     setCurrentSubmissionIndex((prev) =>
// //       prev > 0 ? prev - 1 : highlightedSubmissions.length - 1,
// //     );
// //   };

// //   const handleNext = () => {
// //     setCurrentSubmissionIndex((prev) =>
// //       prev < highlightedSubmissions.length - 1 ? prev + 1 : 0,
// //     );
// //   };

// //   const modalFooter = (
// //     <div className="flex w-full items-center justify-between">
// //       <div className="flex items-center gap-2">
// //         {highlightedSubmissions.length > 1 && (
// //           <>
// //             <button
// //               onClick={handlePrevious}
// //               disabled={updatingHighlights}
// //               className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
// //             >
// //               <ChevronLeftIcon size={16} />
// //               Previous
// //             </button>

// //             <div className="flex items-center gap-1">
// //               {highlightedSubmissions.map((_, index) => (
// //                 <button
// //                   key={index}
// //                   onClick={() => setCurrentSubmissionIndex(index)}
// //                   disabled={updatingHighlights}
// //                   className={`h-8 w-8 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
// //                     index === currentSubmissionIndex
// //                       ? "bg-yellow-500 text-black"
// //                       : "bg-gray-700 text-white hover:bg-gray-600"
// //                   }`}
// //                 >
// //                   {index + 1}
// //                 </button>
// //               ))}
// //             </div>

// //             <button
// //               onClick={handleNext}
// //               disabled={updatingHighlights}
// //               className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
// //             >
// //               Next
// //               <ChevronRightIcon size={16} />
// //             </button>
// //           </>
// //         )}
// //       </div>

// //       <div className="flex items-center gap-2">
// //         {currentHighlightedSubmission && (
// //           <button
// //             onClick={() =>
// //               handleRemoveHighlight(currentHighlightedSubmission.submission_id)
// //             }
// //             disabled={updatingHighlights}
// //             className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
// //           >
// //             <TrashIcon size={16} />
// //             Remove Highlight
// //           </button>
// //         )}

// //         {!isCurrentSubmissionHighlighted &&
// //           highlightedSubmissionIds.length < 3 && (
// //             <button
// //               onClick={handleAddCurrentSubmission}
// //               disabled={updatingHighlights}
// //               className="flex items-center gap-1 rounded-lg bg-yellow-600 px-3 py-2 text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
// //             >
// //               <PlusIcon size={16} />
// //               Add Current
// //             </button>
// //           )}

// //         <button
// //           onClick={handleCloseModal}
// //           disabled={updatingHighlights}
// //           className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
// //         >
// //           Close
// //         </button>
// //       </div>
// //     </div>
// //   );

// //   // Show different buttons based on state
// //   const renderButtons = () => {
// //     if (highlightedSubmissionIds.length === 0) {
// //       // No highlights exist - show highlight button for pending submissions
// //       if (submission.review_status === "pending") {
// //         return (
// //           <Button
// //             size="lg"
// //             radius="full"
// //             disabled={loading}
// //             onPress={handleHighlight}
// //             endContent={<HighlighterIcon size={16} />}
// //             className="neo-button border border-gray-400 bg-gradient-dark hover:bg-gray-700"
// //           >
// //             {loading ? "Highlighting..." : "Highlight"}
// //           </Button>
// //         );
// //       }
// //       return null;
// //     }

// //     // Highlights exist - show view button and optionally highlight button
// //     return (
// //       <div className="flex items-center gap-2">
// //         {submission.review_status === "pending" &&
// //           !isCurrentSubmissionHighlighted &&
// //           highlightedSubmissionIds.length < 3 && (
// //             <Button
// //               size="lg"
// //               radius="full"
// //               disabled={loading}
// //               onPress={handleHighlight}
// //               endContent={<HighlighterIcon size={16} />}
// //               className="neo-button border border-gray-400 bg-gradient-dark hover:bg-gray-700"
// //             >
// //               {loading ? "Highlighting..." : "Highlight"}
// //             </Button>
// //           )}

// //         <Button
// //           size="lg"
// //           radius="full"
// //           variant="flat"
// //           onPress={handleViewHighlighted}
// //           startContent={<StarIcon size={16} />}
// //           className="border border-yellow-500/50 bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30"
// //         >
// //           View Highlighted ({highlightedSubmissionIds.length})
// //         </Button>
// //       </div>
// //     );
// //   };

// //   return (
// //     <>
// //       {renderButtons()}

// //       <MainModal
// //         title="Highlighted Submissions"
// //         description={`Viewing highlighted submissions for "${currentQuest?.name || "this quest"}"`}
// //         isOpen={isModalOpen}
// //         handleOnClose={handleCloseModal}
// //         showFooter={true}
// //         footer={modalFooter}
// //         size="4xl"
// //       >
// //         {fetchingSubmissions ? (
// //           <div className="flex items-center justify-center py-12">
// //             <div className="text-center">
// //               <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>

// //               <p className="text-gray-400">
// //                 Loading highlighted submissions...
// //               </p>
// //             </div>
// //           </div>
// //         ) : highlightedSubmissions.length === 0 ? (
// //           <div className="py-12 text-center">
// //             <StarIcon className="mx-auto mb-4 h-12 w-12 text-gray-500 opacity-50" />
// //             <p className="text-gray-400">No highlighted submissions found</p>
// //           </div>
// //         ) : (
// //           <div className="space-y-6">
// //             <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-800 p-4">
// //               <div className="flex items-center gap-4">
// //                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
// //                   <UserIcon size={20} className="text-yellow-400" />
// //                 </div>

// //                 <div>
// //                   <h3 className="font-semibold text-white">
// //                     {currentHighlightedSubmission?.computed?.ambassador_name}
// //                   </h3>

// //                   <div className="flex items-center gap-2 text-sm text-gray-400">
// //                     <CalendarIcon size={14} />

// //                     <span>
// //                       Submitted{" "}
// //                       {getTimeAgo(currentHighlightedSubmission?.submitted_at)}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="flex items-center gap-2">
// //                 <div className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
// //                   <StarIcon size={14} />
// //                   Highlighted
// //                 </div>

// //                 <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
// //                   <ListIcon size={14} />
// //                   {currentHighlightedSubmission?.computed?.task_count} Tasks
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="rounded-lg border border-gray-600 bg-gray-800/50">
// //               {currentHighlightedSubmission && (
// //                 <ReviewDetailsSubmissions
// //                   submission={currentHighlightedSubmission}
// //                 />
// //               )}
// //             </div>

// //             {highlightedSubmissions.length > 1 && (
// //               <div className="text-center text-sm text-gray-400">
// //                 Showing submission {currentSubmissionIndex + 1} of{" "}
// //                 {highlightedSubmissions.length}
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </MainModal>
// //     </>
// //   );
// // };

// // export default HighlightSubmissionBtn;

// "use client";

// import {
//   ListIcon,
//   StarIcon,
//   UserIcon,
//   CalendarIcon,
//   ChevronLeftIcon,
//   HighlighterIcon,
//   ChevronRightIcon,
//   TrashIcon,
//   PlusIcon,
// } from "lucide-react";
// import { Button } from "@heroui/react";
// import { addToast } from "@heroui/react";
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";

// import MainModal from "@/components/ui/modals/MainModal";
// import ReviewDetailsSubmissions from "@/components/layout/submissions/admin/details/ReviewDetailsSubmissions";

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

// const HighlightSubmissionBtn = ({
//   submission,
//   reviewComment,
//   onReviewSubmission,
// }) => {
//   const currentQuest = useSelector((state) => state.quest?.currentQuest);

//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [updatingHighlights, setUpdatingHighlights] = useState(false);
//   const [fetchingSubmissions, setFetchingSubmissions] = useState(false);
//   const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
//   const [highlightedSubmissions, setHighlightedSubmissions] = useState([]);
//   const [questHighlights, setQuestHighlights] = useState(
//     currentQuest?.highlighted_submissions || [],
//   );

//   const currentHighlightedSubmission =
//     highlightedSubmissions[currentSubmissionIndex];
//   const isCurrentSubmissionHighlighted = questHighlights.includes(
//     submission?.submission_id,
//   );

//   // Update local quest highlights when Redux changes
//   useEffect(() => {
//     setQuestHighlights(currentQuest?.highlighted_submissions || []);
//   }, [currentQuest?.highlighted_submissions]);

//   // Fetch highlighted submissions when modal opens
//   useEffect(() => {
//     if (isModalOpen && questHighlights.length > 0) {
//       fetchHighlightedSubmissions();
//     }
//   }, [isModalOpen, questHighlights]);

//   const fetchHighlightedSubmissions = async () => {
//     setFetchingSubmissions(true);
//     try {
//       const submissionPromises = questHighlights.map(async (submissionId) => {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
//           { credentials: "include" },
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch submission ${submissionId}`);
//         }

//         const data = await response.json();
//         return data.data?.submission || data.submission || data;
//       });

//       const submissions = await Promise.all(submissionPromises);

//       // Fetch ambassador data for each submission
//       const enrichedSubmissions = await Promise.all(
//         submissions.map(async (sub) => {
//           try {
//             const ambassadorResponse = await fetch(
//               `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${sub.ambassador_id}`,
//               { credentials: "include" },
//             );

//             if (ambassadorResponse.ok) {
//               const ambassadorData = await ambassadorResponse.json();
//               const ambassador =
//                 ambassadorData?.data?.ambassador ||
//                 ambassadorData?.ambassador ||
//                 ambassadorData;

//               return {
//                 ...sub,
//                 ambassador_data: ambassador,
//                 quest_data: currentQuest,
//                 computed: {
//                   ambassador_name:
//                     ambassador?.username ||
//                     ambassador?.name ||
//                     "Unknown Ambassador",
//                   quest_name: currentQuest?.name || "Unknown Quest",
//                   task_count: Object.keys(sub.submission_data || {}).length,
//                 },
//               };
//             }

//             return {
//               ...sub,
//               quest_data: currentQuest,
//               computed: {
//                 ambassador_name: "Unknown Ambassador",
//                 quest_name: currentQuest?.name || "Unknown Quest",
//                 task_count: Object.keys(sub.submission_data || {}).length,
//               },
//             };
//           } catch (error) {
//             return {
//               ...sub,
//               quest_data: currentQuest,
//               computed: {
//                 ambassador_name: "Unknown Ambassador",
//                 quest_name: currentQuest?.name || "Unknown Quest",
//                 task_count: Object.keys(sub.submission_data || {}).length,
//               },
//             };
//           }
//         }),
//       );

//       setHighlightedSubmissions(enrichedSubmissions);
//     } catch (error) {
//       addToast({
//         title: "Error",
//         description: "Failed to fetch highlighted submissions",
//         color: "danger",
//       });
//     } finally {
//       setFetchingSubmissions(false);
//     }
//   };

//   const updateQuestHighlights = async (newHighlightedIds) => {
//     setUpdatingHighlights(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/quests/${currentQuest.quest_id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             highlighted_submissions: newHighlightedIds,
//           }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update quest highlights");
//       }

//       // Update local state immediately for better UX
//       setQuestHighlights(newHighlightedIds);

//       return true;
//     } catch (error) {
//       addToast({
//         title: "Error",
//         description: "Failed to update highlighted submissions",
//         color: "danger",
//       });
//       return false;
//     } finally {
//       setUpdatingHighlights(false);
//     }
//   };

//   const handleHighlight = async () => {
//     if (questHighlights.length >= 3) {
//       addToast({
//         title: "Limit Reached",
//         description: "You can only highlight up to 3 submissions per quest",
//         color: "warning",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       // First, highlight the submission (change its status)
//       await onReviewSubmission(
//         "highlighted",
//         reviewComment,
//         currentQuest?.rewards,
//       );

//       // Then, add to quest's highlighted_submissions array
//       const newHighlightedIds = [...questHighlights, submission.submission_id];
//       await updateQuestHighlights(newHighlightedIds);

//       addToast({
//         title: "Submission highlighted successfully",
//         color: "success",
//       });
//     } catch (error) {
//       addToast({
//         title: "Error",
//         description: "Failed to highlight submission",
//         color: "danger",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const revertSubmissionStatus = async (submissionId) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             review_status: "pending",
//             review_comment: "Reverted from highlighted to pending",
//           }),
//         },
//       );

//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   const handleRemoveHighlight = async (submissionIdToRemove) => {
//     setUpdatingHighlights(true);

//     try {
//       // First revert the submission status
//       const statusReverted = await revertSubmissionStatus(submissionIdToRemove);
//       if (!statusReverted) {
//         addToast({
//           title: "Error",
//           description: "Failed to revert submission status",
//           color: "danger",
//         });
//         return;
//       }

//       // Then update quest highlights
//       const newHighlightedIds = questHighlights.filter(
//         (id) => id !== submissionIdToRemove,
//       );
//       const success = await updateQuestHighlights(newHighlightedIds);

//       if (success) {
//         // Update local state
//         setHighlightedSubmissions((prev) =>
//           prev.filter((sub) => sub.submission_id !== submissionIdToRemove),
//         );

//         // Adjust current index if necessary
//         if (currentSubmissionIndex >= newHighlightedIds.length) {
//           setCurrentSubmissionIndex(Math.max(0, newHighlightedIds.length - 1));
//         }

//         addToast({
//           title: "Highlight removed successfully",
//           color: "success",
//         });

//         // Close modal if no more highlights
//         if (newHighlightedIds.length === 0) {
//           handleCloseModal();
//         }
//       }
//     } catch (error) {
//       addToast({
//         title: "Error",
//         description: "Failed to remove highlight",
//         color: "danger",
//       });
//     } finally {
//       setUpdatingHighlights(false);
//     }
//   };

//   const handleAddCurrentSubmission = async () => {
//     if (questHighlights.length >= 3) {
//       addToast({
//         title: "Limit Reached",
//         description: "You can only highlight up to 3 submissions per quest",
//         color: "warning",
//       });
//       return;
//     }

//     if (isCurrentSubmissionHighlighted) {
//       addToast({
//         title: "Already Highlighted",
//         description: "This submission is already highlighted",
//         color: "warning",
//       });
//       return;
//     }

//     setUpdatingHighlights(true);
//     try {
//       // First add to quest highlights
//       const newHighlightedIds = [...questHighlights, submission.submission_id];
//       const success = await updateQuestHighlights(newHighlightedIds);

//       if (success) {
//         // Also highlight the submission if it's pending
//         if (submission.review_status === "pending") {
//           try {
//             await onReviewSubmission(
//               "highlighted",
//               reviewComment,
//               currentQuest?.rewards,
//             );
//           } catch (error) {
//             console.error("Error changing submission status:", error);
//           }
//         }

//         addToast({
//           title: "Submission added to highlights",
//           color: "success",
//         });

//         // Close modal
//         handleCloseModal();
//       }
//     } catch (error) {
//       addToast({
//         title: "Error",
//         description: "Failed to add submission to highlights",
//         color: "danger",
//       });
//     } finally {
//       setUpdatingHighlights(false);
//     }
//   };

//   const handleViewHighlighted = () => {
//     setIsModalOpen(true);
//     setCurrentSubmissionIndex(0);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setHighlightedSubmissions([]);
//     setCurrentSubmissionIndex(0);
//   };

//   const handlePrevious = () => {
//     setCurrentSubmissionIndex((prev) =>
//       prev > 0 ? prev - 1 : highlightedSubmissions.length - 1,
//     );
//   };

//   const handleNext = () => {
//     setCurrentSubmissionIndex((prev) =>
//       prev < highlightedSubmissions.length - 1 ? prev + 1 : 0,
//     );
//   };

//   const modalFooter = (
//     <div className="flex w-full items-center justify-between">
//       <div className="flex items-center gap-2">
//         {highlightedSubmissions.length > 1 && (
//           <>
//             <button
//               onClick={handlePrevious}
//               disabled={updatingHighlights}
//               className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
//             >
//               <ChevronLeftIcon size={16} />
//               Previous
//             </button>

//             <div className="flex items-center gap-1">
//               {highlightedSubmissions.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSubmissionIndex(index)}
//                   disabled={updatingHighlights}
//                   className={`h-8 w-8 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
//                     index === currentSubmissionIndex
//                       ? "bg-yellow-500 text-black"
//                       : "bg-gray-700 text-white hover:bg-gray-600"
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={handleNext}
//               disabled={updatingHighlights}
//               className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
//             >
//               Next
//               <ChevronRightIcon size={16} />
//             </button>
//           </>
//         )}
//       </div>

//       <div className="flex items-center gap-2">
//         {currentHighlightedSubmission && (
//           <button
//             onClick={() =>
//               handleRemoveHighlight(currentHighlightedSubmission.submission_id)
//             }
//             disabled={updatingHighlights}
//             className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
//           >
//             <TrashIcon size={16} />
//             {updatingHighlights ? "Removing..." : "Remove Highlight"}
//           </button>
//         )}

//         {!isCurrentSubmissionHighlighted && questHighlights.length < 3 && (
//           <button
//             onClick={handleAddCurrentSubmission}
//             disabled={updatingHighlights}
//             className="flex items-center gap-1 rounded-lg bg-yellow-600 px-3 py-2 text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
//           >
//             <PlusIcon size={16} />
//             {updatingHighlights ? "Adding..." : "Add Current"}
//           </button>
//         )}

//         <button
//           onClick={handleCloseModal}
//           disabled={updatingHighlights}
//           className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );

//   // Show different buttons based on state
//   const renderButtons = () => {
//     // Always show highlight button for pending submissions
//     const showHighlightButton =
//       submission.review_status === "pending" &&
//       !isCurrentSubmissionHighlighted &&
//       questHighlights.length < 3;

//     // Always show view button if highlights exist
//     const showViewButton = questHighlights.length > 0;

//     if (!showHighlightButton && !showViewButton) {
//       return null;
//     }

//     return (
//       <div className="flex items-center gap-2">
//         {showHighlightButton && (
//           <Button
//             size="lg"
//             radius="full"
//             disabled={loading}
//             onPress={handleHighlight}
//             endContent={<HighlighterIcon size={16} />}
//             className="neo-button border border-gray-400 bg-gradient-dark hover:bg-gray-700"
//           >
//             {loading ? "Highlighting..." : "Highlight"}
//           </Button>
//         )}

//         {showViewButton && (
//           <Button
//             size="lg"
//             radius="full"
//             variant="flat"
//             onPress={handleViewHighlighted}
//             startContent={<StarIcon size={16} />}
//             className="border border-yellow-500/50 bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30"
//           >
//             View Highlighted ({questHighlights.length})
//           </Button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {renderButtons()}

//       <MainModal
//         title="Highlighted Submissions"
//         description={`Viewing highlighted submissions for "${currentQuest?.name || "this quest"}"`}
//         isOpen={isModalOpen}
//         handleOnClose={handleCloseModal}
//         showFooter={true}
//         footer={modalFooter}
//         size="4xl"
//       >
//         {fetchingSubmissions ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
//               <p className="text-gray-400">
//                 Loading highlighted submissions...
//               </p>
//             </div>
//           </div>
//         ) : highlightedSubmissions.length === 0 ? (
//           <div className="py-12 text-center">
//             <StarIcon className="mx-auto mb-4 h-12 w-12 text-gray-500 opacity-50" />
//             <p className="text-gray-400">No highlighted submissions found</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-800 p-4">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
//                   <UserIcon size={20} className="text-yellow-400" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">
//                     {currentHighlightedSubmission?.computed?.ambassador_name}
//                   </h3>
//                   <div className="flex items-center gap-2 text-sm text-gray-400">
//                     <CalendarIcon size={14} />
//                     <span>
//                       Submitted{" "}
//                       {getTimeAgo(currentHighlightedSubmission?.submitted_at)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
//                   <StarIcon size={14} />
//                   Highlighted
//                 </div>
//                 <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
//                   <ListIcon size={14} />
//                   {currentHighlightedSubmission?.computed?.task_count} Tasks
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border border-gray-600 bg-gray-800/50">
//               {currentHighlightedSubmission && (
//                 <ReviewDetailsSubmissions
//                   submission={currentHighlightedSubmission}
//                 />
//               )}
//             </div>

//             {highlightedSubmissions.length > 1 && (
//               <div className="text-center text-sm text-gray-400">
//                 Showing submission {currentSubmissionIndex + 1} of{" "}
//                 {highlightedSubmissions.length}
//               </div>
//             )}
//           </div>
//         )}
//       </MainModal>
//     </>
//   );
// };

// export default HighlightSubmissionBtn;

// "use client";

// import {
//   ListIcon,
//   StarIcon,
//   UserIcon,
//   CalendarIcon,
//   ChevronLeftIcon,
//   HighlighterIcon,
//   ChevronRightIcon,
//   TrashIcon,
//   PlusIcon,
// } from "lucide-react";
// import { Button } from "@heroui/react";
// import { addToast } from "@heroui/react";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";

// import MainModal from "@/components/ui/modals/MainModal";
// import ReviewDetailsSubmissions from "@/components/layout/submissions/admin/details/ReviewDetailsSubmissions";
// import {
//   addHighlightedSubmission,
//   removeHighlightedSubmission,
//   setHighlightedSubmissionsData,
//   updateHighlightedSubmissionData,
// } from "@/redux/slice/questSlice";

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

// const HighlightSubmissionBtn = ({
//   submission,
//   reviewComment,
//   onReviewSubmission,
// }) => {
//   const dispatch = useDispatch();

//   // Get data from Redux instead of local state
//   const currentQuest = useSelector((state) => state.quest?.currentQuest);
//   const questHighlights = useSelector(
//     (state) => state.quest?.currentQuest?.highlighted_submissions || [],
//   );
//   const highlightedSubmissionsData = useSelector(
//     (state) => state.quest?.highlightedSubmissionsData || [],
//   );

//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [updatingHighlights, setUpdatingHighlights] = useState(false);
//   const [fetchingSubmissions, setFetchingSubmissions] = useState(false);
//   const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);

//   const currentHighlightedSubmission =
//     highlightedSubmissionsData[currentSubmissionIndex];
//   const isCurrentSubmissionHighlighted = questHighlights.includes(
//     submission?.submission_id,
//   );

//   // Fetch highlighted submissions when modal opens or when highlight IDs change
//   useEffect(() => {
//     if (isModalOpen && questHighlights.length > 0) {
//       // Check if we need to fetch data (missing submissions in cache)
//       const missingSubmissions = questHighlights.filter(
//         (id) =>
//           !highlightedSubmissionsData.find((sub) => sub.submission_id === id),
//       );

//       if (
//         missingSubmissions.length > 0 ||
//         highlightedSubmissionsData.length === 0
//       ) {
//         fetchHighlightedSubmissions();
//       }
//     }
//   }, [isModalOpen, questHighlights, highlightedSubmissionsData]);

//   const fetchHighlightedSubmissions = useCallback(async () => {
//     if (questHighlights.length === 0) return;

//     setFetchingSubmissions(true);
//     try {
//       const submissionPromises = questHighlights.map(async (submissionId) => {
//         // Check if we already have this submission in cache
//         const cachedSubmission = highlightedSubmissionsData.find(
//           (sub) => sub.submission_id === submissionId,
//         );

//         if (cachedSubmission) {
//           return cachedSubmission;
//         }

//         // Fetch submission if not in cache
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
//           { credentials: "include" },
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to fetch submission ${submissionId}`);
//         }

//         const data = await response.json();
//         return data.data?.submission || data.submission || data;
//       });

//       const submissions = await Promise.all(submissionPromises);

//       // Fetch ambassador data for new submissions
//       const enrichedSubmissions = await Promise.all(
//         submissions.map(async (sub) => {
//           // If already enriched, return as is
//           if (sub.ambassador_data && sub.computed) {
//             return sub;
//           }

//           try {
//             const ambassadorResponse = await fetch(
//               `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${sub.ambassador_id}`,
//               { credentials: "include" },
//             );

//             let ambassador = null;
//             if (ambassadorResponse.ok) {
//               const ambassadorData = await ambassadorResponse.json();
//               ambassador =
//                 ambassadorData?.data?.ambassador ||
//                 ambassadorData?.ambassador ||
//                 ambassadorData;
//             }

//             return {
//               ...sub,
//               ambassador_data: ambassador,
//               quest_data: currentQuest,
//               computed: {
//                 ambassador_name:
//                   ambassador?.username ||
//                   ambassador?.name ||
//                   "Unknown Ambassador",
//                 quest_name: currentQuest?.name || "Unknown Quest",
//                 task_count: Object.keys(sub.submission_data || {}).length,
//               },
//             };
//           } catch (error) {
//             console.error(
//               `Error enriching submission ${sub.submission_id}:`,
//               error,
//             );
//             return {
//               ...sub,
//               quest_data: currentQuest,
//               computed: {
//                 ambassador_name: "Unknown Ambassador",
//                 quest_name: currentQuest?.name || "Unknown Quest",
//                 task_count: Object.keys(sub.submission_data || {}).length,
//               },
//             };
//           }
//         }),
//       );

//       // Update Redux cache
//       dispatch(setHighlightedSubmissionsData(enrichedSubmissions));
//     } catch (error) {
//       console.error("Error fetching highlighted submissions:", error);
//       addToast({
//         title: "Error",
//         description: "Failed to fetch highlighted submissions",
//         color: "danger",
//       });
//     } finally {
//       setFetchingSubmissions(false);
//     }
//   }, [questHighlights, highlightedSubmissionsData, currentQuest, dispatch]);

//   const updateQuestHighlights = async (newHighlightedIds) => {
//     setUpdatingHighlights(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/quests/${currentQuest.quest_id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             highlighted_submissions: newHighlightedIds,
//           }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update quest highlights");
//       }

//       return true;
//     } catch (error) {
//       console.error("Error updating quest highlights:", error);
//       addToast({
//         title: "Error",
//         description: "Failed to update highlighted submissions",
//         color: "danger",
//       });
//       return false;
//     } finally {
//       setUpdatingHighlights(false);
//     }
//   };

//   const handleHighlight = async () => {
//     if (questHighlights.length >= 3) {
//       addToast({
//         title: "Limit Reached",
//         description: "You can only highlight up to 3 submissions per quest",
//         color: "warning",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       // First, highlight the submission (change its status)
//       await onReviewSubmission(
//         "highlighted",
//         reviewComment,
//         currentQuest?.rewards,
//       );

//       // Then, update Redux and API
//       const newHighlightedIds = [...questHighlights, submission.submission_id];

//       // Update Redux first for immediate UI feedback
//       dispatch(addHighlightedSubmission(submission.submission_id));

//       // Then sync with API
//       await updateQuestHighlights(newHighlightedIds);

//       addToast({
//         title: "Submission highlighted successfully",
//         color: "success",
//       });
//     } catch (error) {
//       // Rollback Redux changes if API fails
//       dispatch(removeHighlightedSubmission(submission.submission_id));
//       addToast({
//         title: "Error",
//         description: "Failed to highlight submission",
//         color: "danger",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const revertSubmissionStatus = async (submissionId) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             review_status: "pending",
//             review_comment: "Reverted from highlighted to pending",
//           }),
//         },
//       );

//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   const handleRemoveHighlight = async (submissionIdToRemove) => {
//     setUpdatingHighlights(true);

//     try {
//       // First revert the submission status
//       const statusReverted = await revertSubmissionStatus(submissionIdToRemove);
//       if (!statusReverted) {
//         addToast({
//           title: "Error",
//           description: "Failed to revert submission status",
//           color: "danger",
//         });
//         return;
//       }

//       // Update Redux first for immediate UI feedback
//       dispatch(removeHighlightedSubmission(submissionIdToRemove));

//       // Then sync with API
//       const newHighlightedIds = questHighlights.filter(
//         (id) => id !== submissionIdToRemove,
//       );
//       const success = await updateQuestHighlights(newHighlightedIds);

//       if (success) {
//         // Adjust current index if necessary
//         if (currentSubmissionIndex >= newHighlightedIds.length) {
//           setCurrentSubmissionIndex(Math.max(0, newHighlightedIds.length - 1));
//         }

//         addToast({
//           title: "Highlight removed successfully",
//           color: "success",
//         });

//         // Close modal if no more highlights
//         if (newHighlightedIds.length === 0) {
//           handleCloseModal();
//         }
//       } else {
//         // Rollback Redux changes if API fails
//         dispatch(addHighlightedSubmission(submissionIdToRemove));
//       }
//     } catch (error) {
//       // Rollback Redux changes
//       dispatch(addHighlightedSubmission(submissionIdToRemove));
//       addToast({
//         title: "Error",
//         description: "Failed to remove highlight",
//         color: "danger",
//       });
//     } finally {
//       setUpdatingHighlights(false);
//     }
//   };

//   const handleAddCurrentSubmission = async () => {
//     if (questHighlights.length >= 3) {
//       addToast({
//         title: "Limit Reached",
//         description: "You can only highlight up to 3 submissions per quest",
//         color: "warning",
//       });
//       return;
//     }

//     if (isCurrentSubmissionHighlighted) {
//       addToast({
//         title: "Already Highlighted",
//         description: "This submission is already highlighted",
//         color: "warning",
//       });
//       return;
//     }

//     setUpdatingHighlights(true);
//     try {
//       // Update Redux first for immediate UI feedback
//       dispatch(addHighlightedSubmission(submission.submission_id));

//       // Sync with API
//       const newHighlightedIds = [...questHighlights, submission.submission_id];
//       const success = await updateQuestHighlights(newHighlightedIds);

//       if (success) {
//         // Also highlight the submission if it's pending
//         if (submission.review_status === "pending") {
//           try {
//             await onReviewSubmission(
//               "highlighted",
//               reviewComment,
//               currentQuest?.rewards,
//             );
//           } catch (error) {
//             console.error("Error changing submission status:", error);
//           }
//         }

//         addToast({
//           title: "Submission added to highlights",
//           color: "success",
//         });

//         // Close modal
//         handleCloseModal();
//       } else {
//         // Rollback Redux changes if API fails
//         dispatch(removeHighlightedSubmission(submission.submission_id));
//       }
//     } catch (error) {
//       // Rollback Redux changes
//       dispatch(removeHighlightedSubmission(submission.submission_id));
//       addToast({
//         title: "Error",
//         description: "Failed to add submission to highlights",
//         color: "danger",
//       });
//     } finally {
//       setUpdatingHighlights(false);
//     }
//   };

//   const handleViewHighlighted = () => {
//     setIsModalOpen(true);
//     setCurrentSubmissionIndex(0);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setCurrentSubmissionIndex(0);
//   };

//   const handlePrevious = () => {
//     setCurrentSubmissionIndex((prev) =>
//       prev > 0 ? prev - 1 : highlightedSubmissionsData.length - 1,
//     );
//   };

//   const handleNext = () => {
//     setCurrentSubmissionIndex((prev) =>
//       prev < highlightedSubmissionsData.length - 1 ? prev + 1 : 0,
//     );
//   };

//   // Rest of your component remains the same...
//   const modalFooter = (
//     <div className="flex w-full items-center justify-between">
//       <div className="flex items-center gap-2">
//         {highlightedSubmissionsData.length > 1 && (
//           <>
//             <button
//               onClick={handlePrevious}
//               disabled={updatingHighlights}
//               className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
//             >
//               <ChevronLeftIcon size={16} />
//               Previous
//             </button>

//             <div className="flex items-center gap-1">
//               {highlightedSubmissionsData.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSubmissionIndex(index)}
//                   disabled={updatingHighlights}
//                   className={`h-8 w-8 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
//                     index === currentSubmissionIndex
//                       ? "bg-yellow-500 text-black"
//                       : "bg-gray-700 text-white hover:bg-gray-600"
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={handleNext}
//               disabled={updatingHighlights}
//               className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
//             >
//               Next
//               <ChevronRightIcon size={16} />
//             </button>
//           </>
//         )}
//       </div>

//       <div className="flex items-center gap-2">
//         {currentHighlightedSubmission && (
//           <button
//             onClick={() =>
//               handleRemoveHighlight(currentHighlightedSubmission.submission_id)
//             }
//             disabled={updatingHighlights}
//             className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
//           >
//             <TrashIcon size={16} />
//             {updatingHighlights ? "Removing..." : "Remove Highlight"}
//           </button>
//         )}

//         {!isCurrentSubmissionHighlighted && questHighlights.length < 3 && (
//           <button
//             onClick={handleAddCurrentSubmission}
//             disabled={updatingHighlights}
//             className="flex items-center gap-1 rounded-lg bg-yellow-600 px-3 py-2 text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
//           >
//             <PlusIcon size={16} />
//             {updatingHighlights ? "Adding..." : "Add Current"}
//           </button>
//         )}

//         <button
//           onClick={handleCloseModal}
//           disabled={updatingHighlights}
//           className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );

//   // Show different buttons based on state
//   const renderButtons = () => {
//     const showHighlightButton =
//       submission.review_status === "pending" &&
//       !isCurrentSubmissionHighlighted &&
//       questHighlights.length < 3;

//     const showViewButton = questHighlights.length > 0;

//     if (!showHighlightButton && !showViewButton) {
//       return null;
//     }

//     return (
//       <div className="flex items-center gap-2">
//         {showHighlightButton && (
//           <Button
//             size="lg"
//             radius="full"
//             disabled={loading}
//             onPress={handleHighlight}
//             endContent={<HighlighterIcon size={16} />}
//             className="neo-button border border-gray-400 bg-gradient-dark hover:bg-gray-700"
//           >
//             {loading ? "Highlighting..." : "Highlight"}
//           </Button>
//         )}

//         {showViewButton && (
//           <Button
//             size="lg"
//             radius="full"
//             variant="flat"
//             onPress={handleViewHighlighted}
//             startContent={<StarIcon size={16} />}
//             className="border border-yellow-500/50 bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30"
//           >
//             View Highlighted ({questHighlights.length})
//           </Button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {renderButtons()}

//       <MainModal
//         title="Highlighted Submissions"
//         description={`Viewing highlighted submissions for "${currentQuest?.name || "this quest"}"`}
//         isOpen={isModalOpen}
//         handleOnClose={handleCloseModal}
//         showFooter={true}
//         footer={modalFooter}
//         size="4xl"
//       >
//         {fetchingSubmissions ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
//               <p className="text-gray-400">
//                 Loading highlighted submissions...
//               </p>
//             </div>
//           </div>
//         ) : highlightedSubmissionsData.length === 0 ? (
//           <div className="py-12 text-center">
//             <StarIcon className="mx-auto mb-4 h-12 w-12 text-gray-500 opacity-50" />
//             <p className="text-gray-400">No highlighted submissions found</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-800 p-4">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
//                   <UserIcon size={20} className="text-yellow-400" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">
//                     {currentHighlightedSubmission?.computed?.ambassador_name}
//                   </h3>
//                   <div className="flex items-center gap-2 text-sm text-gray-400">
//                     <CalendarIcon size={14} />
//                     <span>
//                       Submitted{" "}
//                       {getTimeAgo(currentHighlightedSubmission?.submitted_at)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
//                   <StarIcon size={14} />
//                   Highlighted
//                 </div>
//                 <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
//                   <ListIcon size={14} />
//                   {currentHighlightedSubmission?.computed?.task_count} Tasks
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border border-gray-600 bg-gray-800/50">
//               {currentHighlightedSubmission && (
//                 <ReviewDetailsSubmissions
//                   submission={currentHighlightedSubmission}
//                 />
//               )}
//             </div>

//             {highlightedSubmissionsData.length > 1 && (
//               <div className="text-center text-sm text-gray-400">
//                 Showing submission {currentSubmissionIndex + 1} of{" "}
//                 {highlightedSubmissionsData.length}
//               </div>
//             )}
//           </div>
//         )}
//       </MainModal>
//     </>
//   );
// };

// export default HighlightSubmissionBtn;

"use client";

import {
  ListIcon,
  StarIcon,
  UserIcon,
  CalendarIcon,
  ChevronLeftIcon,
  HighlighterIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import MainModal from "@/components/ui/modals/MainModal";
import ReviewDetailsSubmissions from "@/components/layout/submissions/admin/details/ReviewDetailsSubmissions";
import { setHighlightedSubmissionsData } from "@/redux/slice/questSlice";
import {
  useHighlightActions,
  createHighlightErrorHandler,
} from "@/utils/highlightActions";

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

const HighlightSubmissionBtn = ({
  submission,
  reviewComment,
  onReviewSubmission,
}) => {
  const dispatch = useDispatch();
  const highlightManager = useHighlightActions();
  const handleError = createHighlightErrorHandler(addToast);

  // Get data from Redux
  const currentQuest = useSelector((state) => state.quest?.currentQuest);
  const questHighlights = useSelector(
    (state) => state.quest?.currentQuest?.highlighted_submissions || [],
  );
  const highlightedSubmissionsData = useSelector(
    (state) => state.quest?.highlightedSubmissionsData || [],
  );

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingHighlights, setUpdatingHighlights] = useState(false);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(false);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);

  const currentHighlightedSubmission =
    highlightedSubmissionsData[currentSubmissionIndex];
  const isCurrentSubmissionHighlighted = questHighlights.includes(
    submission?.submission_id,
  );

  // Fetch highlighted submissions when modal opens or when highlight IDs change
  useEffect(() => {
    if (isModalOpen && questHighlights.length > 0) {
      const missingSubmissions = questHighlights.filter(
        (id) =>
          !highlightedSubmissionsData.find((sub) => sub.submission_id === id),
      );

      if (
        missingSubmissions.length > 0 ||
        highlightedSubmissionsData.length === 0
      ) {
        fetchHighlightedSubmissions();
      }
    }
  }, [isModalOpen, questHighlights, highlightedSubmissionsData]);

  const fetchHighlightedSubmissions = useCallback(async () => {
    if (questHighlights.length === 0) return;

    setFetchingSubmissions(true);
    try {
      const submissionPromises = questHighlights.map(async (submissionId) => {
        const cachedSubmission = highlightedSubmissionsData.find(
          (sub) => sub.submission_id === submissionId,
        );

        if (cachedSubmission) return cachedSubmission;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch submission ${submissionId}: ${response.status}`,
          );
        }

        const data = await response.json();
        return data.data?.submission || data.submission || data;
      });

      const submissions = await Promise.all(submissionPromises);

      const enrichedSubmissions = await Promise.all(
        submissions.map(async (sub) => {
          if (sub.ambassador_data && sub.computed) return sub;

          try {
            const ambassadorResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${sub.ambassador_id}`,
              { credentials: "include" },
            );

            let ambassador = null;
            if (ambassadorResponse.ok) {
              const ambassadorData = await ambassadorResponse.json();
              ambassador =
                ambassadorData?.data?.ambassador ||
                ambassadorData?.ambassador ||
                ambassadorData;
            }

            return {
              ...sub,
              ambassador_data: ambassador,
              quest_data: currentQuest,
              computed: {
                ambassador_name:
                  ambassador?.username ||
                  ambassador?.name ||
                  "Unknown Ambassador",
                quest_name: currentQuest?.name || "Unknown Quest",
                task_count: Object.keys(sub.submission_data || {}).length,
              },
            };
          } catch (error) {
            console.error(
              `Error enriching submission ${sub.submission_id}:`,
              error,
            );
            return {
              ...sub,
              quest_data: currentQuest,
              computed: {
                ambassador_name: "Unknown Ambassador",
                quest_name: currentQuest?.name || "Unknown Quest",
                task_count: Object.keys(sub.submission_data || {}).length,
              },
            };
          }
        }),
      );

      dispatch(setHighlightedSubmissionsData(enrichedSubmissions));
    } catch (error) {
      handleError(error, "fetching highlighted submissions");
    } finally {
      setFetchingSubmissions(false);
    }
  }, [questHighlights, highlightedSubmissionsData, currentQuest, dispatch]);

  const handleHighlight = async () => {
    setLoading(true);
    try {
      // First, highlight the submission (change its status)
      await onReviewSubmission(
        "highlighted",
        reviewComment,
        currentQuest?.rewards,
      );

      // Then, add to highlights using the bulletproof manager
      await highlightManager.addHighlight(submission.submission_id, true);

      addToast({
        title: "Submission highlighted successfully",
        color: "success",
      });
    } catch (error) {
      handleError(error, "highlighting submission");
    } finally {
      setLoading(false);
    }
  };

  const revertSubmissionStatus = async (submissionId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            review_status: "pending",
            review_comment: "Reverted from highlighted to pending",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to revert submission: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error reverting submission status:", error);
      return false;
    }
  };

  const handleRemoveHighlight = async (submissionIdToRemove) => {
    setUpdatingHighlights(true);

    try {
      // First revert the submission status
      const statusReverted = await revertSubmissionStatus(submissionIdToRemove);
      if (!statusReverted) {
        throw new Error("Failed to revert submission status");
      }

      // Then remove from highlights using the bulletproof manager
      await highlightManager.removeHighlight(submissionIdToRemove, true);

      // Adjust current index if necessary
      const newLength = questHighlights.length - 1;
      if (currentSubmissionIndex >= newLength) {
        setCurrentSubmissionIndex(Math.max(0, newLength - 1));
      }

      addToast({
        title: "Highlight removed successfully",
        color: "success",
      });

      // Close modal if no more highlights
      if (newLength === 0) {
        handleCloseModal();
      }
    } catch (error) {
      handleError(error, "removing highlight");
    } finally {
      setUpdatingHighlights(false);
    }
  };

  const handleAddCurrentSubmission = async () => {
    setUpdatingHighlights(true);
    try {
      // Add to highlights using the bulletproof manager
      await highlightManager.addHighlight(submission.submission_id, true);

      // Also highlight the submission if it's pending
      if (submission.review_status === "pending") {
        try {
          await onReviewSubmission(
            "highlighted",
            reviewComment,
            currentQuest?.rewards,
          );
        } catch (error) {
          console.error("Error changing submission status:", error);
        }
      }

      addToast({
        title: "Submission added to highlights",
        color: "success",
      });

      handleCloseModal();
    } catch (error) {
      handleError(error, "adding submission to highlights");
    } finally {
      setUpdatingHighlights(false);
    }
  };

  const handleViewHighlighted = () => {
    setIsModalOpen(true);
    setCurrentSubmissionIndex(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSubmissionIndex(0);
  };

  const handlePrevious = () => {
    setCurrentSubmissionIndex((prev) =>
      prev > 0 ? prev - 1 : highlightedSubmissionsData.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentSubmissionIndex((prev) =>
      prev < highlightedSubmissionsData.length - 1 ? prev + 1 : 0,
    );
  };

  // Rest of the component (modal, buttons, etc.) remains the same...
  const modalFooter = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        {highlightedSubmissionsData.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={updatingHighlights}
              className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
            >
              <ChevronLeftIcon size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {highlightedSubmissionsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSubmissionIndex(index)}
                  disabled={updatingHighlights}
                  className={`h-8 w-8 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
                    index === currentSubmissionIndex
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={updatingHighlights}
              className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
            >
              Next
              <ChevronRightIcon size={16} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {currentHighlightedSubmission && (
          <button
            onClick={() =>
              handleRemoveHighlight(currentHighlightedSubmission.submission_id)
            }
            disabled={updatingHighlights}
            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <TrashIcon size={16} />
            {updatingHighlights ? "Removing..." : "Remove Highlight"}
          </button>
        )}

        {!isCurrentSubmissionHighlighted && questHighlights.length < 3 && (
          <button
            onClick={handleAddCurrentSubmission}
            disabled={updatingHighlights}
            className="flex items-center gap-1 rounded-lg bg-yellow-600 px-3 py-2 text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
          >
            <PlusIcon size={16} />
            {updatingHighlights ? "Adding..." : "Add Current"}
          </button>
        )}

        <button
          onClick={handleCloseModal}
          disabled={updatingHighlights}
          className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderButtons = () => {
    const showHighlightButton =
      submission.review_status === "pending" &&
      !isCurrentSubmissionHighlighted &&
      questHighlights.length < 3;

    const showViewButton = questHighlights.length > 0;

    if (!showHighlightButton && !showViewButton) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        {showHighlightButton && (
          <Button
            size="lg"
            radius="full"
            disabled={loading}
            onPress={handleHighlight}
            endContent={<HighlighterIcon size={16} />}
            className="neo-button border border-gray-400 bg-gradient-dark hover:bg-gray-700"
          >
            {loading ? "Highlighting..." : "Highlight"}
          </Button>
        )}

        {showViewButton && (
          <Button
            size="lg"
            radius="full"
            variant="flat"
            onPress={handleViewHighlighted}
            startContent={<StarIcon size={16} />}
            className="border border-yellow-500/50 bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30"
          >
            View Highlighted ({questHighlights.length})
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {renderButtons()}

      <MainModal
        title="Highlighted Submissions"
        description={`Viewing highlighted submissions for "${currentQuest?.name || "this quest"}"`}
        isOpen={isModalOpen}
        handleOnClose={handleCloseModal}
        showFooter={true}
        footer={modalFooter}
        size="4xl"
      >
        {fetchingSubmissions ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
              <p className="text-gray-400">
                Loading highlighted submissions...
              </p>
            </div>
          </div>
        ) : highlightedSubmissionsData.length === 0 ? (
          <div className="py-12 text-center">
            <StarIcon className="mx-auto mb-4 h-12 w-12 text-gray-500 opacity-50" />
            <p className="text-gray-400">No highlighted submissions found</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-800 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                  <UserIcon size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {currentHighlightedSubmission?.computed?.ambassador_name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CalendarIcon size={14} />
                    <span>
                      Submitted{" "}
                      {getTimeAgo(currentHighlightedSubmission?.submitted_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
                  <StarIcon size={14} />
                  Highlighted
                </div>
                <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
                  <ListIcon size={14} />
                  {currentHighlightedSubmission?.computed?.task_count} Tasks
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-600 bg-gray-800/50">
              {currentHighlightedSubmission && (
                <ReviewDetailsSubmissions
                  submission={currentHighlightedSubmission}
                />
              )}
            </div>

            {highlightedSubmissionsData.length > 1 && (
              <div className="text-center text-sm text-gray-400">
                Showing submission {currentSubmissionIndex + 1} of{" "}
                {highlightedSubmissionsData.length}
              </div>
            )}
          </div>
        )}
      </MainModal>
    </>
  );
};

export default HighlightSubmissionBtn;
