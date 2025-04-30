"use client";

import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiftIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Chip, Select, SelectItem, Input, Button } from "@heroui/react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminSelectRewards = () => {
  const dispatch = useDispatch();

  const reduxRewards =
    useSelector((state) => state.quest.currentQuest.rewards) || [];

  const [isAdding, setIsAdding] = useState(false);
  const [localRewards, setLocalRewards] = useState(reduxRewards);

  const isUpdatingRedux = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalRewards(reduxRewards);
  }, []);

  // Debounced dispatch
  useEffect(() => {
    // Skip this effect if the change originated from Redux
    if (isUpdatingRedux.current) {
      isUpdatingRedux.current = false;
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced dispatch
    timeoutRef.current = setTimeout(() => {
      dispatch(setCurrentQuest({ rewards: localRewards }));
    }, 500);

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localRewards, dispatch]);

  // Update local state when Redux state changes externally
  useEffect(() => {
    const reduxStr = JSON.stringify(reduxRewards);
    const localStr = JSON.stringify(localRewards);

    if (reduxStr !== localStr) {
      isUpdatingRedux.current = true;
      setLocalRewards(reduxRewards);
    }
  }, [reduxRewards]);

  // Calculate which reward types are already selected
  const selectedTypes = useMemo(() => {
    return new Set(localRewards.map((reward) => reward.type));
  }, [localRewards]);

  // Filter available reward options based on what's already selected
  const availableRewardOptions = useMemo(() => {
    const allOptions = [
      { key: "pod", label: "POD" },
      { key: "nft", label: "NFT" },
      { key: "token", label: "NEO" },
    ];

    return allOptions.filter((option) => !selectedTypes.has(option.key));
  }, [selectedTypes]);

  const canAddMoreRewards = useMemo(() => {
    return availableRewardOptions.length > 0;
  }, [availableRewardOptions]);

  const handleAddRewardClick = useCallback(() => {
    if (canAddMoreRewards) {
      setIsAdding(true);
    }
  }, [canAddMoreRewards]);

  const handleRewardTypeSelect = useCallback((keys) => {
    const type = Array.from(keys)[0];
    let newReward;

    if (type === "pod" || type === "token") {
      newReward = { type, amount: "" };
    } else if (type === "nft") {
      newReward = { type, contract: "", amount: "" };
    }

    setLocalRewards((prev) => [...prev, newReward]);
    setIsAdding(false);
  }, []);

  const handleAmountChange = useCallback((index, value) => {
    // Only update if value is empty or contains only digits
    if (value === "" || /^\d+$/.test(value)) {
      setLocalRewards((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], amount: value };
        return updated;
      });
    }
  }, []);

  // Handle contract change without validation
  const handleContractChange = useCallback((index, value) => {
    setLocalRewards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], contract: value };
      return updated;
    });
  }, []);

  const removeReward = useCallback((index) => {
    setLocalRewards((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const getRewardLabel = useCallback((type) => {
    if (type === "token") return "NEO";
    return type.toUpperCase();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-12">
        <p className="flex w-32 items-center gap-2 text-gray-100">
          <GiftIcon size={20} />
          Rewards
        </p>

        <Button
          onPress={handleAddRewardClick}
          variant="bordered"
          className={`h-8 gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-0 text-base text-white ${
            canAddMoreRewards
              ? "hover:bg-gray-700"
              : "cursor-not-allowed opacity-50"
          }`}
          endContent={<PlusIcon size={16} />}
          isDisabled={!canAddMoreRewards}
        >
          Add Reward
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {localRewards.map((reward, index) => (
          <div
            key={`reward-${index}`}
            className="flex w-full flex-wrap items-center gap-3 rounded-lg border-t border-gray-400 bg-gradient-dark px-4 py-1.5"
          >
            <Chip
              variant="flat"
              className="border border-gray-400 bg-gray-700 capitalize"
            >
              {getRewardLabel(reward.type)}
            </Chip>

            <div className="flex flex-1 flex-wrap items-center gap-3">
              {(reward.type === "pod" || reward.type === "token") && (
                <Input
                  size="sm"
                  placeholder="Amount"
                  value={reward.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  classNames={{
                    inputWrapper:
                      "border border-gray-400 bg-gradient-dark text-white",
                  }}
                />
              )}

              {reward.type === "nft" && (
                <div className="flex-1 space-y-1.5">
                  <Input
                    size="sm"
                    placeholder="Contract Address"
                    value={reward.contract}
                    onChange={(e) =>
                      handleContractChange(index, e.target.value)
                    }
                    classNames={{
                      inputWrapper:
                        "border border-gray-400 bg-gradient-dark text-white",
                    }}
                  />
                  <Input
                    size="sm"
                    placeholder="Amount"
                    value={reward.amount}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                    classNames={{
                      inputWrapper:
                        "border border-gray-400 bg-gradient-dark text-white",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="pt-1">
              <Button
                isIconOnly
                onPress={() => removeReward(index)}
                className="bg-transparent text-red-700 transition-colors hover:bg-red-400/10 hover:text-red-500"
              >
                <TrashIcon size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="w-full">
          <Select
            size="lg"
            variant="bordered"
            aria-label="Rewards"
            selectionMode="single"
            onSelectionChange={handleRewardTypeSelect}
            className="w-full rounded bg-gradient-dark"
            classNames={{
              base: "h-10",
              trigger:
                "border border-gray-400 focus-within:!border-gray-300 h-10 min-h-[40px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
              value: "text-base",
            }}
          >
            {availableRewardOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminSelectRewards);
