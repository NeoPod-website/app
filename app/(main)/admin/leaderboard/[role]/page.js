import React from "react";
import { notFound } from "next/navigation";

import PodProvider from "@/providers/PodProvider";
import LeaderboardContainerLoader from "@/components/ui/loader/leaderboard/LeaderboardContainerLoader";

export const metadata = {
  title: "Admin Leaderboard | NeoPod",
  description:
    "View and manage leaderboards across all pods. Monitor ambassador performance and rankings.",
};

const AdminLeaderboardPage = async ({ params }) => {
  const { role = "all-time" } = await params;

  const validRoles = [
    "initiate",
    "operator",
    "sentinel",
    "architect",
    "all-time",
  ];

  if (!validRoles.includes(role)) {
    notFound();
  }

  return (
    <PodProvider role={role}>
      <LeaderboardContainerLoader role={role} />
    </PodProvider>
  );
};

export default AdminLeaderboardPage;
