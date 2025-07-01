// import React from "react";

// import WrapperContainer from "@/components/common/WrapperContainer";

// const SubmissionDetailQuestCard = ({ InfoItem, submission }) => {
//   return (
//     <WrapperContainer className="space-y-6 px-10 py-6 scrollbar-hide">
//       <h3 className="mb-4 text-lg font-bold text-white">Quest Details</h3>

//       <div className="space-y-4">
//         <InfoItem label="Quest Name">{submission.quest_name}</InfoItem>

//         <InfoItem label="Category">
//           <span className="rounded-md bg-gray-600 px-2 py-1 text-sm">
//             {submission.category_name}
//           </span>
//         </InfoItem>
//       </div>
//     </WrapperContainer>
//   );
// };

// export default SubmissionDetailQuestCard;

import {
  CoinsIcon,
  ClockIcon,
  RepeatIcon,
  TrophyIcon,
  CalendarIcon,
} from "lucide-react";
import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

const SubmissionDetailQuestCard = ({ InfoItem, submission }) => {
  // Format cooldown for display
  const formatCooldown = (cooldown) => {
    if (!cooldown || cooldown === "None") return "None";
    return cooldown;
  };

  // Format recurrence for display
  const formatRecurrence = (recurrence) => {
    if (!recurrence) return "One-time";
    return recurrence.charAt(0).toUpperCase() + recurrence.slice(1);
  };

  // Format due date
  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No deadline";
    return new Date(dueDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <WrapperContainer className="space-y-6 px-10 py-6 scrollbar-hide">
      <h3 className="mb-4 text-lg font-bold text-white">Quest Details</h3>

      <div className="space-y-4">
        {submission.quest_points && (
          <InfoItem label="Points" icon={TrophyIcon}>
            <span className="font-semibold text-yellow-300">
              {submission.quest_points} XP
            </span>
          </InfoItem>
        )}

        {submission.quest_rewards && submission.quest_rewards.length > 0 && (
          <InfoItem label="Rewards" icon={CoinsIcon}>
            <div className="space-y-1">
              {submission.quest_rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="capitalize text-gray-300">
                    {reward.type}:
                  </span>
                  <span className="font-semibold text-yellow-300">
                    +{reward.amount}
                  </span>
                </div>
              ))}
            </div>
          </InfoItem>
        )}

        {submission.quest_cooldown && submission.quest_cooldown !== "None" && (
          <InfoItem label="Cooldown" icon={ClockIcon}>
            <span className="text-gray-300">
              {formatCooldown(submission.quest_cooldown)}
            </span>
          </InfoItem>
        )}

        {submission.quest_recurrence && (
          <InfoItem label="Recurrence" icon={RepeatIcon}>
            <span className="text-gray-300">
              {formatRecurrence(submission.quest_recurrence)}
            </span>
          </InfoItem>
        )}

        {submission.quest_due_date && (
          <InfoItem label="Due Date" icon={CalendarIcon}>
            <span className="text-gray-300">
              {formatDueDate(submission.quest_due_date)}
            </span>
          </InfoItem>
        )}

        {submission.quest_limit && (
          <InfoItem label="Submission Limit">
            <span className="text-gray-300">
              {submission.quest_limit} max submissions
            </span>
          </InfoItem>
        )}
      </div>
    </WrapperContainer>
  );
};

export default SubmissionDetailQuestCard;
