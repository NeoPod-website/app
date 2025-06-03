import React from "react";
import Link from "next/link";
import { SearchXIcon, Undo2Icon } from "lucide-react";

const QuestNotFound = () => {
  return (
    <div className="flex flex-[2] flex-col items-center justify-center gap-6 rounded-lg border border-gray-700 bg-black/30 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-500/30 bg-gray-500/20">
        <SearchXIcon size={32} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-white">Quest Not Found</h1>

        <p className="max-w-md text-base text-gray-200">
          The quest you're looking for could not be found. It may have been
          removed or doesn't exist.
        </p>
      </div>

      <Link
        href="/quests"
        className="flex items-center gap-2 rounded-full border border-white bg-gradient-primary px-6 py-2 text-center text-white"
      >
        Back to Quests <Undo2Icon size={16} className="-mt-0.5" />
      </Link>

      <p className="mt-4 text-sm text-gray-300">
        Need help? Contact support if you believe this is an error.
      </p>
    </div>
  );
};

export default QuestNotFound;
