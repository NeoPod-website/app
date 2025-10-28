"use client";

import {
  XCircleIcon,
  Loader2Icon,
  AlertCircleIcon,
  CheckCircle2Icon,
  SendHorizontalIcon,
} from "lucide-react";
import { addToast } from "@heroui/react";
import React, { useState, useCallback, useMemo } from "react";
import { Button, Select, SelectItem, Chip } from "@heroui/react";

import WebhookTestHistory from "./WebhookTestHistory";
import WebhookPayloadEditor from "./WebhookPayloadEditor";

import WrapperContainer from "@/components/common/WrapperContainer";

const TIMESTAMP = new Date().toISOString();

const SAMPLE_PAYLOADS = {
  "join.community": {
    event: "join.community",
    timestamp: TIMESTAMP,
    data: {
      ambassador_id: "amb_neo_555",
      pod_id: "pod_english_01",
      user: {
        id: "amb_neo_555",
        username: "neo_newbie",
        email: "newbie@neopod.io",
        role_type: "initiate",
        invited_by: "amb_neo_101",
        discord: { id: "93021", username: "neo_newbie#2025" },
        telegram: { id: "88291", username: "neopod_user" },
        twitter: { id: "72910", username: "@neo_newbie" },
        wallet_address: "0x11c5fE402fd39698d1144AD027A2fF2471d723af",
        pod_id: "pod_english_01",
        location: "San Francisco, CA",
        is_verified: true,
        status: "active",
      },
      pod: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
        description:
          "Community ambassadors promoting Neo ecosystem in English-speaking regions",
      },
      joined_at: TIMESTAMP,
    },
  },

  "user.banned": {
    event: "user.banned",
    timestamp: TIMESTAMP,
    data: {
      ambassador_id: "amb_neo_999",
      pod_id: "pod_english_01",
      user: {
        id: "amb_neo_999",
        username: "bad_actor",
        email: "fraud@example.com",
        previous_status: "active",
        previous_role: "initiate",
        role_type: "initiate",
        total_points: 450,
        banned_at: TIMESTAMP,
        submissions_rejected_count: 3,
      },
      pod: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
        description:
          "Community ambassadors promoting Neo ecosystem in English-speaking regions",
      },
      ban_details: {
        reason:
          "Repeated submission of fraudulent proofs and violation of community guidelines",
        banned_by: "neo_admin",
        banned_at: TIMESTAMP,
      },
      admin: {
        id: "neo_admin",
        username: "neo_admin",
        email: "admin@neo.org",
        role_type: "Super Admin",
      },
    },
  },

  "user.role.changed": {
    event: "user.role.changed",
    timestamp: TIMESTAMP,
    data: {
      ambassador_id: "amb_neo_101",
      pod_id: "pod_english_01",
      user: {
        id: "amb_neo_101",
        username: "neo_builder",
        email: "builder@neo.org",
        role_type: "operator",
        discord: { id: "93021", username: "neo_builder#2025" },
        telegram: { id: "88291", username: "neopod_dev" },
        twitter: { id: "72910", username: "@neo_builder" },
        wallet_address: "0x11c5fE402fd39698d1144AD027A2fF2471d723af",
        pod_id: "pod_english_01",
        current_month_points: 1250,
        total_points: 8750,
        total_quests_completed: 32,
        total_rewards_claimed: 2500.75,
        total_tokens_earned: 850.25,
      },
      pod: {
        id: "pod_english_01",
        name: "English Global Ambassadors",
        description:
          "Community ambassadors promoting Neo ecosystem in English-speaking regions",
      },
      role_change: {
        from: "initiate",
        to: "operator",
        reason: "self_promotion_request",
        changed_at: TIMESTAMP,
      },
      promotion_details: {
        discord_role_updated: true,
        eligibility_requirements_met: true,
      },
      changed_at: TIMESTAMP,
    },
  },

  "quest.failed": {
    event: "quest.failed",
    timestamp: TIMESTAMP,
    data: {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_neo_x_twitter_share",
      user: {
        id: "amb_neo_101",
        username: "neo_builder",
        email: "builder@neo.org",
        role_type: "operator",
        pod_id: "pod_english_01",
        total_points: 8750,
        discord: { id: "93021", username: "neo_builder#2025" },
      },
      quest: {
        id: "quest_neo_x_twitter_share",
        name: "Share Neo X Integration Tutorial",
        rewards: [
          { type: "points", amount: 500 },
          { type: "token", amount: "25", tokenType: "native" },
        ],
        points: 500,
        total_submissions: 87,
        created_by: "admin_core_001",
      },
      submission: {
        id: "sub_neo_567",
        review_comment:
          "Twitter link is broken and hashtags are missing. Please resubmit with valid proof.",
        review_status: "rejected",
        reviewed_at: TIMESTAMP,
        submission_data: {
          task_1: "https://twitter.com/neo_builder/status/1234567890",
          task_2: "#NeoX #SmartContract",
        },
        submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      reviewerData: {
        id: "admin_core_001",
        username: "neo_admin",
        email: "admin@neo.org",
        role_type: "Super Admin",
      },
      failure_reason:
        "Invalid proof: broken Twitter link and missing required hashtags",
      failed_at: TIMESTAMP,
    },
  },

  "quest.claimed": {
    event: "quest.claimed",
    timestamp: TIMESTAMP,
    data: {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_neo_x_twitter_share",
      user: {
        id: "amb_neo_101",
        username: "neo_builder",
        email: "builder@neo.org",
        role_type: "operator",
        pod_id: "pod_english_01",
        total_points: 8750,
      },
      quest: {
        id: "quest_neo_x_twitter_share",
        name: "Share Neo X Integration Tutorial",
        rewards: [
          { type: "points", amount: 500 },
          { type: "token", amount: "25", tokenType: "native" },
        ],
        points: 500,
      },
      submission: {
        id: "sub_neo_567",
        review_status: "pending",
        review_comment: null,
        reviewed_at: null,
        submission_data: {
          task_1: "https://twitter.com/neo_builder/status/1234567890",
          task_2: "#NeoX #SmartContract #Tutorial",
        },
        submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      claimed_at: TIMESTAMP,
    },
  },

  "quest.succeeded": {
    event: "quest.succeeded",
    timestamp: TIMESTAMP,
    data: {
      ambassador_id: "amb_neo_101",
      quest_id: "quest_neo_x_twitter_share",
      user: {
        id: "amb_neo_101",
        username: "neo_builder",
        email: "builder@neo.org",
        role_type: "operator",
        pod_id: "pod_english_01",
        total_points: 8750,
        discord: { id: "93021", username: "neo_builder#2025" },
      },
      quest: {
        id: "quest_neo_x_twitter_share",
        name: "Share Neo X Integration Tutorial",
        rewards: [
          { type: "points", amount: 500 },
          { type: "token", amount: "25", tokenType: "native" },
        ],
        points: 500,
      },
      submission: {
        id: "sub_neo_567",
        review_status: "approved",
        review_comment:
          "Excellent Twitter thread! Great engagement and proper hashtag usage.",
        reviewed_at: TIMESTAMP,
        approved_at: TIMESTAMP,
        submission_data: {
          task_1: "https://twitter.com/neo_builder/status/1234567890",
          task_2: "#NeoX #SmartContract #Tutorial",
        },
      },
      reviewerData: {
        id: "admin_core_001",
        username: "neo_admin",
        email: "admin@neo.org",
        role_type: "Super Admin",
      },
      points_earned: 500,
      completed_at: TIMESTAMP,
    },
  },
};

const WebhookTestInterface = ({ webhook }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testHistory, setTestHistory] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [customPayload, setCustomPayload] = useState("");

  // Get available events from webhook subscription
  const availableEvents = useMemo(() => {
    return webhook.events.filter((event) => SAMPLE_PAYLOADS[event]);
  }, [webhook.events]);

  // Get current payload based on selection
  const currentPayload = useMemo(() => {
    if (customPayload) {
      try {
        return JSON.parse(customPayload);
      } catch {
        return null;
      }
    }
    return selectedEvent ? SAMPLE_PAYLOADS[selectedEvent] : null;
  }, [selectedEvent, customPayload]);

  const handleEventChange = useCallback((keys) => {
    const event = [...keys][0];

    setSelectedEvent(event || "");
    setCustomPayload("");
  }, []);

  const handleTestWebhook = useCallback(async () => {
    if (!currentPayload) {
      addToast({
        title: "Please select an event or provide a valid custom payload",
        color: "warning",
      });
      return;
    }

    setIsTesting(true);

    const testResult = {
      id: `test_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: currentPayload.event,
      payload: currentPayload,
      status: null,
      statusCode: null,
      error: null,
      duration: 0,
    };

    const startTime = Date.now();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webhooks/${webhook.webhook_id}/test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload: currentPayload }),
          credentials: "include",
        },
      );

      const data = await response.json();
      const duration = Date.now() - startTime;

      testResult.duration = duration;
      testResult.status = data.data?.success ? "success" : "failed";
      testResult.statusCode = data.data?.status_code;
      testResult.error = data.data?.error;

      if (data.data?.success) {
        addToast({
          title: "Webhook test successful",
          description: `Response received in ${duration}ms`,
          color: "success",
        });
      } else {
        addToast({
          title: "Webhook test failed",
          description: testResult.error || `Status: ${testResult.statusCode}`,
          color: "danger",
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      testResult.duration = duration;
      testResult.status = "error";
      testResult.error = error.message || "Network error";

      addToast({
        title: "Test request failed",
        description: testResult.error,
        color: "danger",
      });
    } finally {
      setIsTesting(false);
      setTestHistory((prev) => [testResult, ...prev]);
    }
  }, [currentPayload, webhook.webhook_id]);

  const isWebhookActive = webhook.status === "active";

  return (
    <section className="flex h-full flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="">
        <div className="hide-scroll space-y-6 overflow-y-auto p-6 3xl:p-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Test Webhook</h2>

            <p className="text-sm text-gray-200">
              Send test payloads to your webhook endpoint
            </p>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-200">
                  Status
                </span>

                <Chip
                  size="sm"
                  variant="flat"
                  color={isWebhookActive ? "success" : "danger"}
                  startContent={
                    isWebhookActive ? (
                      <CheckCircle2Icon size={14} />
                    ) : (
                      <XCircleIcon size={14} />
                    )
                  }
                  className="capitalize"
                >
                  {webhook.status}
                </Chip>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-200">
                  Endpoint URL
                </span>

                <p className="break-all rounded bg-gray-900/50 p-2 font-mono text-xs text-blue-400">
                  {webhook.url}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-200">
                  Subscribed Events
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {webhook.events.map((event) => (
                    <Chip key={event} size="sm" variant="flat" color="primary">
                      {event}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!isWebhookActive && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
              <AlertCircleIcon size={20} className="mt-0.5 text-yellow-500" />

              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-400">
                  Webhook is inactive
                </p>

                <p className="text-xs text-yellow-300">
                  This webhook is currently disabled. You can still test it, but
                  it won't receive real events.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Select Event Type
              </label>

              <Select
                size="lg"
                variant="bordered"
                placeholder="Choose an event to test"
                selectedKeys={selectedEvent ? [selectedEvent] : []}
                onSelectionChange={handleEventChange}
                classNames={{
                  trigger:
                    "border-gray-300 focus-within:!border-gray-300 hover:!bg-black data-[hover=true]:!bg-black",
                }}
              >
                {availableEvents.map((event) => (
                  <SelectItem key={event} value={event}>
                    {event}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <WebhookPayloadEditor
              payload={currentPayload}
              customPayload={customPayload}
              setCustomPayload={setCustomPayload}
            />

            <Button
              size="lg"
              fullWidth
              color="primary"
              isLoading={isTesting}
              onPress={handleTestWebhook}
              disabled={isTesting || !currentPayload}
              className="bg-gradient-primary font-semibold"
            >
              {isTesting ? "Sending Test..." : "Send Test Webhook"}
            </Button>
          </div>
        </div>
      </WrapperContainer>

      <WrapperContainer scrollable className="p-6">
        <WebhookTestHistory history={testHistory} />
      </WrapperContainer>
    </section>
  );
};

export default WebhookTestInterface;
