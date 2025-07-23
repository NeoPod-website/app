// "use client";

// import React, { useState, useEffect } from "react";
// import AmbassadorLeaderboard from "./AmbassadorLeaderboard";
// import { addToast } from "@heroui/react";

// // Additional dummy data for pagination simulation
// const additionalData = [
//   {
//     rank: 7,
//     ambassador_id: "amb_007",
//     username: "NFTCollector",
//     email: "nft@example.com",
//     wallet_address: null,
//     role_type: "initiate",
//     points: 1654,
//     rank_change: 3,
//     profile_photo: "https://i.pravatar.cc/150?u=nftcollector",
//     quest_count: 12,
//     last_activity: "2025-07-16T08:45:00Z",
//   },
//   {
//     rank: 8,
//     ambassador_id: "amb_008",
//     username: "DeFiDegen",
//     email: null,
//     wallet_address: "0x9cd1f109551bD432803012645Hac136c5c8000002",
//     role_type: "operator",
//     points: 1432,
//     rank_change: -1,
//     profile_photo: "https://i.pravatar.cc/150?u=defidegen",
//     quest_count: 10,
//     last_activity: "2025-07-15T19:30:00Z",
//   },
// ];

// const LeaderboardContainer = ({
//   initialData,
//   initialLastKey,
//   initialHasMore,
//   leaderboardType,
//   currentAmbassadorId,
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

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/leaderboards?${query.toString()}`,
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
//       const leaderboard = data.leaderboard || [];
//       console.log(leaderboard);

//       // Simulate loading more data (in real implementation, this comes from your API)
//       const moreData = leaderboard.map((item) => ({
//         ...item,
//         rank: leaderboardData.length + leaderboard.indexOf(item) + 1,
//       }));

//       if (moreData.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       // Update state with new data
//       setLeaderboardData((prev) => [...prev, ...moreData]);

//       setLastKey(data.last_key || null);
//       setHasMore(data.has_more || false);
//     } catch (error) {
//       addToast({
//         color: "danger",
//         title: "500 | Something went wrong",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AmbassadorLeaderboard
//       hasMore={hasMore}
//       isLoading={isLoading}
//       data={leaderboardData}
//       onLoadMore={handleLoadMore}
//       leaderboardType={leaderboardType}
//       currentAmbassadorId={currentAmbassadorId}
//     />
//   );
// };

// export default LeaderboardContainer;

"use client";

import { addToast } from "@heroui/react";
import React, { useState, useEffect } from "react";

import AmbassadorLeaderboard from "./AmbassadorLeaderboard";

const LeaderboardContainer = ({
  initialData,
  initialLastKey,
  initialHasMore,
  leaderboardType,
  userRank,
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

  const handleLoadMore = async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      setIsLoading(true);

      const query = new URLSearchParams({
        limit: "10",
        last_key: lastKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leaderboards?${query.toString()}`,
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

      // Simply append new data - don't modify ranks or stats
      setLeaderboardData((prev) => [...prev, ...newAmbassadors]);
      setLastKey(data.last_key || null);
      setHasMore(data.has_more || false);
    } catch (error) {
      console.error("Error loading more data:", error);

      addToast({
        color: "danger",
        title: "500 | Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AmbassadorLeaderboard
      hasMore={hasMore}
      isLoading={isLoading}
      data={leaderboardData}
      onLoadMore={handleLoadMore}
      leaderboardType={leaderboardType}
      currentAmbassadorId={userRank?.ambassador_id || null}
    />
  );
};

export default LeaderboardContainer;
