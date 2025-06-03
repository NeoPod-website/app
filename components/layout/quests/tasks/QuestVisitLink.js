"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@heroui/react";
import { SquareArrowOutUpRightIcon } from "lucide-react";

import QuestTask from "./QuestTask";

const QuestVisitLink = ({ task, url }) => {
  return (
    <QuestTask
      isAdmin={false}
      color="#0369a1"
      text="Visit Link"
      heading={task.instruction}
      description={task.description}
      icon={<SquareArrowOutUpRightIcon size={12} className="text-white" />}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Input
          type="url"
          size="lg"
          variant="bordered"
          placeholder="Visit Link"
          readOnly
          value={url}
          className="!cursor-pointer bg-dark"
          classNames={{
            base: "!cursor-pointer",
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 rounded-xl focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-4 py-2.5 !cursor-pointer",
            input: "!cursor-pointer",
          }}
        />
      </Link>
    </QuestTask>
  );
};

export default QuestVisitLink;
