import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import SubmissionCardLoader from "@/components/ui/loader/submission/SubmissionCardLoader";
import SubmissionsHeaderLoader from "@/components/ui/loader/submission/SubmissionHeaderLoader";

const loading = () => {
  return (
    <WrapperContainer scrollable={true}>
      <SubmissionsHeaderLoader />

      <div className="grid grid-cols-1 gap-6 px-8 pb-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <SubmissionCardLoader key={index} />
        ))}
      </div>
    </WrapperContainer>
  );
};

export default loading;
