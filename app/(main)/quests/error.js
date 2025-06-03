"use client";

import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

import MainPageScroll from "@/components/common/MainPageScroll";

const QuestsError = ({ error, reset }) => {
  return (
    <MainPageScroll scrollable={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/20">
          <AlertTriangleIcon size={32} className="text-red-400" />
        </div>

        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-bold text-white">
            Something went wrong
          </h1>

          <p className="mx-auto max-w-md text-base text-gray-200">
            We encountered an error while loading your quest categories. This
            might be a temporary issue.
          </p>

          {error?.message && (
            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              Error: {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-full border border-gray-400 bg-black/50 px-6 py-2 text-white transition-colors hover:border-gray-600 hover:bg-black/70"
          >
            Try Again
          </button>

          <Link
            href="/quests"
            className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-center text-white"
          >
            Back to Quests
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          If this problem persists, please contact support for assistance.
        </p>
      </div>
    </MainPageScroll>
  );
};

export default QuestsError;
