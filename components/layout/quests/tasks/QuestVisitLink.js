"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import { SquareArrowOutUpRightIcon } from "lucide-react";

import QuestTask from "./QuestTask";

import {
  updateTaskAnswer,
  selectTaskAnswer,
} from "@/redux/slice/submissionSlice";

const QuestVisitLink = ({ task, questId }) => {
  const dispatch = useDispatch();

  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  // Check if task is completed (answer is true)
  const isCompleted = currentAnswer === true;

  const handleLinkClick = () => {
    // Mark as completed by setting answer to true
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: true,
      }),
    );
  };

  // Get URL from task object
  const linkUrl = task.url || "";

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
        href={linkUrl}
        target="_blank"
        className="block"
        rel="noopener noreferrer"
        onClick={handleLinkClick}
      >
        <Input
          readOnly
          size="lg"
          type="url"
          value={linkUrl}
          variant="bordered"
          placeholder="Click to visit link"
          classNames={{
            base: "!cursor-pointer",
            inputWrapper: `border-gray-300 focus-within:!border-gray-300 rounded-xl focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-4 py-2.5 !cursor-pointer ${
              isCompleted ? "bg-green-500/20 border-green-500" : "bg-dark"
            }`,
            input: "!cursor-pointer text-white",
          }}
        />
      </Link>

      {isCompleted && (
        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
          <span>✓</span> Link visited
        </div>
      )}
    </QuestTask>
  );
};

export default QuestVisitLink;
