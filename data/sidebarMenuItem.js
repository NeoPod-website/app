import {
  BookCheck,
  ChartNoAxesCombined,
  HistoryIcon,
  InboxIcon,
  SettingsIcon,
  MedalIcon,
  TrophyIcon,
} from "lucide-react";

const ambassadorMenuItems = [
  {
    name: "Task Center",
    icon: <BookCheck size={20} />,
    href: "/dashboard",
  },

  {
    name: "Leaderboard",
    icon: <ChartNoAxesCombined size={20} />,
    children: [
      {
        name: "Monthly Leaderboard",
        icon: <MedalIcon size={20} />,
        href: "/leaderboard/monthly",
      },

      {
        name: "All Time Leaderboard",
        icon: <TrophyIcon size={20} />,
        href: "/leaderboard/all-time",
      },
    ],
  },

  {
    name: "Inbox",
    icon: <InboxIcon size={20} />,
    href: "/inbox",
  },

  {
    name: "Submissions",
    icon: <BookCheck size={20} />,
    href: "/submissions",
  },

  {
    name: "History",
    icon: <HistoryIcon size={20} />,
    href: "/history",
  },

  {
    name: "Settings",
    icon: <SettingsIcon size={20} />,
    href: "/settings",
  },
];

const adminMenuItems = [];

export { ambassadorMenuItems, adminMenuItems };
