import Link from "next/link";

import { auth0 } from "@/lib/auth0";

export const metadata = {
  title: "Quests | NEO POD",
  description:
    "Discover and participate in quests designed to boost your engagement and growth within the Neo Pod community. Earn rewards and unlock achievements.",
};

const QuestsPage = async () => {
  const session = await auth0.getSession();

  return (
    <div className="flex flex-col">
      <Link href="/login">Login</Link>
      <a href="/auth/logout">Logout</a>
      <a href="/admin/hi">Logout</a>
      <Link href="/admin/dashboard">Admin View</Link>
    </div>
  );
};

export default QuestsPage;
