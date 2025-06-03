"use client";

import React from "react";
import { Button, Link } from "@heroui/react";
import { ShieldAlertIcon } from "lucide-react";

const QuestDiscordTask = ({ task }) => {
  const handleVerifyJoin = () => {
    // TODO: Implement Discord verification logic
    // Can potentially verify via Discord API or bot
    console.log("Verifying Discord join for:", task?.serverName);
    console.log("Task data:", task);
  };

  return (
    <>
      <div className="mb-3 space-y-3">
        {task?.serverName && (
          <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                <span className="text-sm font-bold text-white">D</span>
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  {task.serverName}
                </p>

                <p className="text-sm text-gray-300">Discord Server</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

          <p className="text-sm text-gray-100">
            Join our Discord server to complete this quest.
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
          href={task?.inviteLink}
          rel="noopener noreferrer"
          className="bg-gray-700"
        >
          Join Server
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

export default QuestDiscordTask;
