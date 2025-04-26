"use client";

import React from "react";
import { useState, useRef } from "react";
import { FileUpIcon } from "lucide-react";

import QuestTask from "./QuestTask";

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

const QuestFileUploadTask = ({
  name,
  heading = "hello",
  description = "test",
  acceptedCategories = ["document"],
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (
      file &&
      ACCEPTED_FILE_TYPES.some((type) => file.name.toLowerCase().endsWith(type))
    ) {
      setSelectedFile(file);
    } else if (file) {
      alert(
        `Invalid file type. Only ${acceptedCategories.map((cat) => FILE_CATEGORIES[cat].name).join(", ")} files are allowed.`,
      );

      event.target.value = "";

      setSelectedFile(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (
      file &&
      ACCEPTED_FILE_TYPES.some((type) => file.name.toLowerCase().endsWith(type))
    ) {
      setSelectedFile(file);
    } else if (file) {
      alert(
        `Invalid file type. Only ${acceptedCategories.map((cat) => FILE_CATEGORIES[cat].name).join(", ")} files are allowed.`,
      );
      setSelectedFile(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  return (
    <QuestTask
      icon={<FileUpIcon size={12} className="text-white" />}
      text="file"
      color="#15803d"
      heading={heading}
      description={description}
    >
      <div className="flex w-full items-center justify-center">
        {selectedFile ? (
          <div
            layoutId="file-upload"
            className={cn(
              "relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-neutral-800 p-4 md:h-24",
              "border border-neutral-700 shadow-md",
            )}
          >
            <div className="flex w-full items-center justify-between gap-4">
              <p
                layout
                className="max-w-xs truncate text-base font-medium text-gray-200"
              >
                {selectedFile.name}
              </p>
              <p
                layout
                className="w-fit shrink-0 rounded-lg bg-neutral-700 px-2 py-1 text-sm text-gray-200 shadow-sm"
              >
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-gray-400 md:flex-row md:items-center">
              <p
                layout
                className="rounded-md bg-neutral-700 px-2 py-0.5 text-gray-300"
              >
                {getFileCategory(selectedFile.name)} -{" "}
                {selectedFile.type || "Unknown file type"}
              </p>
              <div className="flex items-center gap-4">
                <p layout>
                  modified{" "}
                  {new Date(selectedFile.lastModified).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center rounded-md bg-transparent px-3 py-1 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
            className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-600 bg-black/30 transition-colors hover:bg-black/50`}
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

              <p className="mb-2 text-sm text-gray-300">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>

              <p className="text-xs text-gray-400">
                Accepted files:{" "}
                {acceptedCategories
                  .map((cat) => FILE_CATEGORIES[cat].name)
                  .join(", ")}
              </p>

              <p className="text-xs text-gray-400">
                Extensions:{" "}
                {acceptedCategories
                  .map((cat) => FILE_CATEGORIES[cat].extensions)
                  .join(", ")}
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
  );
};

export default QuestFileUploadTask;
