import React from "react";
import { GlobeIcon, MailIcon, User2 } from "lucide-react";

const ProfileInfo = ({ user, isAdmin = false, me = false }) => {
  return (
    <div className="mb-4">
      <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 3xl:gap-20 3xl:text-base">
        <p className="min-w-20 font-bold text-white 3xl:min-w-28">Username</p>

        <div className="flex flex-1 rounded-lg border border-gray-400">
          <p className="border-r border-gray-400 px-4 py-2.5 text-gray-200">
            {process.env.NEXT_PUBLIC_BASE_DOMAIN}
          </p>

          <p className="px-4 py-2.5">{user?.username || "Not set"}</p>
        </div>
      </div>

      {isAdmin && (
        <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 3xl:gap-20 3xl:text-base">
          <p className="min-w-20 font-bold text-white 3xl:min-w-28">Email</p>

          <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-400 px-4 py-2.5">
            <MailIcon className="h-5 w-5 text-gray-200" />

            <p>{user?.email || "Not provided"}</p>
          </div>
        </div>
      )}

      <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 3xl:gap-20 3xl:text-base">
        <p className="min-w-20 font-bold text-white 3xl:min-w-28">Role</p>

        <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-400 px-4 py-2.5">
          <GlobeIcon className="h-5 w-5 text-gray-200" />

          <p className="capitalize">{user?.role_type || "Member"}</p>
        </div>
      </div>

      <div className="flex gap-10 border-t border-gray-400 py-6 text-sm xl:gap-16 3xl:gap-20 3xl:text-base">
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

      {(isAdmin || me) && user?.status === "suspended" && (
        <div className="pb-6">
          <div className="flex gap-10 border-t border-gray-400 pt-6 text-sm xl:gap-16 3xl:gap-20 3xl:text-base">
            <p className="min-w-20 font-bold text-white 3xl:min-w-28">
              Suspended By
            </p>

            <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-400 px-4 py-2.5">
              <User2 className="h-5 w-5 text-gray-200" />

              <p className="capitalize">{user?.banned_by}</p>
            </div>
          </div>

          {user?.status === "suspended" && (
            <div className="mt-4 w-full rounded-lg border border-red-500 bg-red-100 px-4 py-2.5 text-sm text-red-700">
              <strong className="font-semibold">Suspension Reason:</strong>{" "}
              {user?.ban_reason || "No reason provided"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProfileInfo;
