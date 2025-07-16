import React from "react";
import Link from "next/link";
import { UserIcon } from "lucide-react";

import AdminHeader from "./AdminHeader";
import SearchHeader from "./SearchHeader";
import AmbassadorHeader from "./AmbassadorHeader";

const DashboardHeader = async ({ session }) => {
  return (
    <header className="flex w-full items-center justify-between gap-5 px-5 pb-4 pt-3 lg:px-6 3xl:px-8 3xl:py-5">
      <SearchHeader />

      <div className="flex items-center gap-3">
        {session?.isAdmin ? <AdminHeader /> : <AmbassadorHeader />}

        <Link href="/profile">
          <div className="h-9 w-fit rounded-full border-t border-gray-400 bg-gradient-dark px-3 py-2 3xl:h-11 3xl:px-4 3xl:py-2.5">
            <UserIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
