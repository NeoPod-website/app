import React from "react";

const ProfileStats = ({ user }) => {
  const formatJoinDate = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      const date = new Date(dateString);

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 2xl:gap-5 3xl:gap-7">
      <div className="min-w-24 space-y-3 border-r border-gray-400 pr-3 2xl:pr-5 3xl:pr-7">
        <span className="text-sm text-gray-100 3xl:text-base">Joined</span>

        <p className="text-sm text-white 3xl:text-base">
          {formatJoinDate(user?.joining_date)}
        </p>
      </div>

      <div className="min-w-24 space-y-3 border-r border-gray-400 pr-3 2xl:pr-5 3xl:pr-7">
        <span className="text-sm text-gray-100 3xl:text-base">Total XPs</span>

        <p className="text-sm text-white 3xl:text-base">
          {user?.total_points || 0} XP
        </p>
      </div>

      <div className="min-w-24 space-y-3 border-r border-gray-400 pr-3 2xl:pr-5 3xl:pr-7">
        <span className="text-sm text-gray-100 3xl:text-base">Monthly XPs</span>

        <p className="text-sm text-white 3xl:text-base">
          {user?.current_month_points || 0} XP
        </p>
      </div>

      <div className="min-w-24 space-y-3">
        <span className="text-sm text-gray-100 3xl:text-base">
          Quests Completed
        </span>

        <p className="text-sm text-white 3xl:text-base">
          {user?.total_quests_completed || 0}
        </p>
      </div>
    </div>
  );
};

export default ProfileStats;
