"use client";

import { Input, Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { UsersIcon, PlusIcon, TrashIcon } from "lucide-react";
import React, { useState, useCallback } from "react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminQuestClaimLimit = () => {
  const dispatch = useDispatch();

  // Simple local state - no complex syncing
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleChange = useCallback(
    (e) => {
      const newVal = e.target.value;

      // Only allow numbers
      if (/^\d*$/.test(newVal)) {
        setInputValue(newVal);

        // Update Redux immediately when user types
        const numericValue = newVal === "" ? null : parseInt(newVal);
        dispatch(setCurrentQuest({ limit: numericValue }));
      }
    },
    [dispatch],
  );

  const handleAdd = useCallback(() => {
    setIsActive(true);
    setInputValue("1");
    dispatch(setCurrentQuest({ limit: 1 }));
  }, [dispatch]);

  const handleRemove = useCallback(() => {
    setIsActive(false);
    setInputValue("");
    dispatch(setCurrentQuest({ limit: null }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-3 flex items-center gap-12">
        <p className="flex w-32 items-center gap-2 text-gray-100">
          <UsersIcon size={20} />
          Claim Limit
        </p>

        <Button
          size="lg"
          onPress={handleAdd}
          variant="bordered"
          disabled={isActive}
          className="h-8 w-fit gap-2 rounded border border-gray-400 bg-gradient-dark px-3 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          endContent={<PlusIcon size={16} />}
        >
          Add Limit
        </Button>
      </div>

      {isActive && (
        <div className="flex items-center gap-3">
          <Input
            min={1}
            size="sm"
            required
            type="number"
            value={inputValue}
            className="max-w-xs"
            placeholder="e.g. 100"
            onChange={handleChange}
            aria-label="Quest Claim Limit"
            classNames={{
              inputWrapper:
                "border border-gray-400 bg-gradient-dark text-white",
            }}
          />

          <Button
            isIconOnly
            onPress={handleRemove}
            className="bg-transparent text-red-700 hover:bg-red-400/10 hover:text-red-500"
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminQuestClaimLimit);
