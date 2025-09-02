import React from "react";
import { cookies } from "next/headers";
import { Undo2Icon } from "lucide-react";
import { notFound } from "next/navigation";

import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";
import AdminWebhookMain from "@/components/layout/webhook/AdminWebhookMain";

const fetchWebhookById = async (webhookId) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/webhooks/${webhookId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      notFound();
    }
    throw new Error(`Failed to fetch webhook: ${response.status}`);
  }

  const data = await response.json();
  return data.data?.webhook;
};

const EditWebhookPage = async ({ params }) => {
  const { webhookId } = params;
  const webhook = await fetchWebhookById(webhookId);

  const breadcrumbsList = [
    {
      title: "Admin",
    },
    {
      title: "Webhooks",
      href: "/admin/webhooks",
    },
    {
      title: webhook?.name || "Edit",
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
      <AdminWebhookMain isNew={false} initialWebhookData={webhook} />
    </ManagePageWrapper>
  );
};

export default EditWebhookPage;
