"use client";

import { Avatar, AvatarGroup } from "@heroui/react";
import {
  ArrowUp01Icon,
  EarthIcon,
  FileUpIcon,
  ImageIcon,
  LetterTextIcon,
  LinkIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import Image from "next/image";

// Normalize type strings
const normalizeType = (type) => type?.toLowerCase().trim();

const StackedQuests = ({ tasks = [] }) => {
  // Always work with an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <AvatarGroup max={10}>
      {/* Number */}
      {safeTasks.includes("number") && (
        <Avatar
          size="sm"
          icon={<ArrowUp01Icon size={12} className="text-white" />}
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}

      {/* Text */}
      {safeTasks.includes("text") && (
        <Avatar
          size="sm"
          icon={<LetterTextIcon size={12} className="text-white" />}
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}

      {/* Visit Link */}
      {safeTasks.includes("link") && (
        <Avatar
          size="sm"
          icon={<SquareArrowOutUpRightIcon size={12} className="text-white" />}
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}

      {/* URL */}
      {safeTasks.includes("url") && (
        <Avatar
          size="sm"
          icon={<LinkIcon size={12} className="text-white" />}
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}

      {/* NFT */}
      {safeTasks.includes("nft") && (
        <Avatar
          size="sm"
          icon={<ImageIcon size={12} className="text-white" />}
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}

      {/* File Upload */}
      {safeTasks.includes("file") && (
        <Avatar
          size="sm"
          icon={<FileUpIcon size={12} className="text-white" />}
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}

      {/* Token */}
      {safeTasks.includes("token") && (
        <Avatar
          size="sm"
          icon={
            <div className="flex h-[12px] w-[12px] items-center justify-center overflow-hidden rounded">
              <Image src="/neo-logo.svg" width={12} height={12} alt="token" />
            </div>
          }
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}

      {/* Twitter, Telegram, Discord */}
      {safeTasks.some((t) =>
        ["twitter", "telegram", "discord"].includes(t),
      ) && (
        <Avatar
          size="sm"
          icon={<EarthIcon size={12} className="text-white" />}
          classNames={{
            base: "bg-red-700 !w-6 !h-6",
          }}
        />
      )}
    </AvatarGroup>
  );
};

export default StackedQuests;
