import React from "react";

const StatCard = ({ title, value, isMonthly = false }) => (
  <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
    <h4 className="mb-1 text-sm text-gray-200">{title}</h4>

    <p
      className={`text-3xl font-bold ${isMonthly ? "text-pink-500" : "text-white"}`}
    >
      {value?.toLocaleString() || 0}
    </p>
  </div>
);

const StatisticsGrid = ({ user }) => {
  const stats = [
    { title: "Total Points", value: user?.total_points },
    { title: "Total Quests", value: user?.total_quests_completed },
    {
      title: "Monthly Points",
      value: user?.current_month_points,
      isMonthly: true,
    },
    {
      title: "Monthly Quests",
      value: user?.current_month_quests,
      isMonthly: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          isMonthly={stat.isMonthly}
        />
      ))}
    </div>
  );
};

export default StatisticsGrid;
