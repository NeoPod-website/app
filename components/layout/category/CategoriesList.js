import React from "react";

import CategoryContainer from "./CategoryContainer";
import MainPageScroll from "@/components/common/MainPageScroll";

const CategoriesList = ({ categories, isQuestPage = true }) => {
  return (
    <MainPageScroll scrollable>
      {categories.map((category) => {
        return (
          <CategoryContainer
            category={category}
            isQuestPage={isQuestPage}
            key={category.category_id}
          />
        );
      })}
    </MainPageScroll>
  );
};

export default CategoriesList;
