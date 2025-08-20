"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { SendHorizontalIcon } from "lucide-react";
import { Input, Textarea, Select, SelectItem, Button } from "@heroui/react";

import { languages } from "@/data/langData";

import AdminSelector from "./AdminSelector";
import ImageUpload from "@/components/ui/ImageUpload";

// Constants to prevent recreation
const STATUS_OPTIONS = [
  { key: "live", label: "Live" },
  { key: "draft", label: "Draft" },
  { key: "archive", label: "Archive" },
];

const MAX_IMAGE_SIZE_MB = 5;

const PodForm = ({
  role,
  isNew,
  status,
  setStatus,
  podName,
  setPodName,
  language,
  setLanguage,
  coverPhoto,
  setCoverPhoto,
  description,
  setDescription,
  assignedAdmins,
  handleFormSubmit,
  handlePodDataChange,
  isSubmitting,
}) => {
  // console.log(role);
  const submitButtonText = useMemo(() => {
    if (isNew) {
      return isSubmitting ? "Creating..." : "Create";
    }

    return isSubmitting ? "Updating..." : "Update";
  }, [isNew, isSubmitting]);

  return (
    <>
      <h2 className="text-2xl font-bold">{isNew ? "Create" : "Edit"} Pod</h2>

      <form
        onSubmit={handleFormSubmit}
        className="hide-scroll space-y-4 overflow-auto"
      >
        <ImageUpload
          value={coverPhoto || "/backgrounds/background-1.jpg"}
          label="Cover Photo"
          onChange={setCoverPhoto}
          maxSizeInMB={MAX_IMAGE_SIZE_MB}
          prompt="Upload pod cover image"
        />

        {role === "super" && (
          <AdminSelector
            assignedAdmins={assignedAdmins}
            onChange={handlePodDataChange}
          />
        )}

        <Input
          required
          type="text"
          name="pod_name"
          value={podName}
          label="Pod Name"
          variant="bordered"
          onValueChange={setPodName}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        />

        <Textarea
          type="text"
          minRows={4}
          label="Description"
          value={description}
          name="pod_description"
          onValueChange={setDescription}
          variant="bordered"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        />

        <Select
          label="Language"
          variant="bordered"
          selectedKeys={[language]}
          onSelectionChange={(keys) => setLanguage([...keys][0])}
          className="bg-dark"
          classNames={{
            trigger:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        >
          {languages.map((lang) => (
            <SelectItem key={lang.code}>{lang.name}</SelectItem>
          ))}
        </Select>

        <Select
          label="Status"
          variant="bordered"
          selectedKeys={[status]}
          onSelectionChange={(keys) => setStatus([...keys][0])}
          className="bg-dark"
          classNames={{
            trigger:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        >
          {STATUS_OPTIONS.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            as={Link}
            size="lg"
            radius="full"
            disabled={isSubmitting}
            href="/admin/manage/pods"
            className="neo-button border border-red-500 bg-red-500/20"
          >
            Cancel
          </Button>

          <Button
            size="lg"
            type="submit"
            radius="full"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            endContent={<SendHorizontalIcon size={16} />}
            className="neo-button border border-white bg-gradient-primary"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PodForm;
