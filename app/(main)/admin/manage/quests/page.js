import React from "react";

import PodProvider from "@/providers/PodProvider";

import MainPageScroll from "@/components/common/MainPageScroll";

import WrapperContainer from "@/components/common/WrapperContainer";

import CategoryItemLoader from "@/components/ui/loader/category/CategoryItemLoader";
import AdminQuestListLoader from "@/components/ui/loader/quest/admin/AdminQuestListLoader";

export const metadata = {
  title: "Manage Quests | Admin Panel | NeoPod",
  description:
    "Create, edit, and organize quests for ambassadors. Shape the journey and engagement through meaningful tasks and challenges.",
};

const ManageQuestsPage = async () => {
  return (
    <PodProvider>
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
    </PodProvider>
  );
};

export default ManageQuestsPage;
