"use client";

import { Avatar, Chip } from "@heroui/react";
import { Shield, Activity, Award, Eye } from "lucide-react";

const statusColors = {
  active: "bg-green-600 text-white",
  inactive: "bg-gray-500 text-white",
  suspended: "bg-red-600 text-white",
};

const roleColors = {
  super: "bg-red-500/20 text-red-300 border-red-500/30",
  community: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  moderator: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  reviewer: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const AdminCard = ({ admin, isPreview = false }) => {
  // Early return if admin is not provided
  if (!admin) {
    return (
      <div className="w-full rounded-2.5xl border border-gray-500 bg-black/40 p-6">
        <div className="text-center text-gray-400">
          <p>No admin data available</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Never";
    try {
      const date = new Date(dateString);
      const now = new Date();

      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return "Unknown";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "super":
        return <Shield size={14} className="text-red-400" />;
      case "community":
        return <Activity size={14} className="text-blue-400" />;
      case "moderator":
        return <Award size={14} className="text-purple-400" />;
      case "reviewer":
        return <Eye size={14} className="text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full rounded-2.5xl border bg-black/40 transition-colors hover:border-gray-600 hover:bg-black/80 ${
        admin.status === "active"
          ? "border-green-600"
          : admin.status === "suspended"
            ? "border-red-500"
            : "border-gray-500"
      } ${isPreview ? "" : admin.status !== "active" ? "opacity-80 hover:opacity-100" : ""}`}
    >
      <div className="flex items-center justify-center p-6 pb-4">
        <div className="relative">
          <Avatar
            src={admin.profile_photo}
            name={admin.username}
            size="lg"
            className="h-20 w-20"
          />

          <div className="absolute -bottom-1 -right-1 rounded-full border border-gray-600 bg-gray-800 p-2">
            {getRoleIcon(admin.role_type)}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6 pt-0">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-semibold text-white">
              {admin.username || "Unknown User"}
            </h2>

            {admin.isAdmin && <Shield size={16} className="text-blue-400" />}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Chip
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                roleColors[admin.role_type] ||
                "border-gray-500/30 bg-gray-500/20 text-gray-300"
              }`}
              variant="bordered"
            >
              {admin.role_type || "unknown"}
            </Chip>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                statusColors[admin.status] || "bg-gray-700 text-white"
              }`}
            >
              {admin.status || "active"}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="break-words text-sm text-gray-300">
            {admin.email || "No email provided"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-gray-800/50 p-3">
            <div className="text-lg font-bold text-yellow-400">
              {admin.reviews_number || 0}
            </div>

            <div className="text-xs text-gray-400">Reviews</div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-3">
            <div className="text-lg font-bold text-blue-400">
              {admin.assigned_pods?.length || 0}
            </div>

            <div className="text-xs text-gray-400">Pods</div>
          </div>
        </div>

        {admin.assigned_pods && admin.assigned_pods.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Assigned Pods:</p>

            <div className="flex flex-wrap gap-1">
              {admin.assigned_pods.slice(0, 3).map((podId, index) => (
                <span
                  key={index}
                  className="inline-block text-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-gray-100"
                >
                  {typeof podId === "string"
                    ? podId.slice(-8)
                    : `Pod ${index + 1}`}
                </span>
              ))}

              {admin.assigned_pods.length > 3 && (
                <span className="inline-block text-nowrap rounded bg-gray-600 px-2 py-1 text-xs text-gray-200">
                  +{admin.assigned_pods.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {!isPreview && (
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Joined:</span>
              <span>{formattedDate || "Unknown"}</span>
            </div>

            <div className="flex justify-between">
              <span>Last Login:</span>
              <span>{formatTimeAgo(admin.last_login)}</span>
            </div>

            <div className="flex justify-between">
              <span>Created by:</span>
              <span>{admin.created_by || "System"}</span>
            </div>
          </div>
        )}

        {isPreview && (
          <div className="bg-blue-500/20 mt-4 rounded-lg border border-blue-500/30 p-3 text-center">
            <p className="text-xs font-medium text-blue-300">
              Preview Mode - This is how the admin card will appear
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard;
