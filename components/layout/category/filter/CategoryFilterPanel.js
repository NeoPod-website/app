"use client";

import React from "react";
import { Button, Tab, Tabs } from "@heroui/react";

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
    <div className="mb-3 flex items-center justify-between px-8">
      <Tabs
        selectedKey={statusFilter}
        onSelectionChange={setStatusFilter}
        classNames={{
          base: "rounded-full border-2 border-white p-1",
          tabList: "bg-transparent p-0",
          tab: "rounded-full px-4 py-2 transition-colors",
          cursor: "bg-white rounded-full",
          tabContent:
            "group-data-[selected=true]:text-black group-data-[selected=false]:text-gray-200 hover:text-white",
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <Tab key={option.value} title={option.label} />
        ))}
      </Tabs>

      <div className="flex flex-1 items-center justify-end gap-4">
        <Button
          onPress={resetFilters}
          disabled={!hasActiveFilters}
          className="flex items-center gap-1 rounded-full border border-black bg-white px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default CategoryFilterPanel;
