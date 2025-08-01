import React from "react";

import FilterHeader from "@/components/common/filter/FilterHeader";

const PodFilterHeader = ({
  user,
  nameFilter,
  setNameFilter,
  hasActiveFilters,
  activeFiltersCount,
}) => {
  return (
    <FilterHeader
      headerLabel="pods"
      role={user.role_type}
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
