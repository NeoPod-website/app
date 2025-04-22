import {
  BookCheck,
  ChartNoAxesCombined,
  HistoryIcon,
  InboxIcon,
  SettingsIcon,
  MedalIcon,
  TrophyIcon,
  LayoutDashboard,
  FolderKanbanIcon,
  ShapesIcon,
  ClipboardListIcon,
  LockKeyholeIcon,
  ShieldUserIcon,
  UsersIcon,
  ChartAreaIcon,
  BellIcon,
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

const adminMenuItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/admin/dashboard",
  },

  {
    name: "Submissions",
    icon: <HistoryIcon size={20} />,
    href: "/admin/submissions",
  },

  {
    name: "Manage Quests",
    icon: <FolderKanbanIcon size={20} />,
    children: [
      {
        name: "Manage Categories",
        icon: <ShapesIcon size={20} />,
        href: "/admin/manage/categories",
      },

      {
        name: "Manage Tasks",
        icon: <ClipboardListIcon size={20} />,
        href: "/admin/manage/quests",
      },
    ],
  },

  {
    name: "Manage Roles",
    icon: <LockKeyholeIcon size={20} />,
    children: [
      {
        name: "Manage Admins",
        icon: <ShieldUserIcon size={20} />,
        href: "/admin/manage/admins",
      },

      {
        name: "Manage Ambassadors",
        icon: <UsersIcon size={20} />,
        href: "/admin/manage/ambassadors",
      },
    ],
  },

  {
    name: "Analytics",
    icon: <ChartAreaIcon size={20} />,
    href: "/admin/analytics",
  },

  {
    name: "Leaderboard",
    icon: <LockKeyholeIcon size={20} />,
    children: [
      {
        name: "Operator Leaderboard",
        icon: <ShieldUserIcon size={20} />,
        href: "/admin/leaderboard/operator",
      },

      {
        name: "Sentinel Leaderboard",
        icon: <UsersIcon size={20} />,
        href: "/admin/leaderboard/sentinel",
      },

      {
        name: "Architect Leaderboard",
        icon: <UsersIcon size={20} />,
        href: "/admin/leaderboard/architect",
      },

      {
        name: "All Time Leaderboard",
        icon: <UsersIcon size={20} />,
        href: "/admin/leaderboard",
      },
    ],
  },

  {
    name: "Notifications",
    icon: <BellIcon size={20} />,
    href: "/admin/notifications",
  },
];

export { ambassadorMenuItems, adminMenuItems };
