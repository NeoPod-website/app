import {
  BellIcon,
  BookCheck,
  UsersIcon,
  InboxIcon,
  MedalIcon,
  TrophyIcon,
  ShapesIcon,
  PackageIcon,
  HistoryIcon,
  SettingsIcon,
  ChartAreaIcon,
  ShieldUserIcon,
  LockKeyholeIcon,
  LayoutDashboard,
  FolderKanbanIcon,
  ClipboardListIcon,
  ChartNoAxesCombined,
} from "lucide-react";

const ambassadorMenuItems = [
  {
    name: "Quest Center",
    icon: <BookCheck size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/quests",
  },

  {
    name: "Leaderboard",
    icon: <ChartNoAxesCombined size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    children: [
      {
        name: "Monthly Leaderboard",
        icon: <MedalIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/leaderboard/monthly",
      },

      {
        name: "All Time Leaderboard",
        icon: <TrophyIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/leaderboard/all-time",
      },
    ],
  },

  {
    name: "Inbox",
    icon: <InboxIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/inbox",
  },

  {
    name: "Submissions",
    icon: <BookCheck size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/submissions",
  },

  {
    name: "History",
    icon: <HistoryIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/history",
  },

  {
    name: "Settings",
    icon: <SettingsIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/settings",
  },
];

const adminMenuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/admin/dashboard",
  },

  {
    name: "Submissions",
    icon: <HistoryIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/admin/submissions",
  },

  {
    name: "Manage Tasks",
    icon: <FolderKanbanIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    children: [
      {
        name: "Manage Pods",
        icon: <PackageIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/manage/pods",
      },

      {
        name: "Manage Categories",
        icon: <ShapesIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/manage/categories",
      },

      {
        name: "Manage Quests",
        icon: (
          <ClipboardListIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />
        ),
        href: "/admin/manage/quests",
      },
    ],
  },

  {
    name: "Manage Roles",
    icon: <LockKeyholeIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    children: [
      {
        name: "Manage Admins",
        icon: <ShieldUserIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/manage/admins",
      },

      {
        name: "Manage Ambassadors",
        icon: <UsersIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/manage/ambassadors",
      },
    ],
  },

  {
    name: "Analytics",
    icon: <ChartAreaIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/admin/analytics",
  },

  {
    name: "Leaderboard",
    icon: <ChartNoAxesCombined size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    children: [
      {
        name: "Operator Leaderboard",
        icon: <MedalIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/leaderboard/operator",
      },

      {
        name: "Sentinel Leaderboard",
        icon: <MedalIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/leaderboard/sentinel",
      },

      {
        name: "Architect Leaderboard",
        icon: <MedalIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/leaderboard/architect",
      },

      {
        name: "All Time Leaderboard",
        icon: <TrophyIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
        href: "/admin/leaderboard",
      },
    ],
  },

  {
    name: "Notifications",
    icon: <BellIcon size={20} className="3xl:w-5 3xl:h-5 h-4 w-4" />,
    href: "/admin/notifications",
  },
];

export { ambassadorMenuItems, adminMenuItems };
