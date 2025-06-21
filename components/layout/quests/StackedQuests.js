import {
  LinkIcon,
  EarthIcon,
  ImageIcon,
  UsersIcon,
  FileUpIcon,
  ArrowUp01Icon,
  LetterTextIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import React from "react";
import Image from "next/image";

const SimpleAvatar = ({ children, className = "" }) => (
  <div
    className={`flex h-6 w-6 items-center justify-center rounded-full bg-red-700 ${className}`}
  >
    {children}
  </div>
);

const SimpleAvatarGroup = ({ children, max = 3 }) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleChildren}
      {remainingCount > 0 && (
        <SimpleAvatar className="bg-red-700 text-xs font-medium text-white">
          +{remainingCount}
        </SimpleAvatar>
      )}
    </div>
  );
};

const taskIconMap = {
  url: <LinkIcon size={12} className="text-white" />,
  text: <LetterTextIcon size={12} className="text-white" />,
  number: <ArrowUp01Icon size={12} className="text-white" />,

  file: <FileUpIcon size={12} className="text-white" />,
  invite: <UsersIcon size={12} className="text-white" />,
  link: <SquareArrowOutUpRightIcon size={12} className="text-white" />,

  x: <EarthIcon size={12} className="text-white" />,
  discord: <EarthIcon size={12} className="text-white" />,
  telegram: <EarthIcon size={12} className="text-white" />,

  nft: <ImageIcon size={12} className="text-white" />,
  token: (
    <div className="flex h-[12px] w-[12px] items-center justify-center overflow-hidden rounded">
      <Image src="/neo-logo.svg" width={12} height={12} alt="token" />
    </div>
  ),
};

const StackedQuests = ({ tasks = [] }) => {
  // Process tasks directly on the server
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const taskIcons = safeTasks
    .map((task, index) => {
      const taskName =
        typeof task === "object" && task !== null && task.name
          ? task.name
          : task;
      const icon = taskIconMap[taskName];
      return icon ? (
        <SimpleAvatar key={`task-${index}-${taskName}`}>{icon}</SimpleAvatar>
      ) : null;
    })
    .filter(Boolean);

  // Show loading state if no valid icons
  if (taskIcons.length === 0) {
    return null;
  }

  return (
    <div className="min-h-[24px] min-w-[48px]">
      <SimpleAvatarGroup max={3}>{taskIcons}</SimpleAvatarGroup>
    </div>
  );
};

export default StackedQuests;
