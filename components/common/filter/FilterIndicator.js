import React from "react";
import { FilterIcon } from "lucide-react";

const FilterIndicator = ({ hasActiveFilters, activeFiltersCount }) => {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-gray-400 bg-gradient-dark px-3 py-1.5 text-sm text-white transition-colors hover:border-gray-300 hover:bg-black/70"
      aria-controls="filter-panel"
    >
      <FilterIcon className="h-4 w-4" />

      {hasActiveFilters ? "Filters Applied" : "Filters"}

      {hasActiveFilters && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink text-xs font-medium text-black">
          {activeFiltersCount}
        </span>
      )}
    </div>
  );
};

export default FilterIndicator;
