import React from "react";
import { GlobeIcon } from "lucide-react";

import shortAddress from "@/utils/shortAddress";

import SidebarProfilePhoto from "./SidebarProfilePhoto";

import CopyToClipboard from "@/components/ui/CopyToClipboard";
import LogoutBtn from "@/components/ui/buttons/sidebar/LogoutBtn";
import SidebarConnectWallet from "@/components/ui/buttons/sidebar/SidebarConnectWalletBtn";

const SidebarProfile = ({ children, user }) => {
  const isAdmin = user.isAdmin;

  return (
    <div className="flex items-center justify-start gap-3 overflow-hidden px-3 py-2">
      <div className="relative h-10 w-10 3xl:h-12 3xl:w-12 3xl:min-w-12">
        <SidebarProfilePhoto user={user} />

        {children}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium capitalize text-white 3xl:text-base">
              {user.username}
            </h3>

            {isAdmin && (
              <div className="flex items-center gap-1 text-xs capitalize text-gray-100">
                (
                {user.role_type === "super"
                  ? "Super"
                  : user.role_type === "community"
                    ? "Admin"
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
          <div className="flex items-center gap-1 text-xs text-gray-100 3xl:text-sm">
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
              <GlobeIcon size={16} className="h-3 w-3 3xl:h-4 3xl:w-4" />

              <p className="text-xs text-gray-100 3xl:text-sm">
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
