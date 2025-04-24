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
      <Link href="/login" className="w-fit">
        Login
      </Link>
      <a href="/auth/logout" className="w-fit">
        Logout
      </a>
      <Link href="/history" className="w-fit">
        History
      </Link>
    </div>
  );
};

export default AdminDashboardPage;
