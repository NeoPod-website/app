import React from "react";

import CategoryContainer from "./CategoryContainer";
import MainPageScroll from "@/components/common/MainPageScroll";

const CategoriesList = ({ categories, isQuestPage = true, user }) => {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <MainPageScroll scrollable>
        <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
          <p className="text-xl font-bold text-white">
            No categories available
          </p>

          <p className="text-base text-gray-200">
            Check back later for new categories
          </p>
        </div>
      </MainPageScroll>
    );
  }

  return (
    <MainPageScroll scrollable>
      {categories.map((category) => {
        return (
          <CategoryContainer
            user={user}
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
