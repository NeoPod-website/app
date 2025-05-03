"use client";

import {
  LinkIcon,
  ImageIcon,
  FileUpIcon,
  ArrowUp01Icon,
  LetterTextIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import MainModal from "./MainModal";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

import { toggleAddTasksModal } from "@/redux/slice/modalsSlice";
import { addCurrentQuestTask } from "@/redux/slice/questSlice";

const answerTasks = [
  {
    id: 1,
    color: "#15803d",
    type: "file-upload",
    name: "File Upload",
    icon: <FileUpIcon size={20} />,
    description: "Upload files to complete this task.",
  },
  {
    id: 2,
    name: "Text",
    type: "text",
    color: "#ca8a04 ",
    icon: <LetterTextIcon size={20} />,
    description: "Enter required text to complete this task.",
  },
  {
    id: 3,
    name: "URL",
    type: "url",
    color: "#0670F7",
    icon: <LinkIcon size={20} />,
    description: "Enter required URL to complete this task.",
  },
  {
    id: 4,
    name: "Number",
    type: "number",
    color: "#991b1b",
    icon: <ArrowUp01Icon size={20} />,
    description: "Enter required number to complete this task.",
  },
];

const onChainTasks = [
  {
    id: 1,
    name: "NFT",
    type: "nft",
    color: "#9333ea",
    icon: <ImageIcon size={20} />,
    description: "Check required NFT to complete this task.",
  },
  {
    id: 2,
    name: "Token",
    type: "token",
    color: "#000000",
    icon: (
      <div className="flex h-3 w-3 items-center justify-center overflow-hidden rounded">
        <Image src="/neo-logo.svg" width={20} height={20} alt="token" />
      </div>
    ),
    description: "Check required token and amount to complete this task.",
  },
];

const socialTasks = [
  {
    id: 1,
    color: "#000000",
    name: "X (Twitter)",
    type: "x",
    icon: <XIcon className="h-5 w-5" />,
    description:
      "Tweet, Retweet, Reply, Follow or Like required tweet or join a X space.",
  },
  {
    id: 2,
    name: "Discord",
    type: "discord",
    color: "#7289DA",
    icon: <DiscordIcon className="h-5 w-5" />,
    description: "Join required Discord server or channel.",
  },
  {
    id: 3,
    name: "Telegram",
    type: "telegram",
    color: "#24A1DE",
    icon: <TelegramIcon className="h-5 w-5" />,
    description: "Join required Telegram channel.",
  },
];

const actionTasks = [
  {
    id: 1,
    name: "Visit Link",
    type: "link",
    color: "#0369a1",
    icon: <SquareArrowOutUpRightIcon size={20} />,
    description: "Visit required link to complete this task.",
  },
];

const AddTaskModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.modals.isAddTasksModalOpen);

  const handleOnClose = () => {
    dispatch(toggleAddTasksModal());
  };

  const handleQuestTaskAdd = (task) => {
    dispatch(addCurrentQuestTask({ name: task.type }));
    dispatch(toggleAddTasksModal());
  };

  const TaskItem = ({ task }) => {
    return (
      <div
        className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-400 bg-gradient-dark px-4 py-2.5 transition-colors hover:bg-gray-700"
        onClick={() => handleQuestTaskAdd(task)}
      >
        <div
          className="w-fit rounded-full border border-gray-300 p-3"
          style={{
            backgroundColor: task.color,
          }}
        >
          {task.icon}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">{task.name}</h3>

          <p className="text-sm text-gray-100">{task.description}</p>
        </div>
      </div>
    );
  };

  return (
    <MainModal
      size="5xl"
      title="Add Quest Tasks"
      description="Select the type of task you want to add to your quest and update the details."
      isOpen={isOpen}
      handleOnClose={handleOnClose}
      maxW="max-w-none"
    >
      <section className="flex w-full justify-between gap-8">
        <div className="w-1/2 space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400">Action Tasks</h3>

            <div className="space-y-4">
              {actionTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400">Answer Tasks</h3>

            <div className="space-y-4">
              {answerTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2 space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400">Social Tasks</h3>

            <div className="space-y-4">
              {socialTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400">On Chain Tasks</h3>

            <div className="space-y-4">
              {onChainTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainModal>
  );
};

export default AddTaskModal;
