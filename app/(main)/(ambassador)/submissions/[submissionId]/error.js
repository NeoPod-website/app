"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangleIcon, ArrowLeftIcon, RotateCwIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";

const SubmissionDetailError = ({ error, reset }) => {
  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
          <Link
            href="/submissions"
            className="inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-white"
          >
            <ArrowLeftIcon size={16} />
            Back to Submissions
          </Link>

          <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 ring-1 ring-red-500/30">
            <AlertTriangleIcon size={14} />
            Error
          </div>
        </div>

        <WrapperContainer
          scrollable
          className="items-center justify-center space-y-6 p-10"
        >
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold text-white">
              Something went wrong
            </h1>

            <p className="text-gray-200">
              We couldn’t load the submission details. This may be a temporary
              issue.
            </p>

            {error?.message && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                Error: {error.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 px-8">
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-full border border-gray-400 bg-black/50 px-6 py-2 text-white hover:border-gray-300 hover:bg-black/70"
            >
              <RotateCwIcon size={16} />
              Try Again
            </button>

            <Link
              href="/submissions"
              className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-white"
            >
              Back to Submissions
            </Link>
          </div>
        </WrapperContainer>
      </div>

      <div className="hidden max-w-md flex-1 flex-col gap-2 md:flex">
        <div className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
          <h2 className="text-md text-white">Submission Info</h2>

          <div className="rounded border border-gray-400 bg-gradient-dark px-3 py-1 text-gray-50">
            Unavailable
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto p-6 scrollbar-hide">
          <div className="rounded-2xl border border-gray-400 bg-gradient-dark p-6 text-sm text-gray-200">
            <h3 className="mb-3 text-base font-semibold text-yellow-300">
              Why am I seeing this?
            </h3>

            <ul className="list-disc space-y-2 pl-4">
              <li>This submission may have been deleted or never existed.</li>
              <li>The URL might be incorrect or expired.</li>
              <li>There could be a temporary server error.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-400 bg-gradient-dark p-6 text-sm text-gray-200">
            <h3 className="mb-3 text-base font-semibold text-yellow-300">
              Need Help?
            </h3>

            <p>
              If you're sure this submission should exist or you're seeing this
              in error, feel free to contact our support team or go back and try
              refreshing the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailError;
