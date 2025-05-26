"use client";

import Image from "next/image";
import { Input } from "@heroui/react";
import React, { useCallback, useEffect, useState, useRef, memo } from "react";

// Constants to prevent recreation on every render
const INPUT_NAME = "category-icon";
const ACCEPTED_FILE_TYPES = "image/*";

// Memoized Image component to prevent unnecessary re-renders
const IconPreview = memo(({ previewUrl }) => (
  <Image fill src={previewUrl} alt="Icon Preview" className="object-cover" />
));

IconPreview.displayName = "IconPreview";

const AdminIconUpload = memo(
  ({ label = "Upload Icon", initialIcon = "", onChange }) => {
    const [iconFile, setIconFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialIcon || "");

    // Use ref to track object URLs for proper cleanup
    const currentObjectUrlRef = useRef(null);

    // Memoized file change handler to prevent recreation
    const handleFileChange = useCallback(
      (e) => {
        const file = e.target.files?.[0];

        if (file) {
          // Cleanup previous object URL if it exists
          if (currentObjectUrlRef.current) {
            URL.revokeObjectURL(currentObjectUrlRef.current);
          }

          // Create new object URL
          const preview = URL.createObjectURL(file);
          currentObjectUrlRef.current = preview;

          setIconFile(file);
          setPreviewUrl(preview);
          onChange?.(file);
        }
      },
      [onChange],
    );

    // Cleanup object URL on unmount and when dependencies change
    useEffect(() => {
      return () => {
        if (currentObjectUrlRef.current) {
          URL.revokeObjectURL(currentObjectUrlRef.current);
          currentObjectUrlRef.current = null;
        }
      };
    }, []);

    // Handle initial icon changes without creating unnecessary object URLs
    useEffect(() => {
      if (initialIcon && !iconFile) {
        setPreviewUrl(initialIcon);
      }
    }, [initialIcon, iconFile]);

    return (
      <div className="flex items-center justify-between gap-3">
        <Input
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          label={label}
          onChange={handleFileChange}
          variant="bordered"
          name={INPUT_NAME}
          className="min-w-0 max-w-md bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        />

        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-500">
          {previewUrl && <IconPreview previewUrl={previewUrl} />}
        </div>
      </div>
    );
  },
);

AdminIconUpload.displayName = "AdminIconUpload";

export default AdminIconUpload;
