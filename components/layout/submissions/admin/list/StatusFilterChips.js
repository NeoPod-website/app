"use client";

import { Button } from "@heroui/react";
import { CheckCircleIcon } from "lucide-react";

const getFilterChipColor = (filterKey) => {
  const colorMap = {
    all: "default",
    flagged: "danger",
    pending: "default",
    rejected: "danger",
    approved: "success",
    highlighted: "warning",
  };

  return colorMap[filterKey] || "default";
};

const StatusFilterChips = ({ currentStatus, onStatusChange }) => {
  const filterOptions = [
    {
      key: "all",
      label: "All",
    },

    {
      key: "pending",
      label: "Pending",
    },

    {
      key: "approved",
      label: "Approved",
    },

    {
      key: "rejected",
      label: "Rejected",
    },

    {
      key: "highlighted",
      label: "Highlighted",
    },

    {
      key: "flagged",
      label: "Flagged",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map(({ key, label }) => (
        <Button
          key={key}
          size="sm"
          className="h-8"
          onPress={() => onStatusChange(key)}
          variant={currentStatus === key ? "solid" : "bordered"}
          color={currentStatus === key ? getFilterChipColor(key) : "default"}
          startContent={
            currentStatus === key && <CheckCircleIcon className="h-3 w-3" />
          }
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default StatusFilterChips;
