import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { BellIcon, StarIcon, TrophyIcon } from "lucide-react";

const fetchUserRank = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/rank`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const { data } = await response.json();
  return data.ambassador_rank || null;
};

const AmbassadorHeader = async () => {
  const userRank = await fetchUserRank();

  return (
    <>
      <div className="hidden h-fit w-fit items-center gap-3 text-nowrap rounded-full border-t border-gray-400 bg-gradient-dark px-3 py-2 md:flex 3xl:px-4 3xl:py-2.5">
        <TrophyIcon
          size={20}
          className="h-4 w-4 text-sm text-yellow-500 3xl:h-5 3xl:w-5"
        />

        <div className="text-sm text-white 3xl:text-base">
          <span>Monthly: </span>
          <span className="font-bold">{userRank?.rank || 0}</span>
        </div>
      </div>

      <div className="hidden h-fit w-fit items-center gap-3 text-nowrap rounded-full border-t border-gray-400 bg-gradient-dark px-3 py-2 sm:flex 3xl:px-4 3xl:py-2.5">
        <StarIcon
          size={20}
          className="h-4 w-4 text-yellow-500 3xl:h-5 3xl:w-5"
        />

        <div className="space-x-1 text-sm text-white 3xl:text-base">
          <span className="font-bold">{userRank?.points || 0}</span>
          <span>XPs</span>
        </div>
      </div>

      <Link href="/notifications" className="hidden">
        <div className="h-9 w-fit rounded-full border-t border-gray-400 bg-gradient-dark px-3 py-2 3xl:h-11 3xl:px-4 3xl:py-2.5">
          <BellIcon size={20} className="h-4 w-4 text-sm 3xl:h-5 3xl:w-5" />
        </div>
      </Link>
    </>
  );
};

export default AmbassadorHeader;
