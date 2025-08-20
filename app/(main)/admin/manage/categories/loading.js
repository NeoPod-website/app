import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";

import FilterPanelLoader from "@/components/ui/loader/filter/FilterPanelLoader";
import FilterHeaderLoader from "@/components/ui/loader/filter/FilterHeaderLoader";
import CategoryListLoader from "@/components/ui/loader/category/CategoryListLoader";

const CategoryLoading = () => {
  return (
    <MainPageScroll scrollable={false}>
      <FilterHeaderLoader />
      <FilterPanelLoader />
      <CategoryListLoader />
    </MainPageScroll>
  );
};

export default CategoryLoading;
