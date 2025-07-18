import React from "react";

import PodProvider from "@/providers/PodProvider";
import MainPageScroll from "@/components/common/MainPageScroll";

import FilterHeader from "@/components/common/filter/FilterHeader";
import FilterPanelLoader from "@/components/ui/loader/filter/FilterPanelLoader";
import CategoryListLoader from "@/components/ui/loader/category/CategoryListLoader";

export const metadata = {
  title: "Manage Categories | Admin Panel | NeoPod",
  description:
    "Create and organize quest categories for better structure and discoverability. Categorize quests to align with different ambassador goals.",
};

const ManageCategoriesPage = async () => {
  return (
    <PodProvider>
      <MainPageScroll scrollable={false}>
        <FilterHeader
          showFilter={false}
          linkLabel="Loading..."
          headerLabel="Categories"
          linkHref="/admin/manage/categories"
        />
        <FilterPanelLoader />
        <CategoryListLoader />
      </MainPageScroll>
    </PodProvider>
  );
};

export default ManageCategoriesPage;
