"use client";

import React from "react";
import { Tab, Tabs } from "@heroui/react";

const FilterTabs = ({ filter, setFilter, options }) => {
  return (
    <Tabs
      selectedKey={filter}
      onSelectionChange={setFilter}
      classNames={{
        base: "rounded-full border-2 border-white p-0.5 xl:p-1",
        tabList: "bg-transparent p-0",
        tab: "rounded-full px-2 3xl:px-4 py-1 h-7 3xl:h-8 3xl:py-2 transition-colors",
        cursor: "bg-white rounded-full",
        tabContent:
          "group-data-[selected=true]:text-black group-data-[selected=false]:text-gray-200 hover:text-white",
      }}
    >
      {options.map((option) => (
        <Tab key={option.value} title={option.label} />
      ))}
    </Tabs>
  );
};

export default FilterTabs;
