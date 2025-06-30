"use client";

import {
  ClockIcon,
  FileUpIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import useUpload from "@/hooks/useUpload";

const FormattedSubmissionAnswer = ({ answer }) => {
  const { getFileViewUrl } = useUpload();

  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (answer?.fileKey) {
        try {
          const signed = await getFileViewUrl(answer.fileKey);
          setFileUrl(signed);
        } catch (e) {
          setFileUrl(null);
        }
      }
    };

    fetchSignedUrl();
  }, [answer?.fileKey, answer?.fileUrl]);

  if (answer === null || answer === undefined) return <>No answer provided</>;

  if (typeof answer === "string") {
    if (answer.startsWith("http")) {
      return (
        <Link
          href={answer}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-white underline hover:text-gray-100"
        >
          {answer}
        </Link>
      );
    }
    return <>{answer}</>;
  }

  if (typeof answer === "number") return <>{answer}</>;

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
    if (answer.fileName && (fileUrl || answer.fileKey)) {
      const sizeInMB = answer.fileSize
        ? (answer.fileSize / (1024 * 1024)).toFixed(2)
        : "Unknown";

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileUpIcon size={16} className="text-gray-200" />

            <span className="font-medium">{answer.fileName}</span>
            <span className="text-sm text-gray-300">({sizeInMB}MB)</span>
          </div>

          {fileUrl && (
            <Link
              href={fileUrl.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white underline hover:text-gray-100"
            >
              View File →
            </Link>
          )}
        </div>
      );
    }

    if (answer.joined !== undefined || answer.verified !== undefined) {
      return (
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
      );
    }

    return <>Data submitted</>;
  }

  return <>Submitted</>;
};

export default FormattedSubmissionAnswer;
