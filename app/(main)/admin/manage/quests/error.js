"use client";

import { useEffect } from "react";
import { SendHorizontalIcon } from "lucide-react";

import ManageError from "@/components/common/manage/ManageError";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "Quests",
    href: "/admin/manage/quests",
  },

  {
    title: "Error",
  },
];

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error in Manage Pods:", error);
  }, [error]);

  return (
    <ManagePageWrapper
      href="#"
      scrollable={false}
      linkLabel="Error!!"
      list={breadcrumbsList}
      icon={<SendHorizontalIcon size={16} className="-mt-0.5" />}
    >
      <ManageError
        error={error}
        linkLabel="Back to Home"
        linkHref="/admin/dashboard"
        message="Failed to load Quests. Please try again."
      />
    </ManagePageWrapper>
  );
}
