// "use client";

// import {
//   Card,
//   Input,
//   Button,
//   Spinner,
//   CardBody,
//   addToast,
// } from "@heroui/react";
// import {
//   Clock,
//   Heart,
//   Repeat,
//   AlertCircle,
//   CheckCircle,
//   ExternalLink,
//   MessageCircle,
//   ShieldAlertIcon,
//   Link as LinkIcon,
// } from "lucide-react";
// import Link from "next/link";
// import { useSelector, useDispatch } from "react-redux";
// import React, { useState, useCallback, useEffect } from "react";

// import TweetPreviewCard from "./TweetPreviewCard";

// import {
//   updateTaskAnswer,
//   selectTaskAnswer,
// } from "@/redux/slice/submissionSlice";

// // Debounce hook
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// // Get auth token function
// const getAuthToken = () =>
//   typeof window !== "undefined"
//     ? localStorage.getItem("neo-jwt") || sessionStorage.getItem("neo-jwt")
//     : null;

// // Build headers function
// const buildHeaders = (isJson = false) => {
//   const token = getAuthToken();
//   return {
//     ...(isJson ? { "Content-Type": "application/json" } : {}),
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// // Helper functions
// const extractTweetId = (tweetUrl) => {
//   const match = tweetUrl.match(/status\/(\d+)/);
//   return match ? match[1] : null;
// };

// const isValidUrl = (string) => {
//   try {
//     new URL(string);
//     return true;
//   } catch {
//     return false;
//   }
// };

// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return "Unknown date";
//   }
// };

// // Updated API utilities
// const twitterAPI = {
//   async verifyReact(task, replyUrl = null) {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/socials/twitter/verify-react`,
//       {
//         method: "POST",
//         headers: buildHeaders(true),
//         credentials: "include",
//         body: JSON.stringify({
//           task,
//           replyUrl: replyUrl || undefined,
//         }),
//       },
//     );

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to verify interactions");
//     }

//     return response.json();
//   },
// };

// const XReactTask = ({ task, questId, userTwitterHandle }) => {
//   const dispatch = useDispatch();

//   // Redux selectors
//   const currentAnswer = useSelector((state) =>
//     selectTaskAnswer(state, questId, task.id),
//   );

//   // Check if task is completed (allow partial verification)
//   const isTaskCompleted =
//     currentAnswer &&
//     typeof currentAnswer === "object" &&
//     currentAnswer.verified === true;

//   // Local state
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [verificationResult, setVerificationResult] = useState(null);
//   const [verificationStep, setVerificationStep] = useState("actions"); // "actions", "verifying", "completed"

//   const [hasAttemptedVerification, setHasAttemptedVerification] =
//     useState(false);

//   // Reply URL state with debouncing
//   const [replyUrl, setReplyUrl] = useState("");
//   const debouncedReplyUrl = useDebounce(replyUrl, 500); // 500ms debounce

//   const tweetId = extractTweetId(task.tweetUrl);
//   const isValidReplyUrl =
//     debouncedReplyUrl &&
//     isValidUrl(debouncedReplyUrl) &&
//     extractTweetId(debouncedReplyUrl);

//   // Generate action URLs
//   const likeUrl = `https://x.com/intent/like?tweet_id=${tweetId}`;
//   const retweetUrl = `https://x.com/intent/retweet?tweet_id=${tweetId}`;
//   const replyUrl_intent = `https://x.com/intent/tweet?in_reply_to=${tweetId}`;

//   // Debounced input change handler
//   const handleReplyUrlChange = useCallback((e) => {
//     setReplyUrl(e.target.value);
//   }, []);

//   const handleVerifyInteractions = async () => {
//     if (!userTwitterHandle) {
//       addToast({
//         title: "Account Required",
//         description: "Please connect your Twitter account first",
//         color: "warning",
//       });
//       return;
//     }

