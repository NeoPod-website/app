import React from "react";

import CategoryContainer from "./CategoryContainer";
import MainPageScroll from "@/components/common/MainPageScroll";

const CategoriesList = ({ categories }) => {
  return (
    <MainPageScroll scrollable>
      {categories.map((category) => {
        return (
          <CategoryContainer
            isQuestPage={true}
            category={category}
            key={category.category_id}
          />
        );
      })}
    </MainPageScroll>
  );
};

export default CategoriesList;
