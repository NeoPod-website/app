import React from "react";
import { ClockFading, ClockIcon, HashIcon, HourglassIcon } from "lucide-react";

import { QuestDetailsChip } from "./QuestChip";

const QuestDetailHeading = ({
  title,
  due_date,
  cooldown,
  recurrence,
  claim_limit,
}) => {
  const formattedDueDate = due_date
    ? new Date(due_date).toLocaleDateString()
    : null;

  return (
    <div className="space-y-2.5">
      <h2 className="font-work-sans text-3xl font-bold 3xl:text-4xl">
        {title}
      </h2>

      <div className="flex gap-2">
        {due_date && (
          <QuestDetailsChip
            icon={<HourglassIcon size={12} className="text-gray-300" />}
            type="Expires in:"
            text={formattedDueDate}
          />
        )}

        {recurrence && (
          <QuestDetailsChip
            icon={<ClockIcon size={12} className="text-gray-300" />}
            type="Recurrence:"
            text={recurrence}
          />
        )}

        {claim_limit && (
          <QuestDetailsChip
            icon={<HashIcon size={12} className="text-gray-300" />}
            type="Claim limit:"
            text={claim_limit}
          />
        )}

        {cooldown && (
          <QuestDetailsChip
            icon={<ClockFading size={12} className="text-gray-300" />}
            type="Cooldown:"
            text={cooldown}
          />
        )}
      </div>
    </div>
  );
};

export default QuestDetailHeading;
