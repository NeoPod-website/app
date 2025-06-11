"use client";

import React from "react";
import { HourglassIcon } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminQuestCooldown = () => {
  const dispatch = useDispatch();

  const cooldown = useSelector((state) => state.quest.currentQuest.cooldown);

  const selectedCooldown = new Set([cooldown || "never"]);

  const handleCooldownSelectionChange = (keys) => {
    const value = Array.from(keys)[0];

    dispatch(setCurrentQuest({ cooldown: value }));
  };

  return (
    <div className="flex items-center gap-12">
      <p className="flex w-32 items-center gap-3 text-gray-100">
        <HourglassIcon size={20} />
        Cooldown
      </p>

      <Select
        size="lg"
        variant="bordered"
        aria-label="Cooldown"
        selectedKeys={selectedCooldown}
        onSelectionChange={handleCooldownSelectionChange}
        className="w-32 rounded bg-gradient-dark"
        classNames={{
          base: "h-8",
          trigger:
            "border border-gray-400 focus-within:!border-gray-300 h-8 min-h-[32px] max-h-[32px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
          value: "text-base",
        }}
      >
        <SelectItem key="never" value="Never">
          Cooldown
        </SelectItem>

        <SelectItem key="1h" value="1h">
          1h
        </SelectItem>

        <SelectItem key="2h" value="2h">
          2h
        </SelectItem>

        <SelectItem key="6h" value="6h">
          6h
        </SelectItem>

        <SelectItem key="12h" value="12h">
          12h
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

export default AdminQuestCooldown;
