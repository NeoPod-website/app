"use client";

import React from "react";
import { Button, Link } from "@heroui/react";
import { ShieldAlertIcon } from "lucide-react";

const QuestTelegramTask = ({ task }) => {
  const handleVerifyJoin = () => {
    // TODO: Implement Telegram verification logic
    // This might not be possible via API, but we can try username verification
    console.log("Verifying Telegram join for:", task?.channelName);
    console.log("Task data:", task);
  };

  return (
    <>
      <div className="mb-3 space-y-3">
        {/* Channel/Group Info */}
        {task?.channelName && (
          <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                <span className="text-sm font-bold text-white">T</span>
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  {task.channelName}
                </p>

                <p className="text-sm text-gray-300">
                  Telegram {task?.isGroup ? "Group" : "Channel"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

          <p className="text-sm text-gray-100">
            Join our Telegram {task?.isGroup ? "group" : "channel"} to complete
            this quest.
          </p>
        </div>

        {task?.requireVerification && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-900/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <ShieldAlertIcon className="h-4 w-4 text-yellow-400" />

              <p className="text-sm text-yellow-300">
                After joining, you'll need to verify your membership to complete
                this quest.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full justify-end gap-2">
        <Button
          as={Link}
          target="_blank"
          href={task?.channelLink}
          rel="noopener noreferrer"
          className="bg-gray-700"
        >
          Join {task?.isGroup ? "Group" : "Channel"}
        </Button>

        {task?.requireVerification && (
          <Button
            className="border border-white bg-gradient-primary"
            onPress={handleVerifyJoin}
          >
            Verify Join
          </Button>
        )}
      </div>
    </>
  );
};

export default QuestTelegramTask;
