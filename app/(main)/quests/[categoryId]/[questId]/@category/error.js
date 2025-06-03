"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

const CategoryError = ({ error, reset }) => {
  return (
    <div className="flex w-80 flex-shrink-0 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/20">
        <AlertTriangleIcon size={24} className="text-red-400" />
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-lg font-bold text-white">
          Failed to load category
        </h1>

        <p className="text-sm text-gray-200">
          We encountered an error while loading the category information.
        </p>

        {error?.message && (
          <p className="mt-3 text-wrap break-all rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-300">
            Error: {error.message}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <button
          onClick={reset}
          className="rounded-full border border-gray-400 bg-black/50 px-4 py-2 text-sm text-white transition-colors hover:border-gray-600 hover:bg-black/70"
        >
          Try Again
        </button>

        <Link
          href="/quests"
          className="rounded-full border border-white bg-gradient-primary px-4 py-2 text-center text-sm text-white"
        >
          Back to Quests
        </Link>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Contact support if this persists.
      </p>
    </div>
  );
};

export default CategoryError;
