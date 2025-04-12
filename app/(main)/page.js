import { auth0 } from "@/lib/auth0";
import Link from "next/link";

const DashboardPage = async () => {
  const session = await auth0.getSession();
  console.log(session);

  return (
    <div className="flex flex-col">
      <Link href="/login">Login</Link>
      <a href="/auth/logout">Logout</a>
    </div>
  );
};

export default DashboardPage;
