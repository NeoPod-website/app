"use client";

import {
  ClockIcon,
  FileUpIcon,
  XCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";

import useUpload from "@/hooks/useUpload";

import TweetPreview from "../../quests/tasks/social/x/TweetPreviewCard";

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

const extractTweetId = (tweetUrl) => {
  if (!tweetUrl || typeof tweetUrl !== "string") return null;
  const match =
    tweetUrl.match(/status\/(\d+)/) || tweetUrl.match(/t\.co\/(\w+)/);
  return match ? match[1] : null;
};

const isImageFile = (fileName = "") => {
  return /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(fileName);
};

const isPdfFile = (fileName = "") => {
  return /\.pdf$/i.test(fileName);
};

const LoadingPreviewSkeleton = () => (
  <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-3">
    <div className="animate-pulse space-y-2">
      <div className="h-6 w-1/3 rounded bg-gray-700" />
      <div className="h-40 rounded bg-gray-700" />
    </div>
  </div>
);

const FormattedSubmissionAnswer = ({
  answer,
  task = null,
  taskType = null,
  taskSubType = null,
}) => {
  const { getFileViewUrl } = useUpload();

  // State for file preview signing
  const [fileUrl, setFileUrl] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // Compute helpful flags
  const hasFileKey =
    answer && typeof answer === "object" && (answer.fileKey || answer.fileUrl);
  const fileName =
    answer && typeof answer === "object" ? answer.fileName : null;

  // If answer contains tweetUrl/replyUrl -> derive tweetId
  const tweetUrlFromAnswer = useMemo(() => {
    if (!answer || typeof answer !== "object") return null;
    // prefer tweetUrl, then replyUrl, then tweetUrl inside nested verificationData
    return (
      answer.tweetUrl ||
      answer.replyUrl ||
      (answer.verificationData && answer.verificationData.tweetUrl) ||
      null
    );
  }, [answer]);

  const tweetId = useMemo(() => {
    if (!tweetUrlFromAnswer || !isValidUrl(tweetUrlFromAnswer)) return null;
    return extractTweetId(tweetUrlFromAnswer);
  }, [tweetUrlFromAnswer]);

  // Fetch signed URL when fileKey changes
  useEffect(() => {
    let mounted = true;

    const fetchSignedUrl = async () => {
      if (!hasFileKey) {
        setFileUrl(null);
        setFileError(false);
        setIsLoadingFile(false);
        return;
      }

      // If answer directly provides a fileUrl (public), avoid signing step
      if (answer.fileUrl && !answer.fileKey) {
        setFileUrl({ signedUrl: answer.fileUrl });
        setFileError(false);
        setIsLoadingFile(false);
        return;
      }

      setIsLoadingFile(true);
      setFileError(false);

      try {
        const signed = await getFileViewUrl(answer.fileKey);
        if (!mounted) return;
        setFileUrl(signed || null);
      } catch (err) {
        console.error("Error fetching file URL:", err);
        if (!mounted) return;
        setFileUrl(null);
        setFileError(true);
      } finally {
        if (!mounted) return;
        setIsLoadingFile(false);
      }
    };

    fetchSignedUrl();

    return () => {
      mounted = false;
    };
  }, [answer?.fileKey, answer?.fileUrl, getFileViewUrl, hasFileKey]);

  // Handle null/undefined answers
  if (answer === null || answer === undefined) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <XCircleIcon size={16} />
        <span>No answer provided</span>
      </div>
    );
  }

  // Handle string answers (URLs and text)
  if (typeof answer === "string") {
    if (answer.trim() === "") {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <XCircleIcon size={16} />
          <span>Empty answer</span>
        </div>
      );
    }

    if (answer.startsWith("http")) {
      return (
        <Link
          href={answer}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-white underline transition-colors hover:text-gray-100"
        >
          {answer}
        </Link>
      );
    }

    return <span className="text-white">{answer}</span>;
  }

  // Handle number answers
  if (typeof answer === "number") {
    return (
      <span className="font-mono text-white">{answer.toLocaleString()}</span>
    );
  }

  // Handle boolean answers
  if (typeof answer === "boolean") {
    return (
      <div className="flex items-center gap-2">
        {answer ? (
          <>
            <CheckCircleIcon size={16} className="text-green-400" />
            <span className="text-green-400">Completed</span>
          </>
        ) : (
          <>
            <XCircleIcon size={16} className="text-red-400" />
            <span className="text-red-400">Not completed</span>
          </>
        )}
      </div>
    );
  }

  if (typeof answer === "object") {
    const looksLikeTweet =
      (taskType === "x" &&
        (taskSubType === "tweet" ||
          taskSubType === "react" ||
          taskSubType === "spaces")) ||
      Boolean(tweetId);

    if (looksLikeTweet && tweetId) {
      return (
        <div className="space-y-3">
          <TweetPreview tweetId={tweetId} onTweetLoad={() => {}} />

          <div className="flex items-center gap-2">
            {answer.verified ? (
              <>
                <CheckCircleIcon size={16} className="text-green-400" />
                <span className="text-green-400">Verified</span>
              </>
            ) : (
              <>
                <ClockIcon size={16} className="text-yellow-400" />
                <span className="text-yellow-400">Pending Verification</span>
              </>
            )}
          </div>

          {answer.verifiedAt && (
            <p className="text-xs text-gray-300">
              Verified at: {new Date(answer.verifiedAt).toLocaleString()}
            </p>
          )}
        </div>
      );
    }

    if (taskType === "x" && taskSubType === "spaces" && answer.spaceUrl) {
      return (
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-300">
              Attended Space:
            </p>

            <Link
              target="_blank"
              href={answer.spaceUrl}
              rel="noopener noreferrer"
              className="block break-all text-sm text-gray-100 underline hover:text-white"
            >
              {answer.spaceUrl}
            </Link>
          </div>

          {(answer.fileKey || answer.fileUrl) &&
          (isImageFile(answer.fileName) || isPdfFile(answer.fileName)) ? (
            <div className="rounded-lg bg-gray-600/50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <FileUpIcon size={16} className="text-gray-200" />

                <span className="font-medium text-white">
                  {answer.fileName}
                </span>

                {answer.fileSize && (
                  <span className="text-sm text-gray-300">
                    ({(answer.fileSize / (1024 * 1024)).toFixed(2)}MB)
                  </span>
                )}
              </div>

              {isLoadingFile && <LoadingPreviewSkeleton />}

              {fileError && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangleIcon size={16} />
                  <span>Error loading file</span>
                </div>
              )}

              {fileUrl &&
                !isLoadingFile &&
                !fileError &&
                isImageFile(answer.fileName) && (
                  <a
                    href={fileUrl.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={fileUrl.signedUrl}
                      alt={answer.fileName}
                      className="max-h-60 w-full rounded-md object-contain"
                      loading="lazy"
                    />
                  </a>
                )}

              {fileUrl &&
                !isLoadingFile &&
                !fileError &&
                isPdfFile(answer.fileName) && (
                  <div className="w-full">
                    <iframe
                      src={fileUrl.signedUrl}
                      title={answer.fileName}
                      className="h-72 w-full rounded-md border"
                      sandbox="allow-same-origin allow-scripts"
                    />

                    <div className="mt-2">
                      <Link
                        href={fileUrl.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 underline"
                      >
                        Open PDF →
                      </Link>
                    </div>
                  </div>
                )}

              {!isImageFile(answer.fileName) &&
                !isPdfFile(answer.fileName) &&
                !fileUrl && (
                  <Link
                    href={answer.fileUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 underline"
                  >
                    View File →
                  </Link>
                )}
            </div>
          ) : null}
        </div>
      );
    }

    if (hasFileKey && fileName && taskType !== "x") {
      const sizeInMB = answer.fileSize
        ? (answer.fileSize / (1024 * 1024)).toFixed(2)
        : "Unknown";

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileUpIcon size={16} className="text-gray-200" />
            <span className="font-medium text-white">{fileName}</span>
            <span className="text-sm text-gray-300">({sizeInMB}MB)</span>
          </div>

          {isLoadingFile && <LoadingPreviewSkeleton />}

          {fileError && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangleIcon size={16} />
              <span>Error loading file</span>
            </div>
          )}

          {fileUrl && !isLoadingFile && !fileError && isImageFile(fileName) && (
            <a
              href={fileUrl.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={fileUrl.signedUrl}
                alt={fileName}
                className="max-h-60 w-full rounded-md object-contain"
                loading="lazy"
              />
            </a>
          )}

          {fileUrl && !isLoadingFile && !fileError && isPdfFile(fileName) && (
            <div>
              <iframe
                src={fileUrl.signedUrl}
                title={fileName}
                className="h-72 w-full rounded-md border"
                sandbox="allow-same-origin allow-scripts"
              />
              <div className="mt-2">
                <Link
                  href={fileUrl.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 underline"
                >
                  Open PDF →
                </Link>
              </div>
            </div>
          )}

          {!fileUrl && !isLoadingFile && !fileError && answer.fileUrl && (
            <Link
              href={answer.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 underline"
            >
              View File →
            </Link>
          )}

          {!fileUrl && !answer.fileUrl && (
            <div className="text-sm text-gray-400">
              File preview not available
            </div>
          )}
        </div>
      );
    }

    if (answer.joined !== undefined || answer.verified !== undefined) {
      return (
        <div className="space-y-2">
          {taskType === "discord" && answer.serverName && (
            <div>
              <p className="mb-1 text-sm font-medium text-blue-300">
                Joined Discord Server:
              </p>
              <p className="text-sm text-white">{answer.serverName}</p>
            </div>
          )}

          {taskType === "telegram" && answer.groupName && (
            <div>
              <p className="mb-1 text-sm font-medium text-blue-300">
                Joined Telegram{" "}
                {answer.groupType === "supergroup" ? "Group" : "Channel"}:
              </p>
              <p className="text-sm text-white">{answer.groupName}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            {answer.verified ? (
              <>
                <CheckCircleIcon size={16} className="text-green-400" />
                <span className="text-green-400">Verified</span>
              </>
            ) : answer.joined ? (
              <>
                <CheckCircleIcon size={16} className="text-yellow-400" />
                <span className="text-yellow-400">Joined</span>
              </>
            ) : (
              <>
                <ClockIcon size={16} className="text-gray-400" />
                <span className="text-gray-400">Pending</span>
              </>
            )}
          </div>
        </div>
      );
    }

    if (
      answer.completionSummary &&
      (answer.completionSummary.completed || answer.completionSummary.missing)
    ) {
      return (
        <div className="space-y-2">
          {answer.completionSummary.completed?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-blue-300">
                Actions Completed:
              </p>
              <div className="flex flex-wrap gap-2">
                {answer.completionSummary.completed.map((action) => (
                  <span
                    key={action}
                    className="rounded bg-green-600/20 px-2 py-1 text-xs capitalize text-green-400"
                  >
                    ✓ {action}
                  </span>
                ))}
              </div>
            </div>
          )}

          {answer.completionSummary.missing?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-red-300">
                Missing Actions:
              </p>
              <div className="flex flex-wrap gap-2">
                {answer.completionSummary.missing.map((action) => (
                  <span
                    key={action}
                    className="rounded bg-red-600/20 px-2 py-1 text-xs capitalize text-red-400"
                  >
                    ✗ {action}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {answer.verified ? (
              <>
                <CheckCircleIcon size={16} className="text-green-400" />
                <span className="text-green-400">Verified</span>
              </>
            ) : (
              <>
                <ClockIcon size={16} className="text-yellow-400" />
                <span className="text-yellow-400">Pending Verification</span>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <CheckCircleIcon size={16} className="text-green-400" />
        <span className="text-white">Data submitted</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CheckCircleIcon size={16} className="text-green-400" />
      <span className="text-white">Submitted</span>
    </div>
  );
};

export default FormattedSubmissionAnswer;
