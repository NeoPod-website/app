import React from "react";
import Link from "next/link";
import { SendHorizontalIcon } from "lucide-react";

import FilterIndicator from "./FilterIndicator";
import FilterSearchInput from "./FilterSearchInput";

import NeoBreadcrumbs from "@/components/ui/NeoBreadcrumbs";

const FilterHeader = ({
  role,
  list,
  linkHref,
  linkLabel,
  nameFilter,
  headerLabel,
  setNameFilter,
  hasActiveFilters,
  searchPlaceholder,
  showFilter = true,
  activeFiltersCount,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border-t border-gray-400 bg-black/60 px-4 py-2.5 backdrop-blur-sm xl:px-6 3xl:px-8">
      {headerLabel ? (
        <h2 className="text-base capitalize text-gray-100 xl:text-lg">
          {headerLabel}
        </h2>
      ) : (
        <NeoBreadcrumbs list={list} />
      )}

      <div className="flex items-center gap-4">
        {showFilter && (
          <>
            <FilterSearchInput
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              searchPlaceholder={searchPlaceholder}
            />

            <FilterIndicator
              hasActiveFilters={hasActiveFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </>
        )}

        {(role === "super" || headerLabel !== "pods") && linkHref && (
          <Link
            href={linkHref}
            className="flex items-center gap-1 rounded-full border border-black bg-white px-2 py-1 text-sm font-medium text-black transition-colors hover:bg-gray-50 3xl:px-3 3xl:py-1.5"
          >
            {linkLabel}{" "}
            <SendHorizontalIcon
              size={16}
              className="h-3 w-3 3xl:-mt-0.5 3xl:h-4 3xl:w-4"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default FilterHeader;
