"use client";

import React from "react";
import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@heroui/react";
import XSpacesCard from "./XSpacesCard";

const XSpacesTask = ({ task }) => {
  const handleVerifyAttendance = () => {
    // TODO: Implement spaces attendance verification logic
    console.log("Verifying attendance for space:", task?.spaceUrl);
    console.log("Task data:", task);
  };

  return (
    <>
      <div className="mb-3 space-y-3">
        {task?.spaceUrl && <XSpacesCard spaceUrl={task.spaceUrl} task={task} />}

        {task?.spacePassword && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-900/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="h-4 w-4 text-yellow-400" />

              <p className="text-sm text-yellow-300">
                Space Password:{" "}
                <span className="font-mono font-bold text-yellow-100">
                  {task.spacePassword}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-300 px-3 py-2">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

            <p className="text-sm text-gray-100">
              Join and attend this Twitter Space to complete the quest.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-300 bg-gray-900/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-gray-400" />

            <p className="text-sm text-gray-300">
              Click the space above to join, then return here to verify your
              attendance.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button
          onPress={handleVerifyAttendance}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Verify Attendance
        </Button>
      </div>
    </>
  );
};

export default XSpacesTask;
