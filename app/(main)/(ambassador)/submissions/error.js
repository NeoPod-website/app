"use client";

import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

const SubmissionsError = ({ error, reset }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/20">
        <AlertTriangleIcon size={32} className="text-red-400" />
      </div>

      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold text-white">
          Failed to load submissions
        </h1>

        <p className="mx-auto max-w-md text-base text-gray-100">
          We ran into an issue while loading your pending submissions. This
          could be a temporary glitch or a connection problem.
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
          href="/dashboard"
          className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-center text-white"
        >
          Back to Dashboard
        </Link>
      </div>

      <p className="mt-4 text-sm text-gray-200">
        If this continues, please contact our support team.
      </p>
    </div>
  );
};

export default SubmissionsError;
