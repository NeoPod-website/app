"use client";

import React from "react";
import { Repeat2Icon } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminQuestRecurrence = () => {
  const dispatch = useDispatch();

  const recurrence = useSelector(
    (state) => state.quest.currentQuest.recurrence,
  );

  const selectedRecurrence = new Set([recurrence || "never"]);

  const handleRecurrenceSelectionChange = (keys) => {
    const value = Array.from(keys)[0];

    dispatch(setCurrentQuest({ recurrence: value }));
  };

  return (
    <div className="flex items-center gap-12">
      <p className="flex w-32 items-center gap-3 text-gray-100">
        <Repeat2Icon size={20} />
        Recurrence
      </p>

      <Select
        size="lg"
        variant="bordered"
        aria-label="Recurrence"
        selectedKeys={selectedRecurrence}
        onSelectionChange={handleRecurrenceSelectionChange}
        className="w-32 rounded bg-gradient-dark"
        classNames={{
          base: "h-8",
          trigger:
            "border border-gray-400 focus-within:!border-gray-300 h-8 min-h-[32px] max-h-[32px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
          value: "text-base",
        }}
      >
        <SelectItem key="never" value="Never">
          Never
        </SelectItem>

        <SelectItem key="daily" value="Daily">
          Daily
        </SelectItem>

        <SelectItem key="weekly" value="Weekly">
          Weekly
        </SelectItem>

        <SelectItem key="monthly" value="Monthly">
          Monthly
        </SelectItem>
      </Select>
    </div>
  );
};

export default AdminQuestRecurrence;
