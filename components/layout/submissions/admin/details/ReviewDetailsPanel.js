// import { useState } from "react";
// import {
//   XCircleIcon,
//   CheckCircleIcon,
//   StarIcon,
//   BanIcon,
//   UndoIcon,
//   ExternalLinkIcon,
//   UserIcon,
//   CalendarIcon,
//   TagIcon,
//   MessageSquareIcon,
//   LoaderIcon,
//   FlagIcon,
//   ClockIcon,
//   PenToolIcon,
//   RefreshCwIcon,
// } from "lucide-react";

// const getTimeAgo = (timestamp) => {
//   const now = new Date();
//   const date = new Date(timestamp);
//   const diffInMs = now.getTime() - date.getTime();
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInHours < 1) {
//     const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
//     return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//   } else {
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
//   }
// };

// const getStatusBadge = (status) => {
//   const configs = {
//     pending: {
//       text: "Pending",
//       icon: ClockIcon,
//       bg: "bg-yellow-500/20",
//       text_color: "text-yellow-400",
//       border: "border-yellow-500/30",
//     },
//     approved: {
//       text: "Success",
//       icon: CheckCircleIcon,
//       bg: "bg-green-500/20",
//       text_color: "text-green-400",
//       border: "border-green-500/30",
//     },
//     rejected: {
//       text: "Failure",
//       icon: XCircleIcon,
//       bg: "bg-red-500/20",
//       text_color: "text-red-400",
//       border: "border-red-500/30",
//     },
//     highlighted: {
//       text: "Highlighted",
//       icon: StarIcon,
//       bg: "bg-purple-500/20",
//       text_color: "text-purple-400",
//       border: "border-purple-500/30",
//     },
//   };
//   return configs[status] || configs.pending;
// };

// const getActivityIcon = (action) => {
//   const iconMap = {
//     submitted: UserIcon,
//     reviewed: CheckCircleIcon,
//     status_changed: RefreshCwIcon,
//   };
//   return iconMap[action] || UserIcon;
// };

// export default function ReviewDetailsPanel({
//   submission,
//   onReview,
//   isLoading,
//   reviewComment,
//   setReviewComment,
// }) {
//   const [selectedAction, setSelectedAction] = useState(null);

//   if (!submission) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-900">
//         <div className="text-center text-gray-400">
//           <MessageSquareIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
//           <p>Select a submission to view details</p>
//         </div>
//       </div>
//     );
//   }

//   const handleReview = (action) => {
//     if (!reviewComment.trim() && action === "rejected") {
//       alert("Comment is required for rejection");
//       return;
//     }
//     onReview(submission.submission_id, action, reviewComment);
//     setSelectedAction(null);
//   };

//   const statusConfig = getStatusBadge(submission.review_status);
//   const StatusIcon = statusConfig.icon;
//   const verificationData = Object.values(submission.submission_data)[0];

//   return (
//     <div className="flex flex-1 flex-col bg-gray-900">
//       {/* Header */}
//       <div className="border-b border-gray-700 p-6">
//         <div className="mb-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <span
//               className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.bg} ${statusConfig.text_color} ${statusConfig.border}`}
//             >
//               <StatusIcon className="h-4 w-4" />
//               {submission.review_status === "rejected"
//                 ? "Submission Rejected"
//                 : submission.review_status === "approved"
//                   ? "Submission Approved"
//                   : submission.review_status === "highlighted"
//                     ? "Submission Highlighted"
//                     : "Submission Pending"}
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//             {submission.review_status !== "pending" && (
//               <>
//                 <button className="rounded-lg bg-gray-700 px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-gray-600">
//                   Ban
//                 </button>
//                 <button className="rounded-lg bg-gray-700 px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-gray-600">
//                   Undo
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 space-y-6 overflow-y-auto p-6">
//         {/* Twitter Link Section */}
//         {submission.twitter_link && (
//           <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/20 to-transparent p-4">
//             <div className="mb-3 flex items-center gap-2">
//               <div className="bg-blue-500/20 rounded-lg p-2">
//                 <ExternalLinkIcon className="h-4 w-4 text-blue-400" />
//               </div>
//               <span className="font-medium text-blue-400">Twitter Link</span>
//             </div>

//             {/* Mock Twitter embed */}
//             <div className="rounded-xl border border-gray-600 bg-gray-800 p-4">
//               <div className="mb-3 flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-bold text-white">
//                   N
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="font-semibold text-white">
//                       Neo Smart Economy
//                     </span>
//                     <div className="bg-blue-500 flex h-4 w-4 items-center justify-center rounded-full">
//                       <span className="text-xs text-white">✓</span>
//                     </div>
//                   </div>
//                   <span className="text-sm text-gray-400">@NEO_Blockchain</span>
//                 </div>
//               </div>

//               <p className="mb-3 text-white">
//                 🔒 Anti-MEV feature is now LIVE on Neo X TestNet! 🎯
//                 <br />
//                 <br />
//                 Protecting transactions from #MEV exploitation for a fairer,
//                 more secure #DeFi ecosystem!
//                 <br />
//                 <br />
//                 Read more. 👇
//               </p>

//               <div className="mb-3 rounded-lg bg-gray-700 p-3">
//                 <img
//                   src="/api/placeholder/400/200"
//                   alt="Anti-MEV Feature"
//                   className="mb-2 h-32 w-full rounded-lg object-cover"
//                 />
//                 <div className="text-sm font-medium text-green-400">
//                   Anti-MEV Feature
//                 </div>
//                 <div className="text-lg font-bold text-green-300">Now LIVE</div>
//                 <div className="text-sm text-blue-400">On Neo X TestNet</div>
//               </div>

//               <div className="flex items-center justify-between text-sm text-gray-400">
//                 <span>4:04 PM · Mar 13, 2025</span>
//                 <span>371K Views</span>
//               </div>

//               <div className="mt-3 flex items-center justify-between border-t border-gray-700 pt-3">
//                 <div className="flex items-center gap-1 text-gray-400">
//                   <MessageSquareIcon className="h-4 w-4" />
//                   <span className="text-sm">19</span>
//                 </div>
//                 <div className="flex items-center gap-1 text-gray-400">
//                   <RefreshCwIcon className="h-4 w-4" />
//                   <span className="text-sm">108</span>
//                 </div>
//                 <div className="flex items-center gap-1 text-gray-400">
//                   <span className="text-sm">❤️ 130</span>
//                 </div>
//                 <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Activity Section */}
//         <div className="rounded-xl bg-gray-800/50 p-4">
//           <h3 className="mb-4 font-semibold text-white">Activity</h3>
//           <div className="space-y-3">
//             {submission.activity_log?.map((activity, index) => {
//               const ActivityIcon = getActivityIcon(activity.action);
//               return (
//                 <div key={index} className="flex items-center gap-3">
//                   <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700">
//                     <ActivityIcon className="h-3 w-3 text-gray-400" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm font-medium text-white">
//                         {submission.ambassador_name}
//                       </span>
//                       <span className="text-sm text-gray-400">
//                         {activity.action === "submitted"
//                           ? "submitted"
//                           : activity.action === "reviewed"
//                             ? `reviewed submission with ${activity.result}`
//                             : activity.action === "status_changed"
//                               ? `changed submission status to ${activity.to}`
//                               : activity.details}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {getTimeAgo(activity.timestamp)}
//                       </span>
//                     </div>
//                   </div>
//                   {activity.result && (
//                     <span
//                       className={`rounded px-2 py-0.5 text-xs font-medium ${
//                         activity.result === "Success"
//                           ? "bg-green-500/20 text-green-400"
//                           : activity.result === "Failure"
//                             ? "bg-red-500/20 text-red-400"
//                             : activity.result === "Highlighted"
//                               ? "bg-purple-500/20 text-purple-400"
//                               : "bg-gray-500/20 text-gray-400"
//                       }`}
//                     >
//                       {activity.result}
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Submission Details */}
//         <div className="rounded-xl bg-gray-800/50 p-4">
//           <h3 className="mb-4 font-semibold text-white">Submission Details</h3>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <div className="mb-2 flex items-center gap-2">
//                   <UserIcon className="h-4 w-4 text-gray-400" />
//                   <span className="text-sm text-gray-400">Ambassador</span>
//                 </div>
//                 <span className="font-medium text-white">
//                   {submission.ambassador_name}
//                 </span>
//               </div>

