"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { EllipsisVerticalIcon, GlobeIcon } from "lucide-react";
import shortAddress from "@/utils/shortAddress";
import CopyToClipboard from "@/components/ui/CopyToClipboard";

const SidebarProfile = ({ children, user }) => {
  const isAdmin = user.isAdmin;

  return (
    <div className="flex items-center justify-start gap-3 overflow-hidden px-3 py-2">
      <div className="relative h-12 min-w-12">
        <Image
          src={user.profile_photo || "/dashboard/profile/default-profile.png"}
          width={48}
          height={48}
          alt="Profile Photo"
          className="rounded-md"
        />
        {children}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1">
            <h3 className="text-base font-medium capitalize text-white">
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

          {!isAdmin && (
            <Button className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700">
              <EllipsisVerticalIcon size={16} />
            </Button>
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-100">
            {isAdmin ? (
              <>
                <p>{user.email}</p>
                <CopyToClipboard text={user.email} textType="Email" />
              </>
            ) : user.address ? (
              <>
                <p>{shortAddress(user.address)}</p>
                <CopyToClipboard text={user.address} />
              </>
            ) : (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 h-auto rounded !px-0 !py-0 text-xs text-white underline"
                onPress={() => {
                  // This would need to be implemented based on your wallet connection flow
                  console.log("Connect wallet clicked");
                }}
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {!isAdmin && user.location && (
            <div className="flex items-center gap-1">
              <GlobeIcon size={16} />
              <p className="text-sm text-gray-100">{user.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
