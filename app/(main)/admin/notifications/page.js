// import MainPageScroll from "@/components/common/MainPageScroll";
// import WrapperContainer from "@/components/common/WrapperContainer";
// import {
//   BellIcon,
//   BellPlusIcon,
//   BellRingIcon,
//   Clock,
//   Eye,
//   Calendar,
//   ChevronDown,
//   Trash2,
//   SquarePen,
//   SquarePenIcon,
// } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// export const metadata = {
//   title: "Notifications | Admin Panel | NeoPod",
//   description:
//     "Send important updates, announcements, and alerts to the NeoPod community. Manage communication effectively with your ambassadors.",
// };

// const fetchNotifications = async (lastKey = null, limit = 20) => {
//   const mockNotifications = [
//     {
//       notification_id: "notif_001",
//       title: "Welcome New Ambassadors",
//       body: "We're excited to welcome our newest community ambassadors! Get started with your onboarding guide and connect with fellow ambassadors.",
//       notification_type: "announcement",
//       recipient_type: "ambassador",
//       created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//       sender_admin: "admin_john",
//     },
//     {
//       notification_id: "notif_002",
//       title: "Monthly Community Update",
//       body: "Check out this month's highlights, upcoming events, and important announcements from the NeoPod community team.",
//       notification_type: "update",
//       recipient_type: "all",
//       created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
//       sender_admin: "admin_sarah",
//     },
//     {
//       notification_id: "notif_003",
//       title: "Security Alert: Password Update",
//       body: "For your account security, please update your password immediately. Follow the link in your email to create a new strong password.",
//       notification_type: "reminder",
//       recipient_type: "all",
//       created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//       sender_admin: "admin_mike",
//     },
//     {
//       notification_id: "notif_004",
//       title: "New Achievement Unlocked",
//       body: "Congratulations! You've unlocked the 'Community Contributor' achievement for your outstanding participation this month.",
//       notification_type: "achievement",
//       recipient_type: "ambassador",
//       created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//       sender_admin: "admin_alex",
//     },
//     {
//       notification_id: "notif_005",
//       title: "Submission Status Update",
//       body: "Your recent submission has been reviewed and approved. Thank you for your contribution to the NeoPod community!",
//       notification_type: "submission_update",
//       recipient_type: "pod",
//       created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//       sender_admin: "admin_maria",
//     },
//   ];

//   return {
//     notifications: mockNotifications,
//     lastEvaluatedKey:
//       mockNotifications.length > 0
//         ? {
//             notification_id:
//               mockNotifications[mockNotifications.length - 1].notification_id,
//           }
//         : null,
//     hasMore: true,
//   };
// };

// const formatTimeAgo = (isoString) => {
//   const date = new Date(isoString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now - date) / 1000);

//   if (diffInSeconds < 60) return "Just now";
//   if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//   if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//   return `${Math.floor(diffInSeconds / 86400)}d ago`;
// };

// const getRecipientLabel = (recipientType) => {
//   switch (recipientType) {
//     case "ambassador":
//       return "Ambassadors";
//     case "pod":
//       return "Pods";
//     case "all":
//       return "Everyone";
//     default:
//       return "Unknown";
//   }
// };

// const getTypeColor = (type) => {
//   switch (type) {
//     case "announcement":
//       return "from-blue-500 to-cyan-500";
//     case "update":
//       return "from-emerald-500 to-teal-500";
//     case "reminder":
//       return "from-amber-500 to-orange-500";
//     case "achievement":
//       return "from-purple-500 to-pink-500";
//     case "submission_update":
//       return "from-indigo-500 to-blue-500";
//     default:
//       return "from-gray-500 to-gray-600";
//   }
// };

// const NotificationItem = ({ notification, index, isToday = false }) => {
//   const backgroundClass = isToday ? "bg-gradient-dark" : "bg-gray-700";

//   return (
//     <li
//       className={`group relative overflow-hidden rounded-2xl border border-gray-400 ${backgroundClass} backdrop-blur-sm transition-all duration-300 hover:border-gray-600/70 hover:shadow-2xl hover:shadow-purple-500/10`}
//       style={{
//         animationDelay: `${index * 100}ms`,
//       }}
//     >
//       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

