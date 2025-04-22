import Link from "next/link";

import { auth0 } from "@/lib/auth0";

const DashboardPage = async () => {
  const session = await auth0.getSession();

  return (
    <div className="flex flex-col">
      <Link href="/login">Login</Link>
      <a href="/auth/logout">Logout</a>
      <a href="/admin/hi">Logout</a>
    </div>
  );
};

export default DashboardPage;