//               <div>
//                 <div className="mb-2 flex items-center gap-2">
//                   <CalendarIcon className="h-4 w-4 text-gray-400" />
//                   <span className="text-sm text-gray-400">Submitted</span>
//                 </div>
//                 <span className="font-medium text-white">
//                   {getTimeAgo(submission.submitted_at)}
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <div className="mb-2 flex items-center gap-2">
//                   <TagIcon className="h-4 w-4 text-gray-400" />
//                   <span className="text-sm text-gray-400">Category</span>
//                 </div>
//                 <span className="font-medium text-white">
//                   {submission.category_name}
//                 </span>
//               </div>

//               <div>
//                 <div className="mb-2 flex items-center gap-2">
//                   <span className="text-sm text-gray-400">Pod</span>
//                 </div>
//                 <span className="font-medium text-white">
//                   {submission.pod_name}
//                 </span>
//               </div>
//             </div>

//             {/* Verification Status */}
//             <div className="border-t border-gray-700 pt-4">
//               <div className="mb-2 flex items-center gap-2">
//                 <span className="text-sm text-gray-400">
//                   Verification Status
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div
//                   className={`h-2 w-2 rounded-full ${verificationData?.verified ? "bg-green-400" : "bg-red-400"}`}
//                 />
//                 <span
//                   className={`text-sm font-medium ${verificationData?.verified ? "text-green-400" : "text-red-400"}`}
//                 >
//                   {verificationData?.verified ? "Verified" : "Not Verified"}
//                 </span>
//                 {verificationData?.username && (
//                   <>
//                     <span className="text-gray-400">•</span>
//                     <span className="text-gray-300">
//                       @{verificationData.username}
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Additional Context */}
//             {submission.additional_context && (
//               <div className="border-t border-gray-700 pt-4">
//                 <div className="mb-2 flex items-center gap-2">
//                   <span className="text-sm text-gray-400">
//                     Additional Context
//                   </span>
//                 </div>
//                 <p className="text-sm leading-relaxed text-gray-300">
//                   {submission.additional_context}
//                 </p>
//               </div>
//             )}

