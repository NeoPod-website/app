// "use client";

// import Link from "next/link";
// import { Button } from "@heroui/react";
// import React, { useState } from "react";

// const getTimeAgo = (timestamp) => {
//   const now = new Date();
//   const submittedDate = new Date(timestamp);

//   const diffInMs = now.getTime() - submittedDate.getTime();

//   const diffInSeconds = Math.floor(diffInMs / 1000);
//   const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds}s ago`;
//   } else if (diffInMinutes < 60) {
//     return `${diffInMinutes} min ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//   } else {
//     // For dates older than a day, show the actual date
//     const options = {
//       month: "short",
//       day: "numeric",
//       year:
//         submittedDate.getFullYear() !== now.getFullYear()
//           ? "numeric"
//           : undefined,
//     };
//     return submittedDate.toLocaleDateString("en-US", options);
//   }
// };

// const getStatusStyles = (status) => {
//   switch (status) {
//     case "approved":
//       return {
//         className: "text-green-500 border-green-500",
//         text: "Success",
//       };
//     case "rejected":
//       return {
//         className: "text-red-500 border-red-500",
//         text: "Rejected",
//       };
//     case "highlighted":
//       return {
//         className: "text-yellow-500 border-yellow-500",
//         text: "Highlighted",
//       };
//     default:
//       return {
//         className: "border-gray-400",
//         text: status,
//       };
//   }
// };

// const HistoryItemCard = ({ submission, maxCommentLength = 200 }) => {
//   const [showMore, setShowMore] = useState(false);
//   const statusStyles = getStatusStyles(submission.review_status);

//   const truncatedComment =
//     submission.review_comment &&
//     submission.review_comment.length > maxCommentLength
//       ? submission.review_comment.substring(0, maxCommentLength) + "..."
//       : submission.review_comment;

//   return (
//     <div
//       className={
//         "relative mb-3 rounded-lg border bg-gradient-dark p-4 " +
//         statusStyles.className
//       }
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="mb-1 text-sm text-gray-200">
//             {getTimeAgo(submission.submitted_at)}
//           </div>

//           <h3 className="mb-2 text-base font-medium text-white">
//             {submission.quest_name}
//           </h3>

//           {submission.review_comment && (
//             <>
//               <p className="mb-3 text-base text-gray-300">
//                 {showMore ? submission.review_comment : truncatedComment}
//               </p>

//               {submission.review_comment.length > maxCommentLength && (
//                 <Button
//                   variant="link"
//                   onPress={() => setShowMore(!showMore)}
//                   className="h-auto p-0 text-sm text-gray-100 hover:text-white"
//                 >
//                   {showMore ? "Show Less" : "Show More"}
//                 </Button>
//               )}
//             </>
//           )}

//           <div>
//             {!submission.review_comment && (
//               <p className="text-sm italic text-gray-500">
//                 No review comment available
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="ml-4 text-sm">{statusStyles.text}</div>

//         <Link
//           href={`/submissions/${submission.submission_id}`}
//           className="absolute bottom-4 right-4 text-sm text-gray-100 hover:text-white"
//         >
//           Check Submission
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default HistoryItemCard;

"use client";

import {
  StarIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  MessageSquareIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";
import React, { useState } from "react";

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const submittedDate = new Date(timestamp);
  const diffInMs = now.getTime() - submittedDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else {
    const options = {
      month: "short",
      day: "numeric",
      year:
        submittedDate.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    };
    return submittedDate.toLocaleDateString("en-US", options);
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case "approved":
      return {
        icon: CheckCircleIcon,
        text: "Approved",
        chipClass: "bg-green-500/30 text-green-400 ring-green-500/40",
        borderClass: "border-green-500/30",
        bgClass: "bg-green-500/5",
      };
    case "rejected":
      return {
        icon: XCircleIcon,
        text: "Rejected",
        chipClass: "bg-red-500/30 text-red-400 ring-red-500/40",
        borderClass: "border-red-500/30",
        bgClass: "bg-red-500/5",
      };
    case "highlighted":
      return {
        icon: StarIcon,
        text: "Highlighted",
        chipClass: "bg-yellow-500/30 text-yellow-400 ring-yellow-500/40",
        borderClass: "border-yellow-500/30",
        bgClass: "bg-yellow-500/5",
      };
    default:
      return {
        icon: ClockIcon,
        text: "Pending",
        chipClass: "bg-gray-500/30 text-gray-400 ring-gray-500/40",
        borderClass: "border-gray-400",
        bgClass: "bg-gray-500/5",
      };
  }
};

const StatusChip = ({ status }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${config.chipClass}`}
    >
      <IconComponent size={12} />
      <span>{config.text}</span>
    </div>
  );
};

const HistoryItemCard = ({ submission, maxCommentLength = 200 }) => {
  const [showMore, setShowMore] = useState(false);
  const statusConfig = getStatusConfig(submission.review_status);

  const truncatedComment =
    submission.review_comment &&
    submission.review_comment.length > maxCommentLength
      ? submission.review_comment.substring(0, maxCommentLength) + "..."
      : submission.review_comment;

  return (
    <div
      className={`group relative rounded-2xl border bg-gradient-dark p-6 shadow-lg shadow-black/20 transition-all duration-200 ${statusConfig.borderClass}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <CalendarIcon size={14} />
            <span>{getTimeAgo(submission.submitted_at)}</span>
          </div>

          <h3 className="text-lg font-bold text-white transition-colors group-hover:text-gray-100">
            {submission.quest_name}
          </h3>
        </div>

        <StatusChip status={submission.review_status} />
      </div>

      {submission.review_comment ? (
        <div
          className={`mb-4 rounded-xl border-l-4 ${statusConfig.borderClass} ${statusConfig.bgClass} p-4`}
        >
          <div className="mb-2 flex items-center gap-2">
            <MessageSquareIcon size={14} className="text-gray-300" />
            <span className="text-sm font-medium text-gray-200">
              Review Comment
            </span>
          </div>

          <p className="leading-relaxed text-gray-100">
            {showMore ? submission.review_comment : truncatedComment}
          </p>

          {submission.review_comment.length > maxCommentLength && (
            <Button
              variant="link"
              onPress={() => setShowMore(!showMore)}
              className="mt-2 h-auto p-0 text-sm text-gray-300 hover:text-white"
            >
              {showMore ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-gray-400/30 bg-gray-800/20 p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <MessageSquareIcon size={14} />
            <span className="text-sm italic">No review comment available</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          {submission.resubmission_count > 0 && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>

              <span>
                {submission.resubmission_count} resubmission
                {submission.resubmission_count !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <span className="font-mono text-xs">
            ID: {submission.submission_id}
          </span>
        </div>

        <Link
          href={`/submissions/${submission.submission_id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 group-hover:bg-gray-700"
        >
          <span>View Details</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    </div>
  );
};

export default HistoryItemCard;
