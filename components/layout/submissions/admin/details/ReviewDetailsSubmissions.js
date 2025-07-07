import React from "react";
import Link from "next/link";
import { ExternalLinkIcon, ListIcon } from "lucide-react";

const ReviewDetailsSubmissions = ({ submission }) => {
  const taskCount =
    submission.computed?.task_count ||
    Object.keys(submission.submission_data || {}).length;
  const submissionTasks = Object.entries(submission.submission_data || {});

  return (
    <div className="rounded-xl bg-gradient-dark p-4">
      <div className="mb-4 flex items-center gap-2">
        <ListIcon className="h-5 w-5 text-gray-200" />

        <h3 className="font-semibold text-white">
          Submission Tasks ({taskCount})
        </h3>
      </div>

      <div className="space-y-3">
        {submissionTasks.map(([taskId, taskData], index) => (
          <div
            key={taskId}
            className="rounded-lg border border-gray-600 bg-gradient-dark p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-200">
                Task {index + 1}
              </span>

              <span className="text-xs text-gray-200">{taskId}</span>
            </div>

            <div className="space-y-2">
              {typeof taskData === "string" ? (
                taskData.startsWith("http") ? (
                  <Link
                    href={taskData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                    {taskData}
                  </Link>
                ) : (
                  <p className="text-gray-200">{taskData}</p>
                )
              ) : (
                <div className="text-gray-200">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(taskData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewDetailsSubmissions;
