import React from "react";

import FilterHeader from "@/components/common/filter/FilterHeader";

const PodFilterHeader = ({
  nameFilter,
  setNameFilter,
  hasActiveFilters,
  activeFiltersCount,
}) => {
  return (
    <FilterHeader
      headerLabel="pods"
      linkLabel="Create Pod"
      nameFilter={nameFilter}
      setNameFilter={setNameFilter}
      searchPlaceholder="Search Pods..."
      hasActiveFilters={hasActiveFilters}
      linkHref="/admin/manage/pods/create"
      activeFiltersCount={activeFiltersCount}
    />
  );
};

export default PodFilterHeader;
