"use client";

import React from "react";
import { Input } from "@heroui/react";
import { SearchIcon } from "lucide-react";

const FilterSearchInput = ({
  nameFilter,
  setNameFilter,
  searchPlaceholder,
}) => {
  return (
    <div className="w-full max-w-80">
      <Input
        type="text"
        value={nameFilter}
        placeholder={searchPlaceholder}
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
  );
};

export default FilterSearchInput;
