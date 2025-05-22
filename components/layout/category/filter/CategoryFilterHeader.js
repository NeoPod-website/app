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
      linkHref={`/admin/manage/categories/${podId}/create`}
      activeFiltersCount={activeFiltersCount}
    />
  );
};

export default CategoryFilterHeader;
