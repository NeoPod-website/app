import Link from "next/link";

import { auth0 } from "@/lib/auth0";

const AdminDashboardPage = async () => {
  const session = await auth0.getSession();

  return (
    <div className="flex flex-col">
      <Link href="/login">Login</Link>
      <a href="/auth/logout">Logout</a>
      <Link href="/dashboard">Ambassador View</Link>
    </div>
  );
};

export default AdminDashboardPage;
