"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FileUpIcon, EyeIcon, PlayIcon } from "lucide-react";

import QuestTask from "./QuestTask";
import {
  updateTaskAnswer,
  selectTaskAnswer,
} from "@/redux/slice/submissionSlice";

const FILE_CATEGORIES = {
  document: {
    name: "Document",
    extensions: [".doc", ".docx", ".txt", ".pdf", ".rtf", ".odt"],
  },
  presentation: {
    name: "Presentation",
    extensions: [".ppt", ".pptx", ".key", ".odp"],
  },
  spreadsheet: {
    name: "Spreadsheet",
    extensions: [".xls", ".xlsx", ".csv", ".ods"],
  },
  image: {
    name: "Image",
    extensions: [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
  },
  drawing: {
    name: "Drawing",
    extensions: [".psd", ".ai", ".eps", ".svg", ".sketch"],
  },
  video: {
    name: "Video",
    extensions: [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  },
  audio: {
    name: "Audio",
    extensions: [".mp3", ".wav", ".ogg", ".flac", ".aac"],
  },
  archive: {
    name: "Archive",
    extensions: [".zip", ".rar", ".7z", ".tar", ".gz"],
  },
};

const QuestFileUploadTask = ({ task, questId, heading, description }) => {
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Get current answer from Redux
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  // Get accepted categories from task data
  const acceptedCategories = task.acceptedCategories || ["image"];

  // Generate accepted file types based on selected categories
  const getAcceptedFileTypes = () => {
    let types = [];
    acceptedCategories.forEach((category) => {
      if (FILE_CATEGORIES[category]) {
        types = [...types, ...FILE_CATEGORIES[category].extensions];
      }
    });
    return types;
  };

  const ACCEPTED_FILE_TYPES = getAcceptedFileTypes();

  // Check if file is selected
  const isFileSelected = currentAnswer && currentAnswer.file;

  // Create file preview URL when file is selected
  useEffect(() => {
    if (currentAnswer?.file) {
      const file = currentAnswer.file;

      // Only create preview for images and videos
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);

        // Cleanup function to revoke object URL
        return () => {
          URL.revokeObjectURL(previewUrl);
        };
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  }, [currentAnswer?.file]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const validateFile = (file) => {
    // Check file type
    const isValidType = ACCEPTED_FILE_TYPES.some((type) =>
      file.name.toLowerCase().endsWith(type),
    );

    if (!isValidType) {
      return {
        valid: false,
        error: `Invalid file type. Only ${acceptedCategories
          .map((cat) => FILE_CATEGORIES[cat].name)
          .join(", ")} files are allowed.`,
      };
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size too large. Maximum size is 50MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    // Check minimum file size (1KB)
    if (file.size < 1024) {
      return {
        valid: false,
        error: "File size too small. Minimum size is 1KB.",
      };
    }

    return { valid: true };
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Store file data in Redux (don't upload yet)
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: {
          file: file, // Store the actual file object
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          selectedAt: new Date().toISOString(),
          category: getFileCategory(file.name),
          // Will be populated after upload during submission
          fileUrl: null,
          uploaded: false,
        },
      }),
    );
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();

    // Clear the answer from Redux
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: null,
      }),
    );

    // Clear preview
    setFilePreview(null);
    setShowPreview(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  // Function to determine the file category
  const getFileCategory = (fileName) => {
    for (const [category, data] of Object.entries(FILE_CATEGORIES)) {
      if (data.extensions.some((ext) => fileName.toLowerCase().endsWith(ext))) {
        return data.name;
      }
    }
    return "Unknown";
  };

  // Function to check if file type supports preview
  const canPreview = (fileType) => {
    return fileType?.startsWith("image/") || fileType?.startsWith("video/");
  };

  // Function to get file icon based on category
  const getFileIcon = (category) => {
    const icons = {
      Image: "🖼️",
      Video: "🎥",
      Audio: "🎵",
      Archive: "📦",
      Drawing: "🎨",
      Document: "📄",
      Spreadsheet: "📈",
      Presentation: "📊",
    };
    return icons[category] || "📎";
  };

  return (
    <>
      <QuestTask
        text="file"
        color="#15803d"
        isAdmin={false}
        heading={heading}
        description={description}
        icon={<FileUpIcon size={12} className="text-white" />}
      >
        <div className="flex w-full items-center justify-center">
          {isFileSelected ? (
            <div
              className={cn(
                "relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-gray-700 p-4",
                "border border-gray-400 shadow-md",
                canPreview(currentAnswer.fileType) ? "md:h-auto" : "md:h-24",
              )}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-lg">
                    {getFileIcon(currentAnswer.category)}
                  </span>

                  <p className="max-w-xs truncate text-base font-medium text-gray-200">
                    {currentAnswer.fileName}
                  </p>
                </div>

                <p className="w-fit shrink-0 rounded-lg bg-gray-500 px-2 py-1 text-sm text-gray-200 shadow-sm">
                  {(currentAnswer.fileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              {filePreview && canPreview(currentAnswer.fileType) && (
                <div className="mt-3 w-full">
                  <div className="relative overflow-hidden rounded-md bg-black/20">
                    {currentAnswer.fileType?.startsWith("image/") ? (
                      <img
                        src={filePreview}
                        alt="File preview"
                        className="h-32 w-full object-cover"
                      />
                    ) : currentAnswer.fileType?.startsWith("video/") ? (
                      <div className="relative">
                        <video
                          muted
                          src={filePreview}
                          className="h-32 w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayIcon className="h-8 w-8 text-white/80" />
                        </div>
                      </div>
                    ) : null}

                    <button
                      onClick={handlePreview}
                      className="absolute right-2 top-2 rounded bg-black/50 p-1 transition-colors hover:bg-black/70"
                    >
                      <EyeIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-gray-500 md:flex-row md:items-center">
                <p className="rounded-md bg-gray-500 px-2 py-0.5 text-gray-200">
                  {currentAnswer.category} -{" "}
                  {currentAnswer.fileType || "Unknown file type"}
                </p>

                <div className="mt-2 flex items-center gap-4 md:mt-0">
                  <p className="text-blue-400">
                    📎 Selected (will upload on submit)
                  </p>

                  {canPreview(currentAnswer.fileType) && (
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="hover:bg-blue-900/30 inline-flex items-center rounded-md bg-transparent px-2 py-1 text-sm font-medium text-blue-400 transition-colors focus:outline-none"
                    >
                      Preview
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center rounded-md bg-transparent px-3 py-1 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/30 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onClick={handleClick}
              onDragOver={handleDragOver}
              className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-600 bg-black/30 transition-colors hover:bg-black/50"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  className="mb-4 h-8 w-8 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a2 2 0 0 0 2-2v-3l-5.288-.84A2 2 0 0 0 11.7 5H9v7a2 2 0 0 1-2 2H1m5-10V3a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v1h16v-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v3m0 5H6a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8m0 5h8m-8 0h8m-8 0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-8Z"
                  />
                </svg>

                <p className="mb-2 text-sm text-gray-100">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>

                <p className="text-xs text-gray-200">
                  Accepted files:{" "}
                  {acceptedCategories
                    .map((cat) => FILE_CATEGORIES[cat].name)
                    .join(", ")}
                </p>

                <p className="text-xs text-gray-300">
                  Extensions:{" "}
                  {acceptedCategories
                    .flatMap((cat) => FILE_CATEGORIES[cat].extensions)
                    .join(", ")}
                </p>

                <p className="mt-1 text-xs text-gray-300">
                  Maximum file size: 50MB
                </p>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept={ACCEPTED_FILE_TYPES.join(",")}
          />
        </div>
      </QuestTask>

      {showPreview && filePreview && (
        <div
          className="fixed inset-0 -top-10 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-h-full max-w-4xl">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-10 right-0 text-2xl font-bold text-white hover:text-gray-300"
            >
              ✕
            </button>

            {currentAnswer.fileType?.startsWith("image/") ? (
              <img
                src={filePreview}
                alt="File preview"
                className="max-h-full max-w-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            ) : currentAnswer.fileType?.startsWith("video/") ? (
              <video
                src={filePreview}
                controls
                className="max-h-full max-w-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestFileUploadTask;
