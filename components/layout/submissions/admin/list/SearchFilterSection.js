"use client";

import {
  XIcon,
  SearchIcon,
  FilterIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  Card,
  Chip,
  Input,
  Select,
  Button,
  CardBody,
  SelectItem,
} from "@heroui/react";

const getFilterChipColor = (filterKey) => {
  const colorMap = {
    all: "default",
    flagged: "danger",
    pending: "default",
    rejected: "danger",
    approved: "success",
    highlighted: "warning",
  };
  return colorMap[filterKey] || "default";
};

const SearchFilterSection = ({
  filters,
  categories,
  searchUser,
  setSearchUser,
  searchQuest,
  setSearchQuest,
  onStatusFilter,
  isFiltersVisible,
  onCategoryChange,
  onClearAllFilters,
  setIsFiltersVisible,
}) => {
  const hasActiveFilters =
    filters.status !== "pending" ||
    searchUser ||
    searchQuest ||
    filters.category !== "all";

  const activeFiltersCount = [
    filters.status !== "pending" ? 1 : 0,
    searchUser ? 1 : 0,
    searchQuest ? 1 : 0,
    filters.category !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Quick search submissions..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          startContent={<SearchIcon className="h-4 w-4 text-foreground-400" />}
          variant="bordered"
          classNames={{
            input: "text-sm",
            inputWrapper:
              "border-divider data-[hover=true]:border-foreground-300 bg-content1",
          }}
          isClearable
          onClear={() => setSearchUser("")}
          className="flex-1"
        />

        <Button
          variant={hasActiveFilters ? "solid" : "bordered"}
          color={hasActiveFilters ? "primary" : "default"}
          onPress={() => setIsFiltersVisible(!isFiltersVisible)}
          startContent={<FilterIcon className="h-4 w-4" />}
          endContent={
            isFiltersVisible ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )
          }
          className="shrink-0"
        >
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isFiltersVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Card className="border border-divider bg-content2">
          <CardBody className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground-600">
                  Quest Name
                </label>

                <Input
                  type="text"
                  placeholder="Search quests..."
                  value={searchQuest}
                  onChange={(e) => setSearchQuest(e.target.value)}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    inputWrapper:
                      "border-divider data-[hover=true]:border-foreground-300 bg-content1",
                  }}
                  isClearable
                  onClear={() => setSearchQuest("")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground-600">
                  Category
                </label>

                <Select
                  placeholder="Select category"
                  selectedKeys={
                    filters.category !== "all" ? [filters.category] : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    onCategoryChange(value || "all");
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    trigger:
                      "border-divider data-[hover=true]:border-foreground-300 bg-content1",
                  }}
                >
                  <SelectItem key="all" value="all">
                    All Categories
                  </SelectItem>

                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground-600">
                  Actions
                </label>

                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={onClearAllFilters}
                  startContent={<XIcon className="h-4 w-4" />}
                  isDisabled={!hasActiveFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="border-t border-divider pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-foreground-500">
                    Active filters:
                  </span>

                  {filters.status !== "pending" && (
                    <Chip
                      size="sm"
                      color={getFilterChipColor(filters.status)}
                      variant="flat"
                      onClose={() => onStatusFilter("pending")}
                    >
                      Status: {filters.status}
                    </Chip>
                  )}

                  {searchUser && (
                    <Chip
                      size="sm"
                      color="primary"
                      variant="flat"
                      onClose={() => setSearchUser("")}
                    >
                      User: {searchUser}
                    </Chip>
                  )}

                  {searchQuest && (
                    <Chip
                      size="sm"
                      color="primary"
                      variant="flat"
                      onClose={() => setSearchQuest("")}
                    >
                      Quest: {searchQuest}
                    </Chip>
                  )}

                  {filters.category !== "all" && (
                    <Chip
                      size="sm"
                      color="secondary"
                      variant="flat"
                      onClose={() => onCategoryChange("all")}
                    >
                      Category: {filters.category}
                    </Chip>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SearchFilterSection;
