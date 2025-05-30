"use client";

import React from "react";
import { SettingsIcon } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminQuestStatus = () => {
  const dispatch = useDispatch();

  const status = useSelector((state) => state.quest.currentQuest.status);

  const selectedStatus = new Set([status || "active"]);

  const handleStatusSelectionChange = (keys) => {
    const value = Array.from(keys)[0];

    dispatch(setCurrentQuest({ status: value }));
  };

  return (
    <div className="flex items-center gap-12">
      <p className="flex w-32 items-center gap-3 text-gray-100">
        <SettingsIcon size={20} />
        Status
      </p>

      <Select
        size="lg"
        variant="bordered"
        aria-label="Status"
        selectedKeys={selectedStatus}
        onSelectionChange={handleStatusSelectionChange}
        className="w-32 rounded bg-gradient-dark"
        classNames={{
          base: "h-8",
          trigger:
            "border border-gray-400 focus-within:!border-gray-300 h-8 min-h-[32px] max-h-[32px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
          value: "text-base",
        }}
      >
        <SelectItem key="active" value="Active">
          Active
        </SelectItem>

        <SelectItem key="draft" value="Draft">
          Draft
        </SelectItem>

        <SelectItem key="archive" value="Archive">
          Archive
        </SelectItem>
      </Select>
    </div>
  );
};

export default AdminQuestStatus;
