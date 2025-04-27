import React from "react";

import CategoryItem from "./CategoryItem";
import QuestList from "../quests/QuestList";
import WrapperContainer from "@/components/common/WrapperContainer";

const CategoryContainer = ({
  category,
  compact = false,
  scrollable = false,
}) => {
  return (
    <WrapperContainer scrollable={scrollable}>
      <CategoryItem
        id={category.id}
        title={category.title ?? "No Category"}
        icon={category.icon ?? "/dashboard/category/icon-1.png"}
        background={
          category.background ?? "/dashboard/category/background-2.jpg"
        }
      />

      <QuestList
        categoryId={category.id}
        compact={compact}
        scrollable={scrollable}
      />
    </WrapperContainer>
  );
};

export default CategoryContainer;
