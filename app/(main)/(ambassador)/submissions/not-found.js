"use client";

import Link from "next/link";
import { FileXIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";

const SubmissionsNotFound = () => {
  return (
    <WrapperContainer scrollable>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full">
          <FileXIcon size={32} className="text-yellow-400" />
        </div>

        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-bold text-white">
            Submission Not Found
          </h1>

          <p className="mx-auto max-w-md text-base text-gray-100">
            The submission you're looking for doesn’t exist or may have been
            removed. Double-check the URL or return to the list of submissions.
          </p>
        </div>

        <Link
          href="/submissions"
          className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-white transition-colors hover:bg-white/10"
        >
          Back to Submissions
        </Link>

        <p className="mt-4 text-sm text-gray-200">
          Still having trouble? Contact support for help.
        </p>
      </div>
    </WrapperContainer>
  );
};

export default SubmissionsNotFound;
