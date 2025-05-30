"use client";

import {
  Link,
  Input,
  Button,
  Select,
  Textarea,
  SelectItem,
} from "@heroui/react";
import React from "react";
import { SendHorizontalIcon } from "lucide-react";

import AdminIconUpload from "./AdminIconUpload";

import ImageUpload from "@/components/ui/ImageUpload";

// Constants to prevent recreation
const STATUS_OPTIONS = [
  { key: "live", label: "Live" },
  { key: "draft", label: "Draft" },
  { key: "archive", label: "Archive" },
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
];

const MAX_DESCRIPTION_LENGTH = 100;
const MAX_IMAGE_SIZE_MB = 5;

const CategoryForm = ({
  podId,
  isNew = false,
  icon,
  setIcon,
  status,
  setStatus,
  title,
  setTitle,
  selectedFile,
  setSelectedFile,
  description,
  setDescription,
  isSubmitting,
  handleFormSubmit,
}) => {
  const handleBackgroundChange = (file) => {
    setSelectedFile(file);
  };

  return (
    <>
      <h2 className="text-2xl font-bold">
        {isNew ? "Create" : "Edit"} Category
      </h2>

      <form
        onSubmit={handleFormSubmit}
        className="hide-scroll space-y-4 overflow-auto"
      >
        <ImageUpload
          value={selectedFile}
          label="Category Background"
          maxSizeInMB={MAX_IMAGE_SIZE_MB}
          onChange={handleBackgroundChange}
          allowedTypes={ALLOWED_IMAGE_TYPES}
          prompt="Click to upload or drag and drop a Background Image"
        />

        <div className="mx-auto max-w-xl space-y-4">
          <AdminIconUpload
            label="Category Icon"
            initialIcon={icon}
            onChange={(file) => setIcon(file)}
          />

          <Input
            required
            type="text"
            value={title}
            variant="bordered"
            name="category_title"
            label="Category Title"
            onValueChange={setTitle}
            placeholder="Choose a title for the category"
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          <Select
            label="Status"
            variant="bordered"
            selectedKeys={[status]}
            onSelectionChange={(keys) => setStatus([...keys][0])}
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

          <Textarea
            type="text"
            isClearable
            minRows={6}
            variant="bordered"
            value={description}
            name="category_description"
            label="Category Description"
            onValueChange={setDescription}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="Provide more details about your category"
            isInvalid={description.length >= MAX_DESCRIPTION_LENGTH}
            errorMessage="The description cannot be 100 characters long."
            className="bg-dark text-white"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            as={Link}
            size="lg"
            radius="full"
            disabled={isSubmitting}
            href={`/admin/manage/categories/${podId}`}
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
            {isNew ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CategoryForm;
