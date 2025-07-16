"use client";

import React, { useMemo } from "react";
import { Button } from "@heroui/react";
import { useDispatch } from "react-redux";

import { useInbox } from "@/hooks/useInbox";

import { toggleInboxModal } from "@/redux/slice/modalsSlice";

const InboxButton = ({ item }) => {
  const dispatch = useDispatch();
  const { submissions } = useInbox();

  const unreadCount = useMemo(
    () => submissions.filter((s) => !s.is_read_by_ambassador).length,
    [submissions],
  );

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

      {unreadCount > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default InboxButton;
