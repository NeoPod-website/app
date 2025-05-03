"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CoinsIcon, Wallet, ImageIcon } from "lucide-react";
import { Input, Switch, Select, SelectItem } from "@heroui/react";

import AdminTaskItem from "../AdminTaskItem";
import QuestTaskContainer from "../../../../tasks/QuestTaskContainer";

import RemoveCurrentTask from "@/components/ui/buttons/quest/admin/task/RemoveCurrentTask";
import DuplicateCurrentTask from "@/components/ui/buttons/quest/admin/task/DuplicateCurrentTask";

import { updateCurrentQuestTask } from "@/redux/slice/questSlice";

// Blockchain Task Types
const BLOCKCHAIN_TASK_TYPES = {
  NFT: "nft",
  TOKEN: "token",
};

// Network Options
const NETWORK_OPTIONS = [
  { value: "ethereum", label: "Ethereum" },
  { value: "neo", label: "NEO" },
  { value: "bsc", label: "Binance Smart Chain" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
];

// Configuration for each task type
const taskTypeConfig = {
  [BLOCKCHAIN_TASK_TYPES.NFT]: {
    color: "#9333ea",
    icon: <ImageIcon size={16} />,
    title: "NFT",
    description: "User must hold specified NFT",
  },
  [BLOCKCHAIN_TASK_TYPES.TOKEN]: {
    color: "#000000",
    icon: <CoinsIcon size={16} />,
    title: "Token",
    description: "User must hold specified token amount",
  },
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NFTConfig = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [amount, setAmount] = useState(currentTask.amount || "1");
  const [tokenId, setTokenId] = useState(currentTask.tokenId || "");
  const [network, setNetwork] = useState(currentTask.network || "neo");
  const [contractAddress, setContractAddress] = useState(
    currentTask.contractAddress || "",
  );
  const [requireTokenId, setRequireTokenId] = useState(
    currentTask.requireTokenId || false,
  );

  const debouncedAmount = useDebounce(amount, 300);
  const debouncedTokenId = useDebounce(tokenId, 300);
  const debouncedContractAddress = useDebounce(contractAddress, 300);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedContractAddress !== currentTask.contractAddress) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { contractAddress: debouncedContractAddress },
        }),
      );
    }
  }, [debouncedContractAddress, currentTask.contractAddress, taskId, dispatch]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedAmount !== currentTask.amount) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { amount: debouncedAmount },
        }),
      );
    }
  }, [debouncedAmount, currentTask.amount, taskId, dispatch]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedTokenId !== currentTask.tokenId) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { tokenId: debouncedTokenId },
        }),
      );
    }
  }, [debouncedTokenId, currentTask.tokenId, taskId, dispatch]);

  const handleNetworkChange = (value) => {
    setNetwork(value);
    dispatch(
      updateCurrentQuestTask({
        id: taskId,
        changes: { network: value },
      }),
    );
  };

  const handleRequireTokenIdChange = (checked) => {
    setRequireTokenId(checked);
    dispatch(
      updateCurrentQuestTask({
        id: taskId,
        changes: { requireTokenId: checked },
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-gray-300">Network</label>

        <Select
          selectedKeys={[network]}
          onChange={(e) => handleNetworkChange(e.target.value)}
          className="w-full"
          classNames={{
            trigger: "border-gray-300 rounded-lg bg-black",
            popover: "bg-gray-800 border-gray-700",
          }}
        >
          {NETWORK_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <p className="mt-1 text-xs italic text-gray-300">
          Select the blockchain network for this NFT
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          NFT Contract Address
        </label>

        <Input
          size="lg"
          variant="bordered"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0x1234...5678"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />
        <p className="mt-1 text-xs italic text-gray-300">
          Enter the contract address of the NFT collection
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Minimum NFT Amount
        </label>

        <Input
          size="lg"
          variant="bordered"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          The minimum number of NFTs from this collection that users must hold
        </p>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <Switch
            size="sm"
            checked={requireTokenId}
            onChange={(e) => handleRequireTokenIdChange(e.target.checked)}
          />

          <label className="text-sm text-gray-300">
            Require specific token ID
          </label>
        </div>

        {requireTokenId && (
          <div>
            <label className="mb-2 block text-sm text-gray-300">Token ID</label>

            <Input
              size="lg"
              variant="bordered"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter specific token ID"
              className="bg-dark"
              classNames={{
                inputWrapper:
                  "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
                input: "placeholder:text-gray-300",
              }}
            />
            <p className="mt-1 text-xs italic text-gray-300">
              If specified, users must hold this exact token ID
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-md bg-red-600/20 p-3">
        <p className="text-xs text-gray-100">
          <strong className="text-red-500">Note:</strong> The system will verify
          if the user owns the specified NFT(s) in their connected wallet.
        </p>
      </div>
    </div>
  );
};

const TokenConfig = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);
  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [contractAddress, setContractAddress] = useState(
    currentTask.contractAddress || "",
  );
  const [network, setNetwork] = useState(currentTask.network || "neo");
  const [amount, setAmount] = useState(currentTask.amount || "");

  const debouncedContractAddress = useDebounce(contractAddress, 300);
  const debouncedAmount = useDebounce(amount, 300);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedContractAddress !== currentTask.contractAddress) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { contractAddress: debouncedContractAddress },
        }),
      );
    }
  }, [debouncedContractAddress, currentTask.contractAddress, taskId, dispatch]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedAmount !== currentTask.amount) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { amount: debouncedAmount },
        }),
      );
    }
  }, [debouncedAmount, currentTask.amount, taskId, dispatch]);

  const handleNetworkChange = (value) => {
    setNetwork(value);
    dispatch(
      updateCurrentQuestTask({
        id: taskId,
        changes: { network: value },
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-gray-300">Network</label>

        <Select
          selectedKeys={[network]}
          onChange={(e) => handleNetworkChange(e.target.value)}
          className="w-full"
          classNames={{
            trigger: "border-gray-300 rounded-lg bg-black",
            popover: "bg-gray-800 border-gray-700",
          }}
        >
          {NETWORK_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <p className="mt-1 text-xs italic text-gray-300">
          Select the blockchain network for this token
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Token Contract Address
        </label>

        <Input
          size="lg"
          variant="bordered"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0x1234...5678"
          startContent={<Wallet size={16} className="text-gray-400" />}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />
        <p className="mt-1 text-xs italic text-gray-300">
          Enter the contract address of the token
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Minimum Token Amount
        </label>

        <Input
          size="lg"
          variant="bordered"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          The minimum amount of tokens that users must hold
        </p>
      </div>

      <div className="mt-3 rounded-md bg-red-600/20 p-3">
        <p className="text-xs text-gray-100">
          <strong className="text-red-500">Note:</strong> The system will verify
          if the user's wallet contains at least this amount of the specified
          token.
        </p>
      </div>
    </div>
  );
};

const AdminNFTTokenTask = ({ index, task }) => {
  const dispatch = useDispatch();
  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const [currentTask, setCurrentTask] = useState(task);

  useEffect(() => {
    if (task.id) {
      const updatedTask = currentTasks.find((t) => t.id === task.id);
      if (updatedTask) {
        setCurrentTask(updatedTask);
      }
    }
  }, [task.id, currentTasks]);

  const currentType =
    currentTask.blockchainTaskType || BLOCKCHAIN_TASK_TYPES.NFT;
  const config = taskTypeConfig[currentType];

  const handleTypeChange = (newType) => {
    if (!currentTask.id) return;

    dispatch(
      updateCurrentQuestTask({
        id: currentTask.id,
        changes: { blockchainTaskType: newType },
      }),
    );
  };

  // Render the appropriate configuration based on task type
  const renderTaskConfig = () => {
    switch (currentType) {
      case BLOCKCHAIN_TASK_TYPES.NFT:
        return <NFTConfig taskId={currentTask.id} />;
      case BLOCKCHAIN_TASK_TYPES.TOKEN:
        return <TokenConfig taskId={currentTask.id} />;
      default:
        return null;
    }
  };

  return (
    <QuestTaskContainer
      icon={config.icon}
      text={config.title}
      color={config.color}
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: config.color }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Blockchain Asset Type</p>

            <div className="flex flex-wrap gap-3">
              {Object.keys(BLOCKCHAIN_TASK_TYPES).map((typeKey) => {
                const taskType = BLOCKCHAIN_TASK_TYPES[typeKey];
                const isActive = currentType === taskType;
                const { icon, title } = taskTypeConfig[taskType];

                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => handleTypeChange(taskType)}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-white ${
                      isActive
                        ? "border-white bg-black"
                        : "border-gray-400 bg-transparent text-gray-100"
                    }`}
                  >
                    {icon}
                    {title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 flex items-start justify-end gap-2">
            <DuplicateCurrentTask currentTask={currentTask} />
            <RemoveCurrentTask currentTask={currentTask} />
          </div>
        </div>

        <hr className="my-4 border-gray-400" />

        <AdminTaskItem taskId={currentTask.id} taskName={currentType}>
          {renderTaskConfig()}
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminNFTTokenTask;
