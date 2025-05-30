import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";
import AdminQuestListLoader from "@/components/ui/loader/quest/admin/AdminQuestListLoader";

const QuestLoading = () => {
  return (
    <>
      <WrapperContainer>
        <CategoryItemLoader />
        <AdminQuestListLoader count={2} />
      </WrapperContainer>

      <WrapperContainer>
        <CategoryItemLoader />
        <AdminQuestListLoader count={3} />
      </WrapperContainer>
    </>
  );
};

export default QuestLoading;
