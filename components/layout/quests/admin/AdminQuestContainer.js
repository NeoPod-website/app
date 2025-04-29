import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

import CategoryItem from "@/components/layout/category/CategoryItem";
import AdminQuestList from "@/components/layout/quests/admin/AdminQuestList";

const AdminQuestContainer = ({ category }) => {
  return (
    <WrapperContainer scrollable>
      <CategoryItem
        id={category.id}
        showDescription
        title={category.title ?? "No Category"}
        description={category.description ?? ""}
        icon={category.icon ?? "/dashboard/category/icon-1.png"}
        background={
          category.background ?? "/dashboard/category/background-2.jpg"
        }
      />

      <AdminQuestList categoryId={category.id} category={category} />
    </WrapperContainer>
  );
};

export default AdminQuestContainer;
