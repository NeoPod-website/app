import Image from "next/image";
import { cookies } from "next/headers";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";
import CategoryItem from "@/components/layout/category/CategoryItem";

export const metadata = {
  title: "Dashboard | Admin Panel | NeoPod",
  description:
    "Overview of NeoPod ambassador program, recent submissions, and key stats. Quickly access tools to manage quests, roles, and community engagement.",
};

const fetchDashboardMetrics = async (podId) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const url = podId
    ? `${process.env.NEXT_PUBLIC_API_URL}/metrics?pod_id=${podId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/metrics`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch metrics: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

const MetricCard = ({ title, value, subtitle, change }) => (
  <li className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-2.5xl border-t border-gray-400 bg-gradient-dark/60 px-4 py-3 shadow shadow-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-gray-200 hover:bg-gradient-dark hover:shadow-white/30 3xl:gap-6 3xl:px-5 3xl:py-4">
    <div className="flex-1 space-y-2 3xl:space-y-3">
      <h3 className="text-base text-gray-200 transition-colors group-hover:text-white">
        {title}
      </h3>

      <p className="text-3xl font-bold text-white 3xl:text-4xl">
        {value?.toLocaleString() || 0}
      </p>

      {subtitle && (
        <p className="flex items-center gap-1.5 text-sm text-gray-300 transition-colors group-hover:text-gray-100">
          {change !== undefined && change !== 0 && (
            <span
              className={`font-semibold ${
                change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : ""
              }`}
            >
              {change > 0 ? "↑" : change < 0 ? "↓" : ""}
              {Math.abs(change).toLocaleString()}
            </span>
          )}

          <span>{subtitle}</span>
        </p>
      )}
    </div>

    <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
  </li>
);

const RoleDistributionChart = ({ metrics }) => {
  const roles = [
    {
      name: "Initiates",
      count: metrics?.initiates_count || 0,
      gradient: "gradient-rank-initiate",
      color: "#83B0CB",
      icon: "/ambassadors/initiate.png",
    },
    {
      name: "Operators",
      count: metrics?.operators_count || 0,
      gradient: "gradient-rank-operator",
      color: "#49D1B7",
      icon: "/ambassadors/operator.png",
    },
    {
      name: "Sentinels",
      count: metrics?.sentinels_count || 0,
      gradient: "gradient-rank-sentinel",
      color: "#FFB400",
      icon: "/ambassadors/sentinel.png",
    },
    {
      name: "Architects",
      count: metrics?.architects_count || 0,
      gradient: "gradient-rank-architect",
      color: "#F62F4E",
      icon: "/ambassadors/architect.png",
    },
  ];

  const totalCount = roles.reduce((sum, role) => sum + role.count, 0);
  const maxCount = Math.max(...roles.map((r) => r.count));

  return (
    <div className="flex-1 rounded-2.5xl border-t border-gray-400 bg-gradient-dark/60 p-5 shadow shadow-white/10 lg:p-6 3xl:p-8">
      <h3 className="mb-6 text-lg font-bold text-white lg:text-xl">
        Ambassador Distribution by Role
      </h3>

      <div className="space-y-4 lg:space-y-5">
        {roles.map((role) => {
          const percentage =
            totalCount > 0 ? (role.count / totalCount) * 100 : 0;
          const barWidth = maxCount > 0 ? (role.count / maxCount) * 100 : 0;

          return (
            <div key={role.name} className="flex items-center gap-4 lg:gap-6">
              <div className="relative h-10 w-10 flex-shrink-0 lg:h-12 lg:w-12 3xl:h-14 3xl:w-14">
                <Image
                  src={role.icon}
                  alt={role.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200 lg:text-base">
                    {role.name}
                  </span>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-white lg:text-xl">
                      {role.count.toLocaleString()}
                    </span>

                    <span className="text-xs text-gray-300 lg:text-sm">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="relative h-4 overflow-hidden rounded-full bg-gray-800/50 lg:h-6">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${barWidth + 5}%`,
                      backgroundImage: `linear-gradient(90deg, ${role.color}40 0%, ${role.color} 100%)`,
                    }}
                  >
                    <div
                      className="h-full w-full opacity-50"
                      style={{
                        backgroundImage: `linear-gradient(90deg, transparent 0%, ${role.color}20 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
        <span className="text-sm text-gray-400">Total Ambassadors</span>
        <span className="text-lg font-bold text-white">
          {totalCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const AdminDashboardPage = async () => {
  const metrics = await fetchDashboardMetrics(null);

  return (
    <MainPageScroll scrollable={true}>
      <WrapperContainer scrollable={false}>
        <CategoryItem
          icon={null}
          id="Dashboard"
          isAdmin={false}
          showDescription
          podId="Dashboard"
          title="Dashboard"
          isQuestPage={false}
          description="Welcome to your admin dashboard! Here you can manage quests, view submissions, and oversee community activities."
          style={{
            borderRadius: "1.25rem 1.25rem 0 0",
          }}
          background="/dashboard/category/background-3.png"
        />

        <ul className="grid min-w-80 grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-6 3xl:gap-8 3xl:p-8">
          <MetricCard
            title="Total Ambassadors"
            value={metrics?.total_ambassadors}
            subtitle="joined this week"
            change={metrics?.new_ambassadors_this_week}
          />

          <MetricCard
            title="Total Admins"
            value={metrics?.total_admins}
            subtitle={`${metrics?.active_admins || 0} active admins`}
          />

          <MetricCard
            title="Approval Rate"
            value={`${metrics?.approval_rate || 0}%`}
            subtitle={`${metrics?.approved_submissions || 0} approved • ${metrics?.rejected_submissions || 0} rejected`}
          />

          <MetricCard
            title="Pending Submissions"
            value={metrics?.pending_submissions}
            subtitle={`out of ${metrics?.total_submissions?.toLocaleString() || 0} total`}
          />

          <MetricCard
            title="Total Pods"
            value={metrics?.total_pods}
            subtitle={`${metrics?.live_pods || 0} live • ${metrics?.draft_pods || 0} drafts`}
          />

          <MetricCard
            title="Points Awarded"
            value={metrics?.total_points_awarded?.toLocaleString()}
            subtitle="earned this month"
            change={metrics?.current_month_points}
          />
        </ul>
      </WrapperContainer>

      <div className="flex gap-8">
        <RoleDistributionChart metrics={metrics} />
        <RoleDistributionChart metrics={metrics} />
      </div>
    </MainPageScroll>
  );
};

export default AdminDashboardPage;
