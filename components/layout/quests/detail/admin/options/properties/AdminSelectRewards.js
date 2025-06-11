"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiftIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Chip, Select, SelectItem, Input, Button } from "@heroui/react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminSelectRewards = () => {
  const dispatch = useDispatch();
  const rewards =
    useSelector((state) => state.quest.currentQuest.rewards) || [];

  const [isAdding, setIsAdding] = useState(false);

  const updateRewards = useCallback(
    (newRewards) => {
      dispatch(setCurrentQuest({ rewards: newRewards }));
    },
    [dispatch],
  );

  // Calculate which reward types are already selected
  const selectedTypes = useMemo(() => {
    return new Set(rewards.map((reward) => reward.type));
  }, [rewards]);

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

  const handleCancelAdd = useCallback(() => {
    setIsAdding(false);
  }, []);

  const handleRewardTypeSelect = useCallback(
    (keys) => {
      const type = Array.from(keys)[0];
      let newReward;

      if (type === "pod" || type === "token") {
        newReward = { type, amount: "" };
      } else if (type === "nft") {
        newReward = { type, contract: "", amount: "" };
      }

      updateRewards([...rewards, newReward]);
      setIsAdding(false);
    },
    [rewards, updateRewards],
  );

  const handleRewardChange = useCallback(
    (index, field, value) => {
      // Validation for amount field
      if (field === "amount" && value !== "" && !/^\d+$/.test(value)) {
        return;
      }

      const updated = rewards.map((reward, i) =>
        i === index ? { ...reward, [field]: value } : reward,
      );
      updateRewards(updated);
    },
    [rewards, updateRewards],
  );

  const removeReward = useCallback(
    (index) => {
      const updated = [...rewards];
      updated.splice(index, 1);
      updateRewards(updated);
    },
    [rewards, updateRewards],
  );

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
        {isAdding && (
          <div className="flex w-full items-center gap-2">
            <Select
              size="lg"
              variant="bordered"
              selectionMode="single"
              aria-label="Quest Rewards"
              onSelectionChange={handleRewardTypeSelect}
              className="flex-1 rounded bg-gradient-dark"
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

            <Button
              isIconOnly
              onPress={handleCancelAdd}
              variant="light"
              className="h-10 w-10 min-w-[40px] text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <XIcon size={16} />
            </Button>
          </div>
        )}

        {rewards.map((reward, index) => (
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
              {reward.type === "pod" && (
                <Input
                  min={1}
                  size="sm"
                  required
                  type="number"
                  placeholder="Amount"
                  value={reward.amount}
                  aria-label="Quest Reward Amount"
                  onChange={(e) =>
                    handleRewardChange(index, "amount", e.target.value)
                  }
                  classNames={{
                    inputWrapper:
                      "border border-gray-400 bg-gradient-dark text-white",
                  }}
                />
              )}

              {(reward.type === "nft" || reward.type === "token") && (
                <div className="flex-1 space-y-1.5">
                  <Input
                    size="sm"
                    required
                    type="text"
                    value={reward.contract}
                    placeholder="Contract Address"
                    aria-label="Quest NFT Contract Address"
                    onChange={(e) =>
                      handleRewardChange(index, "contract", e.target.value)
                    }
                    classNames={{
                      inputWrapper:
                        "border border-gray-400 bg-gradient-dark text-white",
                    }}
                  />

                  <Input
                    min={1}
                    required
                    size="sm"
                    type="number"
                    placeholder="Amount"
                    aria-label="Quest NFT Amount"
                    value={reward.amount}
                    onChange={(e) =>
                      handleRewardChange(index, "amount", e.target.value)
                    }
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
    </div>
  );
};

export default React.memo(AdminSelectRewards);
