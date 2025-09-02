import React from "react";
import { Undo2Icon } from "lucide-react";

import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";
import AdminWebhookMain from "@/components/layout/webhook/AdminWebhookMain";

const CreateWebhookPage = async () => {
  const breadcrumbsList = [
    {
      title: "Admin",
    },
    {
      title: "Webhooks",
      href: "/admin/webhooks",
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
      href="/admin/webhooks"
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <AdminWebhookMain isNew={true} />
    </ManagePageWrapper>
  );
};

export default CreateWebhookPage;
