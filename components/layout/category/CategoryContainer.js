import React from "react";

import CategoryItem from "./CategoryItem";
import QuestList from "../quests/QuestList";

const CategoryContainer = ({
  category,
  compact = false,
  scrollable = false,
}) => {
  return (
    <section
      key={category.id}
      className={`flex-1 rounded-2.5xl bg-black/50 ${scrollable ? "flex flex-col overflow-hidden" : ""}`}
    >
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
    </section>
  );
};

export default CategoryContainer;
