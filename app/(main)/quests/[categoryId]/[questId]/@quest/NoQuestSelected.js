import React from "react";
import Link from "next/link";
import { CheckCircleIcon, Undo2Icon } from "lucide-react";

const NoQuestSelected = () => {
  return (
    <div className="flex flex-[2] flex-col items-center justify-center gap-6 rounded-lg border border-gray-700 bg-black/30 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20">
        <CheckCircleIcon size={32} className="text-green-400" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-white">
          Quest Submitted Successfully!
        </h1>

        <p className="max-w-md text-base text-gray-200">
          Your quest has been submitted for review. Select another quest from
          the sidebar to continue your journey.
        </p>
      </div>

      <Link
        href="/quests"
        className="flex items-center gap-2 rounded-full border border-white bg-gradient-primary px-6 py-2 text-center text-white"
      >
        Browse More Quests <Undo2Icon size={16} className="-mt-0.5" />
      </Link>

      <p className="mt-4 text-sm text-gray-300">
        Check your inbox for review updates and notifications.
      </p>
    </div>
  );
};

export default NoQuestSelected;
