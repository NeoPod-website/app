import React from "react";
import { Undo2Icon } from "lucide-react";

import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";
import AdminNotificationMain from "@/components/layout/notification/admin/AdminNotificationMain";

const CreateNotificationPage = async () => {
  const breadcrumbsList = [
    {
      title: "Admin",
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
    },
    {
      title: "Create",
    },
  ];

  return (
    <ManagePageWrapper
      linkLabel="Back"
      scrollable={false}
      list={breadcrumbsList}
      href="/admin/notifications"
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <AdminNotificationMain isNew={true} />
    </ManagePageWrapper>
  );
};

export default CreateNotificationPage;
