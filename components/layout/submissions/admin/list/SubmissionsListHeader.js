"use client";

import { useSelector } from "react-redux";
import { UserIcon, FileTextIcon } from "lucide-react";

const SubmissionsListHeader = ({ loadedCount, currentStatus }) => {
  // Get current pod info from Redux
  const allPods = useSelector((state) => state.pods.pods);
  const currentPodId = useSelector((state) => state.pods.currentPod);

  // Find current pod details
  const currentPod = allPods?.find((pod) => pod.pod_id === currentPodId);

  const getStatusLabel = (status) => {
    const statusLabels = {
      all: "All",
      pending: "Pending",
      flagged: "Flagged",
      approved: "Approved",
      rejected: "Rejected",
      highlighted: "Highlighted",
    };

    return statusLabels[status] || "Submissions";
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          {getStatusLabel(currentStatus)} Submissions
        </h1>

        <div className="flex items-center gap-4 text-sm text-foreground-500">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>
              {currentPod?.name || currentPod?.pod_name || "Current Pod"}
            </span>
          </div>

          {loadedCount > 0 && (
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              <span>{loadedCount} loaded</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsListHeader;
