// import {
//   BellIcon,
//   UsersIcon,
//   InboxIcon,
//   HandCoins,
//   MedalIcon,
//   TrophyIcon,
//   ShapesIcon,
//   CircleXIcon,
//   PackageIcon,
//   HistoryIcon,
//   SettingsIcon,
//   SparklesIcon,
//   ChartAreaIcon,
//   BookCheckIcon,
//   ShieldUserIcon,
//   LockKeyholeIcon,
//   LayoutDashboard,
//   FolderKanbanIcon,
//   ClipboardListIcon,
//   CircleCheckBigIcon,
//   ChartNoAxesCombined,
//   LucideChevronsLeftRightEllipsis,
// } from "lucide-react";

// const ambassadorMenuItems = [
//   {
//     name: "Quest Center",
//     icon: <BookCheckIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/quests",
//   },

//   {
//     name: "Leaderboard",
//     icon: <ChartNoAxesCombined size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     children: [
//       {
//         name: "Monthly Leaderboard",
//         icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/leaderboard/monthly",
//       },

//       {
//         name: "All Time Leaderboard",
//         icon: <TrophyIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/leaderboard/all-time",
//       },
//     ],
//   },

//   {
//     name: "Inbox",
//     icon: <InboxIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/inbox",
//   },

//   {
//     name: "Submissions",
//     icon: <BookCheckIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/submissions",
//   },

//   {
//     name: "History",
//     icon: <HistoryIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     children: [
//       {
//         name: "History",
//         icon: <HistoryIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/history",
//       },

//       {
//         name: "Approved",
//         icon: (
//           <CircleCheckBigIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />
//         ),
//         href: "/submissions/approved",
//       },

//       {
//         name: "Rejected",
//         icon: <CircleXIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/submissions/rejected",
//       },

//       {
//         name: "Highlighted",
//         icon: <SparklesIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/submissions/highlighted",
//       },
//     ],
//   },

//   {
//     name: "Settings",
//     icon: <SettingsIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/settings",
//   },
// ];

// const adminMenuItems = [
//   {
//     name: "Dashboard",
//     icon: <LayoutDashboard size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/admin/dashboard",
//   },

//   {
//     name: "Submissions",
//     icon: <HistoryIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/admin/submissions",
//   },

//   {
//     name: "Manage Tasks",
//     icon: <FolderKanbanIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     children: [
//       {
//         name: "Manage Pods",
//         icon: <PackageIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/manage/pods",
//       },

//       {
//         name: "Manage Categories",
//         icon: <ShapesIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/manage/categories",
//       },

//       {
//         name: "Manage Quests",
//         icon: (
//           <ClipboardListIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />
//         ),
//         href: "/admin/manage/quests",
//       },
//     ],
//   },

//   {
//     name: "Manage Roles",
//     icon: <LockKeyholeIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     children: [
//       {
//         name: "Manage Admins",
//         icon: <ShieldUserIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/manage/admins",
//       },

//       {
//         name: "Manage Ambassadors",
//         icon: <UsersIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/manage/ambassadors",
//       },
//     ],
//   },

//   {
//     name: "Analytics",
//     icon: <ChartAreaIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/admin/analytics",
//   },

//   {
//     name: "Leaderboard",
//     icon: <ChartNoAxesCombined size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     children: [
//       {
//         name: "Initiate Leaderboard",
//         icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/leaderboard/initiate",
//       },

//       {
//         name: "Operator Leaderboard",
//         icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/leaderboard/operator",
//       },

//       {
//         name: "Sentinel Leaderboard",
//         icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/leaderboard/sentinel",
//       },

//       {
//         name: "Architect Leaderboard",
//         icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/leaderboard/architect",
//       },

//       {
//         name: "All Time Leaderboard",
//         icon: <TrophyIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//         href: "/admin/leaderboard/all-time",
//       },
//     ],
//   },

//   {
//     name: "Notifications",
//     icon: <BellIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/admin/notifications",
//   },

//   {
//     name: "Webhooks",
//     icon: (
//       <LucideChevronsLeftRightEllipsis
//         size={20}
//         className="h-4 w-4 3xl:h-5 3xl:w-5"
//       />
//     ),
//     href: "/admin/webhooks",
//   },

//   {
//     name: "Rewards History",
//     icon: <HandCoins size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
//     href: "/admin/rewards",
//   },
// ];

// export { ambassadorMenuItems, adminMenuItems };

