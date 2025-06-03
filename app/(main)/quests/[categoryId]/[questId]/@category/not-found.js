import React from "react";
import Link from "next/link";
import { SearchXIcon, Undo2Icon } from "lucide-react";

const CategoryNotFound = () => {
  return (
    <div className="flex w-80 flex-1 flex-shrink-0 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-500/30 bg-gray-500/20">
        <SearchXIcon size={24} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        <h1 className="text-xl font-bold text-white">Category Not Found</h1>

        <p className="text-sm text-gray-200">
          The category for this quest could not be found.
        </p>
      </div>

      <Link
        href="/quests"
        className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white bg-gradient-primary px-4 py-2 text-center text-sm text-white"
      >
        Back to Quests <Undo2Icon size={16} className="-mt-0.5" />
      </Link>

      <p className="mt-2 text-xs text-gray-300">Contact support if needed.</p>
    </div>
  );
};

export default CategoryNotFound;
