import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";
import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";

const CategoryLoading = () => {
  return (
    <WrapperContainer scrollable={true}>
      <CategoryItemLoader />
      <QuestListLoader compact={true} scrollable={true} />
    </WrapperContainer>
  );
};

export default CategoryLoading;
