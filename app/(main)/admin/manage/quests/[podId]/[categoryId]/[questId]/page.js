import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";

import AdminDetailMain from "@/components/layout/quests/detail/admin/AdminDetailMain";
import AdminDetailOption from "@/components/layout/quests/detail/admin/AdminDetailOption";
import AddTaskModal from "@/components/ui/modals/AddTaskModal";

const AdminQuestPage = () => {
  return (
    <>
      <AddTaskModal />

      <MainPageScroll>
        <div className="flex h-full flex-1 gap-4">
          <AdminDetailMain />

          <AdminDetailOption />
        </div>
      </MainPageScroll>
    </>
  );
};

export default AdminQuestPage;
