import React from "react";
import Link from "next/link";
import { BellIcon, StarIcon, TrophyIcon } from "lucide-react";

const AmbassadorHeader = () => {
  return (
    <>
      <div className="flex h-fit w-fit items-center gap-3 text-nowrap rounded-full border-t border-gray-400 bg-gradient-dark px-4 py-2.5">
        <TrophyIcon size={20} className="text-yellow-500" />

        <div className="text-base text-white">
          <span>Monthly: </span>
          <span className="font-bold">20244</span>
        </div>
      </div>

      <div className="flex h-fit w-fit items-center gap-3 text-nowrap rounded-full border-t border-gray-400 bg-gradient-dark px-4 py-2.5">
        <StarIcon size={20} className="text-yellow-500" />

        <div className="text-base text-white">
          <span className="font-bold">382 </span>
          <span>PODS</span>
        </div>
      </div>

      <Link href="/notifications">
        <div className="h-11 w-fit rounded-full border-t border-gray-400 bg-gradient-dark px-4 py-2.5">
          <BellIcon size={20} />
        </div>
      </Link>
    </>
  );
};

export default AmbassadorHeader;
