"use client";

import { Button } from "@heroui/react";
import { useDispatch } from "react-redux";
import React, { useMemo, useEffect, useState } from "react";

import { useInbox } from "@/hooks/useInbox";

import { toggleInboxModal } from "@/redux/slice/modalsSlice";

const InboxButton = ({ item }) => {
  const dispatch = useDispatch();

  const { submissions, getUnreadCount, clearCache } = useInbox();
  const [pollingUnreadCount, setPollingUnreadCount] = useState(0);

  const unreadCount = useMemo(
    () => submissions.filter((s) => !s.is_read_by_ambassador).length,
    [submissions],
  );

  const displayCount = Math.max(unreadCount, pollingUnreadCount);

  useEffect(() => {
    const pollUnreadCount = async () => {
      try {
        const count = await getUnreadCount();
        setPollingUnreadCount(count);

        if (count !== unreadCount && count > 0) {
          clearCache();
        }
      } catch (error) {
        console.error("Error polling unread count:", error);
      }
    };

    pollUnreadCount();

    const interval = setInterval(pollUnreadCount, 120000);

    return () => clearInterval(interval);
  }, [getUnreadCount, unreadCount, clearCache]);

  return (
    <Button
      disableRipple
      onPress={() => dispatch(toggleInboxModal())}
      className="sidebar-menu-item h-[41px] w-full min-w-0 justify-center gap-4 text-sm text-gray-100 xl:justify-between 3xl:h-[46px] 3xl:text-base"
    >
      <div className="flex items-center gap-3 2xl:gap-4">
        <p>{item.icon}</p>
        <p className="md:hidden xl:inline">Inbox</p>
      </div>

      {displayCount > 0 && (
        <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {displayCount > 9 ? "9+" : displayCount}
          {pollingUnreadCount > unreadCount && (
            <span className="absolute inset-0 h-5 w-5 animate-ping rounded-full bg-red-500 opacity-20" />
          )}
        </span>
      )}
    </Button>
  );
};

export default InboxButton;
