// "use client";

// import { addToast } from "@heroui/react";
// import React, { useState, useEffect } from "react";

// import AdminAmbassadorLeaderboard from "./AdminAmbassadorLeaderboard";

// const AdminLeaderboardContainer = ({
//   podId,
//   role,
//   initialData,
//   initialLastKey,
//   initialHasMore,
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(initialHasMore);
//   const [lastKey, setLastKey] = useState(initialLastKey);
//   const [leaderboardData, setLeaderboardData] = useState(initialData);

//   // Initialize state with server data
//   useEffect(() => {
//     setLastKey(initialLastKey);
//     setHasMore(initialHasMore);
//     setLeaderboardData(initialData);
//   }, [initialData, initialLastKey, initialHasMore]);

//   const handleLoadMore = async () => {
//     if (isLoading || !hasMore || !lastKey) return;

//     try {
//       setIsLoading(true);

//       const query = new URLSearchParams({
//         limit: "10",
//         last_key: lastKey,
//       });

//       // Set period and role_type based on route
//       if (role === "all-time") {
//         query.append("period", "all_time");
//         // Don't set role_type for all-time (shows all roles)
//       } else {
//         // For specific roles, use current month in YYYY_MM format
//         const now = new Date();
//         const currentMonth = `${now.getFullYear()}_${(now.getMonth() + 1)
//           .toString()
//           .padStart(2, "0")}`;
//         query.append("period", currentMonth);
//         query.append("role_type", role);
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/admin/pod/${podId}?${query.toString()}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           cache: "no-store",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch more data: ${response.status}`);
//       }

//       const { data } = await response.json();
//       const newAmbassadors = data.leaderboard || [];

//       if (newAmbassadors.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       // Simply append new data - don't modify ranks or stats
//       setLeaderboardData((prev) => [...prev, ...newAmbassadors]);
//       setLastKey(data.last_key || null);
//       setHasMore(data.has_more || false);
//     } catch (error) {
//       console.error("Error loading more data:", error);

//       addToast({
//         color: "danger",
//         title: "500 | Something went wrong",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AdminAmbassadorLeaderboard
//       hasMore={hasMore}
//       isLoading={isLoading}
//       data={leaderboardData}
//       onLoadMore={handleLoadMore}
//       leaderboardType={role === "all-time" ? "all_time" : "monthly"}
//       role={role}
//     />
//   );
// };

// export default AdminLeaderboardContainer;

"use client";

import { addToast } from "@heroui/react";
import React, { useState, useEffect, useCallback } from "react";

import AdminAmbassadorLeaderboard from "./AdminAmbassadorLeaderboard";

const AdminLeaderboardContainer = ({
  role,
  podId,
  initialData,
  initialLastKey,
  initialHasMore,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [hasMore, setHasMore] = useState(initialHasMore);
  const [lastKey, setLastKey] = useState(initialLastKey);

  const [leaderboardData, setLeaderboardData] = useState(initialData);

  // Initialize state with server data
  useEffect(() => {
    setLastKey(initialLastKey);
    setHasMore(initialHasMore);
    setLeaderboardData(initialData);
  }, [initialData, initialLastKey, initialHasMore]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      setIsLoading(true);

      const query = new URLSearchParams({
        limit: "10",
        last_key: lastKey,
      });

      // Set period and role_type based on route
      if (role === "all-time") {
        query.append("period", "all_time");
      } else {
        const now = new Date();

        const currentMonth = `${now.getFullYear()}_${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        query.append("period", currentMonth);
        query.append("role_type", role);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/admin/pod/${podId}?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more data: ${response.status}`);
      }

      const { data } = await response.json();
      const newAmbassadors = data.leaderboard || [];

      if (newAmbassadors.length === 0) {
        setHasMore(false);
        return;
      }

      setLeaderboardData((prev) => [...prev, ...newAmbassadors]);

      setLastKey(data.last_key || null);
      setHasMore(data.has_more || false);
    } catch (error) {
      addToast({
        color: "danger",
        title: "Failed to load more data",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, lastKey, role, podId]);

  return (
    <AdminAmbassadorLeaderboard
      role={role}
      hasMore={hasMore}
      isLoading={isLoading}
      data={leaderboardData}
      onLoadMore={handleLoadMore}
      leaderboardType={role === "all-time" ? "all_time" : "monthly"}
    />
  );
};

export default AdminLeaderboardContainer;
