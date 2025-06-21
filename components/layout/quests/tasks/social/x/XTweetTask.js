// "use client";

// import {
//   EyeIcon,
//   XCircleIcon,
//   CheckCircleIcon,
//   ExternalLinkIcon,
//   ShieldAlertIcon,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Chip, Card, Input, Button, Spinner, CardBody } from "@heroui/react";

// import TweetPreview from "./TweetPreviewCard";

// import {
//   updateTaskAnswer,
//   selectTaskAnswer,
//   selectIsQuestSubmitted,
// } from "@/redux/slice/submissionSlice";

// // Get auth token function (adjust based on your auth system)
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

// // Simplified API utility - only for verification
// const twitterAPI = {
//   async verifyTweet(tweetUrl, task, userTwitterHandle) {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/socials/twitter/verify-tweet`,
//       {
//         method: "POST",
//         headers: buildHeaders(true),
//         credentials: "include",
//         body: JSON.stringify({
//           tweetUrl,
//           task,
//           userTwitterHandle,
//         }),
//       },
//     );

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to verify tweet");
//     }

//     return response.json();
//   },
// };

// // Helper functions
// const extractTweetId = (tweetUrl) => {
//   const match = tweetUrl.match(/status\/(\d+)/);
//   return match ? match[1] : null;
// };

// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     const now = new Date();

//     // Calculate difference in milliseconds
//     const diffTime = now.getTime() - date.getTime();
//     const diffMinutes = Math.floor(diffTime / (1000 * 60));
//     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     // Handle recent times more precisely
//     if (diffMinutes < 1) return "Just now";
//     if (diffMinutes < 60) return `${diffMinutes}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays}d ago`;

//     // For older dates, show the actual date
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
//     });
//   } catch {
//     return "Unknown date";
//   }
// };

// const isValidUrl = (string) => {
//   try {
//     new URL(string);
//     return true;
//   } catch {
//     return false;
//   }
// };

// // Optimized RequiredText component
// const RequiredTextChips = React.memo(({ includeText }) => {
//   if (!includeText) return null;

//   const items = useMemo(
//     () =>
//       includeText
//         .split(",")
//         .map((item) => item.trim())
//         .filter(Boolean),
//     [includeText],
//   );

//   return (
//     <div className="mt-2 flex flex-wrap gap-2">
//       {items.map((item, index) => (
//         <Chip
//           key={index}
//           size="sm"
//           variant="bordered"
//           className="border-neutral-700 bg-neutral-800 text-gray-200"
//         >
//           {item}
//         </Chip>
//       ))}
//     </div>
//   );
// });

// RequiredTextChips.displayName = "RequiredTextChips";

// const XTweetTask = ({ task, questId, userTwitterHandle }) => {
//   const dispatch = useDispatch();
//   userTwitterHandle = "h";

//   // Redux selectors
//   const currentAnswer = useSelector((state) =>
//     selectTaskAnswer(state, questId, task.id),
//   );

//   // Check if task is completed (has verification data)
//   const isQuestSubmitted = useSelector((state) =>
//     selectIsQuestSubmitted(state, questId),
//   );

//   const isTaskCompleted =
//     isQuestSubmitted ||
//     (currentAnswer &&
//       typeof currentAnswer === "object" &&
//       currentAnswer.verified === true);

//   // Local state
//   const [error, setError] = useState("");
//   const [tweetUrl, setTweetUrl] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [verificationResult, setVerificationResult] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);

//   const isValidTweetUrl = useMemo(() => {
//     return tweetUrl && isValidUrl(tweetUrl) && extractTweetId(tweetUrl);
//   }, [tweetUrl]);

//   const tweetId = useMemo(() => {
//     return isValidTweetUrl ? extractTweetId(tweetUrl) : null;
//   }, [isValidTweetUrl, tweetUrl]);

//   // Show preview after user stops typing for 1 second
//   useEffect(() => {
//     if (!tweetUrl.trim()) {
//       setShowPreview(false);
//       return;
//     }

//     const timeoutId = setTimeout(() => {
//       if (isValidTweetUrl) {
//         setShowPreview(true);
//       } else {
//         setShowPreview(false);
//       }
//     }, 1000);

