import {
  CalendarIcon,
  DatabaseIcon,
  ArrowLeftIcon,
  TrendingUpIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

const StatsCard = ({
  icon: Icon,
  label,
  value,
  description,
  color = "text-white",
}) => (
  <div className="rounded-xl border border-gray-400 bg-gradient-dark p-4">
    <div className="flex items-start gap-3">
      <div className="rounded-full bg-green-500/20 p-2">
        <Icon size={16} className="text-green-400" />
      </div>

      <div>
        <p className="text-sm text-gray-300">{label}</p>

        <div>
          <p className={`text-lg font-bold ${color}`}>{value}</p>
          {description && (
            <p className="text-xs text-gray-200">{description}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AcceptedSubmissionsHeader = ({ stats }) => {
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
          <CheckCircleIcon size={20} className="text-green-400" />
          <h1 className="text-2xl font-bold text-white">
            Accepted Submissions
          </h1>
        </div>
      </div>

      <p className="text-gray-300">
        Congratulations! These are your approved submissions that met our
        quality standards.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          icon={DatabaseIcon}
          color="text-green-400"
          label="Currently Loaded"
          value={stats.currentCount}
          description="Total submissions loaded"
        />

        <StatsCard
          icon={CalendarIcon}
          label="This Month"
          color="text-white"
          value={stats.thisMonth}
          description="Recently approved"
        />

        <StatsCard
          icon={TrendingUpIcon}
          color="text-white"
          label="Load Status"
          description="Pagination status"
          value={stats.hasMore ? "More Available" : "All Loaded"}
        />
      </div>
    </div>
  );
};

export default AcceptedSubmissionsHeader;
