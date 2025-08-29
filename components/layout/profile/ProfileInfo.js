import React from "react";
import { GlobeIcon, MailIcon } from "lucide-react";

const ProfileInfo = ({ user, isAdmin }) => {
  return (
    <div className="">
      <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 2xl:text-base 3xl:gap-20">
        <p className="min-w-20 font-bold text-white 3xl:min-w-28">Username</p>

        <div className="flex flex-1 rounded-lg border border-gray-400">
          <p className="border-r border-gray-400 px-4 py-2.5 text-gray-200">
            {process.env.NEXT_PUBLIC_BASE_DOMAIN}
          </p>

          <p className="px-4 py-2.5">{user?.username || "Not set"}</p>
        </div>
      </div>

      {isAdmin && (
        <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 2xl:text-base 3xl:gap-20">
          <p className="min-w-20 font-bold text-white 3xl:min-w-28">
            Email Address
          </p>

          <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-400 px-4 py-2.5">
            <MailIcon className="h-5 w-5 text-gray-200" />

            <p>{user?.email || "Not provided"}</p>
          </div>
        </div>
      )}

      <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 2xl:text-base 3xl:gap-20">
        <p className="min-w-20 font-bold text-white 3xl:min-w-28">Role</p>

        <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-400 px-4 py-2.5">
          <GlobeIcon className="h-5 w-5 text-gray-200" />

          <p className="capitalize">{user?.role_type || "Member"}</p>
        </div>
      </div>

      <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 2xl:text-base 3xl:gap-20">
        <p className="min-w-20 font-bold text-white 3xl:min-w-28">Status</p>

        <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-400 px-4 py-2.5">
          <div
            className={`h-3 w-3 rounded-full ${
              user?.status === "active"
                ? "bg-green-500"
                : user?.status === "inactive"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />

          <p className="capitalize">{user?.status || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;
