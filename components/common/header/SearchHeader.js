"use client";

import React from "react";
import { Button, Input } from "@heroui/react";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";

const SearchHeader = () => {
  return (
    <Input
      size="lg"
      type="search"
      placeholder="Search tasks here..."
      className="min-w-80 max-w-lg bg-gradient-dark"
      classNames={{
        base: "max-w-lg rounded-full",
        inputWrapper:
          "gap-4 h-9 3xl:h-11 min-h-9 3xl:min-h-11 min-w-80 max-h-11 border-t border-t-gray-400 border-x-0 border-b-0 border-t focus-within:!border-t-gray-300 rounded-full bg-gradient-dark",
        innerWrapper: "gap-4 h-9 3xl:h-11",
        input: "h-9 3xl:h-11",
      }}
      startContent={
        <SearchIcon size={20} className="h-4 w-4 text-white 3xl:h-5 3xl:w-5" />
      }
      endContent={
        <Button
          isIconOnly
          variant="light"
          className="h-8 w-8 min-w-0 rounded-full p-1 text-white"
        >
          <SlidersHorizontalIcon
            size={16}
            className="h-4 w-4 text-white 3xl:h-5 3xl:w-5"
          />
        </Button>
      }
    />
  );
};

export default SearchHeader;
