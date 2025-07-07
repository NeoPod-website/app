import React from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

import SubmissionDetailSidebarCard from "./SubmissionDetailSidebarCard";

import WrapperContainer from "@/components/common/WrapperContainer";

const getStatusInfo = (reviewStatus, reviewedBy, resubmissionCount) => {
  const statusInfo = {
    pending: {
      title: "Review Process",
      titleColor: "text-yellow-300",
      content: [
        "Your submission is currently being reviewed by our team. This process typically takes 24-48 hours.",
        "You can edit your submission until it has been approved or rejected. Any changes will reset the review timer.",
        "You'll receive a notification once the review is complete.",
      ],
    },

    approved: {
      title: "Submission Approved",
      titleColor: "text-green-300",
      content: [
        "Congratulations! Your submission has been approved by our review team.",
        "Rewards and points will be distributed to your account within 24 hours.",
        "You can no longer edit this submission as it has been finalized.",
      ],
    },

    rejected: {
      title:
        reviewedBy === "auto-system"
          ? "Auto-Review Failed"
          : "Submission Rejected",
      titleColor: "text-red-300",
      content: [
        reviewedBy === "auto-system"
          ? "Automated review detected issues with your submission. Please check the feedback below."
          : "Your submission was rejected during the review process. Please check any feedback provided.",
        resubmissionCount > 0
          ? `This is resubmission #${resubmissionCount}. Please address all previous feedback.`
          : "You can edit and resubmit your submission to address the issues.",
        "Contact support if you believe this was rejected in error.",
      ],
    },

    highlighted: {
      title: "Outstanding Work",
      titleColor: "text-purple-300",
      content: [
        "Exceptional work! Your submission has been highlighted as a standout example.",
        "This submission may be featured in our community showcase.",
        "Additional bonus rewards may be applied to your account.",
      ],
    },
  };

  // Handle auto-approved submissions
  if (reviewedBy === "auto-system" && reviewStatus === "approved") {
    return {
      title: "Auto-Approved",
      titleColor: "text-green-300",
      content: [
        "Great work! Your submission passed automated verification and has been auto-approved.",
        "All tasks were completed successfully and verified by our automated systems.",
        "Rewards and points have been distributed to your account.",
      ],
    };
  }

  return statusInfo[reviewStatus?.toLowerCase()] || statusInfo.pending;
};

const SubmissionDetailSidebarHeader = ({ submission }) => {
  return (
    <section className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <h2 className="text-md text-white">Submission Info</h2>

      <Link
        href={`/quests/${submission.category_id}/${submission.quest_id}`}
        className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1 text-gray-50 transition-colors hover:border-gray-300 hover:text-white"
      >
        <ExternalLinkIcon size={16} />
        View Quest
      </Link>
    </section>
  );
};

const SubmissionDetailSidebar = ({ submission }) => {
  const completedTasks = Object.keys(submission?.submission_data || {}).length;
  const totalTasks = submission?.quest_tasks?.length || completedTasks;

  const statusInfo = getStatusInfo(
    submission?.review_status,
    submission?.reviewed_by,
    submission?.resubmission_count,
  );

  return (
    <div className="flex max-w-md flex-1 flex-col gap-2">
      <SubmissionDetailSidebarHeader submission={submission} />

      <div className="space-y-3 overflow-y-auto scrollbar-hide">
        <SubmissionDetailSidebarCard
          submission={submission}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
        />

        <WrapperContainer className="space-y-6 px-10 py-6 scrollbar-hide">
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${statusInfo.titleColor}`}>
              {statusInfo.title}
            </h3>

            <div className="space-y-3 text-sm text-gray-200">
              {statusInfo.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {submission?.review_comment && (
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-semibold text-white">
                  Review Feedback:
                </h4>

                <div className="rounded-lg border border-gray-600 bg-gray-800/50 p-3">
                  <p className="text-sm text-gray-200">
                    {submission.review_comment}
                  </p>

                  {submission?.reviewed_by && (
                    <p className="mt-2 text-xs text-gray-400">
                      Reviewed by:{" "}
                      {submission.reviewed_by === "auto-system"
                        ? "Automated System"
                        : submission.reviewed_by}
                    </p>
                  )}
                </div>
              </div>
            )}

            {submission?.review_status === "approved" &&
              submission?.rewards &&
              submission.rewards.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-semibold text-green-300">
                    Earned Rewards:
                  </h4>

                  <div className="rounded-lg border border-green-600/30 bg-green-800/20 p-3">
                    {submission.rewards.map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="capitalize text-gray-200">
                          {reward.type}:
                        </span>

                        <span className="font-semibold text-green-300">
                          +{reward.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </WrapperContainer>
      </div>
    </div>
  );
};

export default SubmissionDetailSidebar;
