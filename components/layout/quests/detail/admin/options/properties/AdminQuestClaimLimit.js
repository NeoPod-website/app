"use client";

import { Input, Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { UsersIcon, PlusIcon, TrashIcon } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminQuestClaimLimit = () => {
  const dispatch = useDispatch();

  const limit = useSelector((state) => state.quest.currentQuest.limit) || null;
  const [inputValue, setInputValue] = useState(limit?.toString() || "");

  const isActive = limit !== null;

  useEffect(() => {
    setInputValue(limit?.toString() || "");
  }, [limit]);

  const debouncedDispatch = useCallback(
    (() => {
      let timer;

      return (value) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
          dispatch(
            setCurrentQuest({ limit: value === "" ? null : parseInt(value) }),
          );
        }, 500);
      };
    })(),
    [dispatch],
  );

  const handleChange = (e) => {
    const newVal = e.target.value;

    if (/^\d*$/.test(newVal)) {
      setInputValue(newVal);
      debouncedDispatch(newVal);
    }
  };

  const handleAdd = useCallback(() => {
    setInputValue("0");
    dispatch(setCurrentQuest({ limit: 0 }));
  }, [dispatch]);

  const handleRemove = useCallback(() => {
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
            size="sm"
            placeholder="e.g. 100"
            value={inputValue}
            onChange={handleChange}
            className="max-w-xs"
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
