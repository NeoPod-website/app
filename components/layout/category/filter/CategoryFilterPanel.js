"use client";

import React from "react";
import { Tab, Tabs } from "@heroui/react";

import FilterPanel from "@/components/common/filter/FilterPanel";

export const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "live", label: "Live" },
  { value: "draft", label: "Draft" },
  { value: "archive", label: "Archive" },
];

const CategoryFilterPanel = ({
  statusFilter,
  resetFilters,
  setStatusFilter,
  hasActiveFilters,
}) => {
  return (
    <FilterPanel
      resetFilters={resetFilters}
      hasActiveFilters={hasActiveFilters}
    >
      <Tabs
        selectedKey={statusFilter}
        onSelectionChange={setStatusFilter}
        classNames={{
          base: "rounded-full border-2 border-white p-0.5 xl:p-1",
          tabList: "bg-transparent p-0",
          tab: "rounded-full px-2 3xl:px-4 py-1 h-7 3xl:h-8 3xl:py-2 transition-colors",
          cursor: "bg-white rounded-full",
          tabContent:
            "group-data-[selected=true]:text-black group-data-[selected=false]:text-gray-200 hover:text-white",
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <Tab key={option.value} title={option.label} />
        ))}
      </Tabs>
    </FilterPanel>
  );
};

export default CategoryFilterPanel;
