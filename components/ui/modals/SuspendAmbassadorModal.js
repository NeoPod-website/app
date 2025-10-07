"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Ban, X } from "lucide-react";
import { Button, Avatar, Textarea } from "@heroui/react";

import MainModal from "@/components/ui/modals/MainModal";

const SuspendAmbassadorModal = ({
  isOpen,
  onClose,
  ambassador,
  podId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [error, setError] = useState("");

  // Reset form when ambassador changes or modal opens
  useEffect(() => {
    if (ambassador && isOpen) {
      setError("");
      setBanReason("");
    }
  }, [ambassador, isOpen]);

  const handleSuspend = async () => {
    if (!ambassador) return;

    if (!banReason.trim()) {
      setError("Ban reason is required");
      return;
    }

    if (banReason.trim().length < 10) {
      setError("Ban reason must be at least 10 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const suspendPayload = {
        ban_reason: banReason.trim(),
        joining_date: ambassador.joining_date,
        pod_id: podId,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/admin/suspend/${ambassador.ambassador_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(suspendPayload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to suspend ambassador (${response.status})`,
        );
      }

      const responseData = await response.json();
      console.log("Suspension successful:", responseData);

      // Create updated ambassador object
      const updatedAmbassador = {
        ...ambassador,
        status: "suspended",
        ban_reason: banReason.trim(),
        banned_at: new Date().toISOString(),
      };

      // Call success callback with updated ambassador
      onSuccess(updatedAmbassador);
    } catch (err) {
      setError(err.message);
      console.error("Failed to suspend ambassador:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setBanReason("");
      onClose();
    }
  };

  const isValidReason = banReason.trim().length >= 10;

  const footer = (
    <>
      <Button
        variant="light"
        disabled={loading}
        onPress={handleClose}
        startContent={<X size={16} />}
        className="text-gray-300 hover:text-white"
      >
        Cancel
      </Button>

      <Button
        color="danger"
        isLoading={loading}
        onPress={handleSuspend}
        className="bg-red-600 hover:bg-red-700"
        startContent={!loading && <Ban size={16} />}
        disabled={loading || !isValidReason}
      >
        {loading ? "Suspending..." : "Suspend Ambassador"}
      </Button>
    </>
  );

  return (
    <MainModal
      size="lg"
      isOpen={isOpen}
      footer={footer}
      showFooter={true}
      onClose={handleClose}
      title="Suspend Ambassador"
      handleOnClose={handleClose}
      description="Suspend ambassador access and reject pending submissions"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg bg-gray-800/50 p-4">
          <Avatar
            size="lg"
            src={ambassador?.profile_photo}
            name={ambassador?.username?.charAt(0)?.toUpperCase()}
            className="shrink-0"
          />

          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold capitalize text-white">
                {ambassador?.username || "Unknown User"}
              </h3>

              {ambassador?.is_verified && (
                <span className="text-blue-400">✓</span>
              )}
            </div>

            <p className="text-sm text-gray-200">
              {ambassador?.email || "No email"}
            </p>

            <div className="mt-1 flex items-center gap-4 text-xs text-gray-300">
              <span>
                ID: {ambassador?.ambassador_id?.slice(-6) || "Unknown"}
              </span>
              <span>
                Points: {ambassador?.total_points?.toLocaleString() || "0"}
              </span>
              <span>Quests: {ambassador?.total_quests_completed || "0"}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-4">
          <div className="flex items-center gap-1 text-sm text-red-300">
            <AlertTriangle size={16} />
            <h4 className="font-medium">Warning: Suspension Action</h4>
          </div>

          <div className="mt-2 space-y-2 text-xs text-red-200">
            <p>Suspending this ambassador will:</p>

            <ul className="ml-4 list-disc space-y-1">
              <li>Immediately revoke their access to the platform</li>
              <li>Automatically reject all their pending submissions</li>
              <li>Add a suspension record to their profile</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-300">
            <Ban size={16} />

            <label className="text-sm font-medium">
              Suspension Reason (Required)
            </label>
          </div>

          <Textarea
            minRows={3}
            maxRows={6}
            value={banReason}
            disabled={loading}
            className="w-full"
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Provide a detailed explanation for why this ambassador is being suspended..."
            classNames={{
              input: "bg-gray-800/50 text-white",
              inputWrapper: "border border-gray-600 hover:border-gray-500",
            }}
          />

          <div
            className={`text-xs ${isValidReason ? "text-green-400" : "text-gray-400"}`}
          >
            {banReason.length}/10 characters minimum {isValidReason && "✓"}
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default SuspendAmbassadorModal;
