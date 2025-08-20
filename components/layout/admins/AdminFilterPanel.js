"use client";

import React from "react";

import FilterTabs from "@/components/common/filter/FilterTabs";
import FilterPanel from "@/components/common/filter/FilterPanel";

const ROLE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "super", label: "Super" },
  { value: "community", label: "Community" },
  { value: "moderator", label: "Moderator" },
  { value: "reviewer", label: "Reviewer" },
];

const SORT_OPTIONS = [
  { value: "decrease", label: "Decrease" },
  { value: "increase", label: "Increase" },
];

const FILTER_OPTIONS = [
  { value: "reviews", label: "Reviews" },
  { value: "login", label: "Last Login" },
];

const AdminFilterPanel = ({
  filter,
  setFilter,
  sortFilter,
  setSortFilter,
  roleFilter,
  setRoleFilter,
  resetFilters,
  hasActiveFilters,
}) => {
  return (
    <FilterPanel
      showResetButton={false}
      resetFilters={resetFilters}
      hasActiveFilters={hasActiveFilters}
      className="flex items-center justify-between gap-2"
    >
      <FilterTabs
        filter={roleFilter}
        setFilter={setRoleFilter}
        options={ROLE_OPTIONS}
      />

      <div className="hidden items-center gap-2 lg:flex">
        <FilterTabs
          filter={sortFilter}
          setFilter={setSortFilter}
          options={SORT_OPTIONS}
        />

        <FilterTabs
          filter={filter}
          setFilter={setFilter}
          options={FILTER_OPTIONS}
        />
      </div>
    </FilterPanel>
  );
};

export default AdminFilterPanel;
