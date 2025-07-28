import {
  StarIcon,
  CrownIcon,
  XCircleIcon,
  CalendarIcon,
  DatabaseIcon,
  ArrowLeftIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";

const SUBMISSION_THEMES = {
  accepted: {
    icon: CheckCircleIcon,
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    title: "Accepted Submissions",
    primaryColor: "text-green-400",
    description:
      "Congratulations! These are your approved submissions that met our quality standards.",
    statsConfig: [
      {
        icon: DatabaseIcon,
        label: "Currently Loaded",
        description: "Total submissions loaded",
      },
      {
        icon: CalendarIcon,
        label: "This Month",
        description: "Recently approved",
      },
      {
        icon: TrendingUpIcon,
        label: "Load Status",
        description: "Pagination status",
      },
    ],
  },

  highlighted: {
    icon: StarIcon,
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
    primaryColor: "text-yellow-400",
    title: "Highlighted Submissions",
    description:
      "Celebrate your exceptional work! These submissions showcase outstanding quality and have been recognized for excellence.",
    statsConfig: [
      {
        icon: DatabaseIcon,
        label: "Currently Loaded",
        description: "Total highlights loaded",
      },
      {
        icon: CalendarIcon,
        label: "This Month",
        description: "New highlights",
      },
      {
        icon: CrownIcon,
        label: "Load Status",
        description: "Pagination status",
      },
    ],
  },

  rejected: {
    icon: XCircleIcon,
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    primaryColor: "text-red-400",
    title: "Rejected Submissions",
    description:
      "Learn from these submissions to improve your future work. Each rejection is an opportunity to grow!",
    statsConfig: [
      {
        icon: DatabaseIcon,
        label: "Currently Loaded",
        description: "Total submissions loaded",
      },
      {
        icon: CalendarIcon,
        label: "This Month",
        description: "Recent rejections",
      },
      {
        icon: AlertTriangleIcon,
        label: "Load Status",
        description: "Pagination status",
      },
    ],
  },
};

const StatsCard = ({
  label,
  value,
  icon: Icon,
  description,
  color,
  iconColor,
  iconBg,
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-gray-400 bg-gradient-dark p-4">
    <div className={`rounded-full p-2 ${iconBg}`}>
      <Icon size={16} className={iconColor} />
    </div>

    <div>
      <p className="text-sm text-gray-100">{label}</p>

      <div>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-200">{description}</p>
      </div>
    </div>
  </div>
);

const SubmissionsTypesHeader = ({
  type,
  stats,
  hasMore,
  backHref = "/history",
}) => {
  const theme = SUBMISSION_THEMES[type];

  const HeaderIcon = theme.icon;

  const statsValues = [
    stats.currentCount,
    stats.thisMonth,
    hasMore ? "More Available" : "All Loaded",
  ];

  const statsColors = [theme.primaryColor, "text-white", "text-white"];

  return (
    <div className="space-y-4 pb-4 2xl:space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="hidden items-center gap-2 text-sm text-gray-200 transition-colors hover:text-white md:inline-flex 3xl:text-base"
        >
          <ArrowLeftIcon size={16} />
          Back to History
        </Link>

        <div className="hidden h-6 w-px bg-gray-400 md:inline-flex" />

        <div className="flex items-center gap-2">
          <HeaderIcon size={20} className={theme.iconColor} />
          <h1 className="text-2xl font-bold text-white">{theme.title}</h1>
        </div>
      </div>

      <p className="text-gray-300">{theme.description}</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {theme.statsConfig.map((config, index) => (
          <StatsCard
            key={config.label}
            icon={config.icon}
            label={config.label}
            iconBg={theme.iconBg}
            value={statsValues[index]}
            color={statsColors[index]}
            iconColor={theme.iconColor}
            description={config.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SubmissionsTypesHeader;
