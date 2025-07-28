import React from "react";
import Link from "next/link";
import { CheckCircleIcon, StarIcon, XCircleIcon } from "lucide-react";

const EMPTY_STATE_CONFIGS = {
  accepted: {
    icon: CheckCircleIcon,
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    title: "No Accepted Submissions Yet",
    description: "Complete some quests and get them approved to see them here!",
    button: {
      text: "Start a Quest",
      href: "/quests",
      className:
        "rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700",
    },
  },

  highlighted: {
    icon: StarIcon,
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
    title: "No Highlighted Submissions Yet",
    description:
      "Keep creating exceptional work to earn highlights and recognition!",
    button: {
      text: "Create Outstanding Work",
      href: "/quests",
      className:
        "rounded-xl bg-yellow-600 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-700",
    },
  },

  rejected: {
    icon: XCircleIcon,
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    title: "No Rejected Submissions",
    description:
      "Great job! You don't have any rejected submissions. Keep up the excellent work!",
    button: {
      text: "View Approved Work",
      href: "/submissions/approved",
      className:
        "rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700",
    },
  },
};

const SubmissionsTypesEmptyState = ({ type }) => {
  const config = EMPTY_STATE_CONFIGS[type];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-400/50 bg-gray-800/20 p-8 text-center">
      <div className={`rounded-full p-8 ${config.iconBg}`}>
        <Icon className={`h-16 w-16 ${config.iconColor}`} />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{config.title}</h3>
        <p className="text-gray-200">{config.description}</p>
      </div>

      <Link href={config.button.href} className={config.button.className}>
        {config.button.text}
      </Link>
    </div>
  );
};

export default SubmissionsTypesEmptyState;
