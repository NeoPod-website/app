// "use client";

// import {
//   ClockIcon,
//   FileUpIcon,
//   XCircleIcon,
//   CheckCircleIcon,
// } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// import useUpload from "@/hooks/useUpload";

// const FormattedSubmissionAnswer = ({ answer }) => {
//   const { getFileViewUrl } = useUpload();

//   const [fileUrl, setFileUrl] = useState(null);

//   useEffect(() => {
//     const fetchSignedUrl = async () => {
//       if (answer?.fileKey) {
//         try {
//           const signed = await getFileViewUrl(answer.fileKey);
//           setFileUrl(signed);
//         } catch (e) {
//           setFileUrl(null);
//         }
//       }
//     };

//     fetchSignedUrl();
//   }, [answer?.fileKey, answer?.fileUrl]);

//   if (answer === null || answer === undefined) return <>No answer provided</>;

//   if (typeof answer === "string") {
//     if (answer.startsWith("http")) {
//       return (
//         <Link
//           href={answer}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="break-all text-white underline hover:text-gray-100"
//         >
//           {answer}
//         </Link>
//       );
//     }
//     return <>{answer}</>;
//   }

//   if (typeof answer === "number") return <>{answer}</>;

//   if (typeof answer === "boolean") {
//     return (
//       <div className="flex items-center gap-2">
//         {answer ? (
//           <>
//             <CheckCircleIcon size={16} className="text-green-400" />
//             <span className="text-green-400">Completed</span>
//           </>
//         ) : (
//           <>
//             <XCircleIcon size={16} className="text-red-400" />
//             <span className="text-red-400">Not completed</span>
//           </>
//         )}
//       </div>
//     );
//   }

//   if (typeof answer === "object") {
//     if (answer.fileName && (fileUrl || answer.fileKey)) {
//       const sizeInMB = answer.fileSize
//         ? (answer.fileSize / (1024 * 1024)).toFixed(2)
//         : "Unknown";

//       return (
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <FileUpIcon size={16} className="text-gray-200" />

//             <span className="font-medium">{answer.fileName}</span>
//             <span className="text-sm text-gray-300">({sizeInMB}MB)</span>
//           </div>

//           {fileUrl && (
//             <Link
//               href={fileUrl.signedUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-1 text-white underline hover:text-gray-100"
//             >
//               View File →
//             </Link>
//           )}
//         </div>
//       );
//     }

//     if (answer.joined !== undefined || answer.verified !== undefined) {
//       return (
//         <div className="flex items-center gap-2">
//           {answer.verified ? (
//             <>
//               <CheckCircleIcon size={16} className="text-green-400" />
//               <span className="text-green-400">Verified</span>
//             </>
//           ) : answer.joined ? (
//             <>
//               <CheckCircleIcon size={16} className="text-yellow-400" />
//               <span className="text-yellow-400">Joined</span>
//             </>
//           ) : (
//             <>
//               <ClockIcon size={16} className="text-gray-400" />
//               <span className="text-gray-400">Pending</span>
//             </>
//           )}
//         </div>
//       );
//     }

//     return <>Data submitted</>;
//   }

//   return <>Submitted</>;
// };

// export default FormattedSubmissionAnswer;

// "use client";

// import {
//   ClockIcon,
//   FileUpIcon,
//   XCircleIcon,
//   CheckCircleIcon,
//   AlertTriangleIcon,
//   LoaderIcon,
// } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// import useUpload from "@/hooks/useUpload";

// const FormattedSubmissionAnswer = ({ answer }) => {
//   const { getFileViewUrl } = useUpload();

//   const [fileUrl, setFileUrl] = useState(null);
//   const [isLoadingFile, setIsLoadingFile] = useState(false);
//   const [fileError, setFileError] = useState(false);

//   useEffect(() => {
//     const fetchSignedUrl = async () => {
//       if (answer?.fileKey) {
//         setIsLoadingFile(true);
//         setFileError(false);

