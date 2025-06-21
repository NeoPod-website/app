"use client";

import {
  XIcon,
  EyeIcon,
  KeyIcon,
  CopyIcon,
  UploadIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Card, CardBody, Input, addToast } from "@heroui/react";

import {
  updateTaskAnswer,
  selectTaskAnswer,
  selectIsQuestSubmitted,
} from "@/redux/slice/submissionSlice";

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown date";
  }
};

const XSpacesTask = ({ task, questId, userTwitterHandle }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Redux selectors
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  const isQuestSubmitted = useSelector((state) =>
    selectIsQuestSubmitted(state, questId),
  );

  // Fix: Proper task completion check - similar to other components
  const isTaskCompleted = useMemo(() => {
    return (
      currentAnswer &&
      typeof currentAnswer === "object" &&
      currentAnswer.verified === true &&
      !isQuestSubmitted // Key fix: Reset when quest is submitted
    );
  }, [currentAnswer, isQuestSubmitted]);

  // Local state
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix: Reset local state when quest is submitted
  useEffect(() => {
    if (isQuestSubmitted) {
      setScreenshotPreview(null);
      setShowPreview(false);
      setIsSubmitting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isQuestSubmitted]);

  // Also reset local state when currentAnswer is cleared (additional safety)
  useEffect(() => {
    if (!currentAnswer || currentAnswer === null) {
      setScreenshotPreview(null);
      setShowPreview(false);
      setIsSubmitting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [currentAnswer]);

  // Check if screenshot is selected
  const isScreenshotSelected =
    currentAnswer && currentAnswer.file && !isQuestSubmitted;

  // Create preview URL when file is selected
  useEffect(() => {
    if (currentAnswer?.file && !isQuestSubmitted) {
      const file = currentAnswer.file;
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        setScreenshotPreview(previewUrl);

        return () => {
          URL.revokeObjectURL(previewUrl);
        };
      }
    } else {
      setScreenshotPreview(null);
    }
  }, [currentAnswer?.file, isQuestSubmitted]);

  const handleCopyLink = async () => {
    if (task?.spaceUrl) {
      try {
        await navigator.clipboard.writeText(task.spaceUrl);
        addToast({
          title: "Link Copied!",
          description: "Space URL copied to clipboard",
          color: "success",
        });
      } catch (error) {
        addToast({
          title: "Copy Failed",
          description: "Could not copy link to clipboard",
          color: "danger",
        });
      }
    }
  };

  const handleOpenSpace = () => {
    if (task?.spaceUrl) {
      window.open(task.spaceUrl, "_blank", "noopener,noreferrer");
    }
  };

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      return {
        valid: false,
        error: "Please select an image file (PNG, JPG, etc.)",
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    if (file.size < 1024) {
      return {
        valid: false,
        error: "File size too small. Minimum size is 1KB.",
      };
    }

    return { valid: true };
  };

  const processFile = (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      addToast({
        title: "Invalid File",
        description: validation.error,
        color: "danger",
      });
      return;
    }

    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: {
          file: file,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          selectedAt: new Date().toISOString(),
          spaceUrl: task.spaceUrl,
          fileUrl: null,
          uploaded: false,
          verified: false,
        },
      }),
    );

    addToast({
      title: "Screenshot Selected",
      description: "Screenshot ready for submission",
      color: "success",
    });
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

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileClick = () => {
    if (!isTaskCompleted) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();

    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: null,
      }),
    );

    setScreenshotPreview(null);
    setShowPreview(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  const handleSubmitProof = async () => {
    if (!userTwitterHandle) {
      addToast({
        title: "Account Required",
        description: "Please connect your Twitter account first",
        color: "warning",
      });
      return;
    }

    if (!isScreenshotSelected) {
      addToast({
        title: "Screenshot Required",
        description: "Please upload a screenshot of your attendance",
        color: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      dispatch(
        updateTaskAnswer({
          questId,
          taskId: task.id,
          answer: {
            ...currentAnswer,
            verified: true,
            verifiedAt: new Date().toISOString(),
            method: "screenshot_proof",
            userConfirmed: true,
          },
        }),
      );

      addToast({
        title: "Proof Submitted!",
        description: "Your screenshot proof has been submitted successfully",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Submission Failed",
        description: "Failed to submit proof. Please try again.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          label="Twitter Space URL"
          value={task?.spaceUrl || ""}
          readOnly
          onClick={handleOpenSpace}
          startContent={<ExternalLinkIcon className="h-4 w-4 text-gray-400" />}
          classNames={{
            input: "text-gray-300 cursor-pointer",
            inputWrapper:
              "border-gray-600 bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer",
          }}
        />

        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleCopyLink}
          className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-200"
          aria-label="Copy link"
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>

      {task?.spacePassword && (
        <Card className="border border-yellow-500/40 bg-yellow-900/10">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <KeyIcon className="h-5 w-5 text-yellow-400" />

              <div className="flex-1">
                <p className="text-sm text-yellow-300">
                  Space Password:{" "}
                  <span className="rounded bg-yellow-900/30 px-2 py-1 font-mono font-bold text-yellow-100">
                    {task.spacePassword}
                  </span>
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {isQuestSubmitted && (
        <Card className="bg-blue-900/10 border border-blue-500/40">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />

              <div className="flex-1">
                <p className="mb-2 text-sm font-medium text-blue-200">
                  How to Complete:
                </p>

                <ol className="list-inside list-decimal space-y-1 text-sm text-blue-100">
                  <li>Click the Space URL above to join, or copy the link</li>
                  <li>Take a screenshot showing you joined the space</li>
                  <li>Upload the screenshot below to verify attendance</li>
                </ol>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="border border-gray-500/30 bg-gray-900/20">
        <CardBody className="p-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-200">
              Upload Screenshot Proof:
            </p>

            {isScreenshotSelected ? (
              <div className="relative overflow-hidden rounded-md border border-gray-400 bg-gray-700 p-4">
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-lg">🖼️</span>

                    <p className="max-w-xs truncate text-base font-medium text-gray-200">
                      {currentAnswer.fileName}
                    </p>
                  </div>

                  <p className="w-fit shrink-0 rounded-lg bg-gray-500 px-2 py-1 text-sm text-gray-200">
                    {(currentAnswer.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                {screenshotPreview && (
                  <div className="mt-3 w-full">
                    <div className="relative overflow-hidden rounded-md bg-black/20">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="h-32 w-full object-cover"
                      />

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
                    Image - {currentAnswer.fileType}
                  </p>

                  <div className="mt-2 flex items-center gap-4 md:mt-0">
                    <p className="text-blue-400">
                      📎 Selected (will upload on submit)
                    </p>

                    <button
                      type="button"
                      onClick={handlePreview}
                      className="hover:bg-blue-900/30 inline-flex items-center rounded-md bg-transparent px-2 py-1 text-sm font-medium text-blue-400 transition-colors"
                    >
                      Preview
                    </button>

                    {!isTaskCompleted && (
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="inline-flex items-center rounded-md bg-transparent px-3 py-1 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/30"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onClick={handleFileClick}
                onDragOver={handleDragOver}
                className={`flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-600 bg-black/30 transition-colors ${
                  isTaskCompleted
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-black/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <UploadIcon className="mb-4 h-8 w-8 text-gray-400" />

                  <p className="mb-2 text-sm text-gray-100">
                    <span className="font-semibold">
                      {isTaskCompleted ? "Task Completed" : "Click to upload"}
                    </span>{" "}
                    {!isTaskCompleted && "or drag and drop"}
                  </p>

                  {!isTaskCompleted && (
                    <>
                      <p className="text-xs text-gray-200">
                        PNG, JPG, JPEG, GIF, WebP
                      </p>

                      <p className="mt-1 text-xs text-gray-300">
                        Maximum file size: 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isTaskCompleted}
            />
          </div>
        </CardBody>
      </Card>

      {isTaskCompleted && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
          <CheckCircleIcon className="h-4 w-4 text-green-400" />
          <p className="text-sm text-green-300">
            ✅ Space attendance task completed successfully!
          </p>
        </div>
      )}

      <div className="flex flex-col justify-end gap-3 sm:flex-row">
        <Button
          as="a"
          href={task?.spaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="bordered"
          className="w-full border-gray-400 text-gray-200 hover:bg-gray-800 sm:w-auto"
          endContent={<ExternalLinkIcon className="h-4 w-4" />}
        >
          Join Space
        </Button>

        <Button
          onPress={handleSubmitProof}
          disabled={
            !userTwitterHandle || !isScreenshotSelected || isTaskCompleted
          }
          isLoading={isSubmitting}
          className={`w-full text-white sm:w-auto ${
            isTaskCompleted
              ? "cursor-not-allowed bg-green-600 opacity-50"
              : "bg-green-600 hover:bg-green-700 disabled:opacity-50"
          }`}
          startContent={
            isTaskCompleted ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <UploadIcon className="h-4 w-4" />
            )
          }
        >
          {isTaskCompleted ? "✅ Completed" : "Submit Screenshot"}
        </Button>
      </div>

      {showPreview && screenshotPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-h-full max-w-4xl">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-10 right-0 text-2xl font-bold text-white hover:text-gray-300"
            >
              <XIcon className="h-6 w-6" />
            </button>

            <img
              src={screenshotPreview}
              alt="Screenshot preview"
              className="max-h-full max-w-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default XSpacesTask;
