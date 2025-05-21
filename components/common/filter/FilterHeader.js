import React from "react";
import Link from "next/link";
import { SendHorizontalIcon } from "lucide-react";

import FilterIndicator from "./FilterIndicator";
import FilterSearchInput from "./FilterSearchInput";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";

const FilterHeader = ({
  list,
  linkHref,
  linkLabel,
  nameFilter,
  headerLabel,
  setNameFilter,
  hasActiveFilters,
  showFilter = true,
  activeFiltersCount,
}) => {
  return (
    <div className="mb-3 flex items-center justify-between gap-4 rounded-xl border-t border-gray-400 bg-black/60 px-8 py-2.5 backdrop-blur-sm">
      {headerLabel ? (
        <h2 className="text-lg capitalize text-gray-100">{headerLabel}</h2>
      ) : (
        <NeoBreadcrumbs list={list} />
      )}

      <div className="flex items-center gap-4">
        {showFilter && (
          <>
            <FilterSearchInput
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              searchPlaceholder="Search Pods..."
            />

            <FilterIndicator
              hasActiveFilters={hasActiveFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </>
        )}

        <Link
          href={linkHref}
          className="flex items-center gap-1 rounded-full border border-black bg-white px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-gray-50"
        >
          {linkLabel} <SendHorizontalIcon size={16} className="-mt-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default FilterHeader;
