"use client";

import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Button, Chip } from "@heroui/react";
import {
  EditIcon,
  TrashIcon,
  SendHorizontalIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";
import WebhookSamplePayloads from "./WebhookTestPayloads";
import {
  setDeleteModalData,
  toggleDeleteConfirmationModal,
} from "@/redux/slice/modalsSlice";

const WebhookDetailView = ({ webhook, onDelete }) => {
  const dispatch = useDispatch();

  const handleDeleteClick = () => {
    dispatch(
      setDeleteModalData({
        itemName: webhook.name || webhook.url,
        itemType: "webhook",
        isDeleting: false,
        onConfirmDelete: onDelete,
      }),
    );
    dispatch(toggleDeleteConfirmationModal());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActive = webhook.status === "active";

  return (
    <section className="flex h-full flex-1 gap-4 overflow-hidden">
      {/* Left Panel - Details */}
      <WrapperContainer scrollable className="space-y-6 p-6 3xl:p-10">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">
                    {webhook.name || "Unnamed Webhook"}
                  </h2>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={isActive ? "success" : "danger"}
                    startContent={
                      isActive ? (
                        <CheckCircle2Icon size={14} />
                      ) : (
                        <XCircleIcon size={14} />
                      )
                    }
                  >
                    {webhook.status}
                  </Chip>
                </div>
                {webhook.description && (
                  <p className="text-sm text-gray-300">{webhook.description}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                size="lg"
                color="primary"
                href={`/admin/webhooks/${webhook.webhook_id}/test`}
                startContent={<SendHorizontalIcon size={18} />}
                className="bg-gradient-primary font-semibold"
              >
                Test Webhook
              </Button>

              <Button
                as={Link}
                size="lg"
                variant="bordered"
                href={`/admin/webhooks/${webhook.webhook_id}/edit`}
                startContent={<EditIcon size={18} />}
                className="border-gray-300 font-semibold text-white"
              >
                Edit
              </Button>

              <Button
                size="lg"
                color="danger"
                variant="flat"
                onPress={handleDeleteClick}
                startContent={<TrashIcon size={18} />}
                className="font-semibold"
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Webhook Details */}
          <div className="space-y-4 rounded-xl border border-gray-700 bg-gray-800/30 p-6">
            <h3 className="text-lg font-semibold text-white">
              Webhook Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Webhook ID
                </label>
                <p className="rounded-lg border border-gray-700 bg-gray-900/50 p-3 font-mono text-sm text-blue-400">
                  {webhook.webhook_id}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Endpoint URL
                </label>
                <p className="break-all rounded-lg border border-gray-700 bg-gray-900/50 p-3 font-mono text-sm text-blue-400">
                  {webhook.url}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Created At
                </label>
                <p className="text-sm text-white">
                  {formatDate(webhook.created_at)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isActive ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span className="text-sm font-medium capitalize text-white">
                    {webhook.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribed Events */}
          <div className="space-y-4 rounded-xl border border-gray-700 bg-gray-800/30 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Subscribed Events
              </h3>
              <Chip size="sm" variant="flat">
                {webhook.events.length} events
              </Chip>
            </div>

            <div className="flex flex-wrap gap-2">
              {webhook.events.map((event) => (
                <Chip
                  key={event}
                  size="md"
                  variant="flat"
                  color="primary"
                  className="font-mono"
                >
                  {event}
                </Chip>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-6">
            <h3 className="mb-2 text-lg font-semibold text-purple-300">
              🔒 Security
            </h3>
            <p className="text-sm text-purple-200">
              All webhook requests include an{" "}
              <code className="rounded bg-purple-900/50 px-1.5 py-0.5 font-mono text-xs">
                X-Webhook-Signature
              </code>{" "}
              header for verification. Use this to validate that requests are
              genuinely from NeoPod.
            </p>
          </div>
        </div>
      </WrapperContainer>

      {/* Right Panel - Sample Payloads */}
      <WrapperContainer scrollable className="p-6">
        <WebhookSamplePayloads events={webhook.events} />
      </WrapperContainer>
    </section>
  );
};

export default WebhookDetailView;
