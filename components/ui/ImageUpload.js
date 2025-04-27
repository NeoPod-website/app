"use client";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import { Trash2, Image as ImageIcon } from "lucide-react";
import React, { useState, useCallback, useEffect, useRef } from "react";

const ImageUpload = ({
  onChange,
  maxSizeInMB = 5,
  value: initialValue,
  label = "Upload Image",
  prompt = "Click to upload or drag and drop",
  customErrorMessage,
  allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
  ],
  fixedSize = { width: undefined, height: 256 },
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  // Normalize allowed types for more robust checking
  const normalizedAllowedTypes = useCallback(() => {
    return allowedTypes.map((type) => type.toLowerCase());
  }, [allowedTypes]);

  // Extract file extension from name
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  // Map common extensions to MIME types for additional validation
  const extensionToMimeType = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };

  // Check if file type is allowed using both MIME type and extension
  const isFileTypeAllowed = useCallback(
    (file) => {
      const fileType = file.type.toLowerCase();
      const fileExtension = getFileExtension(file.name);
      const expectedMimeType = extensionToMimeType[fileExtension];
      const normalizedTypes = normalizedAllowedTypes();

      // Accept if either the browser-detected MIME type or the extension-based MIME type is allowed
      return (
        normalizedTypes.includes(fileType) ||
        (expectedMimeType && normalizedTypes.includes(expectedMimeType))
      );
    },
    [normalizedAllowedTypes],
  );

  useEffect(() => {
    if (initialValue) {
      // Handle both string URLs and File objects
      if (typeof initialValue === "string") {
        const loadImage = async () => {
          try {
            const response = await fetch(initialValue);
            const blob = await response.blob();

            // Try to determine the correct file type from the URL or response
            let fileType = blob.type;
            if (!fileType || fileType === "application/octet-stream") {
              // Try to extract from URL
              const extension = getFileExtension(initialValue);
              fileType = extensionToMimeType[extension] || "image/jpeg";
            }

            const file = new File(
              [blob],
              "initial_image." + getFileExtension(initialValue) || "jpg",
              {
                type: fileType,
                lastModified: Date.now(),
              },
            );

            setPreview({ url: initialValue, file });
          } catch (err) {
            console.error("Failed to load initial image:", err);
            setError("Failed to load initial image.");
            onChange(null);
          }
        };

        loadImage();
      } else if (initialValue instanceof File) {
        // Handle File object directly
        const reader = new FileReader();
        reader.onload = () => {
          setPreview({ url: reader.result, file: initialValue });
        };
        reader.readAsDataURL(initialValue);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [initialValue, onChange]);

  // Handle file selection
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];

      if (!file) {
        setPreview(null);
        setError(null);
        onChange(null);
        return;
      }

      setError(null);

      // Enhanced file type validation
      if (!isFileTypeAllowed(file)) {
        const errorMsg =
          customErrorMessage ||
          `Invalid file type. Allowed: ${allowedTypes.join(", ")}. File detected as: ${file.type}`;
        setError(errorMsg);
        return;
      }

      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        setError(`File too large. Max: ${maxSizeInMB} MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreview({ url: reader.result, file });
        onChange(file);
      };

      reader.onerror = () => {
        setError("Failed to read file.");
      };

      reader.readAsDataURL(file);
    },
    [isFileTypeAllowed, maxSizeInMB, customErrorMessage, onChange],
  );

  // Handle file removal
  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerInput = () => {
    inputRef.current?.click();
  };

  // Format allowed types for display
  const formatAllowedTypes = () => {
    return allowedTypes
      .map((type) => {
        const parts = type.split("/");
        const extension = parts[1].toUpperCase();
        return extension === "JPEG" ? "JPG/JPEG" : extension;
      })
      .filter((value, index, self) => self.indexOf(value) === index);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={triggerInput}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) {
            handleFileChange({
              target: { files: e.dataTransfer.files },
              currentTarget: inputRef.current,
            });
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative flex flex-col items-center justify-center",
          "h-48 w-full rounded-lg border-2 border-dashed border-gray-700",
          "cursor-pointer bg-gray-800/50 transition-colors duration-200",
          "hover:border-gray-600 hover:bg-gray-700/50",
          preview ? "border-gray-700" : "border-dashed border-gray-700",
        )}
      >
        <input
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleFileChange}
          className="hidden"
          ref={inputRef}
          aria-label="Upload Image"
        />

        {preview ? (
          <div className="absolute inset-0">
            <img
              src={preview.url}
              alt="Uploaded Preview"
              className="h-full w-full object-contain"
            />

            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute right-2 top-2 h-10 w-10 min-w-0 bg-red-500/30 p-1.5"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />

            <p className="text-sm text-gray-300">
              <span className="font-semibold">{label}</span> {prompt}
            </p>

            <p className="text-xs text-gray-400">
              Accepted file types: {formatAllowedTypes().join(", ")}
            </p>

            <p className="text-xs text-gray-400">Max size: {maxSizeInMB} MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 p-3">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