//       <div className="relative p-6">
//         <div className="flex items-start justify-between">
//           <div className="flex flex-1 items-start gap-4">
//             <div className="flex-shrink-0">
//               <div
//                 className={`rounded-xl bg-gradient-to-br ${getTypeColor(notification.notification_type)} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}
//               >
//                 <BellRingIcon size={24} className="text-white" />
//               </div>
//             </div>

//             <div className="min-w-0 flex-1">
//               <div className="mb-2 flex items-center gap-3">
//                 <h3 className="truncate font-work-sans text-xl font-bold text-white transition-colors duration-300 group-hover:text-purple-300">
//                   {notification.title}
//                 </h3>
//                 <span className="rounded-full border border-gray-600/50 bg-gray-700/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-300">
//                   {notification.notification_type}
//                 </span>
//               </div>

//               <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-300">
//                 {notification.body}
//               </p>

//               <div className="flex items-center gap-4 text-sm text-gray-400">
//                 <div className="flex items-center gap-1">
//                   <Eye size={14} />
//                   <span>{getRecipientLabel(notification.recipient_type)}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Clock size={14} />
//                   <span>{formatTimeAgo(notification.created_at)}</span>
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   by {notification.sender_admin}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex translate-x-4 transform items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
//             <Link
//               href={`/admin/notifications/${notification.notification_id}`}
//               className="hover:bg-blue-500/50 z-10 rounded-lg bg-gray-700/50 p-2 transition-colors duration-200"
//             >
//               <SquarePenIcon
//                 size={16}
//                 className="text-gray-300 hover:text-white"
//               />
//             </Link>

//             <button className="z-10 rounded-lg bg-gray-700/50 p-2 transition-colors duration-200 hover:bg-red-500/50">
//               <Trash2 size={16} className="text-gray-300 hover:text-red-300" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </li>
//   );
// };

// const NotificationGroup = ({ notifications, title, icon, isToday = false }) => {
//   if (!notifications || notifications.length === 0) return null;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-3">
//         <div className="flex items-center gap-2">
//           {icon}
//           <h2 className="font-work-sans text-2xl font-bold text-white">
//             {title}
//           </h2>
//         </div>
//         <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
//         <span className="rounded-full bg-gray-800/50 px-3 py-1 text-sm text-gray-400">
//           {notifications.length} notifications
//         </span>
//       </div>

//       <ul className="space-y-4">
//         {notifications.map((notification, index) => (
//           <NotificationItem
//             key={notification.notification_id}
//             notification={notification}
//             index={index}
//             isToday={isToday}
//           />
//         ))}
//       </ul>
//     </div>
//   );
// };

// const LoadMoreIndicator = ({ hasMore, totalShown }) => {
//   if (!hasMore) return null;

