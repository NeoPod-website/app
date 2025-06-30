"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";
import { MessageSquareIcon } from "lucide-react";

const HistoryItemCardReview = ({
  submission,
  statusConfig,
  maxCommentLength = 200,
}) => {
  const [showMore, setShowMore] = useState(false);

  const truncatedComment =
    submission.review_comment &&
    submission.review_comment.length > maxCommentLength
      ? submission.review_comment.substring(0, maxCommentLength) + "..."
      : submission.review_comment;

  return submission.review_comment ? (
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
  );
};

export default HistoryItemCardReview;
