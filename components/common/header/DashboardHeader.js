import React from "react";
import Link from "next/link";
import { UserIcon } from "lucide-react";

import AdminHeader from "./AdminHeader";
import SearchHeader from "./SearchHeader";
import AmbassadorHeader from "./AmbassadorHeader";

const DashboardHeader = async ({ session }) => {
  return (
    <header className="flex w-full items-center justify-between gap-5 px-7 py-5">
      <SearchHeader />

      <div className="flex items-center gap-3">
        {session?.isAdmin ? <AdminHeader /> : <AmbassadorHeader />}

        <Link href="/profile">
          <div className="h-11 w-fit rounded-full border-t border-gray-400 bg-gradient-dark px-4 py-2.5">
            <UserIcon size={20} />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
