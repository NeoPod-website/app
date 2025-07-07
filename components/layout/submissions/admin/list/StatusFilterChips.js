// "use client";

// import { Button } from "@heroui/react";
// import { CheckCircleIcon } from "lucide-react";

// const getFilterChipColor = (filterKey) => {
//   const colorMap = {
//     all: "default",
//     pending: "default",
//     approved: "success",
//     rejected: "danger",
//     highlighted: "warning",
//     flagged: "danger",
//   };
//   return colorMap[filterKey] || "default";
// };

// const StatusFilterChips = ({ filters, filterCounts, onStatusFilter }) => {
//   const filterOptions = [
//     { key: "all", label: "All", count: filterCounts.all },
//     { key: "pending", label: "Pending", count: filterCounts.pending },
//     { key: "approved", label: "Approved", count: filterCounts.approved },
//     { key: "rejected", label: "Rejected", count: filterCounts.rejected },
//     {
//       key: "highlighted",
//       label: "Highlighted",
//       count: filterCounts.highlighted,
//     },
//     { key: "flagged", label: "Flagged", count: filterCounts.flagged },
//   ];

//   return (
//     <div className="mb-6 flex flex-wrap gap-2">
//       {filterOptions.map(({ key, label, count }) => (
//         <Button
//           key={key}
//           size="sm"
//           variant={filters.status === key ? "solid" : "bordered"}
//           color={filters.status === key ? getFilterChipColor(key) : "default"}
//           onPress={() => onStatusFilter(key)}
//           className="h-8"
//           startContent={
//             filters.status === key && <CheckCircleIcon className="h-3 w-3" />
//           }
//         >
//           {label} ({count})
//         </Button>
//       ))}
//     </div>
//   );
// };

// export default StatusFilterChips;

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
