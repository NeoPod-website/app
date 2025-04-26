import React from "react";
import { ClockFading, ClockIcon, HashIcon, HourglassIcon } from "lucide-react";

import { QuestDetailsChip } from "./QuestChip";

const QuestDetailHeading = ({
  title,
  due_date,
  recurrence,
  claim_limit,
  cooldown,
}) => {
  return (
    <div className="space-y-2.5">
      <h2 className="font-work-sans text-4xl font-bold">{title}</h2>

      <div className="flex gap-2">
        <QuestDetailsChip
          icon={<HourglassIcon size={12} className="text-gray-300" />}
          text={`Expires in ${due_date}`}
        />

        <QuestDetailsChip
          icon={<ClockIcon size={12} className="text-gray-300" />}
          text={recurrence}
        />

        <QuestDetailsChip
          icon={<HashIcon size={12} className="text-gray-300" />}
          text={`Claim limit: ${claim_limit}`}
        />

        <QuestDetailsChip
          icon={<ClockFading size={12} className="text-gray-300" />}
          text={cooldown}
        />
      </div>
    </div>
  );
};

export default QuestDetailHeading;
