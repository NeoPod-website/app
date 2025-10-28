"use client";

import {
  CodeIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import React from "react";
import { Chip, Accordion, AccordionItem } from "@heroui/react";

const WebhookTestHistory = ({ history }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle2Icon size={16} className="text-green-500" />;
      case "failed":
        return <XCircleIcon size={16} className="text-red-500" />;
      case "error":
        return <AlertTriangleIcon size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "success";
      case "failed":
        return "danger";
      case "error":
        return "warning";
      default:
        return "default";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (history.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Test History</h3>

        <div className="rounded-lg border border-dashed border-gray-600 bg-gray-800/20 p-12 text-center">
          <ClockIcon size={32} className="mx-auto mb-3 text-gray-500" />

          <p className="text-sm text-gray-400">No tests run yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Send a test webhook to see results here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hide-scroll space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Test History</h3>

        <Chip size="sm" variant="flat">
          {history.length} {history.length === 1 ? "test" : "tests"}
        </Chip>
      </div>

      <div className="space-y-3">
        <Accordion
          className="px-0"
          variant="splitted"
          itemClasses={{
            base: "bg-gray-800/30 border border-gray-700",
            title: "text-white text-sm",
            trigger: "py-4 px-4",
            content: "px-4 pb-4 pt-0",
          }}
        >
          {history.map((test) => (
            <AccordionItem
              key={test.id}
              startContent={getStatusIcon(test.status)}
              title={
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-purple-400">
                    {test.event}
                  </span>

                  <span className="text-xs text-gray-500">•</span>

                  <span className="text-xs text-gray-100">
                    {formatTimestamp(test.timestamp)}
                  </span>
                </div>
              }
              subtitle={
                <div className="mt-1 flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="capitalize"
                    color={getStatusColor(test.status)}
                  >
                    {test.status}
                  </Chip>

                  {test.statusCode && (
                    <Chip size="sm" variant="flat">
                      {test.statusCode}
                    </Chip>
                  )}

                  <span className="text-xs text-gray-200">
                    {test.duration}ms
                  </span>
                </div>
              }
            >
              <div className="space-y-4 pt-3">
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-200">
                      <CalendarIcon size={12} />
                      <span>Date</span>
                    </div>

                    <p className="font-medium text-white">
                      {formatDate(test.timestamp)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-200">
                      <ClockIcon size={12} />
                      <span>Duration</span>
                    </div>

                    <p className="font-medium text-white">{test.duration}ms</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-200">
                      <CodeIcon size={12} />
                      <span>Status Code</span>
                    </div>

                    <p className="font-medium text-white">
                      {test.statusCode || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-200">
                      <CheckCircle2Icon size={12} />
                      <span>Result</span>
                    </div>

                    <p className="font-medium capitalize text-white">
                      {test.status}
                    </p>
                  </div>
                </div>

                {test.error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                    <p className="text-xs font-medium text-red-400">
                      Error: {test.error}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-400">
                    Request Payload
                  </p>

                  <div className="thin-scrollbar max-h-64 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 p-3">
                    <pre className="text-xs text-gray-300">
                      <code>{JSON.stringify(test.payload, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default WebhookTestHistory;
