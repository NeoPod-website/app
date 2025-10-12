import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";
import CategoryItem from "@/components/layout/category/CategoryItem";

export const metadata = {
  title: "Analytics | Admin Panel | NeoPod",
  description:
    "Deep dive into NeoPod analytics with comprehensive insights on ambassadors, quests, submissions, and rewards.",
};

const fetchDashboardMetrics = async (podId = null) => {
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

const fetchPods = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pods`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pods: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.pods;
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
      color: "#83B0CB",
      icon: "/ambassadors/initiate.png",
    },
    {
      name: "Operators",
      count: metrics?.operators_count || 0,
      color: "#49D1B7",
      icon: "/ambassadors/operator.png",
    },
    {
      name: "Sentinels",
      count: metrics?.sentinels_count || 0,
      color: "#FFB400",
      icon: "/ambassadors/sentinel.png",
    },
    {
      name: "Architects",
      count: metrics?.architects_count || 0,
      color: "#F62F4E",
      icon: "/ambassadors/architect.png",
    },
  ];

  const totalCount = roles.reduce((sum, role) => sum + role.count, 0);
  const maxCount = Math.max(...roles.map((r) => r.count));

  return (
    <li className="col-span-full rounded-2.5xl border-t border-gray-400 bg-gradient-dark/60 p-5 shadow shadow-white/10 lg:p-6 3xl:p-8">
      <h4 className="mb-6 text-lg font-semibold text-white">
        Role Distribution
      </h4>
      <div className="space-y-4">
        {roles.map((role) => {
          const percentage =
            totalCount > 0 ? (role.count / totalCount) * 100 : 0;
          const barWidth = maxCount > 0 ? (role.count / maxCount) * 100 : 0;

          return (
            <div key={role.name} className="flex items-center gap-4 lg:gap-6">
              <div className="relative h-10 w-10 flex-shrink-0 lg:h-12 lg:w-12">
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
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${barWidth + 5}%`,
                      backgroundImage: `linear-gradient(90deg, ${role.color}40 0%, ${role.color} 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </li>
  );
};

const PodSelector = ({ pods, currentPodId }) => (
  <div className="flex flex-wrap gap-3 p-5 lg:p-6 3xl:p-8">
    <Link
      href="/analytics"
      className={`rounded-full border px-4 py-2 text-sm transition-all ${
        !currentPodId
          ? "border-white bg-gradient-primary text-white"
          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-400"
      }`}
    >
      Global
    </Link>
    {pods?.map((pod) => (
      <Link
        key={pod.pod_id}
        href={`/analytics/${pod.pod_id}`}
        className={`rounded-full border px-4 py-2 text-sm transition-all ${
          currentPodId === pod.pod_id
            ? "border-white bg-gradient-primary text-white"
            : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-400"
        }`}
      >
        {pod.name}
      </Link>
    ))}
  </div>
);

const AnalyticsPage = async () => {
  const metrics = await fetchDashboardMetrics(null);
  const pods = await fetchPods();

  return (
    <MainPageScroll scrollable={true}>
      <WrapperContainer scrollable={false}>
        <CategoryItem
          icon={null}
          id="Analytics"
          isAdmin={false}
          showDescription
          podId="Analytics"
          title="Analytics"
          isQuestPage={false}
          description="Comprehensive analytics and insights across all pods and metrics."
          style={{ borderRadius: "1.25rem 1.25rem 0 0" }}
          background="/dashboard/category/background-3.png"
        />

        <PodSelector pods={pods} currentPodId={null} />
      </WrapperContainer>

      <WrapperContainer scrollable={false}>
        <CategoryItem
          icon={null}
          id="ambassador-analytics"
          isAdmin={false}
          showDescription={false}
          podId="ambassador-analytics"
          title="Ambassador Analytics"
          isQuestPage={false}
          description=""
          style={{ borderRadius: "1.25rem 1.25rem 0 0" }}
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
            title="Active Ambassadors"
            value={metrics?.active_ambassadors}
            subtitle={`${((metrics?.active_ambassadors / metrics?.total_ambassadors) * 100).toFixed(1)}% of total`}
          />
          <MetricCard
            title="Verified Ambassadors"
            value={metrics?.verified_ambassadors}
            subtitle={`${metrics?.unverified_ambassadors} unverified`}
          />
          <MetricCard
            title="Suspended"
            value={metrics?.suspended_ambassadors}
            subtitle={`${metrics?.inactive_ambassadors} inactive`}
          />
          <MetricCard
            title="New Today"
            value={metrics?.new_ambassadors_today}
            subtitle="ambassadors joined"
          />
          <MetricCard
            title="New This Month"
            value={metrics?.new_ambassadors_this_month}
            subtitle="ambassadors joined"
          />

          <RoleDistributionChart metrics={metrics} />
        </ul>
      </WrapperContainer>

      {/* Quest Analytics */}
      <WrapperContainer scrollable={false}>
        <CategoryItem
          icon={null}
          id="quest-analytics"
          isAdmin={false}
          showDescription={false}
          podId="quest-analytics"
          title="Quest Analytics"
          isQuestPage={false}
          description=""
          style={{ borderRadius: "1.25rem 1.25rem 0 0" }}
          background="/dashboard/category/background-3.png"
        />

        <ul className="grid min-w-80 grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-6 3xl:gap-8 3xl:p-8">
          <MetricCard
            title="Total Quests"
            value={metrics?.total_quests}
            subtitle={`${metrics?.published_quests} published`}
          />
          <MetricCard
            title="Active Quests"
            value={metrics?.active_quests}
            subtitle={`${((metrics?.active_quests / metrics?.total_quests) * 100).toFixed(1)}% of total`}
          />
          <MetricCard
            title="Draft Quests"
            value={metrics?.draft_quests}
            subtitle="unpublished"
          />
          <MetricCard
            title="Points Available"
            value={metrics?.total_points_available}
            subtitle="across all quests"
          />
          <MetricCard
            title="Daily Quests"
            value={metrics?.daily_quests}
            subtitle={`${((metrics?.daily_quests / metrics?.total_quests) * 100).toFixed(1)}% of total`}
          />
          <MetricCard
            title="Weekly Quests"
            value={metrics?.weekly_quests}
            subtitle={`${((metrics?.weekly_quests / metrics?.total_quests) * 100).toFixed(1)}% of total`}
          />
          <MetricCard
            title="Monthly Quests"
            value={metrics?.monthly_quests}
            subtitle={`${((metrics?.monthly_quests / metrics?.total_quests) * 100).toFixed(1)}% of total`}
          />
          <MetricCard
            title="Archived Quests"
            value={metrics?.archived_quests}
            subtitle="no longer active"
          />
        </ul>
      </WrapperContainer>

      {/* Submission Analytics */}
      <WrapperContainer scrollable={false}>
        <CategoryItem
          icon={null}
          id="submission-analytics"
          isAdmin={false}
          showDescription={false}
          podId="submission-analytics"
          title="Submission Analytics"
          isQuestPage={false}
          description=""
          style={{ borderRadius: "1.25rem 1.25rem 0 0" }}
          background="/dashboard/category/background-3.png"
        />

        <ul className="grid min-w-80 grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-6 3xl:gap-8 3xl:p-8">
          <MetricCard
            title="Total Submissions"
            value={metrics?.total_submissions}
            subtitle="this week"
            change={metrics?.submissions_this_week}
          />
          <MetricCard
            title="Pending Review"
            value={metrics?.pending_submissions}
            subtitle="awaiting action"
          />
          <MetricCard
            title="Approved"
            value={metrics?.approved_submissions}
            subtitle={`${metrics?.approval_rate}% approval rate`}
          />
          <MetricCard
            title="Rejected"
            value={metrics?.rejected_submissions}
            subtitle={`${((metrics?.rejected_submissions / metrics?.total_submissions) * 100).toFixed(1)}% rejection rate`}
          />
          <MetricCard
            title="Today"
            value={metrics?.submissions_today}
            subtitle="submissions"
          />
          <MetricCard
            title="This Month"
            value={metrics?.submissions_this_month}
            subtitle="submissions"
          />
          <MetricCard
            title="Highlighted"
            value={metrics?.highlighted_submissions}
            subtitle="featured work"
          />
          <MetricCard
            title="Flagged"
            value={metrics?.flagged_submissions}
            subtitle="requires attention"
          />
        </ul>
      </WrapperContainer>

      {/* Rewards Analytics */}
      <WrapperContainer scrollable={false}>
        <CategoryItem
          icon={null}
          id="rewards-analytics"
          isAdmin={false}
          showDescription={false}
          podId="rewards-analytics"
          title="Rewards Analytics"
          isQuestPage={false}
          description=""
          style={{ borderRadius: "1.25rem 1.25rem 0 0" }}
          background="/dashboard/category/background-3.png"
        />

        <ul className="grid min-w-80 grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-6 3xl:gap-8 3xl:p-8">
          <MetricCard
            title="Total Points Awarded"
            value={metrics?.total_points_awarded}
            subtitle="all time"
          />
          <MetricCard
            title="Current Month Points"
            value={metrics?.current_month_points}
            subtitle={`${((metrics?.current_month_points / metrics?.total_points_awarded) * 100).toFixed(1)}% of total`}
          />
          <MetricCard
            title="Tokens Distributed"
            value={metrics?.total_tokens_distributed?.toFixed(2)}
            subtitle="total tokens"
          />
          <MetricCard
            title="USD Value"
            value={`$${metrics?.total_usd_distributed?.toLocaleString()}`}
            subtitle="total value"
          />
          <MetricCard
            title="Completed Claims"
            value={metrics?.completed_claims}
            subtitle={`${((metrics?.completed_claims / metrics?.total_claims) * 100).toFixed(1)}% success rate`}
          />
          <MetricCard
            title="Pending Claims"
            value={metrics?.pending_claims}
            subtitle="processing"
          />
          <MetricCard
            title="Failed Claims"
            value={metrics?.failed_claims}
            subtitle="requires review"
          />
          <MetricCard
            title="Total Claims"
            value={metrics?.total_claims}
            subtitle="all time"
          />
        </ul>
      </WrapperContainer>

      {/* System Analytics */}
      <WrapperContainer scrollable={false}>
        <CategoryItem
          icon={null}
          id="system-analytics"
          isAdmin={false}
          showDescription={false}
          podId="system-analytics"
          title="System Analytics"
          isQuestPage={false}
          description=""
          style={{ borderRadius: "1.25rem 1.25rem 0 0" }}
          background="/dashboard/category/background-3.png"
        />

        <ul className="grid min-w-80 grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-6 3xl:gap-8 3xl:p-8">
          <MetricCard
            title="Total Pods"
            value={metrics?.total_pods}
            subtitle={`${metrics?.live_pods} live • ${metrics?.draft_pods} drafts`}
          />
          <MetricCard
            title="Total Categories"
            value={metrics?.total_categories}
            subtitle={`${metrics?.live_categories} live`}
          />
          <MetricCard
            title="Total Admins"
            value={metrics?.total_admins}
            subtitle={`${metrics?.active_admins} active`}
          />
          <MetricCard
            title="Super Admins"
            value={metrics?.super_admins}
            subtitle="highest access"
          />
          <MetricCard
            title="Community Admins"
            value={metrics?.community_admins}
            subtitle="pod managers"
          />
          <MetricCard
            title="Total Reviews"
            value={metrics?.total_reviews_conducted}
            subtitle="conducted"
          />
        </ul>
      </WrapperContainer>
    </MainPageScroll>
  );
};

export default AnalyticsPage;
