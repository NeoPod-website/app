"use client";

import {
  Chip,
  Card,
  Button,
  Dropdown,
  CardBody,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useState, useCallback } from "react";
import { MoreVertical, Edit, Trash2, Globe } from "lucide-react";

import {
  setDeleteModalData,
  toggleDeleteConfirmationModal,
} from "@/redux/slice/modalsSlice";

const WebhookCard = ({ webhook, onDelete }) => {
  const dispatch = useDispatch();

  const [testResult, setTestResult] = useState(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const formatUrl = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== "/" ? urlObj.pathname : "");
    } catch {
      return url;
    }
  }, []);

  const handleTestWebhook = useCallback(async () => {
    if (isTestingWebhook) return;

    setIsTestingWebhook(true);
    setTestResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webhooks/${webhook.webhook_id}/test`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await response.json();
      setTestResult({
        success: response.ok && data.data?.success,
        message:
          data.message || (response.ok ? "Test successful" : "Test failed"),
      });

      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      console.error("Webhook test error:", error);
      setTestResult({
        success: false,
        message: "Connection failed",
      });
      setTimeout(() => setTestResult(null), 3000);
    } finally {
      setIsTestingWebhook(false);
    }
  }, [webhook.webhook_id, isTestingWebhook]);

  const handleDeleteWebhook = useCallback(() => {
    const deleteWebhook = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/webhooks/${webhook.webhook_id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      onDelete(webhook.webhook_id);
    };

    dispatch(
      setDeleteModalData({
        itemName: webhook.name || formatUrl(webhook.url),
        itemType: "webhook",
        onConfirmDelete: deleteWebhook,
      }),
    );
    dispatch(toggleDeleteConfirmationModal());
  }, [webhook, onDelete, dispatch, formatUrl]);

  return (
    <Card className="border-t border-gray-400 bg-gradient-dark backdrop-blur-sm">
      <CardHeader className="flex justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <Globe size={20} className="text-purple-400" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold capitalize text-white">
              {webhook.name || "Unnamed Webhook"}
            </h3>

            <p className="truncate text-sm text-gray-400">
              {formatUrl(webhook.url)}
            </p>
          </div>
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              className="flex-shrink-0 text-gray-400 hover:text-white"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownTrigger>

          <DropdownMenu aria-label="Webhook actions">
            <DropdownItem
              as={Link}
              key="edit"
              startContent={<Edit size={16} />}
              href={`/admin/webhooks/${webhook.webhook_id}`}
            >
              Edit
            </DropdownItem>

            <DropdownItem
              key="delete"
              color="danger"
              className="text-danger"
              startContent={<Trash2 size={16} />}
              onPress={handleDeleteWebhook}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>

      <CardBody className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Status</span>

            <Chip
              size="sm"
              variant="flat"
              color={webhook.status === "active" ? "success" : "danger"}
            >
              {webhook.status || "inactive"}
            </Chip>
          </div>

          {webhook.events?.length > 0 && (
            <div>
              <span className="text-sm text-gray-200">Events</span>

              <div className="mt-1 flex flex-wrap gap-1">
                {webhook.events.slice(0, 3).map((event, index) => (
                  <Chip
                    key={index}
                    size="sm"
                    variant="flat"
                    className="text-xs"
                  >
                    {event}
                  </Chip>
                ))}

                {webhook.events.length > 3 && (
                  <Chip size="sm" variant="flat" className="text-xs">
                    +{webhook.events.length - 3} more
                  </Chip>
                )}
              </div>
            </div>
          )}

          {webhook.description && (
            <div>
              <span className="text-sm text-gray-200">Description</span>

              <p className="mt-1 line-clamp-2 text-sm text-gray-300">
                {webhook.description}
              </p>
            </div>
          )}

          {testResult && (
            <div
              className={`rounded-lg border p-3 ${
                testResult.success
                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              <p className="text-sm">{testResult.message}</p>
            </div>
          )}
        </div>
      </CardBody>

      <CardFooter className="pt-0">
        <div className="flex w-full justify-between text-xs text-gray-200">
          <span>
            Created:{" "}
            {webhook.created_at
              ? new Date(webhook.created_at).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WebhookCard;
