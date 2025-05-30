import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";
import AdminQuestListLoader from "@/components/ui/loader/quest/admin/AdminQuestListLoader";

const QuestLoading = () => {
  return (
    <div className="flex flex-1 flex-col px-7 pb-5">
      <WrapperContainer scrollable>
        <CategoryItemLoader />
        <AdminQuestListLoader />
      </WrapperContainer>
    </div>
  );
};

export default QuestLoading;
