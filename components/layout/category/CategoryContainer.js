import React from "react";

import CategoryItem from "./CategoryItem";
import QuestList from "../quests/QuestList";

const CategoryContainer = ({ category }) => {
  return (
    <section key={category.id} className="mb-7 rounded-2.5xl bg-black/50">
      <CategoryItem
        title={category.title ?? "Untitled"}
        icon={category.icon ?? "/default-icon.png"}
        background={category.background ?? "/default-background.jpg"}
      />

      <QuestList categoryId={category.id} />
    </section>
  );
};

export default CategoryContainer;
