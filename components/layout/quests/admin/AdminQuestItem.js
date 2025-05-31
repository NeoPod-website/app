"use client";

import {
  RadioIcon,
  Repeat2Icon,
  HourglassIcon,
  GripVerticalIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { addToast, Checkbox, Select, SelectItem } from "@heroui/react";

import StackedQuests from "../StackedQuests";

import { setCurrentCategory } from "@/redux/slice/categorySlice";

const AdminQuestItem = ({
  quest,
  category,
  hasChanges,
  selectedQuests,
  onQuestChange,
  onQuestSelect,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const dragControls = useDragControls();

  const [selectedStatus, setSelectedStatus] = useState(
    new Set([quest.status || "draft"]),
  );
  const [selectedCooldown, setSelectedCooldown] = useState(
    new Set([quest.cooldown || "never"]),
  );
  const [selectedRecurrence, setSelectedRecurrence] = useState(
    new Set([quest.recurrence || "never"]),
  );

  const canUpdate = () => {
    if (selectedQuests.size > 0) {
      addToast({
        color: "danger",
        title: "Cannot perform action",
        description:
          "You have selected quests. Please deselect before changing.",
      });

      return false;
    }

    return true;
  };

  const handleStatusSelectionChange = (keys) => {
    if (!canUpdate()) return;

    const newStatus = Array.from(keys)[0];
    setSelectedStatus(keys);

    if (onQuestChange) {
      onQuestChange(quest.quest_id, "status", newStatus);
    }
  };

  const handleRecurrenceSelectionChange = (keys) => {
    if (!canUpdate()) return;

    const newRecurrence = Array.from(keys)[0];
    setSelectedRecurrence(keys);

    if (onQuestChange) {
      onQuestChange(quest.quest_id, "recurrence", newRecurrence);
    }
  };

  const handleCooldownSelectionChange = (keys) => {
    if (!canUpdate()) return;

    const newCooldown = Array.from(keys)[0];
    setSelectedCooldown(keys);

    if (onQuestChange) {
      onQuestChange(quest.quest_id, "cooldown", newCooldown);
    }
  };

  const startDrag = (e) => {
    dragControls.start(e);
  };

  useEffect(() => {
    setSelectedStatus(new Set([quest.status || "draft"]));
    setSelectedCooldown(new Set([quest.cooldown || "never"]));
    setSelectedRecurrence(new Set([quest.recurrence || "never"]));
  }, [quest]);

  const handleQuestItemClick = (e, questId) => {
    if (!canUpdate()) return;

    if (hasChanges) {
      addToast({
        color: "danger",
        title: "Cannot select quest",
        description: "You have unsaved changes. Please save before selecting.",
      });

      return;
    }

    if (shouldPreventNavigation(e)) return;

    dispatch(setCurrentCategory(category));

    router.push(
      `/admin/manage/quests/${category.pod_id}/${category.category_id}/${questId}`,
    );
  };

  const shouldPreventNavigation = (e) => {
    return (
      e.target.closest(".grip-icon") ||
      e.target.closest("select") ||
      e.target.closest('input[type="checkbox"]')
    );
  };

  return (
    <Reorder.Item
      value={quest}
      dragControls={dragControls}
      dragListener={false}
      className="mb-4 select-none"
    >
      <div
        className={`flex w-full items-center justify-between gap-5 rounded-lg border border-gray-400 bg-gradient-dark px-5 py-4 ${
          quest.status === "active"
            ? "border-green-600"
            : quest.status === "draft"
              ? "border-yellow-500 opacity-80 hover:opacity-100"
              : "border-gray-500 opacity-80 hover:opacity-100"
        }`}
      >
        <div className="flex flex-1 items-center gap-5">
          <Checkbox
            isSelected={selectedQuests.has(quest.quest_id)}
            onValueChange={() => onQuestSelect(quest.quest_id)}
            classNames={{
              base: "p-0",
              wrapper: "after:bg-white text-black",
            }}
          />

          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <div
              className="min-w-0 cursor-pointer rounded-lg border border-gray-400 bg-gray-700 px-4 py-2.5 text-white"
              onClick={(e) => handleQuestItemClick(e, quest.quest_id)}
            >
              <p className="line-clamp-1 text-sm">{quest.name}</p>
            </div>

            <StackedQuests tasks={quest.tasks} />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Select
            size="lg"
            variant="bordered"
            aria-label="Quest Status"
            selectedKeys={selectedStatus}
            className="w-28 rounded-full bg-gray-700"
            onSelectionChange={handleStatusSelectionChange}
            startContent={<RadioIcon size={20} className="text-white" />}
            classNames={{
              base: "h-11",
              value: "text-base",
              innerWrapper: "w-full",
              selectorIcon: "hidden",
              trigger:
                "border border-gray-400 border-[1px] focus-within:!border-t-gray-300 h-11 min-h-[44px] max-h-[44px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded-full",
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

          <Select
            size="lg"
            variant="bordered"
            aria-label="Quest Recurrence"
            selectedKeys={selectedRecurrence}
            onSelectionChange={handleRecurrenceSelectionChange}
            startContent={<Repeat2Icon size={20} className="text-white" />}
            className="w-28 rounded-full bg-gray-700"
            classNames={{
              base: "h-11",
              value: "text-base",
              innerWrapper: "w-full",
              selectorIcon: "hidden",
              trigger:
                "border border-gray-400 border-[1px] focus-within:!border-t-gray-300 h-11 min-h-[44px] max-h-[44px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded-full",
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

          <Select
            size="lg"
            variant="bordered"
            aria-label="Quest Cooldown"
            selectedKeys={selectedCooldown}
            onSelectionChange={handleCooldownSelectionChange}
            startContent={<HourglassIcon size={20} className="text-white" />}
            className="w-32 rounded-full bg-gray-700"
            classNames={{
              base: "h-11",
              value: "text-base",
              innerWrapper: "w-full",
              selectorIcon: "hidden",
              trigger:
                "border border-gray-400 border-[1px] focus-within:!border-t-gray-300 h-11 min-h-[44px] max-h-[44px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded-full",
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

          <div
            className="grip-icon cursor-grab active:cursor-grabbing"
            onPointerDown={startDrag}
          >
            <GripVerticalIcon size={20} className="text-white" />
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default AdminQuestItem;
