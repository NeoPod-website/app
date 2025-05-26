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
    title: "PODS",
    href: "/admin/manage/pods",
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
      scrollable={false}
      linkLabel="Create Pod"
      list={breadcrumbsList}
      href="/admin/manage/pods/create"
      icon={<SendHorizontalIcon size={16} className="-mt-0.5" />}
    >
      <ManageError
        error={error}
        linkLabel="Back to PODS"
        linkHref="/admin/manage/pods"
        message="Failed to load PODs. Please try again."
      />
    </ManagePageWrapper>
  );
}