//     // Check if reply URL is provided when reply is required (use debounced value)
//     if (task?.requireReply && !isValidReplyUrl) {
//       addToast({
//         title: "Reply URL Required",
//         description: "Please provide the URL of your reply tweet",
//         color: "warning",
//       });
//       return;
//     }

//     setIsVerifying(true);
//     setVerificationStep("verifying");
//     setHasAttemptedVerification(true);

//     try {
//       const result = await twitterAPI.verifyReact(
//         task,
//         task?.requireReply ? debouncedReplyUrl : null, // Use debounced value
//       );

//       setVerificationResult(result.verificationData);
//       setVerificationStep("actions"); // Stay in actions step to show manual completion option

//       // Update task answer in Redux
//       dispatch(
//         updateTaskAnswer({
//           questId,
//           taskId: task.id,
//           answer: {
//             verified: result.verificationData.verified,
//             tweetId,
//             verifiedAt: new Date().toISOString(),
//             verificationResults: result.verificationData.verificationResults,
//             completionSummary: result.verificationData.completionSummary,
//             replyUrl: task.requireReply ? debouncedReplyUrl : undefined, // Use debounced value
//             method: "backend_verification",
//           },
//         }),
//       );

//       // Show appropriate toast based on completion
//       const { completionSummary } = result.verificationData;
//       if (completionSummary.isFullyVerified) {
//         addToast({
//           title: "Verification Successful",
//           description: "All required interactions have been verified",
//           color: "success",
//         });
//         setVerificationStep("completed");
//       } else if (completionSummary.isPartiallyVerified) {
//         addToast({
//           title: "Partial Verification",
//           description: `${completionSummary.completed.length}/${completionSummary.required.length} actions verified. You can complete manually.`,
//           color: "warning",
//         });
//       } else {
//         addToast({
//           title: "Verification Failed",
//           description:
//             "No interactions could be verified. You can complete manually.",
//           color: "warning",
//         });
//       }
//     } catch (err) {
//       setVerificationStep("actions");
//       addToast({
//         title: "Verification Failed",
//         description: err.message,
//         color: "danger",
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // Helper function to check if manual completion should be available
//   const shouldShowManualCompletion = () => {
//     if (!hasAttemptedVerification || isTaskCompleted) return false;
//     if (!verificationResult?.completionSummary) return false;

//     // Use the backend's canComplete flag which has the proper logic
//     return verificationResult.completionSummary.canComplete;
//   };

//   const handleTweetLoad = (tweetData) => {
//     console.log("Original tweet loaded:", tweetData);
//   };

//   // If task is already completed, show completed state
//   if (isTaskCompleted) {
//     return (
//       <div className="space-y-4">
//         {tweetId && (
//           <TweetPreviewCard tweetId={tweetId} onTweetLoad={handleTweetLoad} />
//         )}

//         <Card className="border border-green-500/50 bg-green-900/20">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />

//               <div className="flex-1">
//                 {currentAnswer?.completionSummary?.isFullyVerified ? (
//                   <p className="text-sm font-medium text-green-300">
//                     All Interactions Verified! ✓
//                   </p>
//                 ) : (
//                   <div>
//                     <p className="text-sm font-medium text-green-300">
//                       Partially Verified (
//                       {currentAnswer?.completionSummary?.completionRate || 0}%)
//                     </p>

//                     <p className="mt-1 text-xs text-green-200">
//                       {currentAnswer?.completionSummary?.completed?.length || 0}{" "}
//                       of{" "}
//                       {currentAnswer?.completionSummary?.required?.length || 0}{" "}
//                       actions completed
//                     </p>
//                   </div>
//                 )}
//                 <div className="mt-2 space-y-1 text-xs text-green-200">
//                   <p>✓ Verified: {formatDate(currentAnswer?.verifiedAt)}</p>

