import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

const SubmissionDetailQuestCard = ({ InfoItem, submission }) => {
  return (
    <WrapperContainer className="space-y-6 px-10 py-6 scrollbar-hide">
      <h3 className="mb-4 text-lg font-bold text-white">Quest Details</h3>

      <div className="space-y-4">
        <InfoItem label="Quest Name">{submission.quest_name}</InfoItem>

        <InfoItem label="Category">
          <span className="rounded-md bg-gray-600 px-2 py-1 text-sm">
            {submission.category_name}
          </span>
        </InfoItem>
      </div>
    </WrapperContainer>
  );
};

export default SubmissionDetailQuestCard;
