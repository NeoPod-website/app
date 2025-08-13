import React from "react";
import { FilterIcon } from "lucide-react";

const FilterIndicator = ({ hasActiveFilters, activeFiltersCount }) => {
  return (
    <div
      className="hidden items-center gap-1.5 rounded-full border border-gray-400 bg-gradient-dark px-3 py-1.5 text-sm text-white transition-colors hover:border-gray-300 hover:bg-black/70 md:flex 3xl:gap-2"
      aria-controls="filter-panel"
    >
      <FilterIcon className="h-3 w-3 3xl:h-4 3xl:w-4" />

      <p className="text-sm 3xl:text-base">
        {hasActiveFilters ? "Filters Applied" : "Filters"}
      </p>

      {hasActiveFilters && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink text-xs font-medium text-black 3xl:text-base">
          {activeFiltersCount}
        </span>
      )}
    </div>
  );
};

export default FilterIndicator;
