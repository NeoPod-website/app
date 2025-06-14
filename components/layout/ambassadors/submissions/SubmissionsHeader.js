// components/layout/submissions/SubmissionsHeader.js
import React from "react";
import { ClockIcon, FileTextIcon } from "lucide-react";

const SubmissionsHeader = ({ count, hasMore }) => {
  return (
    <div className="space-y-6 p-8 pb-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Pending Submissions</h2>

          <p className="text-base text-gray-200">
            {count > 0
              ? `${count} submission${count !== 1 ? "s" : ""} awaiting review`
              : "All your submissions have been reviewed"}
          </p>
        </div>

        {count > 0 && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 rounded-2xl bg-yellow-500/10 px-4 py-3 ring-1 ring-yellow-500/20">
              <div className="flex h-3 w-3 items-center justify-center">
                <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
              </div>

              <span className="text-sm font-medium text-yellow-400">
                {count} pending review
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-gray-400 bg-gradient-dark/60 px-4 py-3">
              <FileTextIcon className="h-4 w-4 text-white" />

              <span className="text-sm font-medium text-white">
                {hasMore ? `${count}+` : count} total
              </span>
            </div>
          </div>
        )}
      </div>

      {count > 0 && (
        <div className="rounded-2xl border border-gray-600 bg-black/5 p-4">
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
