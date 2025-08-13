"use client";

import React from "react";
import { Button } from "@heroui/react";

const FilterPanel = ({
  children,
  className,
  resetFilters,
  hasActiveFilters,
  showResetButton = true,
}) => {
  return (
    <div
      className={`mb-3 flex items-center justify-between gap-2.5 px-4 xl:px-6 3xl:gap-4 3xl:px-8 ${className}`}
    >
      {children}

      {showResetButton && (
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button
            onPress={resetFilters}
            disabled={!hasActiveFilters}
            className="flex h-auto items-center gap-1 rounded-full border border-black bg-white px-2 py-1.5 text-sm font-medium text-black transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 3xl:px-3 3xl:py-2"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
