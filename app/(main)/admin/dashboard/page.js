import Link from "next/link";

import { auth0 } from "@/lib/auth0";

export const metadata = {
  title: "Dashboard | Admin Panel | NEO POD",
  description:
    "Overview of Neo Pod’s ambassador program, recent submissions, and key stats. Quickly access tools to manage quests, roles, and community engagement.",
};

const AdminDashboardPage = async () => {
  const session = await auth0.getSession();

  return (
    <div className="flex flex-col">
      <Link href="/login">Login</Link>
      <a href="/auth/logout">Logout</a>
      <Link href="/quests">Ambassador View</Link>
    </div>
  );
};

export default AdminDashboardPage;
