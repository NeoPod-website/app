// "use client";

// import React from "react";

// import AdminTableHeader from "./AdminTableHeader";
// import AdminAmbassadorRow from "./AdminAmbassadorRow";

// const AdminLeaderboardSection = ({ ambassadors, leaderboardType, role }) => {
//   const getSectionTitle = () => {
//     if (role === "all-time") {
//       return "Top Ambassadors - All Time";
//     } else {
//       const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);
//       return `Top ${roleDisplay} Ambassadors - Current Month`;
//     }
//   };

//   return (
//     <div>
//       <h2 className="mb-4 text-lg font-semibold text-gray-100 md:text-xl">
//         {getSectionTitle()}
//       </h2>
//       <div className="space-y-2">
//         {ambassadors.map((ambassador) => (
//           <AdminAmbassadorRow
//             key={ambassador.ambassador_id}
//             ambassador={ambassador}
//             leaderboardType={leaderboardType}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const LoadMoreButton = ({ onLoadMore, isLoading, hasMore }) => {
//   if (!hasMore) {
//     return (
//       <div className="py-4 text-center">
//         <p className="text-gray-400">You've reached the end</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center py-6">
//       <button
//         onClick={onLoadMore}
//         disabled={isLoading}
//         className="rounded-xl border border-gray-600/30 bg-gray-700/30 px-8 py-3 text-gray-100 transition-colors duration-200 hover:bg-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         {isLoading ? "Loading..." : "Load More"}
//       </button>
//     </div>
//   );
// };

// const AdminAmbassadorLeaderboard = ({
//   data = [],
//   hasMore = false,
//   onLoadMore = null,
//   isLoading = false,
//   leaderboardType = "all_time",
//   role = "all-time",
// }) => {
//   return (
//     <div className="w-full pr-3">
//       <AdminTableHeader leaderboardType={leaderboardType} />

//       <AdminLeaderboardSection
//         ambassadors={data}
//         leaderboardType={leaderboardType}
//         role={role}
//       />

//       {onLoadMore && (
//         <LoadMoreButton
//           onLoadMore={onLoadMore}
//           isLoading={isLoading}
//           hasMore={hasMore}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminAmbassadorLeaderboard;

"use client";

import React, { memo } from "react";

import AdminTableHeader from "./AdminTableHeader";
import AdminAmbassadorRow from "./AdminAmbassadorRow";

const AdminLeaderboardSection = memo(
  ({ ambassadors, leaderboardType, role }) => {
    const getSectionTitle = () => {
      if (role === "all-time") {
        return "Top Ambassadors - All Time";
      }

      const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

      return `Top ${roleDisplay} Ambassadors - Current Month`;
    };

    return (
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-100 md:text-xl">
          {getSectionTitle()}
        </h2>

        <div className="space-y-2">
          {ambassadors.map((ambassador) => (
            <AdminAmbassadorRow
              key={ambassador.ambassador_id}
              ambassador={ambassador}
              leaderboardType={leaderboardType}
            />
          ))}
        </div>
      </div>
    );
  },
);

AdminLeaderboardSection.displayName = "AdminLeaderboardSection";

const LoadMoreButton = memo(({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-400">You've reached the end</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="rounded-xl border border-gray-600/30 bg-gray-700/30 px-8 py-3 text-gray-100 transition-colors duration-200 hover:bg-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={
          isLoading ? "Loading more ambassadors" : "Load more ambassadors"
        }
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
});

LoadMoreButton.displayName = "LoadMoreButton";

const AdminAmbassadorLeaderboard = ({
  data = [],
  hasMore = false,
  onLoadMore = null,
  isLoading = false,
  role = "all-time",
  leaderboardType = "all_time",
}) => {
  return (
    <div className="w-full pr-3">
      <AdminTableHeader />

      <AdminLeaderboardSection
        ambassadors={data}
        leaderboardType={leaderboardType}
        role={role}
      />

      {onLoadMore && (
        <LoadMoreButton
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default memo(AdminAmbassadorLeaderboard);
