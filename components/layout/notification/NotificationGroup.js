import NotificationItem from "@/components/layout/notification/NotificationItem";

const NotificationGroup = ({ notifications, title, icon }) => {
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

        <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />

        <span className="rounded-full bg-gray-800/50 px-3 py-1 text-sm text-gray-400">
          {notifications.length} notification
          {notifications.length !== 1 ? "s" : ""}
        </span>
      </div>

      <ul className="space-y-4">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.notification_id}
            notification={notification}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

export default NotificationGroup;
