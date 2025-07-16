import React from "react";
import Image from "next/image";
import { GlobeIcon } from "lucide-react";

import shortAddress from "@/utils/shortAddress";

import CopyToClipboard from "@/components/ui/CopyToClipboard";
import LogoutBtn from "@/components/ui/buttons/sidebar/LogoutBtn";
import SidebarConnectWallet from "@/components/ui/buttons/sidebar/SidebarConnectWalletBtn";

const SidebarProfile = ({ children, user }) => {
  const isAdmin = user.isAdmin;

  return (
    <div className="flex items-center justify-start gap-3 overflow-hidden px-3 py-2">
      <div className="3xl:h-12 3xl:w-12 3xl:min-w-12 relative h-10 w-10">
        <Image
          width={48}
          height={48}
          alt="Profile Photo"
          className="3xl:w-12 3xl:h-12 h-10 w-10 rounded-md"
          src={user.profile_photo || "/dashboard/profile/default-profile.png"}
        />

        {children}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1">
            <h3 className="3xl:text-base text-sm font-medium capitalize text-white">
              {user.username}
            </h3>

            {isAdmin && (
              <div className="flex items-center gap-1 text-xs capitalize text-gray-100">
                (
                {user.role_type === "super"
                  ? "Super Admin"
                  : user.role_type === "community"
                    ? "Community Admin"
                    : user.role_type === "moderator"
                      ? "Moderator"
                      : "Reviewer"}
                )
              </div>
            )}
          </div>

          <LogoutBtn />
        </div>

        <div className="flex justify-between">
          <div className="3xl:text-sm flex items-center gap-1 text-xs text-gray-100">
            {isAdmin ? (
              <>
                <p>{user.email}</p>
                <CopyToClipboard text={user.email} textType="Email" />
              </>
            ) : user.wallet_address ? (
              <>
                <p>{shortAddress(user.wallet_address)}</p>
                <CopyToClipboard text={user.wallet_address} />
              </>
            ) : (
              <SidebarConnectWallet />
            )}
          </div>

          {!isAdmin && user.location && (
            <div className="flex items-center gap-1">
              <GlobeIcon size={16} className="3xl:h-4 3xl:w-4 h-3 w-3" />

              <p className="3xl:text-sm text-xs text-gray-100">
                {user.location}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
