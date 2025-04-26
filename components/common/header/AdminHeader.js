"use client";

import React, { useState } from "react";
import { Select, SelectItem } from "@heroui/react";

import AdminViewBtn from "./AdminViewBtn";

const AdminHeader = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(new Set(["zh"]));

  const handleSelectionChange = (keys) => {
    setSelectedLanguage(keys);
  };

  return (
    <>
      <AdminViewBtn />

      <Select
        aria-label="Language"
        variant="bordered"
        size="lg"
        selectedKeys={selectedLanguage}
        onSelectionChange={handleSelectionChange}
        className="w-32 rounded-full bg-gradient-dark"
        classNames={{
          base: "h-11",
          trigger:
            "border-t border-t-gray-400 border-x-0 border-b-0 border-t-[1px] focus-within:!border-t-gray-300 h-11 min-h-[44px] max-h-[44px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded-full",
          value: "text-base",
        }}
      >
        <SelectItem key="zh" value="Chinese">
          Chinese
        </SelectItem>
        <SelectItem key="en" value="English">
          English
        </SelectItem>
      </Select>
    </>
  );
};

export default AdminHeader;
