import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import QuestListLoader from "@/components/ui/loader/quest/QuestListLoader";
import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";

const CategoryLoading = () => {
  return (
    <div className="hidden lg:block">
      <WrapperContainer scrollable={true}>
        <CategoryItemLoader />
        <QuestListLoader compact={true} scrollable={true} />
      </WrapperContainer>
    </div>
  );
};

export default CategoryLoading;
