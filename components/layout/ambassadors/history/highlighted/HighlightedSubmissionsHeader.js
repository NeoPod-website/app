import {
  StarIcon,
  CrownIcon,
  CalendarIcon,
  DatabaseIcon,
  ArrowLeftIcon,
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
    <div className="rounded-full bg-yellow-500/20 p-2">
      <Icon size={16} className="text-yellow-400" />
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

const HighlightedSubmissionsHeader = ({ stats }) => {
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
          <StarIcon size={20} className="text-yellow-400" />

          <h1 className="text-2xl font-bold text-white">
            Highlighted Submissions
          </h1>
        </div>
      </div>

      <p className="text-gray-300">
        Celebrate your exceptional work! These submissions showcase outstanding
        quality and have been recognized for excellence.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          icon={DatabaseIcon}
          color="text-yellow-400"
          label="Currently Loaded"
          value={stats.currentCount}
          description="Total highlights loaded"
        />

        <StatsCard
          label="This Month"
          color="text-white"
          icon={CalendarIcon}
          value={stats.thisMonth}
          description="New highlights"
        />

        <StatsCard
          icon={CrownIcon}
          color="text-white"
          label="Load Status"
          description="Pagination status"
          value={stats.hasMore ? "More Available" : "All Loaded"}
        />
      </div>
    </div>
  );
};

export default HighlightedSubmissionsHeader;