//     return () => clearTimeout(timeoutId);
//   }, [tweetUrl, isValidTweetUrl]);

//   const handleVerifyTweet = async () => {
//     if (!userTwitterHandle) {
//       setError("Please connect your Twitter account first");
//       return;
//     }

//     setError("");
//     setIsVerifying(true);
//     setVerificationResult(null);

//     try {
//       const result = await twitterAPI.verifyTweet(
//         tweetUrl,
//         task,
//         userTwitterHandle,
//       );

//       setVerificationResult(result.verificationData);

//       // Update task answer with verification data in Redux
//       dispatch(
//         updateTaskAnswer({
//           questId,
//           taskId: task.id,
//           answer: {
//             verified: true,
//             tweetUrl: tweetUrl,
//             tweetId: tweetId,
//             verifiedAt: new Date().toISOString(),
//             verificationData: result.verificationData,
//           },
//         }),
//       );
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleTweetLoad = useCallback((tweetData) => {
//     // Optional: Handle tweet load if needed for additional logic
//     console.log("Tweet loaded:", tweetData);
//   }, []);

//   // If task is already completed, show completed state
//   if (isTaskCompleted && !verificationResult) {
//     return (
//       <div className="space-y-4">
//         <Card className="border border-green-500/50 bg-green-900/20">
//           <CardBody className="p-4">
//             <div className="flex items-start gap-3">
//               <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />

//               <div className="flex-1">
//                 <p className="text-sm font-medium text-green-300">
//                   Tweet Task Completed! ✓
//                 </p>

//                 <div className="mt-2 space-y-1 text-xs text-green-200">
//                   <p>✓ Tweet URL: {currentAnswer?.tweetUrl}</p>
//                   <p>✓ Verified: {formatDate(currentAnswer?.verifiedAt)}</p>
//                   {currentAnswer?.verificationData?.username && (
//                     <p>✓ Author: @{currentAnswer.verificationData.username}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="space-y-3">
//         <div className="space-y-2">
//           <Input
//             size="lg"
//             type="url"
//             value={tweetUrl}
//             variant="bordered"
//             placeholder={task?.placeholder || "https://x.com/your_tweet_url"}
//             onChange={(e) => setTweetUrl(e.target.value)}
//             classNames={{
//               inputWrapper:
//                 "border-gray-300 focus-within:!border-blue-400 rounded-xl hover:border-gray-200 transition-colors",
//               input: "text-gray-200",
//             }}
//             startContent={
//               <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
//             }
//           />

//           {tweetUrl && (
//             <div className="flex items-center space-x-2 text-xs">
//               {isValidTweetUrl ? (
//                 <div className="flex items-center space-x-1 text-green-400">
//                   <CheckCircleIcon className="h-3 w-3" />
//                   <span>Valid X.com tweet URL</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-1 text-red-400">
//                   <XCircleIcon className="h-3 w-3" />
//                   <span>Please enter a valid X.com tweet URL</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {showPreview && tweetId && (
//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <EyeIcon className="h-4 w-4 text-white" />
//               <span className="text-sm font-medium text-gray-200">
//                 Tweet Preview
//               </span>
//             </div>

//             <TweetPreview tweetId={tweetId} onTweetLoad={handleTweetLoad} />
//           </div>
//         )}

//         {task?.includeText && !verificationResult && (
//           <div className="rounded-xl border border-gray-300 px-3 py-2">
//             <div className="flex items-center gap-2">
//               <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

//               <p className="text-sm text-gray-100">
//                 Include the following words, hashtags, or mentions in your tweet
//                 to complete the quest:
//               </p>
//             </div>

//             <RequiredTextChips includeText={task.includeText} />
//           </div>
//         )}

//         {error && (
//           <Card className="border border-red-500/50 bg-red-900/20">
//             <CardBody className="p-4">
//               <div className="flex items-center gap-3">
//                 <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-400" />
//                 <p className="text-sm text-red-300">{error}</p>
//               </div>
//             </CardBody>
//           </Card>
//         )}

//         {verificationResult && (
//           <Card className="border border-green-500/50 bg-green-900/20">
//             <CardBody className="p-4">
//               <div className="flex items-start gap-3">
//                 <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />

//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-green-300">
//                     Tweet Verification Successful! ✓
//                   </p>

//                   <div className="mt-2 space-y-1 text-xs text-green-200">
//                     <p>✓ Author: @{verificationResult.username}</p>
//                     <p>✓ Posted: {formatDate(verificationResult.createdAt)}</p>
//                     {verificationResult.requirementsMet
//                       ?.containsRequiredText && <p>✓ Contains required text</p>}
//                   </div>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         )}
//       </div>

//       <div className="flex justify-end">
//         <Button
//           onPress={handleVerifyTweet}
//           disabled={!isValidTweetUrl || isVerifying || verificationResult}
//           className={`disabled:cursor-not-allowed disabled:opacity-50 ${
//             verificationResult
//               ? "bg-green-600 text-white hover:bg-green-700"
//               : "bg-gray-600 text-white hover:bg-gray-700"
//           }`}
//         >
//           {isVerifying ? (
//             <div className="flex items-center space-x-2">
//               <Spinner size="sm" color="white" />
//               <span>Verifying...</span>
//             </div>
//           ) : verificationResult ? (
//             <div className="flex items-center space-x-2">
//               <CheckCircleIcon className="h-4 w-4" />
//               <span>Verified</span>
//             </div>
//           ) : (
//             "Verify Tweet"
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default XTweetTask;

"use client";

import {
  EyeIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Chip, Card, Input, Button, Spinner, CardBody } from "@heroui/react";

import TweetPreview from "./TweetPreviewCard";

import {
  updateTaskAnswer,
  selectTaskAnswer,
  selectIsQuestSubmitted,
} from "@/redux/slice/submissionSlice";

// Get auth token function (adjust based on your auth system)
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

// Simplified API utility - only for verification
const twitterAPI = {
  async verifyTweet(tweetUrl, task, userTwitterHandle) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/socials/twitter/verify-tweet`,
      {
        method: "POST",
        headers: buildHeaders(true),
        credentials: "include",
        body: JSON.stringify({
          tweetUrl,
          task,
          userTwitterHandle,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to verify tweet");
    }

    return response.json();
  },
};

// Helper functions
const extractTweetId = (tweetUrl) => {
  const match = tweetUrl.match(/status\/(\d+)/);
  return match ? match[1] : null;
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    // Calculate difference in milliseconds
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Handle recent times more precisely
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    // For older dates, show the actual date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "Unknown date";
  }
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// Optimized RequiredText component
const RequiredTextChips = React.memo(({ includeText }) => {
  if (!includeText) return null;

  const items = useMemo(
    () =>
      includeText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [includeText],
  );

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Chip
          key={index}
          size="sm"
          variant="bordered"
          className="border-neutral-700 bg-neutral-800 text-gray-200"
        >
          {item}
        </Chip>
      ))}
    </div>
  );
});

RequiredTextChips.displayName = "RequiredTextChips";

const XTweetTask = ({ task, questId, userTwitterHandle }) => {
  const dispatch = useDispatch();
  userTwitterHandle = "h";

  // Redux selectors
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  const isQuestSubmitted = useSelector((state) =>
    selectIsQuestSubmitted(state, questId),
  );

  // Fix: Proper task completion check - similar to Telegram component
  const isTaskCompleted = useMemo(() => {
    return (
      currentAnswer &&
      typeof currentAnswer === "object" &&
      currentAnswer.verified === true &&
      !isQuestSubmitted // Key fix: Reset when quest is submitted
    );
  }, [currentAnswer, isQuestSubmitted]);

  // Local state
  const [error, setError] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fix: Reset local state when quest is submitted
  useEffect(() => {
    if (isQuestSubmitted) {
      setError("");
      setTweetUrl("");
      setIsVerifying(false);
      setVerificationResult(null);
      setShowPreview(false);
    }
  }, [isQuestSubmitted]);

  // Also reset local state when currentAnswer is cleared (additional safety)
  useEffect(() => {
    if (!currentAnswer || currentAnswer === null) {
      setError("");
      setTweetUrl("");
      setIsVerifying(false);
      setVerificationResult(null);
      setShowPreview(false);
    }
  }, [currentAnswer]);

  const isValidTweetUrl = useMemo(() => {
    return tweetUrl && isValidUrl(tweetUrl) && extractTweetId(tweetUrl);
  }, [tweetUrl]);

  const tweetId = useMemo(() => {
    return isValidTweetUrl ? extractTweetId(tweetUrl) : null;
  }, [isValidTweetUrl, tweetUrl]);

  // Show preview after user stops typing for 1 second
  useEffect(() => {
    if (!tweetUrl.trim()) {
      setShowPreview(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (isValidTweetUrl) {
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [tweetUrl, isValidTweetUrl]);

  const handleVerifyTweet = async () => {
    if (!userTwitterHandle) {
      setError("Please connect your Twitter account first");
      return;
    }

    setError("");
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await twitterAPI.verifyTweet(
        tweetUrl,
        task,
        userTwitterHandle,
      );

      setVerificationResult(result.verificationData);

      // Update task answer with verification data in Redux
      dispatch(
        updateTaskAnswer({
          questId,
          taskId: task.id,
          answer: {
            verified: true,
            tweetUrl: tweetUrl,
            tweetId: tweetId,
            verifiedAt: new Date().toISOString(),
            verificationData: result.verificationData,
          },
        }),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTweetLoad = useCallback((tweetData) => {
    // Optional: Handle tweet load if needed for additional logic
    console.log("Tweet loaded:", tweetData);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-2">
          <Input
            size="lg"
            type="url"
            value={tweetUrl}
            variant="bordered"
            placeholder={task?.placeholder || "https://x.com/your_tweet_url"}
            onChange={(e) => setTweetUrl(e.target.value)}
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-blue-400 rounded-xl hover:border-gray-200 transition-colors",
              input: "text-gray-200",
            }}
            startContent={
              <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
            }
          />

          {tweetUrl && (
            <div className="flex items-center space-x-2 text-xs">
              {isValidTweetUrl ? (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircleIcon className="h-3 w-3" />
                  <span>Valid X.com tweet URL</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-400">
                  <XCircleIcon className="h-3 w-3" />
                  <span>Please enter a valid X.com tweet URL</span>
                </div>
              )}
            </div>
          )}
        </div>

        {showPreview && tweetId && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <EyeIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-gray-200">
                Tweet Preview
              </span>
            </div>

            <TweetPreview tweetId={tweetId} onTweetLoad={handleTweetLoad} />
          </div>
        )}

        {task?.includeText && !verificationResult && (
          <div className="rounded-xl border border-gray-300 px-3 py-2">
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

              <p className="text-sm text-gray-100">
                Include the following words, hashtags, or mentions in your tweet
                to complete the quest:
              </p>
            </div>

            <RequiredTextChips includeText={task.includeText} />
          </div>
        )}

        {error && (
          <Card className="border border-red-500/50 bg-red-900/20">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </CardBody>
          </Card>
        )}

        {verificationResult && !isQuestSubmitted && (
          <Card className="border border-green-500/50 bg-green-900/20">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />

                <div className="flex-1">
                  <p className="text-sm font-medium text-green-300">
                    Tweet Verification Successful! ✓
                  </p>

                  <div className="mt-2 space-y-1 text-xs text-green-200">
                    <p>✓ Author: @{verificationResult.username}</p>
                    <p>✓ Posted: {formatDate(verificationResult.createdAt)}</p>
                    {verificationResult.requirementsMet
                      ?.containsRequiredText && <p>✓ Contains required text</p>}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Show task completion status */}
        {isTaskCompleted && (
          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
            <CheckCircleIcon className="h-4 w-4 text-green-400" />
            <p className="text-sm text-green-300">
              ✅ Tweet task completed successfully!
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onPress={handleVerifyTweet}
          disabled={!isValidTweetUrl || isVerifying || isTaskCompleted}
          className={`disabled:cursor-not-allowed disabled:opacity-50 ${
            isTaskCompleted
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          {isVerifying ? (
            <div className="flex items-center space-x-2">
              <Spinner size="sm" color="white" />
              <span>Verifying...</span>
            </div>
          ) : isTaskCompleted ? (
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-4 w-4" />
              <span>Completed</span>
            </div>
          ) : (
            "Verify Tweet"
          )}
        </Button>
      </div>
    </div>
  );
};

export default XTweetTask;
