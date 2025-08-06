export const formatTimeAgo = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const getTypeColor = (type) => {
  switch (type) {
    case "announcement":
      return "from-blue-500 to-cyan-500";
    case "update":
      return "from-emerald-500 to-teal-500";
    case "reminder":
      return "from-amber-500 to-orange-500";
    case "achievement":
      return "from-purple-500 to-pink-500";
    case "submission_update":
      return "from-indigo-500 to-blue-500";
    default:
      return "from-gray-500 to-gray-600";
  }
};

export const groupNotificationsByTime = (notifications) => {
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  const todayNotifications = notifications.filter(
    (notif) => new Date(notif.created_at).toDateString() === today,
  );

  const yesterdayNotifications = notifications.filter(
    (notif) => new Date(notif.created_at).toDateString() === yesterday,
  );

  const olderNotifications = notifications.filter((notif) => {
    const notifDate = new Date(notif.created_at).toDateString();
    return notifDate !== today && notifDate !== yesterday;
  });

  return {
    todayNotifications,
    yesterdayNotifications,
    olderNotifications,
  };
};

export const calculateNotificationStats = (notifications) => {
  const totalShown = notifications.length;

  const typeStats = notifications.reduce((acc, notif) => {
    acc[notif.notification_type] = (acc[notif.notification_type] || 0) + 1;
    return acc;
  }, {});

  return {
    totalShown,
    typeStats,
  };
};