//   return (
//     <div className="flex justify-center">
//       <div className="mx-auto w-fit rounded-xl border border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 backdrop-blur-sm">
//         <div className="mb-3 flex items-center justify-center gap-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
//             <ChevronDown size={16} className="text-white" />
//           </div>
//           <span className="font-medium text-white">
//             More notifications available
//           </span>
//         </div>
//         <div className="text-center">
//           <p className="mb-2 text-sm text-gray-400">
//             Showing {totalShown} notifications
//           </p>
//           <p className="text-xs text-gray-500">
//             Implement LoadMoreButton component for pagination
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatsCard = ({ label, value, icon, color }) => (
//   <div className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/20 to-gray-900/40 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
//     <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />
//     <div className="relative flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-300">{label}</p>
//         <p className="mt-1 text-2xl font-bold text-white">{value}</p>
//       </div>
//       <div className="text-2xl">{icon}</div>
//     </div>
//   </div>
// );

// const AdminNotificationsPage = async () => {
//   const { notifications, lastEvaluatedKey, hasMore } = await fetchNotifications(
//     null,
//     20,
//   );

//   const totalShown = notifications.length;
//   const typeStats = notifications.reduce((acc, notif) => {
//     acc[notif.notification_type] = (acc[notif.notification_type] || 0) + 1;
//     return acc;
//   }, {});

//   const now = new Date();
//   const today = now.toDateString();
//   const yesterday = new Date(now.getTime() - 86400000).toDateString();

//   const todayNotifications = notifications.filter(
//     (notif) => new Date(notif.created_at).toDateString() === today,
//   );

//   const yesterdayNotifications = notifications.filter(
//     (notif) => new Date(notif.created_at).toDateString() === yesterday,
//   );

//   const olderNotifications = notifications.filter((notif) => {
//     const notifDate = new Date(notif.created_at).toDateString();
//     return notifDate !== today && notifDate !== yesterday;
//   });

//   if (notifications.length === 0) {
//     return (
//       <WrapperContainer
//         scrollable={true}
//         className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
//       >
//         <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
//           <div className="space-y-2">
//             <h1 className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text font-work-sans text-4xl font-bold text-transparent xl:text-5xl 3xl:text-6xl">
//               Notifications
//             </h1>
//             <p className="text-lg text-gray-400">
//               Manage and send updates to your community
//             </p>
//           </div>

//           <Link
//             href="/admin/notifications/create"
//             className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-emerald-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//             <span className="relative z-10">Create Notification</span>
//             <BellPlusIcon
//               size={20}
//               className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
//             />
//           </Link>
//         </div>

//         <div className="py-16 text-center">
//           <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700/50 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
//             <BellIcon size={32} className="text-gray-400" />
//           </div>
//           <h3 className="mb-2 text-xl font-semibold text-white">
//             No notifications yet
//           </h3>
//           <p className="mb-6 text-gray-400">
//             Start engaging with your community by creating your first
//             notification.
//           </p>
//           <Link
//             href="/admin/notifications/create"
//             className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/25"
//           >
//             Create Your First Notification
//             <BellPlusIcon size={16} />
//           </Link>
//         </div>
//       </WrapperContainer>
//     );
//   }

//   return (
//     <MainPageScroll scrollable={false}>
//       <div className="flex h-full flex-1 gap-4">
//         <WrapperContainer
//           scrollable={true}
//           className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
//         >
//           <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
//             <div className="space-y-2">
//               <h1 className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text font-work-sans text-4xl font-bold text-transparent xl:text-5xl 3xl:text-6xl">
//                 Notifications
//               </h1>
//               <p className="text-lg text-gray-400">
//                 Manage and send updates to your community
//               </p>
//             </div>

//             <Link
//               href="/admin/notifications/create"
//               className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-emerald-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//               <span className="relative z-10">Create Notification</span>
//               <BellPlusIcon
//                 size={20}
//                 className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
//               />
//             </Link>
//           </div>

//           <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
//             <StatsCard
//               label="Loaded"
//               value={totalShown}
//               icon="📊"
//               color="from-blue-500 to-cyan-500"
//             />
//             <StatsCard
//               label="Announcements"
//               value={typeStats.announcement || 0}
//               icon="📢"
//               color="from-emerald-500 to-teal-500"
//             />
//             <StatsCard
//               label="Updates"
//               value={typeStats.update || 0}
//               icon="📰"
//               color="from-amber-500 to-orange-500"
//             />
//             <StatsCard
//               label="Reminders"
//               value={typeStats.reminder || 0}
//               icon="⏰"
//               color="from-purple-500 to-pink-500"
//             />
//           </div>

//           <section className="space-y-8 overflow-y-scroll pr-4">
//             {todayNotifications.length > 0 && (
//               <NotificationGroup
//                 notifications={todayNotifications}
//                 title="Today"
//                 icon={<Calendar size={24} className="text-purple-400" />}
//                 isToday={true}
//               />
//             )}

//             {yesterdayNotifications.length > 0 && (
//               <NotificationGroup
//                 notifications={yesterdayNotifications}
//                 title="Yesterday"
//                 icon={<Clock size={24} className="text-blue-400" />}
//                 isToday={false}
//               />
//             )}

//             {olderNotifications.length > 0 && (
//               <NotificationGroup
//                 notifications={olderNotifications}
//                 title="Earlier"
//                 icon={<Clock size={24} className="text-gray-400" />}
//                 isToday={false}
//               />
//             )}

//             <LoadMoreIndicator hasMore={hasMore} totalShown={totalShown} />
//           </section>
//         </WrapperContainer>
//       </div>
//     </MainPageScroll>
//   );
// };

// export default AdminNotificationsPage;

import Link from "next/link";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { BellIcon, BellPlusIcon } from "lucide-react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

import NotificationStatsCard from "@/components/layout/notification/NotificationStatsCard";
import LoadMoreAdminNotifications from "@/components/layout/notification/admin/LoadMoreAdminNotifications";

import {
  groupNotificationsByTime,
  calculateNotificationStats,
} from "@/components/layout/notification/notificationUtils";
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal";

export const metadata = {
  title: "Notifications | Admin Panel | NeoPod",
  description:
    "Send important updates, announcements, and alerts to the NeoPod community. Manage communication effectively with your ambassadors.",
};

// Fetch admin's notifications with proper authentication
const fetchAdminNotifications = async (limit = 20, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("lastEvaluatedKey", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/admin?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      notFound();
    }

    if (response.status === 404) {
      return {
        notifications: [],
        pagination: { hasMore: false, nextKey: null },
      };
    }

    throw new Error(`Failed to fetch admin notifications: ${response.status}`);
  }

  const data = await response.json();

  return {
    notifications: data.data?.notifications || [],
    pagination: {
      hasMore: data.data?.pagination?.has_more || false,
      nextKey: data.data?.pagination?.next_key || null,
    },
    totalResults: data.results || 0,
  };
};