//                   {currentAnswer?.verificationResults && (
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {currentAnswer.verificationResults.liked && (
//                         <span className="rounded bg-red-900/30 px-2 py-1 text-xs text-red-300">
//                           ❤️ Liked
//                         </span>
//                       )}

//                       {!currentAnswer.verificationResults.liked && (
//                         <span className="rounded bg-gray-700/30 px-2 py-1 text-xs text-gray-400">
//                           ❤️ Like (Not Verified)
//                         </span>
//                       )}

//                       {task?.requireRetweet &&
//                         currentAnswer.verificationResults.retweeted && (
//                           <span className="rounded bg-green-900/30 px-2 py-1 text-xs text-green-300">
//                             🔄 Retweeted
//                           </span>
//                         )}

//                       {task?.requireRetweet &&
//                         !currentAnswer.verificationResults.retweeted && (
//                           <span className="rounded bg-gray-700/30 px-2 py-1 text-xs text-gray-400">
//                             🔄 Retweet (Not Verified)
//                           </span>
//                         )}

//                       {task?.requireReply &&
//                         currentAnswer.verificationResults.replied && (
//                           <span className="bg-blue-900/30 rounded px-2 py-1 text-xs text-blue-300">
//                             💬 Replied
//                           </span>
//                         )}

//                       {task?.requireReply &&
//                         !currentAnswer.verificationResults.replied && (
//                           <span className="rounded bg-gray-700/30 px-2 py-1 text-xs text-gray-400">
//                             💬 Reply (Not Verified)
//                           </span>
//                         )}
//                     </div>
//                   )}

//                   {currentAnswer?.completionSummary?.missing?.length > 0 && (
//                     <p className="mt-2 text-xs text-amber-300">
//                       Missing:{" "}
//                       {currentAnswer.completionSummary.missing.join(", ")}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardBody>
//         </Card>

//         <div className="flex justify-end">
//           <Button
//             disabled
//             className="w-fit cursor-default bg-green-600 text-white"
//             startContent={<CheckCircle className="h-4 w-4" />}
//           >
//             Task Completed ✓
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {tweetId && (
//         <TweetPreviewCard tweetId={tweetId} onTweetLoad={handleTweetLoad} />
//       )}

//       {verificationStep === "verifying" && (
//         <Card className="bg-blue-900/10 border border-blue-500/40">
//           <CardBody className="p-4">
//             <div className="flex items-center gap-3">
//               <Spinner size="sm" color="primary" />

//               <div className="flex-1">
//                 <p className="text-sm font-medium text-blue-200">
//                   Verifying your interactions...
//                 </p>

//                 <p className="mt-1 text-xs text-blue-300">
//                   Checking your recent activity on X (Twitter)
//                 </p>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {shouldShowManualCompletion() && verificationStep === "actions" && (
//         <Card className="border border-green-500/40 bg-green-900/10">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />

//               <div className="flex-1">
//                 <p className="mb-2 text-sm font-medium text-green-200">
//                   Great! You can complete this task
//                 </p>

//                 <p className="mb-2 text-sm text-green-100">
//                   We've verified{" "}
//                   {verificationResult?.completionSummary?.actuallyVerified
//                     ?.length || 0}{" "}
//                   of your verifiable actions. You can now mark this task as
//                   completed.
//                 </p>

//                 {verificationResult && (
//                   <div className="text-xs text-green-200">
//                     <p>
//                       ✅ Verified:{" "}
//                       {verificationResult.completionSummary.actuallyVerified.join(
//                         ", ",
//                       )}
//                     </p>

//                     <p>
//                       ⚠️ Like verification unavailable (API limitation) - please
//                       confirm you liked the tweet
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Insufficient verification message */}
//       {hasAttemptedVerification &&
//         !shouldShowManualCompletion() &&
//         verificationStep === "actions" &&
//         !isTaskCompleted && (
//           <Card className="border border-amber-500/40 bg-amber-900/10">
//             <CardBody className="p-4">
//               <div className="flex items-start gap-3">
//                 <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />

//                 <div className="flex-1">
//                   <p className="mb-2 text-sm font-medium text-amber-200">
//                     More actions needed
//                   </p>

//                   <p className="mb-2 text-sm text-amber-100">
//                     We could only verify{" "}
//                     {verificationResult?.completionSummary?.actuallyVerified
//                       ?.length || 0}{" "}
//                     of{" "}
//                     {verificationResult?.completionSummary?.verifiable
//                       ?.length || 0}{" "}
//                     verifiable actions.
//                   </p>

//                   {verificationResult && (
//                     <div className="text-xs text-amber-200">
//                       {verificationResult.completionSummary?.actuallyVerified
//                         ?.length > 0 && (
//                         <p>
//                           ✅ Verified:{" "}
//                           {verificationResult.completionSummary.actuallyVerified.join(
//                             ", ",
//                           )}
//                         </p>
//                       )}

//                       <p>
//                         ❌ Missing:{" "}
//                         {verificationResult.completionSummary?.verifiable
//                           ?.filter(
//                             (action) =>
//                               !verificationResult.completionSummary.actuallyVerified.includes(
//                                 action,
//                               ),
//                           )
//                           .join(", ")}
//                       </p>

//                       <p className="mt-1">
//                         Please complete the missing actions and try verification
//                         again.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         )}

//       {verificationStep === "actions" && (
//         <Card className="border border-gray-500/40 bg-gray-700/10">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <ShieldAlertIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />

//               <div className="flex-1">
//                 <p className="mb-3 text-sm font-medium text-gray-100">
//                   Complete these actions on X (Twitter):
//                 </p>

//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700/50 p-3">
//                     <div className="flex items-center gap-3">
//                       <Heart size={16} className="text-red-400" />

//                       <span className="text-sm text-gray-200">
//                         Like the tweet
//                       </span>

//                       <span className="text-xs text-gray-400">(Required)</span>
//                     </div>

//                     <Link
//                       href={likeUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <Button
//                         size="sm"
//                         className="bg-red-600 text-white hover:bg-red-700"
//                         endContent={<ExternalLink size={12} />}
//                       >
//                         Like
//                       </Button>
//                     </Link>
//                   </div>

//                   {task?.requireRetweet && (
//                     <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700/50 p-3">
//                       <div className="flex items-center gap-3">
//                         <Repeat size={16} className="text-green-400" />

//                         <span className="text-sm text-gray-200">
//                           Retweet the post
//                         </span>

//                         <span className="text-xs text-gray-400">
//                           (Required)
//                         </span>
//                       </div>

//                       <Link
//                         href={retweetUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Button
//                           size="sm"
//                           className="bg-green-600 text-white hover:bg-green-700"
//                           endContent={<ExternalLink size={12} />}
//                         >
//                           Retweet
//                         </Button>
//                       </Link>
//                     </div>
//                   )}

//                   {task?.requireReply && (
//                     <div className="rounded-lg border border-gray-600 bg-gray-700/50 p-3">
//                       <div className="mb-3 flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <MessageCircle size={16} className="text-blue-400" />

//                           <span className="text-sm text-gray-200">
//                             Reply to the tweet
//                           </span>

//                           <span className="text-xs text-gray-400">
//                             (Required)
//                           </span>
//                         </div>

//                         <Link
//                           target="_blank"
//                           href={replyUrl_intent}
//                           rel="noopener noreferrer"
//                         >
//                           <Button
//                             size="sm"
//                             className="bg-blue-600 hover:bg-blue-700 text-white"
//                             endContent={<ExternalLink size={12} />}
//                           >
//                             Reply
//                           </Button>
//                         </Link>
//                       </div>

//                       <div className="space-y-2 border-l-2 border-gray-600/30 pl-6">
//                         <p className="text-xs text-gray-200">
//                           Paste your reply tweet URL here for verification:
//                         </p>

//                         <Input
//                           size="sm"
//                           placeholder="https://x.com/your_username/status/..."
//                           value={replyUrl}
//                           onChange={handleReplyUrlChange}
//                           startContent={
//                             <LinkIcon className="h-3 w-3 text-gray-400" />
//                           }
//                           classNames={{
//                             inputWrapper: "border-gray-600 bg-gray-700",
//                             input: "text-gray-50 text-xs",
//                           }}
//                         />

//                         {replyUrl &&
//                           !isValidReplyUrl &&
//                           debouncedReplyUrl === replyUrl && (
//                             <p className="text-xs text-red-400">
//                               Please enter a valid Twitter URL
//                             </p>
//                           )}

//                         {replyUrl && debouncedReplyUrl !== replyUrl && (
//                           <p className="text-xs text-gray-400">
//                             Checking URL...
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {verificationStep === "actions" && (
//         <Card className="border border-amber-500/40 bg-amber-900/10">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />

//               <div className="flex-1">
//                 <p className="mb-2 text-sm font-medium text-amber-200">
//                   Important Tips:
//                 </p>

//                 <ul className="list-inside list-disc space-y-1 text-sm text-amber-100">
//                   <li>The retweet should be present in last 10 tweets</li>

//                   <li>
//                     Complete all actions before clicking "Verify Interactions"
//                   </li>

//                   <li>
//                     Wait a few moments after completing actions for them to
//                     register
//                   </li>

//                   <li>
//                     For replies: paste the URL of your reply tweet in the input
//                     field
//                   </li>

//                   <li>
//                     Like verification uses smart detection based on your
//                     activity
//                   </li>

//                   <li>If verification fails, wait 1-2 minutes and try again</li>
//                 </ul>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       <div className="flex justify-end gap-3">
//         {verificationStep === "actions" && (
//           <Button
//             onPress={handleVerifyInteractions}
//             disabled={
//               !userTwitterHandle ||
//               isVerifying ||
//               (task?.requireReply && !isValidReplyUrl)
//             }
//             isLoading={isVerifying}
//             className="bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
//             startContent={!isVerifying && <CheckCircle className="h-4 w-4" />}
//           >
//             {isVerifying ? "Verifying..." : "Verify Interactions"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default XReactTask;

"use client";

import {
  Card,
  Input,
  Button,
  Spinner,
  CardBody,
  addToast,
} from "@heroui/react";
import {
  Clock,
  Heart,
  Repeat,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  ShieldAlertIcon,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useCallback, useEffect, useMemo } from "react";

import TweetPreviewCard from "./TweetPreviewCard";

import {
  updateTaskAnswer,
  selectTaskAnswer,
  selectIsQuestSubmitted,
} from "@/redux/slice/submissionSlice";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Get auth token function
const getAuthToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("neo-jwt") || sessionStorage.getItem("neo-jwt")
    : null;

// Build headers function
const buildHeaders = (isJson = false) => {
  const token = getAuthToken();
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper functions
const extractTweetId = (tweetUrl) => {
  const match = tweetUrl.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown date";
  }
};

// Updated API utilities
const twitterAPI = {
  async verifyReact(task, replyUrl = null) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/socials/twitter/verify-react`,
      {
        method: "POST",
        headers: buildHeaders(true),
        credentials: "include",
        body: JSON.stringify({
          task,
          replyUrl: replyUrl || undefined,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to verify interactions");
    }

    return response.json();
  },
};

const XReactTask = ({ task, questId, userTwitterHandle }) => {
  const dispatch = useDispatch();

  // Redux selectors
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  const isQuestSubmitted = useSelector((state) =>
    selectIsQuestSubmitted(state, questId),
  );

  // Fix: Proper task completion check - similar to other components
  const isTaskCompleted = useMemo(() => {
    return (
      currentAnswer &&
      typeof currentAnswer === "object" &&
      currentAnswer.verified === true &&
      !isQuestSubmitted // Key fix: Reset when quest is submitted
    );
  }, [currentAnswer, isQuestSubmitted]);

  // Local state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationStep, setVerificationStep] = useState("actions"); // "actions", "verifying", "completed"
  const [hasAttemptedVerification, setHasAttemptedVerification] =
    useState(false);

  // Reply URL state with debouncing
  const [replyUrl, setReplyUrl] = useState("");
  const debouncedReplyUrl = useDebounce(replyUrl, 500); // 500ms debounce

  // Fix: Reset local state when quest is submitted
  useEffect(() => {
    if (isQuestSubmitted) {
      setIsVerifying(false);
      setVerificationResult(null);
      setVerificationStep("actions");
      setHasAttemptedVerification(false);
      setReplyUrl("");
    }
  }, [isQuestSubmitted]);

  // Also reset local state when currentAnswer is cleared (additional safety)
  useEffect(() => {
    if (!currentAnswer || currentAnswer === null) {
      setIsVerifying(false);
      setVerificationResult(null);
      setVerificationStep("actions");
      setHasAttemptedVerification(false);
      setReplyUrl("");
    }
  }, [currentAnswer]);

  const tweetId = extractTweetId(task.tweetUrl);
  const isValidReplyUrl =
    debouncedReplyUrl &&
    isValidUrl(debouncedReplyUrl) &&
    extractTweetId(debouncedReplyUrl);

  // Generate action URLs
  const likeUrl = `https://x.com/intent/like?tweet_id=${tweetId}`;
  const retweetUrl = `https://x.com/intent/retweet?tweet_id=${tweetId}`;
  const replyUrl_intent = `https://x.com/intent/tweet?in_reply_to=${tweetId}`;

  // Debounced input change handler
  const handleReplyUrlChange = useCallback((e) => {
    setReplyUrl(e.target.value);
  }, []);

  const handleVerifyInteractions = async () => {
    if (!userTwitterHandle) {
      addToast({
        title: "Account Required",
        description: "Please connect your Twitter account first",
        color: "warning",
      });
      return;
    }

    // Check if reply URL is provided when reply is required (use debounced value)
    if (task?.requireReply && !isValidReplyUrl) {
      addToast({
        title: "Reply URL Required",
        description: "Please provide the URL of your reply tweet",
        color: "warning",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStep("verifying");
    setHasAttemptedVerification(true);

    try {
      const result = await twitterAPI.verifyReact(
        task,
        task?.requireReply ? debouncedReplyUrl : null, // Use debounced value
      );

      setVerificationResult(result.verificationData);
      setVerificationStep("actions"); // Stay in actions step to show manual completion option

      // Update task answer in Redux
      dispatch(
        updateTaskAnswer({
          questId,
          taskId: task.id,
          answer: {
            verified: result.verificationData.verified,
            tweetId,
            verifiedAt: new Date().toISOString(),
            verificationResults: result.verificationData.verificationResults,
            completionSummary: result.verificationData.completionSummary,
            replyUrl: task.requireReply ? debouncedReplyUrl : undefined, // Use debounced value
            method: "backend_verification",
          },
        }),
      );

      // Show appropriate toast based on completion
      const { completionSummary } = result.verificationData;
      if (completionSummary.isFullyVerified) {
        addToast({
          title: "Verification Successful",
          description: "All required interactions have been verified",
          color: "success",
        });
        setVerificationStep("completed");
      } else if (completionSummary.isPartiallyVerified) {
        addToast({
          title: "Partial Verification",
          description: `${completionSummary.completed.length}/${completionSummary.required.length} actions verified. You can complete manually.`,
          color: "warning",
        });
      } else {
        addToast({
          title: "Verification Failed",
          description:
            "No interactions could be verified. You can complete manually.",
          color: "warning",
        });
      }
    } catch (err) {
      setVerificationStep("actions");
      addToast({
        title: "Verification Failed",
        description: err.message,
        color: "danger",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper function to check if manual completion should be available
  const shouldShowManualCompletion = () => {
    if (!hasAttemptedVerification || isTaskCompleted) return false;
    if (!verificationResult?.completionSummary) return false;

    // Use the backend's canComplete flag which has the proper logic
    return verificationResult.completionSummary.canComplete;
  };

  const handleTweetLoad = (tweetData) => {
    console.log("Original tweet loaded:", tweetData);
  };

  return (
    <div className="space-y-4">
      {tweetId && (
        <TweetPreviewCard tweetId={tweetId} onTweetLoad={handleTweetLoad} />
      )}

      {verificationStep === "verifying" && !isQuestSubmitted && (
        <Card className="bg-blue-900/10 border border-blue-500/40">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <Spinner size="sm" color="primary" />

              <div className="flex-1">
                <p className="text-sm font-medium text-blue-200">
                  Verifying your interactions...
                </p>

                <p className="mt-1 text-xs text-blue-300">
                  Checking your recent activity on X (Twitter)
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {shouldShowManualCompletion() &&
        verificationStep === "actions" &&
        !isQuestSubmitted && (
          <Card className="border border-green-500/40 bg-green-900/10">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />

                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium text-green-200">
                    Great! You can complete this task
                  </p>

                  <p className="mb-2 text-sm text-green-100">
                    We've verified{" "}
                    {verificationResult?.completionSummary?.actuallyVerified
                      ?.length || 0}{" "}
                    of your verifiable actions. You can now mark this task as
                    completed.
                  </p>

                  {verificationResult && (
                    <div className="text-xs text-green-200">
                      <p>
                        ✅ Verified:{" "}
                        {verificationResult.completionSummary.actuallyVerified.join(
                          ", ",
                        )}
                      </p>

                      <p>
                        ⚠️ Like verification unavailable (API limitation) -
                        please confirm you liked the tweet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

      {/* Insufficient verification message */}
      {hasAttemptedVerification &&
        !shouldShowManualCompletion() &&
        verificationStep === "actions" &&
        !isTaskCompleted &&
        !isQuestSubmitted && (
          <Card className="border border-amber-500/40 bg-amber-900/10">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />

                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium text-amber-200">
                    More actions needed
                  </p>

                  <p className="mb-2 text-sm text-amber-100">
                    We could only verify{" "}
                    {verificationResult?.completionSummary?.actuallyVerified
                      ?.length || 0}{" "}
                    of{" "}
                    {verificationResult?.completionSummary?.verifiable
                      ?.length || 0}{" "}
                    verifiable actions.
                  </p>

                  {verificationResult && (
                    <div className="text-xs text-amber-200">
                      {verificationResult.completionSummary?.actuallyVerified
                        ?.length > 0 && (
                        <p>
                          ✅ Verified:{" "}
                          {verificationResult.completionSummary.actuallyVerified.join(
                            ", ",
                          )}
                        </p>
                      )}

                      <p>
                        ❌ Missing:{" "}
                        {verificationResult.completionSummary?.verifiable
                          ?.filter(
                            (action) =>
                              !verificationResult.completionSummary.actuallyVerified.includes(
                                action,
                              ),
                          )
                          .join(", ")}
                      </p>

                      <p className="mt-1">
                        Please complete the missing actions and try verification
                        again.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

      {verificationStep === "actions" && (
        <Card className="border border-gray-500/40 bg-gray-700/10">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <ShieldAlertIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />

              <div className="flex-1">
                <p className="mb-3 text-sm font-medium text-gray-100">
                  Complete these actions on X (Twitter):
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700/50 p-3">
                    <div className="flex items-center gap-3">
                      <Heart size={16} className="text-red-400" />

                      <span className="text-sm text-gray-200">
                        Like the tweet
                      </span>

                      <span className="text-xs text-gray-400">(Required)</span>
                    </div>

                    <Link
                      href={likeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        disabled={isTaskCompleted}
                        className={`text-white ${
                          isTaskCompleted
                            ? "cursor-not-allowed bg-gray-500"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                        endContent={<ExternalLink size={12} />}
                      >
                        Like
                      </Button>
                    </Link>
                  </div>

                  {task?.requireRetweet && (
                    <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-700/50 p-3">
                      <div className="flex items-center gap-3">
                        <Repeat size={16} className="text-green-400" />

                        <span className="text-sm text-gray-200">
                          Retweet the post
                        </span>

                        <span className="text-xs text-gray-400">
                          (Required)
                        </span>
                      </div>

                      <Link
                        href={retweetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          disabled={isTaskCompleted}
                          className={`text-white ${
                            isTaskCompleted
                              ? "cursor-not-allowed bg-gray-500"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          endContent={<ExternalLink size={12} />}
                        >
                          Retweet
                        </Button>
                      </Link>
                    </div>
                  )}

                  {task?.requireReply && (
                    <div className="rounded-lg border border-gray-600 bg-gray-700/50 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageCircle size={16} className="text-blue-400" />

                          <span className="text-sm text-gray-200">
                            Reply to the tweet
                          </span>

                          <span className="text-xs text-gray-400">
                            (Required)
                          </span>
                        </div>

                        <Link
                          target="_blank"
                          href={replyUrl_intent}
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            disabled={isTaskCompleted}
                            className={`text-white ${
                              isTaskCompleted
                                ? "cursor-not-allowed bg-gray-500"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            endContent={<ExternalLink size={12} />}
                          >
                            Reply
                          </Button>
                        </Link>
                      </div>

                      <div className="space-y-2 border-l-2 border-gray-600/30 pl-6">
                        <p className="text-xs text-gray-200">
                          Paste your reply tweet URL here for verification:
                        </p>

                        <Input
                          size="sm"
                          placeholder="https://x.com/your_username/status/..."
                          value={replyUrl}
                          disabled={isTaskCompleted}
                          onChange={handleReplyUrlChange}
                          startContent={
                            <LinkIcon className="h-3 w-3 text-gray-400" />
                          }
                          classNames={{
                            inputWrapper: `border-gray-600 ${
                              isTaskCompleted
                                ? "bg-gray-600 opacity-50"
                                : "bg-gray-700"
                            }`,
                            input: "text-gray-50 text-xs",
                          }}
                        />

                        {replyUrl &&
                          !isValidReplyUrl &&
                          debouncedReplyUrl === replyUrl && (
                            <p className="text-xs text-red-400">
                              Please enter a valid Twitter URL
                            </p>
                          )}

                        {replyUrl && debouncedReplyUrl !== replyUrl && (
                          <p className="text-xs text-gray-400">
                            Checking URL...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {verificationStep === "actions" && (
        <Card className="border border-amber-500/40 bg-amber-900/10">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />

              <div className="flex-1">
                <p className="mb-2 text-sm font-medium text-amber-200">
                  Important Tips:
                </p>

                <ul className="list-inside list-disc space-y-1 text-sm text-amber-100">
                  <li>The retweet should be present in last 10 tweets</li>

                  <li>
                    Complete all actions before clicking "Verify Interactions"
                  </li>

                  <li>
                    Wait a few moments after completing actions for them to
                    register
                  </li>

                  <li>
                    For replies: paste the URL of your reply tweet in the input
                    field
                  </li>

                  <li>
                    Like verification uses smart detection based on your
                    activity
                  </li>

                  <li>If verification fails, wait 1-2 minutes and try again</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Show task completion status */}
      {isTaskCompleted && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <p className="text-sm text-green-300">
            ✅ React task completed successfully!
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {verificationStep === "actions" && (
          <Button
            onPress={handleVerifyInteractions}
            disabled={
              !userTwitterHandle ||
              isVerifying ||
              isTaskCompleted ||
              (task?.requireReply && !isValidReplyUrl)
            }
            isLoading={isVerifying}
            className={`text-white ${
              isTaskCompleted
                ? "cursor-not-allowed bg-green-600 opacity-50"
                : "bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
            }`}
            startContent={
              isTaskCompleted ? (
                <CheckCircle className="h-4 w-4" />
              ) : !isVerifying ? (
                <CheckCircle className="h-4 w-4" />
              ) : null
            }
          >
            {isTaskCompleted
              ? "✅ Completed"
              : isVerifying
                ? "Verifying..."
                : "Verify Interactions"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default XReactTask;
