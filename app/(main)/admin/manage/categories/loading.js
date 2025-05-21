import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import FilterHeaderLoader from "@/components/ui/loader/filter/FilterHeaderLoader";
import CategoryListLoader from "@/components/ui/loader/category/CategoryListLoader";

const CategoryLoading = () => {
  return (
    <MainPageScroll scrollable={false}>
      <FilterHeaderLoader />
      <CategoryListLoader />
    </MainPageScroll>
  );
};

export default CategoryLoading;
