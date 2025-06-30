"use client";

import React from "react";
import Link from "next/link";
import { addToast, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Eye, RefreshCw } from "lucide-react";

const QuestSubmittedBtn = ({
  quest,
  submission,
  showSubmissionStatus = false,
}) => {
  const router = useRouter();

  const handleResubmit = () => {
    // Clear any existing submission data from Redux if needed
    // Then refresh the page to show the quest form again
    router.refresh();

    addToast({
      title: "Ready to Resubmit",
      description: "You can now update your answers and resubmit the quest.",
      color: "info",
    });
  };

  // If not showing submission status, render the normal submit button area
  if (!showSubmissionStatus) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {submission.review_status === "rejected" && (
        <Button
          size="lg"
          onPress={handleResubmit}
          endContent={<RefreshCw size={16} />}
          className="neo-button flex h-12 items-center gap-2 rounded-full border border-white bg-gradient-primary"
        >
          Resubmit
        </Button>
      )}

      <Link
        href={`/submissions/${submission.submission_id}`}
        className="neo-button flex h-12 scale-100 items-center gap-2 rounded-full border border-white bg-gradient-primary text-white transition-all active:scale-95"
      >
        View Details
        <Eye size={16} />
      </Link>
    </div>
  );
};

export default QuestSubmittedBtn;
