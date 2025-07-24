import { redirect } from "next/navigation";

export const metadata = {
  title: "All-Time Leaderboard | Admin Panel | NeoPod",
  description:
    "Explore the all-time top-performing ambassadors across all roles — Initiate, Operator, Sentinel, and Architect. Track long-term contributions and engagement in the NeoPod community.",
};

const AdminLeaderboardPage = () => {
  redirect("/admin/leaderboard/all-time");
};

export default AdminLeaderboardPage;
