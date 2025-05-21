"use client";

import Image from "next/image";
import { Input } from "@heroui/react";
import React, { useEffect, useState } from "react";

const AdminIconUpload = ({
  label = "Upload Icon",
  initialIcon = "",
  onChange,
}) => {
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialIcon || "");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setIconFile(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      if (onChange) {
        onChange(file);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (iconFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [iconFile, previewUrl]);

  return (
    <div className="flex items-center gap-3">
      <Input
        type="file"
        accept="image/*"
        label={label}
        onChange={handleFileChange}
        variant="bordered"
        name="category-icon"
        className="min-w-0 bg-dark"
        classNames={{
          inputWrapper:
            "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
        }}
      />

      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-500">
        {previewUrl && (
          <Image
            fill
            src={previewUrl}
            alt="Icon Preview"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default AdminIconUpload;
