"use client";

import { Save, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button, Select, SelectItem, Avatar } from "@heroui/react";

import MainModal from "@/components/ui/modals/MainModal";

const ROLE_OPTIONS = [
  { value: "initiate", label: "Initiate" },
  { value: "operator", label: "Operator" },
  { value: "sentinel", label: "Sentinel" },
  { value: "architect", label: "Architect" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const EditAmbassadorModal = ({
  isOpen,
  onClose,
  ambassador,
  podId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(ambassador?.status || "active");
  const [roleType, setRoleType] = useState(ambassador?.role_type || "initiate");

  const [error, setError] = useState("");

  // Reset form when ambassador changes or modal opens
  useEffect(() => {
    if (ambassador && isOpen) {
      setRoleType(ambassador.role_type || "initiate");
      setStatus(ambassador.status || "active");
      setError("");
    }
  }, [ambassador, isOpen]);

  const handleSave = async () => {
    if (!ambassador) return;

    setLoading(true);
    setError("");

    try {
      // Prepare update payload - only include changed fields
      const updatePayload = {};

      if (roleType !== ambassador.role_type) {
        updatePayload.role_type = roleType;
      }

      if (status !== ambassador.status) {
        updatePayload.status = status;
      }

      // Include joining_date and pod_id for optimal performance
      updatePayload.joining_date = ambassador.joining_date;
      updatePayload.pod_id = podId; // Use the podId prop passed from parent

      // Only make API call if there are changes
      if (updatePayload.role_type || updatePayload.status) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/admin/update/${ambassador.ambassador_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatePayload),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to update ambassador (${response.status})`,
          );
        }

        // Optionally use the returned updated ambassador data
        const responseData = await response.json();
        console.log("Update successful:", responseData);
      }

      // Create updated ambassador object
      const updatedAmbassador = {
        ...ambassador,
        role_type: roleType,
        status: status,
      };

      // Call success callback with updated ambassador
      onSuccess(updatedAmbassador);
    } catch (err) {
      setError(err.message);
      console.error("Failed to update ambassador:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      // Reset to current ambassador values
      setRoleType(ambassador?.role_type || "initiate");
      setStatus(ambassador?.status || "active");
      onClose();
    }
  };

  const hasChanges =
    roleType !== ambassador?.role_type || status !== ambassador?.status;

  const footer = (
    <>
      <Button
        variant="light"
        onPress={handleClose}
        disabled={loading}
        className="text-gray-300 hover:text-white"
        startContent={<X size={16} />}
      >
        Cancel
      </Button>

      <Button
        color="primary"
        onPress={handleSave}
        disabled={loading || !hasChanges}
        isLoading={loading}
        className="bg-blue-600 hover:bg-blue-700"
        startContent={!loading && <Save size={16} />}
      >
        {loading ? "Saving..." : "Save Changes"}
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
      title="Edit Ambassador"
      handleOnClose={handleClose}
      description="Update ambassador role and status settings"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-lg bg-gray-800/50 p-4">
          <Avatar
            size="lg"
            src={ambassador?.profile_photo}
            name={ambassador?.username?.charAt(0)?.toUpperCase()}
            className="shrink-0"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">
                {ambassador?.username || "Unknown User"}
              </h3>

              {ambassador?.is_verified && (
                <span className="text-blue-400">✓</span>
              )}
            </div>

            <p className="text-sm text-gray-400">
              {ambassador?.email || "No email"}
            </p>

            <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
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

        <div className="space-y-4">
          <Select
            label="Role Type"
            disabled={loading}
            selectedKeys={[roleType]}
            placeholder="Select role type"
            onSelectionChange={(keys) => setRoleType(Array.from(keys)[0])}
            classNames={{
              trigger:
                "bg-gray-800/50 border border-gray-600 hover:border-gray-500",
              value: "text-white",
              popoverContent: "bg-black/90 border border-gray-600",
            }}
          >
            {ROLE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-200 hover:bg-gray-700/50"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Status"
            disabled={loading}
            selectedKeys={[status]}
            placeholder="Select status"
            onSelectionChange={(keys) => setStatus(Array.from(keys)[0])}
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

        {hasChanges && (
          <div className="bg-blue-500/20 rounded-lg border border-blue-500/30 p-3">
            <h4 className="mb-2 text-sm font-medium text-blue-300">
              Pending Changes:
            </h4>

            <ul className="space-y-1 text-xs text-blue-200">
              {roleType !== ambassador?.role_type && (
                <li>
                  • Role: {ambassador?.role_type} → {roleType}
                </li>
              )}

              {status !== ambassador?.status && (
                <li>
                  • Status: {ambassador?.status} → {status}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </MainModal>
  );
};

export default EditAmbassadorModal;
