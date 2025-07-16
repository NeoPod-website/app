import React from "react";
import Link from "next/link";
import { BellIcon, StarIcon, TrophyIcon } from "lucide-react";

const AmbassadorHeader = () => {
  return (
    <>
      <div className="flex h-fit w-fit items-center gap-3 text-nowrap rounded-full border-t border-gray-400 bg-gradient-dark px-3 py-2 3xl:px-4 3xl:py-2.5">
        <TrophyIcon
          size={20}
          className="h-4 w-4 text-sm text-yellow-500 3xl:h-5 3xl:w-5"
        />

        <div className="text-sm text-white 3xl:text-base">
          <span>Monthly: </span>
          <span className="font-bold">20244</span>
        </div>
      </div>

      <div className="flex h-fit w-fit items-center gap-3 text-nowrap rounded-full border-t border-gray-400 bg-gradient-dark px-3 py-2 3xl:px-4 3xl:py-2.5">
        <StarIcon
          size={20}
          className="h-4 w-4 text-yellow-500 3xl:h-5 3xl:w-5"
        />

        <div className="text-sm text-white 3xl:text-base">
          <span className="font-bold">382 </span>
          <span>PODS</span>
        </div>
      </div>

      <Link href="/notifications">
        <div className="h-9 w-fit rounded-full border-t border-gray-400 bg-gradient-dark px-3 py-2 3xl:h-11 3xl:px-4 3xl:py-2.5">
          <BellIcon size={20} className="h-4 w-4 text-sm 3xl:h-5 3xl:w-5" />
        </div>
      </Link>
    </>
  );
};

export default AmbassadorHeader;
