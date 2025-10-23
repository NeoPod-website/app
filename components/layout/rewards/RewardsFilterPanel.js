"use client";

import React from "react";

import FilterTabs from "@/components/common/filter/FilterTabs";
import FilterPanel from "@/components/common/filter/FilterPanel";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

const RewardsFilterPanel = ({
  statusFilter,
  setStatusFilter,
  sortFilter,
  setSortFilter,
  resetFilters,
  hasActiveFilters,
  disabled = false,
}) => {
  return (
    <FilterPanel
      showResetButton={false}
      resetFilters={resetFilters}
      hasActiveFilters={hasActiveFilters}
      className="flex items-center justify-between gap-2"
    >
      <div className={disabled ? "pointer-events-none opacity-50" : ""}>
        <FilterTabs
          filter={statusFilter}
          setFilter={setStatusFilter}
          options={STATUS_OPTIONS}
        />
      </div>

      <div
        className={`hidden items-center gap-2 lg:flex ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <FilterTabs
          filter={sortFilter}
          setFilter={setSortFilter}
          options={SORT_OPTIONS}
        />
      </div>
    </FilterPanel>
  );
};

export default RewardsFilterPanel;
