import {
  XCircleIcon,
  CalendarIcon,
  DatabaseIcon,
  ArrowLeftIcon,
  AlertTriangleIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

const StatsCard = ({
  label,
  value,
  icon: Icon,
  description,
  color = "text-white",
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-gray-400 bg-gradient-dark p-4">
    <div className="rounded-full bg-red-500/20 p-2">
      <Icon size={16} className="text-red-400" />
    </div>

    <div>
      <p className="text-sm text-gray-100">{label}</p>

      <div>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
        {description && <p className="text-xs text-gray-200">{description}</p>}
      </div>
    </div>
  </div>
);

const RejectedSubmissionsHeader = ({ stats }) => {
  return (
    <div className="space-y-6 p-8 pb-4">
      <div className="flex items-center gap-4">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-gray-200 transition-colors hover:text-white"
        >
          <ArrowLeftIcon size={16} />
          Back to History
        </Link>

        <div className="h-6 w-px bg-gray-400"></div>

        <div className="flex items-center gap-2">
          <XCircleIcon size={20} className="text-red-400" />

          <h1 className="text-2xl font-bold text-white">
            Rejected Submissions
          </h1>
        </div>
      </div>

      <p className="text-gray-200">
        Learn from these submissions to improve your future work. Each rejection
        is an opportunity to grow!
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          color="text-red-400"
          icon={DatabaseIcon}
          label="Currently Loaded"
          value={stats.currentCount}
          description="Total submissions loaded"
        />

        <StatsCard
          icon={CalendarIcon}
          label="This Month"
          color="text-white"
          value={stats.thisMonth}
          description="Recent rejections"
        />

        <StatsCard
          icon={AlertTriangleIcon}
          color="text-white"
          label="Load Status"
          description="Pagination status"
          value={stats.hasMore ? "More Available" : "All Loaded"}
        />
      </div>
    </div>
  );
};

export default RejectedSubmissionsHeader;
