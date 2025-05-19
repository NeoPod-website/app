"use client";

import React from "react";
import Link from "next/link";
import { SendHorizontalIcon } from "lucide-react";
import { Input, Textarea, Select, SelectItem, Button } from "@heroui/react";

import { languages } from "@/data/langData";

import AdminSelector from "./AdminSelector";

import ImageUpload from "@/components/ui/ImageUpload";

const PodForm = ({
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
          maxSizeInMB={8}
          prompt="Upload pod cover image"
        />

        <AdminSelector
          assignedAdmins={assignedAdmins}
          onChange={handlePodDataChange}
        />

        <Input
          required
          label="Pod Name"
          value={podName}
          onValueChange={setPodName}
        />

        <Textarea
          label="Description"
          value={description}
          onValueChange={setDescription}
          minRows={4}
        />

        <Select
          label="Language"
          selectedKeys={[language]}
          onSelectionChange={(keys) => setLanguage([...keys][0])}
        >
          {languages.map((lang) => (
            <SelectItem key={lang.code}>{lang.name}</SelectItem>
          ))}
        </Select>

        <Select
          label="Status"
          selectedKeys={[status]}
          onSelectionChange={(keys) => setStatus([...keys][0])}
        >
          <SelectItem key="live">Live</SelectItem>
          <SelectItem key="draft">Draft</SelectItem>
          <SelectItem key="archive">Archive</SelectItem>
        </Select>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            as={Link}
            size="lg"
            radius="full"
            href="/admin/manage/pods"
            className="neo-button border border-red-500 bg-red-500/20"
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            size="lg"
            type="submit"
            radius="full"
            className="neo-button border border-white bg-gradient-primary"
            endContent={<SendHorizontalIcon size={16} />}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isNew
              ? isSubmitting
                ? "Creating..."
                : "Create"
              : isSubmitting
                ? "Updating..."
                : "Update"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PodForm;
