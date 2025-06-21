import React from "react";

import QuestProvider from "@/providers/QuestProvider";

import MainPageScroll from "@/components/common/MainPageScroll";

import FilterHeader from "@/components/common/filter/FilterHeader";
import WrapperContainer from "@/components/common/WrapperContainer";

import FilterPanelLoader from "@/components/ui/loader/filter/FilterPanelLoader";
import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";
import AdminQuestListLoader from "@/components/ui/loader/quest/admin/AdminQuestListLoader";

export const metadata = {
  title: "Manage Quests | Admin Panel | NeoPod",
  description:
    "Create, edit, and organize quests for ambassadors. Shape the journey and engagement through meaningful tasks and challenges.",
};

const ManageQuestsPage = async () => {
  return (
    <QuestProvider>
      <MainPageScroll scrollable={false}>
        <FilterHeader
          showFilter={false}
          linkLabel="Loading..."
          headerLabel="Quests"
          linkHref="/admin/manage/quests"
        />
        <FilterPanelLoader />

        <WrapperContainer>
          <CategoryItemLoader />
          <AdminQuestListLoader />
        </WrapperContainer>
      </MainPageScroll>
    </QuestProvider>
  );
};

export default ManageQuestsPage;
