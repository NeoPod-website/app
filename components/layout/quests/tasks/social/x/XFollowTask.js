"use client";

import React from "react";
import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@heroui/react";
import XAccountCard from "./XAccountCard";

const XFollowTask = ({ task }) => {
  const handleVerifyFollow = () => {
    // TODO: Implement follow verification logic
    console.log("Verifying follow for:", task?.username);
    console.log("Task data:", task);
  };

  return (
    <>
      <div className="mb-3 space-y-3">
        {task?.username && (
          <XAccountCard username={task.username} task={task} />
        )}

        <div className="rounded-xl border border-gray-300 px-3 py-2">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

            <p className="text-sm text-gray-100">
              Follow @{task?.username || "this account"} to complete the quest.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button
          onPress={handleVerifyFollow}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Verify Follow
        </Button>
      </div>
    </>
  );
};

export default XFollowTask;