//         try {
//           const signed = await getFileViewUrl(answer.fileKey);
//           setFileUrl(signed);
//         } catch (error) {
//           console.error('Error fetching file URL:', error);
//           setFileUrl(null);
//           setFileError(true);
//         } finally {
//           setIsLoadingFile(false);
//         }
//       }
//     };

//     fetchSignedUrl();
//   }, [answer?.fileKey, getFileViewUrl]);

//   // Handle null/undefined answers
//   if (answer === null || answer === undefined) {
//     return (
//       <div className="flex items-center gap-2 text-gray-400">
//         <XCircleIcon size={16} />
//         <span>No answer provided</span>
//       </div>
//     );
//   }

//   // Handle string answers (URLs and text)
//   if (typeof answer === "string") {
//     if (answer.trim() === "") {
//       return (
//         <div className="flex items-center gap-2 text-gray-400">
//           <XCircleIcon size={16} />
//           <span>Empty answer</span>
//         </div>
//       );
//     }

//     if (answer.startsWith("http")) {
//       return (
//         <Link
//           href={answer}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="break-all text-white underline hover:text-gray-100 transition-colors"
//         >
//           {answer}
//         </Link>
//       );
//     }

//     return <span className="text-white">{answer}</span>;
//   }

//   // Handle number answers
//   if (typeof answer === "number") {
//     return <span className="text-white font-mono">{answer.toLocaleString()}</span>;
//   }

//   // Handle boolean answers
//   if (typeof answer === "boolean") {
//     return (
//       <div className="flex items-center gap-2">
//         {answer ? (
//           <>
//             <CheckCircleIcon size={16} className="text-green-400" />
//             <span className="text-green-400">Completed</span>
//           </>
//         ) : (
//           <>
//             <XCircleIcon size={16} className="text-red-400" />
//             <span className="text-red-400">Not completed</span>
//           </>
//         )}
//       </div>
//     );
//   }

//   // Handle object answers
//   if (typeof answer === "object") {
//     // Handle file uploads
//     if (answer.fileName && (answer.fileKey || answer.fileUrl)) {
//       const sizeInMB = answer.fileSize
//         ? (answer.fileSize / (1024 * 1024)).toFixed(2)
//         : "Unknown";

//       return (
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <FileUpIcon size={16} className="text-gray-200" />
//             <span className="font-medium text-white">{answer.fileName}</span>
//             <span className="text-sm text-gray-300">({sizeInMB}MB)</span>
//           </div>

//           {isLoadingFile && (
//             <div className="flex items-center gap-2 text-gray-400">
//               <LoaderIcon size={16} className="animate-spin" />
//               <span>Loading file...</span>
//             </div>
//           )}

//           {fileError && (
//             <div className="flex items-center gap-2 text-red-400">
//               <AlertTriangleIcon size={16} />
//               <span>Error loading file</span>
//             </div>
//           )}

//           {fileUrl && !isLoadingFile && !fileError && (
//             <Link
//               href={fileUrl.signedUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-1 text-white underline hover:text-gray-100 transition-colors"
//             >
//               View File →
//             </Link>
//           )}

//           {!fileUrl && !isLoadingFile && !fileError && answer.fileUrl && (
//             <Link
//               href={answer.fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-1 text-white underline hover:text-gray-100 transition-colors"
//             >
//               View File →
//             </Link>
//           )}
//         </div>
//       );
//     }

//     // Handle join/verification status
//     if (answer.joined !== undefined || answer.verified !== undefined) {
//       return (
//         <div className="flex items-center gap-2">
//           {answer.verified ? (
//             <>
//               <CheckCircleIcon size={16} className="text-green-400" />
//               <span className="text-green-400">Verified</span>
//             </>
//           ) : answer.joined ? (
//             <>
//               <CheckCircleIcon size={16} className="text-yellow-400" />
//               <span className="text-yellow-400">Joined</span>
//             </>
//           ) : (
//             <>
//               <ClockIcon size={16} className="text-gray-400" />
//               <span className="text-gray-400">Pending</span>
//             </>
//           )}
//         </div>
//       );
//     }

