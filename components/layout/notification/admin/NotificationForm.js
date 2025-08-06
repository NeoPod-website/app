"use client";

import {
  Chip,
  Link,
  Input,
  Button,
  Select,
  Textarea,
  SelectItem,
} from "@heroui/react";
import { SendHorizontalIcon, PlusIcon } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

import ImageUpload from "@/components/ui/ImageUpload";

const NOTIFICATION_TYPE_OPTIONS = [
  { key: "update", label: "Update" },
  { key: "reminder", label: "Reminder" },
  { key: "achievement", label: "Achievement" },
  { key: "announcement", label: "Announcement" },
  { key: "submission_update", label: "Submission Update" },
];

const RECIPIENT_TYPE_OPTIONS = [
  { key: "pod", label: "Pods" },
  { key: "all", label: "Everyone" },
  { key: "ambassador", label: "Ambassadors" },
];

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/gif",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

const MAX_BODY_LENGTH = 500;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_TITLE_LENGTH = 100;

const NotificationForm = ({
  isNew = false,
  body,
  title,
  setBody,
  linkUrl,
  setTitle,
  imageFile,
  setLinkUrl,
  recipientIds,
  setImageFile,
  isSubmitting,
  recipientType,
  setRecipientIds,
  setRecipientType,
  notificationType,
  handleFormSubmit,
  setNotificationType,
}) => {
  const [ambassadorInput, setAmbassadorInput] = useState("");
  const [selectedAmbassadors, setSelectedAmbassadors] = useState(
    new Set(recipientIds || []),
  );

  const [availablePods, setAvailablePods] = useState([]);
  const [isLoadingPods, setIsLoadingPods] = useState(false);
  const [selectedPods, setSelectedPods] = useState(new Set(recipientIds || []));

  // Initialize local state from props only once
  useEffect(() => {
    if (recipientIds && recipientIds.length > 0) {
      if (recipientType === "ambassador") {
        setSelectedAmbassadors(new Set(recipientIds));
      } else if (recipientType === "pod") {
        setSelectedPods(new Set(recipientIds));
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Fetch available pods when recipient type is "pod"
  useEffect(() => {
    if (recipientType === "pod") {
      const fetchPods = async () => {
        setIsLoadingPods(true);

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pods?limit=100`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            },
          );

          const data = await response.json();

          if (response.ok) {
            setAvailablePods(data.data.pods || []);
          }
        } catch (error) {
          setAvailablePods([]);
        } finally {
          setIsLoadingPods(false);
        }
      };

      fetchPods();
    }
  }, [recipientType]);

  // Sync local state with parent state only when user makes changes
  const syncRecipientsToParent = useCallback(() => {
    if (recipientType === "ambassador") {
      setRecipientIds([...selectedAmbassadors]);
    } else if (recipientType === "pod") {
      setRecipientIds([...selectedPods]);
    }
  }, [selectedAmbassadors, selectedPods, recipientType, setRecipientIds]);

  // Call sync only when selections actually change
  useEffect(() => {
    syncRecipientsToParent();
  }, [syncRecipientsToParent]);

  const handleAddAmbassador = useCallback(() => {
    if (
      ambassadorInput.trim() &&
      !selectedAmbassadors.has(ambassadorInput.trim())
    ) {
      const newSelection = new Set(selectedAmbassadors);

      newSelection.add(ambassadorInput.trim());

      setSelectedAmbassadors(newSelection);
      setAmbassadorInput("");
    }
  }, [ambassadorInput, selectedAmbassadors]);

  const handleRemoveAmbassador = useCallback(
    (ambassadorId) => {
      const newSelection = new Set(selectedAmbassadors);
      newSelection.delete(ambassadorId);
      setSelectedAmbassadors(newSelection);
    },
    [selectedAmbassadors],
  );

  const handlePodSelectionChange = useCallback((keys) => {
    setSelectedPods(keys);
  }, []);

  const handleRecipientTypeChange = useCallback(
    (type) => {
      setRecipientType(type);
      // Clear selections when changing type
      if (type === "all") {
        setRecipientIds([]);
        setSelectedPods(new Set());
        setSelectedAmbassadors(new Set());
      }
    },
    [setRecipientType, setRecipientIds],
  );

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAmbassador();
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white">
        {isNew ? "Create" : "Edit"} Notification
      </h2>

      <form
        onSubmit={handleFormSubmit}
        className="hide-scroll space-y-6 overflow-auto"
      >
        <div className="space-y-4">
          <Input
            required
            type="text"
            value={title}
            variant="bordered"
            name="notification_title"
            label="Notification Title"
            onValueChange={setTitle}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="Enter a compelling title for your notification"
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          <Textarea
            required
            type="text"
            minRows={4}
            variant="bordered"
            value={body}
            name="notification_body"
            label="Notification Message"
            onValueChange={setBody}
            maxLength={MAX_BODY_LENGTH}
            placeholder="Write your notification message here..."
            isInvalid={body && body.length >= MAX_BODY_LENGTH}
            errorMessage={`Message cannot exceed ${MAX_BODY_LENGTH} characters.`}
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              required
              label="Notification Type"
              variant="bordered"
              selectedKeys={notificationType ? [notificationType] : []}
              onSelectionChange={(keys) => setNotificationType([...keys][0])}
              className="bg-dark text-white"
              classNames={{
                trigger:
                  "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
              }}
            >
              {NOTIFICATION_TYPE_OPTIONS.map(({ key, label }) => (
                <SelectItem key={key}>{label}</SelectItem>
              ))}
            </Select>

            <Select
              required
              label="Send To"
              variant="bordered"
              selectedKeys={recipientType ? [recipientType] : []}
              onSelectionChange={(keys) =>
                handleRecipientTypeChange([...keys][0])
              }
              className="bg-dark text-white"
              classNames={{
                trigger:
                  "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
              }}
            >
              {RECIPIENT_TYPE_OPTIONS.map(({ key, label }) => (
                <SelectItem key={key}>{label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Ambassador Selection */}
          {recipientType === "ambassador" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">
                Add Ambassadors
              </label>

              <div className="flex gap-2">
                <Input
                  type="text"
                  value={ambassadorInput}
                  variant="bordered"
                  placeholder="Enter ambassador ID"
                  onValueChange={setAmbassadorInput}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-dark text-white"
                  classNames={{
                    inputWrapper:
                      "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
                  }}
                />
                <Button
                  size="md"
                  isIconOnly
                  type="button"
                  variant="bordered"
                  onPress={handleAddAmbassador}
                  disabled={!ambassadorInput.trim()}
                  className="border-gray-300 text-white hover:bg-gray-700"
                >
                  <PlusIcon size={16} />
                </Button>
              </div>

              {selectedAmbassadors.size > 0 && (
                <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 bg-black/20 p-3">
                  {[...selectedAmbassadors].map((ambassadorId) => (
                    <Chip
                      key={ambassadorId}
                      onClose={() => handleRemoveAmbassador(ambassadorId)}
                      variant="flat"
                      color="primary"
                      classNames={{
                        base: "bg-purple-600/20 border border-purple-600/50",
                        content: "text-white",
                        closeButton: "text-white hover:bg-red-500/20",
                      }}
                    >
                      {ambassadorId}
                    </Chip>
                  ))}
                </div>
              )}

              {selectedAmbassadors.size === 0 && (
                <p className="text-sm text-red-400">
                  Please add at least one ambassador ID
                </p>
              )}
            </div>
          )}

          {/* Pod Selection */}
          {recipientType === "pod" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">
                Select Pods
              </label>

              <Select
                variant="bordered"
                label="Choose Pods"
                selectionMode="multiple"
                isLoading={isLoadingPods}
                selectedKeys={selectedPods}
                className="bg-dark text-white"
                onSelectionChange={handlePodSelectionChange}
                classNames={{
                  trigger:
                    "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
                }}
              >
                {availablePods.map((pod) => (
                  <SelectItem key={pod.pod_id} value={pod.pod_id}>
                    {pod.name || pod.language || pod.pod_id}
                  </SelectItem>
                ))}
              </Select>

              {selectedPods.size === 0 && (
                <p className="text-sm text-red-400">
                  Please select at least one pod
                </p>
              )}
            </div>
          )}

          <Input
            type="url"
            variant="bordered"
            value={linkUrl || ""}
            name="notification_link"
            label="Link URL (Optional)"
            onValueChange={setLinkUrl}
            placeholder="https://example.com/link-to-action"
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          {/* <ImageUpload
            value={imageFile}
            onChange={handleImageChange}
            maxSizeInMB={MAX_IMAGE_SIZE_MB}
            allowedTypes={ALLOWED_IMAGE_TYPES}
            label="Notification Image (Optional)"
            prompt="Click to upload or drag and drop an image"
          /> */}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            as={Link}
            size="lg"
            radius="full"
            disabled={isSubmitting}
            href="/admin/notifications"
            className="neo-button border border-red-500 bg-red-500/20 text-white"
          >
            Cancel
          </Button>

          <Button
            size="lg"
            type="submit"
            radius="full"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="neo-button border border-white bg-gradient-primary text-white"
            endContent={<SendHorizontalIcon size={16} />}
          >
            {isNew ? "Send Notification" : "Update Notification"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default NotificationForm;