//             {/* Flags */}
//             {submission.is_flagged && (
//               <div className="border-t border-gray-700 pt-4">
//                 <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
//                   <FlagIcon className="h-4 w-4 text-red-400" />
//                   <span className="font-medium text-red-400">
//                     This submission has been flagged
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* Review Comment (if reviewed) */}
//             {submission.review_comment && submission.reviewed_by && (
//               <div className="border-t border-gray-700 pt-4">
//                 <div className="mb-2 flex items-center gap-2">
//                   <MessageSquareIcon className="h-4 w-4 text-gray-400" />
//                   <span className="text-sm text-gray-400">
//                     Review from {submission.reviewed_by}
//                   </span>
//                 </div>
//                 <div className="rounded-lg bg-gray-700/50 p-3">
//                   <p className="text-sm leading-relaxed text-gray-200">
//                     {submission.review_comment}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Review Actions */}
//         {submission.review_status === "pending" && (
//           <div className="rounded-xl bg-gray-800/50 p-4">
//             <h3 className="mb-4 font-semibold text-white">Your Comment</h3>

//             <textarea
//               value={reviewComment}
//               onChange={(e) => setReviewComment(e.target.value)}
//               placeholder="Your comment goes here..."
//               rows={4}
//               className="mb-4 w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//             />

//             <div className="flex items-center justify-between">
//               <button
//                 onClick={() => handleReview("rejected")}
//                 disabled={isLoading}
//                 className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <LoaderIcon className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <XCircleIcon className="h-4 w-4" />
//                 )}
//                 Fail
//               </button>

//               <button
//                 onClick={() => handleReview("highlighted")}
//                 disabled={isLoading}
//                 className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <LoaderIcon className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <PenToolIcon className="h-4 w-4" />
//                 )}
//                 Highlights
//               </button>

//               <button
//                 onClick={() => handleReview("approved")}
//                 disabled={isLoading}
//                 className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 rounded-lg px-6 py-2 font-medium text-white transition-colors disabled:opacity-50"
//               >
//                 {isLoading ? (
//                   <LoaderIcon className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <CheckCircleIcon className="h-4 w-4" />
//                 )}
//                 Success
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { MessageSquareIcon } from "lucide-react";

import ReviewDetailsBtn from "./ReviewDetailsBtn";
import ReviewDetailsHeader from "./ReviewDetailsHeader";
import ReviewDetailsComment from "./ReviewDetailsComment";
import ReviewDetailsTimeline from "./ReviewDetailsTimeline";
import ReviewDetailsSubmissions from "./ReviewDetailsSubmissions";

import WrapperContainer from "@/components/common/WrapperContainer";

export default function ReviewDetailsPanel({
  onReview,
  submission,
  reviewComment,
  setReviewComment,
  onSubmissionUpdate,
}) {
  if (!submission) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <MessageSquareIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Select a submission to view details</p>
        </div>
      </div>
    );
  }

  const handleReview = async (action) => {
    if (!reviewComment.trim() && action === "rejected") {
      alert("Comment is required for rejection");
      return;
    }

    try {
      await onReview(submission.submission_id, action, reviewComment);
      // Note: Parent component should handle updating the submission with new history
    } catch (error) {
      console.error("Review failed:", error);
    }
  };

  return (
    <div className="flex flex-[2] flex-col space-y-3 overflow-hidden">
      <ReviewDetailsHeader
        submission={submission}
        onSubmissionUpdate={onSubmissionUpdate}
      />

      <WrapperContainer className="flex flex-1 flex-col justify-between space-y-6 overflow-y-auto p-6 scrollbar-hide">
        <ReviewDetailsSubmissions submission={submission} />

        <div className="space-y-6">
          <ReviewDetailsTimeline submission={submission} />

          <ReviewDetailsComment
            submission={submission}
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
          />

          <ReviewDetailsBtn
            submission={submission}
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
            onSubmissionUpdate={onSubmissionUpdate}
          />
        </div>
      </WrapperContainer>
    </div>
  );
}