const AdminNotificationsPage = async () => {
  // Fetch initial admin notifications
  const notificationData = await fetchAdminNotifications(2);

  // Calculate stats and groupings
  const { totalShown, typeStats } = calculateNotificationStats(
    notificationData.notifications,
  );
  const { todayNotifications, yesterdayNotifications, olderNotifications } =
    groupNotificationsByTime(notificationData.notifications);

  if (notificationData.notifications.length === 0) {
    return (
      <WrapperContainer
        scrollable={true}
        className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
              Notifications
            </h2>

            <p className="text-lg text-gray-400">
              Manage and send updates to your community
            </p>
          </div>

          <Link
            href="/admin/notifications/create"
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="relative z-10">Create Notification</span>

            <BellPlusIcon
              size={20}
              className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
            />
          </Link>
        </div>

        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700/50 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
            <BellIcon size={32} className="text-gray-400" />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-white">
            No notifications yet
          </h3>

          <p className="mb-6 text-gray-400">
            Start engaging with your community by creating your first
            notification.
          </p>

          <Link
            href="/admin/notifications/create"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/25"
          >
            Create Your First Notification
            <BellPlusIcon size={16} />
          </Link>
        </div>
      </WrapperContainer>
    );
  }

  return (
    <MainPageScroll scrollable={false}>
      <DeleteConfirmationModal />

      <div className="flex h-full flex-1 gap-4">
        <WrapperContainer
          scrollable={true}
          className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
                Notifications
              </h2>

              <p className="text-lg text-gray-200">
                Manage and send updates to your community
              </p>
            </div>

            <Link
              href="/admin/notifications/create"
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white bg-gradient-primary px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300"
            >
              <span className="relative z-10">Create Notification</span>

              <BellPlusIcon
                size={20}
                className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
              />
            </Link>
          </div>

          <Suspense>
            <LoadMoreAdminNotifications
              todayNotifications={todayNotifications}
              olderNotifications={olderNotifications}
              yesterdayNotifications={yesterdayNotifications}
              initialNextKey={notificationData.pagination.nextKey}
              initialHasMore={notificationData.pagination.hasMore}
              initialNotifications={notificationData.notifications}
            />
          </Suspense>
        </WrapperContainer>
      </div>
    </MainPageScroll>
  );
};

export default AdminNotificationsPage;
