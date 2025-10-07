"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, X, Shield, Loader2 } from "lucide-react";
import { Button, Avatar, Select, SelectItem } from "@heroui/react";

import MainModal from "@/components/ui/modals/MainModal";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const UnsuspendAmbassadorModal = ({
  isOpen,
  onClose,
  ambassador,
  podId,
  onSuccess,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("active");

  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [fullAmbassadorData, setFullAmbassadorData] = useState(null);

  // Fetch full ambassador details when modal opens
  useEffect(() => {
    const fetchAmbassadorDetails = async () => {
      if (!ambassador || !isOpen) return;

      setFetchingDetails(true);
      setError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${ambassador.ambassador_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ambassador details");
        }

        const data = await response.json();

        setFullAmbassadorData(data.data?.ambassador);
      } catch (err) {
        console.error("Failed to fetch ambassador details:", err);
        // Fallback to prop data if fetch fails
        setFullAmbassadorData(ambassador);
      } finally {
        setFetchingDetails(false);
      }
    };

    if (isOpen) {
      setNewStatus("active");
      fetchAmbassadorDetails();
    }
  }, [ambassador, isOpen]);

  const handleUnsuspend = async () => {
    if (!ambassador) return;

    setLoading(true);
    setError("");

    try {
      const unsuspendPayload = {
        new_status: newStatus,
        joining_date: ambassador.joining_date,
        pod_id: podId,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/admin/unsuspend/${ambassador.ambassador_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(unsuspendPayload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
            `Failed to unsuspend ambassador (${response.status})`,
        );
      }

      // Create updated ambassador object
      const updatedAmbassador = {
        ...ambassador,
        status: newStatus,
        ban_reason: undefined,
        banned_at: undefined,
        banned_by: undefined,
        unbanned_at: new Date().toISOString(),
      };

      // Call success callback with updated ambassador
      onSuccess(updatedAmbassador);
    } catch (err) {
      setError(err.message);
      console.error("Failed to unsuspend ambassador:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !fetchingDetails) {
      setError("");
      setNewStatus("active");
      setFullAmbassadorData(null);
      onClose();
    }
  };

  const footer = (
    <>
      <Button
        variant="light"
        disabled={loading || fetchingDetails}
        onPress={handleClose}
        startContent={<X size={16} />}
        className="text-gray-300 hover:text-white"
      >
        Cancel
      </Button>

      <Button
        disabled={loading || fetchingDetails}
        isLoading={loading}
        onPress={handleUnsuspend}
        className="bg-green-600 text-black hover:bg-green-700 hover:text-white"
        startContent={!loading && <CheckCircle size={16} />}
      >
        {loading ? "Unsuspending..." : "Unsuspend Ambassador"}
      </Button>
    </>
  );

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  // Use full data if available, fallback to prop data
  const displayData = fullAmbassadorData || ambassador;

  // Check if we have suspension details
  const hasSuspensionDetails =
    displayData?.banned_at || displayData?.banned_by || displayData?.ban_reason;

  return (
    <MainModal
      size="lg"
      isOpen={isOpen}
      footer={footer}
      showFooter={true}
      onClose={handleClose}
      title="Unsuspend Ambassador"
      handleOnClose={handleClose}
      description="Restore ambassador access and remove suspension"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-lg bg-gray-800/50 p-4">
          <Avatar
            size="lg"
            src={displayData?.profile_photo}
            name={displayData?.username?.charAt(0)?.toUpperCase()}
            className="shrink-0"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold capitalize text-white">
                {displayData?.username || "Unknown User"}
              </h3>

              {displayData?.is_verified && (
                <span className="text-blue-400">✓</span>
              )}
            </div>

            <p className="text-sm text-gray-200">
              {displayData?.email || "No email"}
            </p>

            <div className="mt-1 flex items-center gap-4 text-xs text-gray-300">
              <span>
                ID: {displayData?.ambassador_id?.slice(-6) || "Unknown"}
              </span>
              <span>
                Points: {displayData?.total_points?.toLocaleString() || "0"}
              </span>
              <span>Quests: {displayData?.total_quests_completed || "0"}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {fetchingDetails && (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-800/50 p-4">
            <Loader2 size={16} className="animate-spin text-gray-400" />
            <span className="text-sm text-gray-400">
              Loading suspension details...
            </span>
          </div>
        )}

        {!fetchingDetails && (
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/20 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-orange-300">
              <Shield size={16} />
              <h4 className="font-medium">Current Status: Suspended</h4>
            </div>

            {hasSuspensionDetails ? (
              <div className="space-y-2 text-xs text-orange-200">
                {displayData?.banned_at && (
                  <div>
                    <span className="font-medium">Suspended on:</span>{" "}
                    {formatDate(displayData.banned_at)}
                  </div>
                )}

                {displayData?.banned_by && (
                  <div>
                    <span className="font-medium">Suspended by:</span>{" "}
                    {displayData.banned_by}
                  </div>
                )}

                {displayData?.ban_reason && (
                  <div>
                    <span className="font-medium">Reason:</span>{" "}
                    <span className="italic">
                      {displayData.ban_reason.length > 100
                        ? `${displayData.ban_reason.substring(0, 100)}...`
                        : displayData.ban_reason}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-orange-200">
                This ambassador is currently suspended. Suspension details are
                not available.
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            Select New Status
          </label>

          <Select
            label="Status after unsuspension"
            disabled={loading || fetchingDetails}
            selectedKeys={[newStatus]}
            placeholder="Select status"
            onSelectionChange={(keys) => setNewStatus(Array.from(keys)[0])}
            classNames={{
              trigger:
                "bg-gray-800/50 border border-gray-600 hover:border-gray-500",
              value: "text-white",
              popoverContent: "bg-black/90 border border-gray-600",
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-200 hover:bg-gray-700/50"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </MainModal>
  );
};

export default UnsuspendAmbassadorModal;
