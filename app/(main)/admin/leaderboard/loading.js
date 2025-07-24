import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import LeaderboardSkeleton from "@/components/ui/loader/leaderboard/LeaderboardSkeleton";

const AdminLeaderboardLoading = () => {
  return (
    <WrapperContainer scrollable={true} className="p-6 3xl:p-10">
      <div className="mb-6 md:mb-8">
        <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-700 md:h-9"></div>
        <div className="h-4 w-48 animate-pulse rounded bg-gray-700 md:h-5"></div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-600/30 bg-gray-700/30 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <div className="mx-auto mb-2 h-6 w-16 animate-pulse rounded bg-gray-600 md:h-8"></div>
              <div className="mx-auto h-3 w-20 animate-pulse rounded bg-gray-600 md:h-4"></div>
            </div>
          ))}
        </div>
      </div>

      <section className="thin-scrollbar flex flex-1 flex-col overflow-y-auto">
        <LeaderboardSkeleton />
      </section>
    </WrapperContainer>
  );
};

export default AdminLeaderboardLoading;
