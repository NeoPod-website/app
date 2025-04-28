"use client";

import React from "react";
import { SendHorizonalIcon } from "lucide-react";
import { Button, Input, Link, Textarea } from "@heroui/react";

import AdminIconUpload from "./AdminIconUpload";
import ImageUpload from "@/components/ui/ImageUpload";

const CategoryForm = ({
  isNew = false,
  icon,
  setIcon,
  title,
  setTitle,
  selectedFile,
  setSelectedFile,
  description,
  setDescription,
  handleFormSubmit,
}) => {
  const handleBackgroundChange = (file) => {
    setSelectedFile(file);
  };

  const handleIconFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setIcon(file);
    }
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
        {/* Background Upload */}
        <ImageUpload
          maxSizeInMB={8}
          value={selectedFile}
          label="Category Background"
          onChange={handleBackgroundChange}
          prompt="Click to upload or drag and drop a Background Image"
          allowedTypes={[
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/jpg",
          ]}
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
            className="bg-dark"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />

          <Textarea
            type="text"
            isClearable
            minRows={6}
            maxLength={100}
            variant="bordered"
            value={description}
            name="category_description"
            label="Category Description"
            onValueChange={setDescription}
            placeholder="Provide more details about your category"
            isInvalid={description.length >= 100}
            errorMessage="The description cannot be 100 characters long."
            className="bg-dark"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          {isNew && (
            <Button
              as={Link}
              size="lg"
              radius="full"
              href="/admin/manage/categories"
              className="neo-button border border-red-500 bg-red-500/20"
            >
              Cancel
            </Button>
          )}

          <Button
            size="lg"
            type="submit"
            radius="full"
            className="neo-button border border-white bg-gradient-primary"
            endContent={<SendHorizonalIcon size={16} />}
          >
            {isNew ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CategoryForm;
