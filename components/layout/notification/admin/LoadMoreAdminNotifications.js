// "use client";

// import React, { useState } from "react";
// import { Button } from "@heroui/react";
// import { Calendar, Clock } from "lucide-react";

// import AdminNotificationGroup from "./AdminNotificationGroup";
// import { groupNotificationsByTime } from "@/components/layout/notification/notificationUtils";

// const LoadMoreAdminNotifications = ({
//   initialNotifications,
//   initialNextKey,
//   initialHasMore,
//   todayNotifications: initialTodayNotifications,
//   yesterdayNotifications: initialYesterdayNotifications,
//   olderNotifications: initialOlderNotifications,
// }) => {
//   // Local state for notifications and pagination
//   const [notifications, setNotifications] = useState(initialNotifications);
//   const [nextKey, setNextKey] = useState(initialNextKey);
//   const [hasMore, setHasMore] = useState(initialHasMore);
//   const [loading, setLoading] = useState(false);

//   // Calculate current groupings
//   const { todayNotifications, yesterdayNotifications, olderNotifications } =
//     groupNotificationsByTime(notifications);

//   /**
//    * Load more admin notifications
//    */
//   const loadMoreNotifications = async () => {
//     if (loading || !hasMore || !nextKey) return;

//     try {
//       setLoading(true);

//       const params = new URLSearchParams({
//         limit: "20",
//         lastEvaluatedKey: nextKey,
//       });

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/notifications/admin?${params.toString()}`,
//         {
//           method: "GET",
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch more notifications: ${response.status}`,
//         );
//       }

//       const data = await response.json();
//       const newNotifications = data.data?.notifications || [];

//       if (newNotifications.length === 0) {
//         setHasMore(false);
//         setNextKey(null);
//         return;
//       }

//       // Append new notifications to existing ones
//       setNotifications((prev) => [...prev, ...newNotifications]);
//       setNextKey(data.data?.pagination?.next_key || null);
//       setHasMore(data.data?.pagination?.has_more || false);
//     } catch (error) {
//       console.error("Error loading more notifications:", error);
//       // Could add toast notification here
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="space-y-8 overflow-y-scroll pr-4">
//       {todayNotifications.length > 0 && (
//         <AdminNotificationGroup
//           notifications={todayNotifications}
//           title="Today"
//           icon={<Calendar size={24} className="text-purple-400" />}
//           isToday={true}
//         />
//       )}

//       {yesterdayNotifications.length > 0 && (
//         <AdminNotificationGroup
//           notifications={yesterdayNotifications}
//           title="Yesterday"
//           icon={<Clock size={24} className="text-blue-400" />}
//           isToday={false}
//         />
//       )}

//       {olderNotifications.length > 0 && (
//         <AdminNotificationGroup
//           notifications={olderNotifications}
//           title="Earlier"
//           icon={<Clock size={24} className="text-gray-400" />}
//           isToday={false}
//         />
//       )}

//       <div>
//         {hasMore && (
//           <div className="flex justify-center py-4">
//             <Button
//               onPress={loadMoreNotifications}
//               disabled={loading}
//               variant="ghost"
//               className="px-8 py-3 text-white hover:bg-gray-700"
//             >
//               {loading ? "Loading..." : "Load More"}
//             </Button>
//           </div>
//         )}

//         {!hasMore && notifications.length > 0 && (
//           <div className="py-4 text-center">
//             <p className="text-sm text-gray-300 3xl:text-base">
//               You've reached the end • {notifications.length} notifications
//               shown
//             </p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default LoadMoreAdminNotifications;

"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";

import {
  groupNotificationsByTime,
  calculateNotificationStats,
} from "@/components/layout/notification/notificationUtils";

import AdminNotificationGroup from "./AdminNotificationGroup";
import NotificationStatsCard from "../NotificationStatsCard";

const LoadMoreNotifications = ({
  initialNotifications,
  initialNextKey,
  initialHasMore,
}) => {
  // Simple local state - no Redux needed!
  const [notifications, setNotifications] = useState(initialNotifications);

  const [loading, setLoading] = useState(false);
  const [nextKey, setNextKey] = useState(initialNextKey);
  const [hasMore, setHasMore] = useState(initialHasMore);

  /**
   * Load more notifications
   */
  const loadMoreNotifications = async () => {
    if (loading || !hasMore || !nextKey) return;

    try {
      setLoading(true);

      const params = new URLSearchParams({
        limit: "20",
        lastEvaluatedKey: nextKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/admin?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch more notifications: ${response.status}`,
        );
      }

      const data = await response.json();
      const newNotifications = data.data?.notifications || [];

      if (newNotifications.length === 0) {
        setHasMore(false);
        setNextKey(null);
        return;
      }

      // Append new notifications to existing ones
      setNotifications((prev) => [...prev, ...newNotifications]);
      setNextKey(data.data?.pagination?.next_key || null);
      setHasMore(data.data?.pagination?.has_more || false);
    } catch (error) {
      console.error("Error loading more notifications:", error);
      // Could add toast here if you want
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats and groupings from current notifications
  const { totalShown, typeStats } = calculateNotificationStats(notifications);
  const { todayNotifications, yesterdayNotifications, olderNotifications } =
    groupNotificationsByTime(notifications);

  return (
    <div className="hide-scroll flex flex-1 flex-col space-y-8 overflow-y-auto lg:overflow-y-hidden">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <NotificationStatsCard
          icon="📊"
          label="Total"
          value={totalShown}
          color="from-blue-500 to-cyan-500"
        />

        <NotificationStatsCard
          icon="📢"
          label="Announcements"
          value={typeStats.announcement || 0}
          color="from-emerald-500 to-teal-500"
        />

        <NotificationStatsCard
          icon="📰"
          label="Updates"
          value={typeStats.update || 0}
          color="from-amber-500 to-orange-500"
        />

        <NotificationStatsCard
          icon="🏆"
          label="Achievements"
          value={typeStats.achievement || 0}
          color="from-purple-500 to-pink-500"
        />
      </div>

      <section className="thin-scrollbar flex-1 space-y-6 overflow-y-auto pr-4 3xl:space-y-8">
        {todayNotifications.length > 0 && (
          <AdminNotificationGroup
            notifications={todayNotifications}
            title="Today"
            icon={<Calendar size={24} className="text-blue-400" />}
          />
        )}

        {yesterdayNotifications.length > 0 && (
          <AdminNotificationGroup
            notifications={yesterdayNotifications}
            title="Yesterday"
            icon={<Clock size={24} className="text-purple-400" />}
          />
        )}

        {olderNotifications.length > 0 && (
          <AdminNotificationGroup
            notifications={olderNotifications}
            title="Earlier"
            icon={<Clock size={24} className="text-gray-400" />}
          />
        )}

        <div>
          {hasMore && (
            <div className="flex justify-center py-4">
              <Button
                onPress={loadMoreNotifications}
                disabled={loading}
                variant="ghost"
                className="px-8 py-3 text-white hover:bg-gray-700"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {!hasMore && notifications.length > 0 && (
            <div className="py-4 text-center">
              <p className="text-sm text-gray-300 3xl:text-base">
                You've reached the end • {totalShown} notifications shown
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LoadMoreNotifications;
