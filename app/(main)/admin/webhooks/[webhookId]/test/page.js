import React from "react";
import { cookies } from "next/headers";
import { Undo2Icon } from "lucide-react";
import { notFound } from "next/navigation";

import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";
import WebhookTestInterface from "@/components/layout/webhook/WebhookTestInterface";

const fetchWebhook = async (webhookId) => {
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

const WebhookTestPage = async ({ params }) => {
  const { webhookId } = await params;
  const webhook = await fetchWebhook(webhookId);

  if (!webhook) {
    notFound();
  }

  const breadcrumbsList = [
    {
      title: "Admin",
    },

    {
      title: "Webhooks",
      href: "/admin/webhooks",
    },

    {
      title: webhook.name || "Webhook",
      href: `/admin/webhooks/${webhookId}`,
    },

    {
      title: "Test",
    },
  ];

  return (
    <ManagePageWrapper
      linkLabel="Back"
      scrollable={false}
      list={breadcrumbsList}
      href={`/admin/webhooks/${webhookId}`}
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <WebhookTestInterface webhook={webhook} />
    </ManagePageWrapper>
  );
};

export default WebhookTestPage;
