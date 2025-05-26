import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";
import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";

const QuestLoading = () => {
  return (
    <WrapperContainer>
      <CategoryItemLoader />
      <QuestListLoader />
    </WrapperContainer>
  );
};

export default QuestLoading;
