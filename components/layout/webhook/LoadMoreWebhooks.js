"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";

import WebhookCard from "./WebhookCard";

const LoadMoreWebhooks = ({
  initialWebhooks,
  initialNextKey,
  initialHasMore,
}) => {
  const [webhooks, setWebhooks] = useState(initialWebhooks);

  const [loading, setLoading] = useState(false);
  const [nextKey, setNextKey] = useState(initialNextKey);
  const [hasMore, setHasMore] = useState(initialHasMore);

  /**
   * Load more webhooks
   */
  const loadMoreWebhooks = async () => {
    if (loading || !hasMore || !nextKey) return;

    try {
      setLoading(true);

      const params = new URLSearchParams({
        limit: "20",
        lastEvaluatedKey: nextKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webhooks?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more webhooks: ${response.status}`);
      }

      const data = await response.json();
      const newWebhooks = data.data?.webhooks || [];

      if (newWebhooks.length === 0) {
        setHasMore(false);
        setNextKey(null);
        return;
      }

      // Append new webhooks to existing ones
      setWebhooks((prev) => [...prev, ...newWebhooks]);
      setNextKey(data.data?.pagination?.next_key || null);
      setHasMore(data.data?.pagination?.has_more || false);
    } catch (error) {
      console.error("Error loading more webhooks:", error);
      // Could add toast here if you want
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a webhook from the list (after deletion)
   */
  const removeWebhook = (webhookId) => {
    setWebhooks((prev) =>
      prev.filter((webhook) => webhook.webhook_id !== webhookId),
    );
  };

  return (
    <div className="hide-scroll flex flex-1 flex-col space-y-8 overflow-y-auto lg:overflow-y-hidden">
      <section className="thin-scrollbar flex-1 space-y-6 overflow-y-auto pr-4 3xl:space-y-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {webhooks.map((webhook) => (
            <WebhookCard
              webhook={webhook}
              key={webhook.webhook_id}
              onDelete={removeWebhook}
            />
          ))}
        </div>

        <div>
          {hasMore && (
            <div className="flex justify-center py-4">
              <Button
                onPress={loadMoreWebhooks}
                disabled={loading}
                variant="ghost"
                className="px-8 py-3 text-white hover:bg-gray-700"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {!hasMore && webhooks.length > 0 && (
            <div className="py-4 text-center">
              <p className="text-sm text-gray-300 3xl:text-base">
                You've reached the end • {webhooks.length} webhooks shown
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LoadMoreWebhooks;