//     // Handle complex objects by showing a generic message
//     return (
//       <div className="flex items-center gap-2">
//         <CheckCircleIcon size={16} className="text-green-400" />
//         <span className="text-white">Data submitted</span>
//       </div>
//     );
//   }

//   // Fallback for any other type
//   return (
//     <div className="flex items-center gap-2">
//       <CheckCircleIcon size={16} className="text-green-400" />
//       <span className="text-white">Submitted</span>
//     </div>
//   );
// };

// export default FormattedSubmissionAnswer;

"use client";

import {
  ClockIcon,
  FileUpIcon,
  XCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import useUpload from "@/hooks/useUpload";

const FormattedSubmissionAnswer = ({ answer }) => {
  const { getFileViewUrl } = useUpload();

  const [fileUrl, setFileUrl] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (answer?.fileKey) {
        setIsLoadingFile(true);
        setFileError(false);

        try {
          const signed = await getFileViewUrl(answer.fileKey);
          setFileUrl(signed);
        } catch (error) {
          console.error("Error fetching file URL:", error);
          setFileUrl(null);
          setFileError(true);
        } finally {
          setIsLoadingFile(false);
        }
      }
    };

    fetchSignedUrl();
  }, [answer?.fileKey, getFileViewUrl]);

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

  // Handle object answers
  if (typeof answer === "object") {
    // Handle X/Twitter task submissions
    if (answer.replyUrl || answer.tweetId || answer.verified !== undefined) {
      return (
        <div className="space-y-2">
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

          {answer.replyUrl && (
            <Link
              href={answer.replyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-white underline transition-colors hover:text-gray-100"
            >
              View Tweet/Reply →
            </Link>
          )}

          {answer.verifiedAt && (
            <p className="text-xs text-gray-400">
              Verified at: {new Date(answer.verifiedAt).toLocaleString()}
            </p>
          )}
        </div>
      );
    }

    // Handle file uploads
    if (answer.fileName && (answer.fileKey || answer.fileUrl)) {
      const sizeInMB = answer.fileSize
        ? (answer.fileSize / (1024 * 1024)).toFixed(2)
        : "Unknown";

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileUpIcon size={16} className="text-gray-200" />
            <span className="font-medium text-white">{answer.fileName}</span>
            <span className="text-sm text-gray-300">({sizeInMB}MB)</span>
          </div>

          {isLoadingFile && (
            <div className="flex items-center gap-2 text-gray-400">
              <LoaderIcon size={16} className="animate-spin" />
              <span>Loading file...</span>
            </div>
          )}

          {fileError && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangleIcon size={16} />
              <span>Error loading file</span>
            </div>
          )}

          {fileUrl && !isLoadingFile && !fileError && (
            <Link
              href={fileUrl.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white underline transition-colors hover:text-gray-100"
            >
              View File →
            </Link>
          )}

          {!fileUrl && !isLoadingFile && !fileError && answer.fileUrl && (
            <Link
              href={answer.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white underline transition-colors hover:text-gray-100"
            >
              View File →
            </Link>
          )}
        </div>
      );
    }

    // Handle join/verification status
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

    // Handle complex objects by showing a generic message
    return (
      <div className="flex items-center gap-2">
        <CheckCircleIcon size={16} className="text-green-400" />
        <span className="text-white">Data submitted</span>
      </div>
    );
  }

  // Fallback for any other type
  return (
    <div className="flex items-center gap-2">
      <CheckCircleIcon size={16} className="text-green-400" />
      <span className="text-white">Submitted</span>
    </div>
  );
};

export default FormattedSubmissionAnswer;
