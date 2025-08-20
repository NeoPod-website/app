import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import React, { memo, useState } from "react";
import { Edit2, Eye, MoreVertical } from "lucide-react";

import {
  PointsSection,
  AvatarWithRole,
} from "@/components/layout/leaderboard/AmbassadorUI";

import EditAmbassadorModal from "@/components/ui/modals/EditAmbassadorModal";

// Admin-specific user info component
const AdminUserInfo = memo(({ ambassador }) => {
  const ambassadorId = ambassador.ambassador_id || "";
  const displayId =
    ambassadorId.length >= 6 ? ambassadorId.slice(-6) : ambassadorId;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-medium text-gray-100 md:text-base">
          {ambassador.username}
        </p>

        <span className="bg-blue-500/20 rounded-md px-1.5 py-0.5 text-xs text-blue-300">
          ID: {displayId}
        </span>

        {ambassador.is_verified && (
          <span className="text-sm text-blue-400">✓</span>
        )}
      </div>

      <p className="truncate text-xs text-gray-400 md:text-sm">
        {ambassador.email || "No email"}
      </p>
    </div>
  );
});

AdminUserInfo.displayName = "AdminUserInfo";

// Status badge component
const StatusBadge = memo(({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs font-medium capitalize ${getStatusStyle(status)}`}
    >
      {status || "unknown"}
    </span>
  );
});

StatusBadge.displayName = "StatusBadge";

// Role badge component
const RoleBadge = memo(({ role }) => {
  const getRoleStyle = (role) => {
    switch (role) {
      case "initiate":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "operator":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "sentinel":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "architect":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs font-medium capitalize ${getRoleStyle(role)}`}
    >
      {role || "unknown"}
    </span>
  );
});

RoleBadge.displayName = "RoleBadge";

// Joining date formatter
const JoiningDate = memo(({ date }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="hidden w-24 flex-shrink-0 text-center lg:block lg:w-28">
      <div className="text-xs text-gray-400">Joined</div>

      <div className="text-sm font-medium text-gray-200">
        {formatDate(date)}
      </div>
    </div>
  );
});

JoiningDate.displayName = "JoiningDate";

const AdminAmbassadorContainer = ({ podId, ambassador, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Transform ambassador data to match leaderboard format
  const leaderboardAmbassador = {
    ...ambassador,
    points: ambassador.total_points || 0,
    quest_count: ambassador.total_quests_completed || 0,
    last_activity: ambassador.last_login,
    rank: 0,
    rank_change: 0,
  };

  const handleEditSuccess = (updatedAmbassador) => {
    setShowEditModal(false);

    // Call the parent's update function to update the state
    if (onUpdate && typeof onUpdate === "function") {
      onUpdate(updatedAmbassador);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-2xl bg-gray-700/20 p-3 transition-all duration-200 hover:bg-gray-700/40 xl:p-4">
        <div className="flex flex-1 items-center gap-3 lg:gap-4">
          <div className="flex-shrink-0">
            <AvatarWithRole ambassador={leaderboardAmbassador} />
          </div>

          <div className="min-w-0 flex-1">
            <AdminUserInfo ambassador={ambassador} />
          </div>

          <div className="hidden flex-col gap-1 sm:flex">
            <RoleBadge role={ambassador.role_type} />
            <StatusBadge status={ambassador.status} />
          </div>

          <JoiningDate date={ambassador.joining_date} />
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <PointsSection ambassador={leaderboardAmbassador} />

          <div className="hidden w-16 flex-shrink-0 text-center sm:block md:w-20">
            <div className="text-sm font-bold text-gray-100 md:text-base">
              {ambassador.total_quests_completed || 0}
            </div>

            <div className="text-xs text-gray-400">quests</div>
          </div>

          <div className="flex-shrink-0">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Ambassador actions"
                classNames={{
                  base: "bg-black/90 border border-gray-600",
                  list: "bg-black/90",
                }}
              >
                <DropdownItem
                  key="edit"
                  startContent={<Edit2 size={16} />}
                  onPress={() => setShowEditModal(true)}
                  className="text-gray-200 hover:bg-gray-700/50"
                >
                  Edit Ambassador
                </DropdownItem>

                <DropdownItem
                  key="view"
                  startContent={<Eye size={16} />}
                  href={`/profile/${ambassador.username}`}
                  className="text-gray-200 hover:bg-gray-700/50"
                >
                  View Profile
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      <EditAmbassadorModal
        podId={podId}
        isOpen={showEditModal}
        ambassador={ambassador}
        onSuccess={handleEditSuccess}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default memo(AdminAmbassadorContainer);
