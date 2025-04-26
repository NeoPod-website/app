"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ShieldAlertIcon } from "lucide-react";

const QuestTelegramTask = () => {
  return (
    <>
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
        <ShieldAlertIcon className="h-4 w-4 text-gray-100" />

        <p className="text-sm text-gray-100">
          Join our Telegram channel to complete this quest.
        </p>
      </div>

      <div className="flex w-full justify-end">
        <Button className="ml-auto">Join Telegram Channel</Button>
      </div>
    </>
  );
};

export default QuestTelegramTask;
