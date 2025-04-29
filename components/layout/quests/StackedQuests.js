"use client";

import {
  LinkIcon,
  EarthIcon,
  ImageIcon,
  FileUpIcon,
  ArrowUp01Icon,
  LetterTextIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Avatar, AvatarGroup } from "@heroui/react";

const taskIconMap = {
  number: <ArrowUp01Icon size={12} className="text-white" />,
  text: <LetterTextIcon size={12} className="text-white" />,
  link: <SquareArrowOutUpRightIcon size={12} className="text-white" />,
  url: <LinkIcon size={12} className="text-white" />,
  nft: <ImageIcon size={12} className="text-white" />,
  file: <FileUpIcon size={12} className="text-white" />,
  token: (
    <div className="flex h-[12px] w-[12px] items-center justify-center overflow-hidden rounded">
      <Image src="/neo-logo.svg" width={12} height={12} alt="token" />
    </div>
  ),
  twitter: <EarthIcon size={12} className="text-white" />,
  telegram: <EarthIcon size={12} className="text-white" />,
  discord: <EarthIcon size={12} className="text-white" />,
};

const StackedQuests = ({ tasks = [] }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Memoize the task icons to avoid re-renders if tasks prop doesn't change
  const taskIcons = useMemo(() => {
    return safeTasks
      .map((task) => {
        const taskName =
          typeof task === "object" && task !== null && task.name
            ? task.name
            : task;
        const icon = taskIconMap[taskName];
        return icon ? (
          <Avatar
            key={taskName}
            size="sm"
            icon={icon}
            classNames={{
              base: "bg-red-700 !w-6 !h-6",
            }}
          />
        ) : null;
      })
      .filter(Boolean);
  }, [safeTasks]);

  return (
    <AvatarGroup
      max={3}
      classNames={{
        count: "bg-red-700 !w-6 !h-6 text-white",
      }}
    >
      {taskIcons}
    </AvatarGroup>
  );
};

export default StackedQuests;
