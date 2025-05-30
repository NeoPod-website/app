import React from "react";

import FilterHeader from "@/components/common/filter/FilterHeader";

const CategoryFilterHeader = ({
  podId,
  nameFilter,
  setNameFilter,
  hasActiveFilters,
  activeFiltersCount,
}) => {
  return (
    <FilterHeader
      headerLabel="categories"
      linkLabel="Create Category"
      nameFilter={nameFilter}
      setNameFilter={setNameFilter}
      hasActiveFilters={hasActiveFilters}
      activeFiltersCount={activeFiltersCount}
      searchPlaceholder="Search Categories..."
      linkHref={`/admin/manage/categories/${podId}/create`}
    />
  );
};

export default CategoryFilterHeader;
