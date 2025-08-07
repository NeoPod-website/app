import { BellRingIcon, ClockIcon, ExternalLink } from "lucide-react";

import {
  getTypeColor,
  formatTimeAgo,
} from "@/components/layout/notification/notificationUtils";

const NotificationItem = ({ notification, index }) => {
  const backgroundClass = notification.is_read
    ? "bg-gray-700"
    : "bg-gradient-dark";
  const titleColor = notification.is_read ? "text-gray-300" : "text-white";

  return (
    <li
      className={`group relative overflow-hidden rounded-2xl border border-gray-400 p-4 pl-10 xl:p-6 ${backgroundClass} backdrop-blur-sm transition-all duration-300 hover:border-gray-600/70 hover:shadow-xl hover:shadow-blue-500/10`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex-shrink-0">
            <div
              className={`rounded-xl bg-gradient-to-br ${getTypeColor(notification.notification_type)} p-2 shadow-lg transition-transform duration-300 group-hover:scale-110 3xl:p-3`}
            >
              <BellRingIcon
                size={24}
                className="h-5 w-5 text-white 3xl:h-6 3xl:w-6"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3
                className={`truncate font-work-sans text-lg font-bold 3xl:text-xl ${titleColor} transition-colors duration-300 group-hover:text-blue-300`}
              >
                {notification.title}
              </h3>

              <span className="rounded-full border border-gray-500/50 bg-gray-700/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-100">
                {notification.notification_type}
              </span>
            </div>

            <p className="mb-2 text-sm leading-relaxed text-gray-100 lg:text-base 3xl:mb-3">
              {notification.body}
            </p>

            {/* {notification.image_url && (
              <div className="mb-3 max-w-sm overflow-hidden rounded-lg">
                <img
                  alt="Notification image"
                  src={notification.image_url}
                  className="h-24 w-full object-cover"
                />
              </div>
            )} */}

            {notification.link_url && (
              <div className="mb-3">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={notification.link_url}
                  className="inline-flex items-center gap-1 text-sm text-blue-400 underline transition-colors duration-200 hover:text-blue-300"
                >
                  Open Link
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-200 3xl:text-sm">
              <div className="flex items-center gap-1">
                <ClockIcon size={14} />
                <span>{formatTimeAgo(notification.created_at)}</span>
              </div>

              <div className="text-xs capitalize">
                by {notification.sender_admin}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