import React from "react";
import {
  BellIcon,
  UsersIcon,
  InboxIcon,
  HandCoins,
  MedalIcon,
  TrophyIcon,
  ShapesIcon,
  CircleXIcon,
  PackageIcon,
  HistoryIcon,
  SettingsIcon,
  SparklesIcon,
  ChartAreaIcon,
  BookCheckIcon,
  ShieldUserIcon,
  LockKeyholeIcon,
  LayoutDashboard,
  FolderKanbanIcon,
  ClipboardListIcon,
  CircleCheckBigIcon,
  ChartNoAxesCombined,
  LucideChevronsLeftRightEllipsis,
} from "lucide-react";

const ambassadorMenuItems = [
  {
    key: "quest_center",
    name: "Quest Center",
    icon: <BookCheckIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/quests",
  },

  {
    key: "leaderboard",
    name: "Leaderboard",
    icon: <ChartNoAxesCombined size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    children: [
      {
        key: "monthly_leaderboard",
        name: "Monthly Leaderboard",
        icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/leaderboard/monthly",
      },

      {
        key: "all_time_leaderboard",
        name: "All Time Leaderboard",
        icon: <TrophyIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/leaderboard/all-time",
      },
    ],
  },

  {
    key: "inbox",
    name: "Inbox",
    icon: <InboxIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/inbox",
  },

  {
    key: "submissions",
    name: "Submissions",
    icon: <BookCheckIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/submissions",
  },

  {
    key: "history",
    name: "History",
    icon: <HistoryIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    children: [
      {
        key: "history",
        name: "History",
        icon: <HistoryIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/history",
      },

      {
        key: "approved",
        name: "Approved",
        icon: (
          <CircleCheckBigIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />
        ),
        href: "/submissions/approved",
      },

      {
        key: "rejected",
        name: "Rejected",
        icon: <CircleXIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/submissions/rejected",
      },

      {
        key: "highlighted",
        name: "Highlighted",
        icon: <SparklesIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/submissions/highlighted",
      },
    ],
  },

  {
    key: "settings",
    name: "Settings",
    icon: <SettingsIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/settings",
  },
];

const adminMenuItems = [
  {
    key: "dashboard",
    name: "Dashboard",
    icon: <LayoutDashboard size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/admin/dashboard",
  },

  {
    key: "submissions",
    name: "Submissions",
    icon: <HistoryIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/admin/submissions",
  },

  {
    key: "manage_tasks",
    name: "Manage Tasks",
    icon: <FolderKanbanIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    children: [
      {
        key: "manage_pods",
        name: "Manage Pods",
        icon: <PackageIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/manage/pods",
      },

      {
        key: "manage_categories",
        name: "Manage Categories",
        icon: <ShapesIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/manage/categories",
      },

      {
        key: "manage_quests",
        name: "Manage Quests",
        icon: (
          <ClipboardListIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />
        ),
        href: "/admin/manage/quests",
      },
    ],
  },

  {
    key: "manage_roles",
    name: "Manage Roles",
    icon: <LockKeyholeIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    children: [
      {
        key: "manage_admins",
        name: "Manage Admins",
        icon: <ShieldUserIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/manage/admins",
      },

      {
        key: "manage_ambassadors",
        name: "Manage Ambassadors",
        icon: <UsersIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/manage/ambassadors",
      },
    ],
  },

  {
    key: "analytics",
    name: "Analytics",
    icon: <ChartAreaIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/admin/analytics",
  },

  {
    key: "leaderboard",
    name: "Leaderboard",
    icon: <ChartNoAxesCombined size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    children: [
      {
        key: "initiate_leaderboard",
        name: "Initiate Leaderboard",
        icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/leaderboard/initiate",
      },

      {
        key: "operator_leaderboard",
        name: "Operator Leaderboard",
        icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/leaderboard/operator",
      },

      {
        key: "sentinel_leaderboard",
        name: "Sentinel Leaderboard",
        icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/leaderboard/sentinel",
      },

      {
        key: "architect_leaderboard",
        name: "Architect Leaderboard",
        icon: <MedalIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/leaderboard/architect",
      },

      {
        key: "all_time_leaderboard",
        name: "All Time Leaderboard",
        icon: <TrophyIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
        href: "/admin/leaderboard/all-time",
      },
    ],
  },

  {
    key: "notifications",
    name: "Notifications",
    icon: <BellIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/admin/notifications",
  },

  {
    key: "webhooks",
    name: "Webhooks",
    icon: (
      <LucideChevronsLeftRightEllipsis
        size={20}
        className="h-4 w-4 3xl:h-5 3xl:w-5"
      />
    ),
    href: "/admin/webhooks",
  },

  {
    key: "rewards_history",
    name: "Rewards History",
    icon: <HandCoins size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />,
    href: "/admin/rewards",
  },
];

export { ambassadorMenuItems, adminMenuItems };
