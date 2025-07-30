import React from "react";
import Image from "next/image";

import shortAddress from "@/utils/shortAddress";

import CopyToClipboard from "@/components/ui/CopyToClipboard";

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative">
      <div className="relative h-32 w-full overflow-hidden rounded-2xl sm:h-40 md:h-44">
        <Image
          fill
          alt="Profile Banner Image"
          src="/backgrounds/background-2.png"
          className="absolute left-0 top-0 h-full w-full object-cover opacity-70"
        />
      </div>

      <div className="mx-6 -mt-12 flex items-end justify-between sm:-mt-14 md:-mt-16">
        <div className="relative aspect-square w-28 overflow-hidden rounded-full border-4 border-black sm:w-32 md:w-36">
          <Image
            fill
            alt="profile"
            src={
              user?.profile_photo || "/dashboard/profile/default-profile.png"
            }
            className="absolute left-0 top-0 h-full w-full object-cover"
          />
        </div>

        <div className="mb-2 flex w-fit items-center gap-3 rounded-lg border-t border-gray-400 bg-gradient-dark px-4 py-2.5 text-sm font-bold sm:text-base">
          {shortAddress(
            user?.wallet_address ||
              "0x0000000000000000000000000000000000000000",
          )}
          <CopyToClipboard text={user?.wallet_address || ""} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
