import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";
import AdminQuestListLoader from "@/components/ui/loader/quest/admin/AdminQuestListLoader";

const QuestLoading = () => {
  return (
    <MainPageScroll scrollable={false}>
      <WrapperContainer>
        <CategoryItemLoader />
        <AdminQuestListLoader count={2} />
      </WrapperContainer>

      <WrapperContainer>
        <CategoryItemLoader />
        <AdminQuestListLoader count={3} />
      </WrapperContainer>
    </MainPageScroll>
  );
};

export default QuestLoading;
