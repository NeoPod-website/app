"use client";

import React from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Button, Tab, Tabs, Input } from "@heroui/react";

export const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archive", label: "Archive" },
];

const QuestFilterPanel = ({
  nameFilter,
  setNameFilter,
  statusFilter,
  setStatusFilter,
  resetFilters,
  hasActiveFilters,
  activeFiltersCount,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-b-xl border-t border-gray-400 bg-black/60 px-8 py-2.5 backdrop-blur-sm">
      <div className="w-full max-w-80">
        <Input
          type="text"
          value={nameFilter}
          placeholder="Search quests..."
          onClear={() => setNameFilter("")}
          startContent={<SearchIcon size={20} />}
          onChange={(e) => setNameFilter(e.target.value)}
          classNames={{
            base: "rounded-full border-2 border-white bg-transparent hover:bg-transparent p-0 placeholder-gray-200 focus:outline-none focus:ring-1 min-w-80",
            inputWrapper:
              "placeholder-gray-200 px-2 py-1.5 bg-transparent hover:bg-transparent focus:bg-transparent min-h-0 h-auto rounded-full",
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Status:</span>

          <Tabs
            selectedKey={statusFilter}
            onSelectionChange={setStatusFilter}
            classNames={{
              base: "rounded-full border border-gray-400 p-0.5",
              tabList: "bg-transparent p-0",
              tab: "rounded-full px-3 py-1.5 transition-colors text-xs",
              cursor: "bg-white rounded-full",
              tabContent:
                "group-data-[selected=true]:text-black group-data-[selected=false]:text-gray-300 hover:text-white",
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <Tab key={option.value} title={option.label} />
            ))}
          </Tabs>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-gray-400 bg-gradient-dark px-3 py-1.5 text-sm text-white transition-colors hover:border-gray-300 hover:bg-black/70">
          <FilterIcon className="h-4 w-4" />

          {hasActiveFilters ? "Filters Applied" : "Filters"}

          {hasActiveFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink text-xs font-medium text-black">
              {activeFiltersCount}
            </span>
          )}
        </div>

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

export default QuestFilterPanel;
