import React from "react";

import AdminNotificationItem from "./AdminNotificationItem";

const AdminNotificationGroup = ({
  notifications,
  title,
  icon,
  isToday = false,
}) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-work-sans text-2xl font-bold text-white">
            {title}
          </h2>
        </div>

        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />

        <span className="rounded-full bg-gray-800/50 px-3 py-1 text-sm text-gray-400">
          {notifications.length} notifications
        </span>
      </div>

      <ul className="space-y-4">
        {notifications.map((notification, index) => (
          <AdminNotificationItem
            index={index}
            isToday={isToday}
            notification={notification}
            key={notification.notification_id}
          />
        ))}
      </ul>
    </div>
  );
};

export default AdminNotificationGroup;
