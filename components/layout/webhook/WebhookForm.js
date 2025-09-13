"use client";

import {
  Link,
  Input,
  Button,
  Select,
  Textarea,
  SelectItem,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import { SendHorizontalIcon } from "lucide-react";
import React, { useCallback, useMemo } from "react";

const SUPPORTED_EVENTS = [
  { key: "join.community", label: "Join Community" },
  { key: "user.banned", label: "User Banned" },
  { key: "user.role.changed", label: "User Role Changed" },
  { key: "quest.failed", label: "Quest Failed" },
  // { key: "sprint.ended", label: "Sprint Ended" },
  { key: "quest.claimed", label: "Quest Claimed" },
  // { key: "sprint.started", label: "Sprint Started" },
  { key: "quest.succeeded", label: "Quest Succeeded" },
  // { key: "quest.claim.status.updated", label: "Quest Claim Status Updated" },
];

const STATUS_OPTIONS = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const WebhookForm = ({
  isNew = false,
  url,
  setUrl,
  name,
  setName,
  events,
  setEvents,
  description,
  setDescription,
  status,
  setStatus,
  isSubmitting,
  handleFormSubmit,
}) => {
  const selectedStatus = useMemo(
    () => (status ? [status] : ["active"]),
    [status],
  );

  const handleSelectAll = useCallback(() => {
    setEvents(SUPPORTED_EVENTS.map((e) => e.key));
  }, [setEvents]);

  const handleClearAll = useCallback(() => {
    setEvents([]);
  }, [setEvents]);

  const handleStatusChange = useCallback(
    (keys) => {
      setStatus([...keys][0]);
    },
    [setStatus],
  );

  const isFormValid = useMemo(() => {
    return url?.trim() && events?.length > 0;
  }, [url, events]);

  const eventCount = events?.length || 0;
  const hasEvents = eventCount > 0;

  return (
    <>
      <h2 className="text-2xl font-bold text-white">
        {isNew ? "Create" : "Edit"} Webhook
      </h2>

      <form
        onSubmit={handleFormSubmit}
        className="hide-scroll space-y-6 overflow-auto"
      >
        <div className="space-y-4">
          <Input
            type="text"
            value={name || ""}
            variant="bordered"
            label="Webhook Name (Optional)"
            onValueChange={setName}
            placeholder="My Discord Bot Webhook"
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          <Input
            required
            type="url"
            value={url || ""}
            variant="bordered"
            label="Webhook URL"
            onValueChange={setUrl}
            placeholder="https://your-domain.com/webhook"
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          <Textarea
            minRows={3}
            maxRows={5}
            variant="bordered"
            value={description || ""}
            label="Description (Optional)"
            onValueChange={setDescription}
            placeholder="Sends quest completion notifications to our Discord channel"
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          <Select
            required
            label="Status"
            variant="bordered"
            selectedKeys={selectedStatus}
            onSelectionChange={handleStatusChange}
            className="bg-dark text-white"
            classNames={{
              trigger:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          >
            {STATUS_OPTIONS.map(({ key, label }) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">
                Events to Subscribe *
              </label>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="light"
                  onPress={handleSelectAll}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Select All
                </Button>

                <Button
                  size="sm"
                  variant="light"
                  onPress={handleClearAll}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear
                </Button>
              </div>
            </div>

            <CheckboxGroup
              value={events || []}
              onValueChange={setEvents}
              classNames={{
                wrapper: "grid grid-cols-1 md:grid-cols-2 gap-2",
              }}
            >
              {SUPPORTED_EVENTS.map(({ key, label }) => (
                <Checkbox
                  key={key}
                  value={key}
                  classNames={{
                    base: "inline-flex max-w-full w-full bg-gray-800/50 hover:bg-gray-700/50 items-center justify-start cursor-pointer rounded-lg gap-2 p-3 border border-gray-700 transition-colors",
                    label: "w-full text-white text-sm",
                    icon: "text-purple-400",
                  }}
                >
                  {label}
                </Checkbox>
              ))}
            </CheckboxGroup>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                {eventCount} of {SUPPORTED_EVENTS.length} events selected
              </span>

              {!hasEvents && (
                <span className="text-red-400">Select at least one event</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            as={Link}
            size="lg"
            radius="full"
            href="/admin/webhooks"
            disabled={isSubmitting}
            className="neo-button border border-red-500 bg-red-500/20 text-white"
          >
            Cancel
          </Button>

          <Button
            size="lg"
            type="submit"
            radius="full"
            isLoading={isSubmitting}
            disabled={isSubmitting || !isFormValid}
            endContent={<SendHorizontalIcon size={16} />}
            className="neo-button border border-white bg-gradient-primary text-white disabled:opacity-50"
          >
            {isNew ? "Create Webhook" : "Update Webhook"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default WebhookForm;
