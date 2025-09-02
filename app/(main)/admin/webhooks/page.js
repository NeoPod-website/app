import Link from "next/link";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { Webhook, Plus } from "lucide-react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";
import LoadMoreWebhooks from "@/components/layout/webhook/LoadMoreWebhooks";
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal";

export const metadata = {
  title: "Webhooks | Admin Panel | NeoPod",
  description:
    "Manage webhooks for real-time notifications and integrations with external services.",
};

// Fetch webhooks with proper authentication
const fetchWebhooks = async (limit = 20, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("lastEvaluatedKey", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/webhooks?${params.toString()}`,
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
    if (response.status === 403) {
      notFound();
    }

    if (response.status === 404) {
      return {
        webhooks: [],
        pagination: { hasMore: false, nextKey: null },
      };
    }

    throw new Error(`Failed to fetch webhooks: ${response.status}`);
  }

  const data = await response.json();

  return {
    webhooks: data.data?.webhooks || [],
    pagination: {
      hasMore: data.data?.pagination?.has_more || false,
      nextKey: data.data?.pagination?.next_key || null,
    },
    totalResults: data.results || 0,
  };
};

const AdminWebhooksPage = async () => {
  // Fetch initial webhooks
  const webhookData = await fetchWebhooks(20);

  if (webhookData.webhooks.length === 0) {
    return (
      <MainPageScroll scrollable={false}>
        <WrapperContainer
          scrollable={true}
          className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="space-y-1">
              <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
                Webhooks
              </h2>

              <p className="textbase text-gray-100 3xl:text-lg">
                Manage webhooks for real-time notifications and integrations
              </p>
            </div>

            <Link
              href="/admin/webhooks/create"
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-primary px-5 py-2 font-semibold text-white shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="relative z-10">Create Webhook</span>

              <Plus
                size={20}
                className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
              />
            </Link>
          </div>

          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700/50 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
              <Webhook size={32} className="text-gray-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-white">
              No webhooks configured
            </h3>

            <p className="mb-6 text-gray-200">
              Set up your first webhook to receive real-time notifications and
              integrate with external services.
            </p>

            <Link
              href="/admin/webhooks/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-white shadow-lg transition-transform duration-300"
            >
              Create Your First Webhook
              <Plus size={16} />
            </Link>
          </div>
        </WrapperContainer>
      </MainPageScroll>
    );
  }

  return (
    <MainPageScroll scrollable={false}>
      <DeleteConfirmationModal />

      <div className="flex h-full flex-1 gap-4">
        <WrapperContainer
          scrollable={true}
          className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
                Webhooks
              </h2>

              <p className="text-lg text-gray-200">
                Manage webhooks for real-time notifications and integrations
              </p>
            </div>

            <Link
              href="/admin/webhooks/create"
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white bg-gradient-primary px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300"
            >
              <span className="relative z-10">Create Webhook</span>

              <Plus
                size={20}
                className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
              />
            </Link>
          </div>

          <Suspense>
            <LoadMoreWebhooks
              initialWebhooks={webhookData.webhooks}
              initialNextKey={webhookData.pagination.nextKey}
              initialHasMore={webhookData.pagination.hasMore}
            />
          </Suspense>
        </WrapperContainer>
      </div>
    </MainPageScroll>
  );
};

export default AdminWebhooksPage;
