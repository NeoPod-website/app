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
      nameFilter={nameFilter}
      setNameFilter={setNameFilter}
      hasActiveFilters={hasActiveFilters}
      activeFiltersCount={activeFiltersCount}
    />
  );
};

export default PodFilterHeader;
