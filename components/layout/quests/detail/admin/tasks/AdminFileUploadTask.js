"use client";

import { Switch } from "@heroui/react";
import { FileUpIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminTaskItem from "./AdminTaskItem";
import QuestTaskContainer from "../../../tasks/QuestTaskContainer";

import RemoveCurrentTask from "@/components/ui/buttons/quest/admin/task/RemoveCurrentTask";
import DuplicateCurrentTask from "@/components/ui/buttons/quest/admin/task/DuplicateCurrentTask";

import { updateCurrentQuestTask } from "@/redux/slice/questSlice";

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

const FileUploadField = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [acceptedCategories, setAcceptedCategories] = useState(
    currentTask.acceptedCategories || ["image", "document"],
  );

  useEffect(() => {
    if (currentTask) {
      setAcceptedCategories(
        currentTask.acceptedCategories || ["image", "document"],
      );
    }
  }, [currentTask]);

  const handleCategoryToggle = (category) => {
    const updatedCategories = acceptedCategories.includes(category)
      ? acceptedCategories.filter((cat) => cat !== category)
      : [...acceptedCategories, category];

    setAcceptedCategories(updatedCategories);

    dispatch(
      updateCurrentQuestTask({
        id: taskId,
        changes: { acceptedCategories: updatedCategories },
      }),
    );
  };

  const handleClick = () => {};

  const handleDrop = (e) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm text-gray-300">
        File Upload Settings
      </label>

      <div className="mb-4">
        <p className="mb-2 text-sm text-gray-300">Accepted File Types:</p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {Object.keys(FILE_CATEGORIES).map((category) => (
            <div
              key={category}
              className="flex items-center justify-between rounded-md border border-gray-700 bg-black/30 p-3"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {FILE_CATEGORIES[category].name}
                </span>

                <span className="text-xs text-gray-400">
                  {FILE_CATEGORIES[category].extensions.join(", ")}
                </span>
              </div>

              <Switch
                size="md"
                color="primary"
                isSelected={acceptedCategories.includes(category)}
                onValueChange={() => handleCategoryToggle(category)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-2 text-sm text-gray-300">
          Upload Preview (for admin only):
        </p>

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

            <p className="mb-2 text-sm text-gray-300">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>

            <p className="text-xs text-gray-400">
              Accepted files:{" "}
              {acceptedCategories
                .map((cat) => FILE_CATEGORIES[cat].name)
                .join(", ")}
            </p>

            <p className="text-xs text-gray-400">
              Extensions:{" "}
              {acceptedCategories.length > 0
                ? acceptedCategories
                    .flatMap((cat) => FILE_CATEGORIES[cat].extensions)
                    .join(", ")
                : "No file types selected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminFileUploadTask = ({ index, task }) => {
  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const [currentTask, setCurrentTask] = useState(task);

  useEffect(() => {
    if (task.id) {
      const updatedTask = currentTasks.find((t) => t.id === task.id);
      if (updatedTask) {
        setCurrentTask(updatedTask);
      }
    }
  }, [task.id, currentTasks]);

  return (
    <QuestTaskContainer
      icon={<FileUpIcon size={16} />}
      text="File Upload"
      color="#15803d"
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: "#15803d" }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">File Upload Task</p>
          </div>

          <div className="mb-3 flex items-start justify-end gap-2">
            <DuplicateCurrentTask currentTask={currentTask} />
            <RemoveCurrentTask currentTask={currentTask} />
          </div>
        </div>

        <hr className="my-4 border-gray-400" />

        <AdminTaskItem taskId={currentTask.id} taskName="file-upload">
          <FileUploadField taskId={currentTask.id} />
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminFileUploadTask;
