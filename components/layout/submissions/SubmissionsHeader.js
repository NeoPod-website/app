import React from "react";
import { ClockIcon, FileTextIcon } from "lucide-react";

const SubmissionsHeader = ({ count, hasMore }) => {
  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-start justify-between">
        <div className="mx-4 space-y-2 md:mx-0">
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            Pending Submissions
          </h2>

          <p className="text-sm text-gray-200 lg:text-base">
            {count > 0
              ? `${count} submission${count !== 1 ? "s" : ""} awaiting review`
              : "All your submissions have been reviewed"}
          </p>
        </div>

        {count > 0 && (
          <div className="hidden items-center gap-4 md:flex lg:gap-6">
            <div className="flex items-center gap-3 rounded-2xl bg-yellow-500/10 px-2.5 py-2.5 ring-1 ring-yellow-500/20 3xl:px-4 3xl:py-3">
              <div className="flex h-3 w-3 items-center justify-center">
                <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
              </div>

              <span className="text-sm font-medium text-yellow-400">
                {count} pending review
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-gray-400 bg-gradient-dark/60 px-2.5 py-2.5 3xl:px-4 3xl:py-3">
              <FileTextIcon className="h-4 w-4 text-white" />

              <span className="text-sm font-medium text-white">
                {hasMore ? `${count}+` : count} total
              </span>
            </div>
          </div>
        )}
      </div>

      {count > 0 && (
        <div className="hidden rounded-2xl border border-gray-600 bg-black/5 p-3 md:block 3xl:p-4">
          <div className="flex items-start gap-3">
            <ClockIcon className="mt-0.5 h-5 w-5 text-gray-100" />

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-100">
                Review Process Information
              </p>

              <p className="text-sm text-gray-200">
                Your submissions are being reviewed by our team. You can edit
                them until they're approved. Most submissions are reviewed
                within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsHeader;
