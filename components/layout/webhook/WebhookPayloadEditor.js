"use client";

import { Button, Tabs, Tab } from "@heroui/react";
import React, { useState, useCallback, useMemo } from "react";
import { CodeIcon, EditIcon, EyeIcon, CopyIcon, CheckIcon } from "lucide-react";

const WebhookPayloadEditor = ({ payload, customPayload, setCustomPayload }) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [isCopied, setIsCopied] = useState(false);

  const formattedPayload = useMemo(() => {
    if (!payload) return "";
    return JSON.stringify(payload, null, 2);
  }, [payload]);

  const isCustomPayloadValid = useMemo(() => {
    if (!customPayload) return true;

    try {
      JSON.parse(customPayload);
      return true;
    } catch {
      return false;
    }
  }, [customPayload]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedPayload);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [formattedPayload]);

  const handleEditPayload = useCallback(() => {
    setCustomPayload(formattedPayload);
    setActiveTab("edit");
  }, [formattedPayload, setCustomPayload]);

  const handleResetPayload = useCallback(() => {
    setCustomPayload("");
    setActiveTab("preview");
  }, [setCustomPayload]);

  if (!payload && !customPayload) {
    return (
      <div className="rounded-lg border border-dashed border-gray-600 bg-gray-800/20 p-8 text-center">
        <CodeIcon size={32} className="mx-auto mb-3 text-gray-500" />

        <p className="text-sm text-gray-400">
          Select an event type to see the payload
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">Payload</label>

        <div className="flex gap-2">
          {customPayload && (
            <Button
              size="sm"
              variant="light"
              onPress={handleResetPayload}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Reset to Default
            </Button>
          )}

          <Button
            size="sm"
            variant="light"
            onPress={handleCopy}
            startContent={
              isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />
            }
            className="text-xs text-gray-200 hover:text-gray-300"
          >
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <Tabs
        size="sm"
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
        classNames={{
          tabList: "bg-gray-800/50 border border-gray-700",
          tab: "text-gray-400",
          cursor: "bg-gray-700",
        }}
      >
        <Tab
          key="preview"
          title={
            <div className="flex items-center gap-2">
              <EyeIcon size={14} />
              <span>Preview</span>
            </div>
          }
        >
          <div className="thin-scrollbar mt-3 max-h-64 overflow-auto rounded-lg border border-gray-700 bg-gray-900 p-4">
            <pre className="text-xs text-gray-300">
              <code>{formattedPayload}</code>
            </pre>
          </div>
        </Tab>

        <Tab
          key="edit"
          title={
            <div className="flex items-center gap-2">
              <EditIcon size={14} />
              <span>Edit Custom</span>
            </div>
          }
        >
          <div className="mt-3 space-y-2">
            <textarea
              rows={15}
              value={customPayload || formattedPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="thin-scrollbar w-full rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-xs text-gray-300 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="Enter custom JSON payload..."
            />

            {!isCustomPayloadValid && (
              <p className="text-xs text-red-400">
                Invalid JSON format. Please check your syntax.
              </p>
            )}

            {!customPayload && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-200">
                  Click below to start editing the payload
                </p>

                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={handleEditPayload}
                  startContent={<EditIcon size={14} />}
                  className="text-xs"
                >
                  Start Editing
                </Button>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default WebhookPayloadEditor;
