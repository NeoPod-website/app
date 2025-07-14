// import React from "react";
// import Link from "next/link";
// import { ExternalLinkIcon, ListIcon } from "lucide-react";

// const ReviewDetailsSubmissions = ({ submission }) => {
//   console.log(submission);

//   const taskCount =
//     submission.computed?.task_count ||
//     Object.keys(submission.submission_data || {}).length;
//   const submissionTasks = Object.entries(submission.submission_data || {});

//   return (
//     <div className="rounded-xl bg-gradient-dark p-4">
//       <div className="mb-4 flex items-center gap-2">
//         <ListIcon className="h-5 w-5 text-gray-200" />

//         <h3 className="font-semibold text-white">
//           Submission Tasks ({taskCount})
//         </h3>
//       </div>

//       <div className="space-y-3">
//         {submissionTasks.map(([taskId, taskData], index) => (
//           <div
//             key={taskId}
//             className="rounded-lg border border-gray-600 bg-gradient-dark p-3"
//           >
//             <div className="mb-2 flex items-center justify-between">
//               <span className="text-sm font-medium text-gray-200">
//                 Task {index + 1}
//               </span>

//               <span className="text-xs text-gray-200">{taskId}</span>
//             </div>

//             <div className="space-y-2">
//               {typeof taskData === "string" ? (
//                 taskData.startsWith("http") ? (
//                   <Link
//                     href={taskData}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
//                   >
//                     <ExternalLinkIcon className="h-4 w-4" />
//                     {taskData}
//                   </Link>
//                 ) : (
//                   <p className="text-gray-200">{taskData}</p>
//                 )
//               ) : (
//                 <div className="text-gray-200">
//                   <pre className="whitespace-pre-wrap text-sm">
//                     {JSON.stringify(taskData, null, 2)}
//                   </pre>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReviewDetailsSubmissions;

// import React from "react";
// import Link from "next/link";
// import {
//   ExternalLinkIcon,
//   ListIcon,
//   LinkIcon,
//   FileTextIcon,
//   ImageIcon,
//   UsersIcon,
//   FileUpIcon,
//   LetterTextIcon,
//   ArrowUp01Icon,
//   CheckCircleIcon,
//   XCircleIcon,
//   AlertCircleIcon
// } from "lucide-react";

// import XIcon from "@/components/ui/socialIcons/XIcon";
// import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
// import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

// // Task type configuration
// const getTaskConfig = (taskType) => {
//   const configs = {
//     x: {
//       icon: XIcon,
//       label: "X (Twitter)",
//       color: "text-blue-400"
//     },
//     url: {
//       icon: LinkIcon,
//       label: "URL",
//       color: "text-green-400"
//     },
//     nft: {
//       icon: ImageIcon,
//       label: "NFT",
//       color: "text-purple-400"
//     },
//     invite: {
//       icon: UsersIcon,
//       label: "Invite Friends",
//       color: "text-orange-400"
//     },
//     token: {
//       icon: FileTextIcon,
//       label: "Token",
//       color: "text-yellow-400"
//     },
//     discord: {
//       icon: DiscordIcon,
//       label: "Discord",
//       color: "text-indigo-400"
//     },
//     text: {
//       icon: LetterTextIcon,
//       label: "Text",
//       color: "text-gray-400"
//     },
//     number: {
//       icon: ArrowUp01Icon,
//       label: "Number",
//       color: "text-cyan-400"
//     },
//     telegram: {
//       icon: TelegramIcon,
//       label: "Telegram",
//       color: "text-blue-400"
//     },
//     "file-upload": {
//       icon: FileUpIcon,
//       label: "File Upload",
//       color: "text-green-400"
//     },
//     link: {
//       icon: ExternalLinkIcon,
//       label: "Visit Link",
//       color: "text-blue-400"
//     },
//   };

//   return configs[taskType] || {
//     icon: FileTextIcon,
//     label: "Task",
//     color: "text-gray-400"
//   };
// };

// // Enhanced task answer renderer based on task type
// const TaskAnswerRenderer = ({ task, answer, taskId }) => {
//   const taskConfig = getTaskConfig(task?.name || task?.type);
//   const IconComponent = taskConfig.icon;

//   // Handle different answer formats based on task type
//   const renderAnswer = () => {
//     if (!answer) {
//       return <span className="text-gray-400 italic">No answer provided</span>;
//     }

//     // Handle string answers (simple cases)
//     if (typeof answer === "string") {
//       // URL/Link answers
//       if (answer.startsWith("http")) {
//         return (
//           <Link
//             href={answer}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 text-blue-400 hover:text-blue-300 break-all"
//           >
//             <ExternalLinkIcon className="h-4 w-4 flex-shrink-0" />
//             {answer}
//           </Link>
//         );
//       }

//       // Regular text answers
//       return <p className="text-gray-200 break-words">{answer}</p>;
//     }

//     // Handle object answers (complex cases)
//     if (typeof answer === "object") {
//       switch (task?.name || task?.type) {
//         case "x":
//           return renderXAnswer(answer);
//         case "discord":
//           return renderDiscordAnswer(answer);
//         case "telegram":
//           return renderTelegramAnswer(answer);
//         case "nft":
//           return renderNftAnswer(answer);
//         case "invite":
//           return renderInviteAnswer(answer);
//         case "file-upload":
//           return renderFileUploadAnswer(answer);
//         case "token":
//           return renderTokenAnswer(answer);
//         default:
//           return renderGenericObjectAnswer(answer);
//       }
//     }

//     // Handle other types (numbers, booleans, etc.)
//     return <p className="text-gray-200">{String(answer)}</p>;
//   };

//   return (
//     <div className="rounded-lg border border-gray-600 bg-gradient-dark p-4">
//       <div className="mb-3 flex items-center gap-3">
//         <div className={`flex items-center justify-center rounded-full bg-gray-700 p-2`}>
//           <IconComponent size={16} className={`h-4 w-4 ${taskConfig.color}`} />
//         </div>

//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <span className="font-medium text-white">
//               {task?.instruction || task?.title || taskConfig.label}
//             </span>
//             <span className="text-xs text-gray-400">#{taskId}</span>
//           </div>

//           {task?.description && (
//             <p className="text-sm text-gray-300 mt-1">{task.description}</p>
//           )}
//         </div>
//       </div>

//       <div className="border-l-2 border-gray-600 pl-4 ml-6">
//         <div className="space-y-2">
//           <p className="text-sm font-medium text-gray-300">Answer:</p>
//           <div className="bg-gray-800/50 rounded-lg p-3">
//             {renderAnswer()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Specific renderers for different task types
// const renderXAnswer = (answer) => {
//   if (answer.tweet_url) {
//     return (
//       <div className="space-y-2">
//         <Link
//           href={answer.tweet_url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
//         >
//           <ExternalLinkIcon className="h-4 w-4" />
//           View Tweet
//         </Link>
//         {answer.tweet_text && (
//           <p className="text-gray-200 mt-2 p-2 bg-gray-700/50 rounded italic">
//             "{answer.tweet_text}"
//           </p>
//         )}
//         {answer.username && (
//           <p className="text-gray-300 text-sm">@{answer.username}</p>
//         )}
//       </div>
//     );
//   }

//   return renderGenericObjectAnswer(answer);
// };

// const renderDiscordAnswer = (answer) => {
//   if (answer.discord_username) {
//     return (
//       <div className="space-y-2">
//         <div className="flex items-center gap-2">
//           <DiscordIcon className="h-4 w-4 text-indigo-400" />
//           <span className="text-gray-200">{answer.discord_username}</span>
//         </div>
//         {answer.server_name && (
//           <p className="text-gray-300 text-sm">Server: {answer.server_name}</p>
//         )}
//         {answer.verification_screenshot && (
//           <Link
//             href={answer.verification_screenshot}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-400 hover:text-blue-300 text-sm"
//           >
//             View Screenshot
//           </Link>
//         )}
//       </div>
//     );
//   }

//   return renderGenericObjectAnswer(answer);
// };

// const renderTelegramAnswer = (answer) => {
//   if (answer.telegram_username) {
//     return (
//       <div className="space-y-2">
//         <div className="flex items-center gap-2">
//           <TelegramIcon className="h-4 w-4 text-blue-400" />
//           <span className="text-gray-200">@{answer.telegram_username}</span>
//         </div>
//         {answer.group_name && (
//           <p className="text-gray-300 text-sm">Group: {answer.group_name}</p>
//         )}
//       </div>
//     );
//   }

//   return renderGenericObjectAnswer(answer);
// };

// const renderNftAnswer = (answer) => {
//   if (answer.contract_address || answer.token_id) {
//     return (
//       <div className="space-y-2">
//         {answer.contract_address && (
//           <div>
//             <span className="text-gray-300 text-sm">Contract:</span>
//             <p className="text-gray-200 font-mono text-sm break-all">
//               {answer.contract_address}
//             </p>
//           </div>
//         )}
//         {answer.token_id && (
//           <div>
//             <span className="text-gray-300 text-sm">Token ID:</span>
//             <p className="text-gray-200">{answer.token_id}</p>
//           </div>
//         )}
//         {answer.proof_url && (
//           <Link
//             href={answer.proof_url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-400 hover:text-blue-300 text-sm"
//           >
//             View Proof
//           </Link>
//         )}
//       </div>
//     );
//   }

//   return renderGenericObjectAnswer(answer);
// };

// const renderInviteAnswer = (answer) => {
//   if (answer.invited_users || answer.invite_count) {
//     return (
//       <div className="space-y-2">
//         {answer.invite_count && (
//           <div className="flex items-center gap-2">
//             <UsersIcon className="h-4 w-4 text-orange-400" />
//             <span className="text-gray-200">
//               {answer.invite_count} users invited
//             </span>
//           </div>
//         )}
//         {answer.invited_users && Array.isArray(answer.invited_users) && (
//           <div>
//             <span className="text-gray-300 text-sm">Invited users:</span>
//             <ul className="text-gray-200 text-sm mt-1">
//               {answer.invited_users.map((user, index) => (
//                 <li key={index} className="ml-2">• {user}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return renderGenericObjectAnswer(answer);
// };

// const renderFileUploadAnswer = (answer) => {
//   if (answer.file_url || answer.files) {
//     return (
//       <div className="space-y-2">
//         {answer.file_url && (
//           <Link
//             href={answer.file_url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
//           >
//             <FileUpIcon className="h-4 w-4" />
//             View File
//           </Link>
//         )}
//         {answer.files && Array.isArray(answer.files) && (
//           <div>
//             <span className="text-gray-300 text-sm">Files:</span>
//             <ul className="text-gray-200 text-sm mt-1">
//               {answer.files.map((file, index) => (
//                 <li key={index} className="ml-2">
//                   <Link
//                     href={file.url || file}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-400 hover:text-blue-300"
//                   >
//                     {file.name || `File ${index + 1}`}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         {answer.file_name && (
//           <p className="text-gray-300 text-sm">Filename: {answer.file_name}</p>
//         )}
//       </div>
//     );
//   }

//   return renderGenericObjectAnswer(answer);
// };

// const renderTokenAnswer = (answer) => {
//   if (answer.wallet_address || answer.transaction_hash) {
//     return (
//       <div className="space-y-2">
//         {answer.wallet_address && (
//           <div>
//             <span className="text-gray-300 text-sm">Wallet:</span>
//             <p className="text-gray-200 font-mono text-sm break-all">
//               {answer.wallet_address}
//             </p>
//           </div>
//         )}
//         {answer.transaction_hash && (
//           <div>
//             <span className="text-gray-300 text-sm">Transaction:</span>
//             <p className="text-gray-200 font-mono text-sm break-all">
//               {answer.transaction_hash}
//             </p>
//           </div>
//         )}
//         {answer.amount && (
//           <div>
//             <span className="text-gray-300 text-sm">Amount:</span>
//             <p className="text-gray-200">{answer.amount}</p>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return renderGenericObjectAnswer(answer);
// };

// const renderGenericObjectAnswer = (answer) => {
//   // For objects we don't have specific renderers for, show key-value pairs nicely
//   const entries = Object.entries(answer);

//   if (entries.length === 0) {
//     return <span className="text-gray-400 italic">Empty response</span>;
//   }

//   return (
//     <div className="space-y-2">
//       {entries.map(([key, value]) => (
//         <div key={key} className="flex flex-col">
//           <span className="text-gray-300 text-sm capitalize">
//             {key.replace(/_/g, ' ')}:
//           </span>
//           <span className="text-gray-200 ml-2 break-words">
//             {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Updated ReviewDetailsSubmissions component
// const ReviewDetailsSubmissions = ({ submission }) => {
//   const taskCount = submission.computed?.task_count ||
//     Object.keys(submission.submission_data || {}).length;
//   const submissionTasks = Object.entries(submission.submission_data || {});

//   // Get quest tasks to match with submission data
//   const questTasks = submission.quest_tasks || [];
//   const getTaskByIdFromQuest = (taskId) => {
//     return questTasks.find(task => task.id === taskId);
//   };

//   return (
//     <div className="rounded-xl bg-gradient-dark p-4">
//       <div className="mb-4 flex items-center gap-2">
//         <ListIcon className="h-5 w-5 text-gray-200" />
//         <h3 className="font-semibold text-white">
//           Submission Tasks ({taskCount})
//         </h3>
//       </div>

//       <div className="space-y-4">
//         {submissionTasks.map(([taskId, taskData]) => {
//           const questTask = getTaskByIdFromQuest(taskId);

//           return (
//             <TaskAnswerRenderer
//               key={taskId}
//               task={questTask}
//               answer={taskData}
//               taskId={taskId}
//             />
//           );
//         })}

//         {submissionTasks.length === 0 && (
//           <div className="text-center py-8 text-gray-400">
//             <AlertCircleIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
//             <p>No submission data found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewDetailsSubmissions;

// import React from "react";
// import Link from "next/link";
// import {
//   ExternalLinkIcon,
//   ListIcon,
//   LinkIcon,
//   FileTextIcon,
//   ImageIcon,
//   UsersIcon,
//   FileUpIcon,
//   LetterTextIcon,
//   ArrowUp01Icon,
//   CheckCircleIcon,
//   XCircleIcon,
//   AlertCircleIcon,
//   HeartIcon,
//   RepeatIcon,
//   MessageCircleIcon,
//   EyeIcon,
//   CalendarIcon,
//   DownloadIcon,
// } from "lucide-react";

// import XIcon from "@/components/ui/socialIcons/XIcon";
// import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
// import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

// // Task type configuration
// const getTaskConfig = (taskType, subType = null) => {
//   const configs = {
//     x: {
//       icon: XIcon,
//       label: "X (Twitter)",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     url: {
//       icon: LinkIcon,
//       label: "URL Visit",
//       color: "text-green-400",
//       bgColor: "bg-green-500/20",
//     },
//     discord: {
//       icon: DiscordIcon,
//       label: "Discord",
//       color: "text-indigo-400",
//       bgColor: "bg-indigo-500/20",
//     },
//     telegram: {
//       icon: TelegramIcon,
//       label: "Telegram",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     text: {
//       icon: LetterTextIcon,
//       label: "Text Response",
//       color: "text-gray-400",
//       bgColor: "bg-gray-500/20",
//     },
//     number: {
//       icon: ArrowUp01Icon,
//       label: "Number",
//       color: "text-cyan-400",
//       bgColor: "bg-cyan-500/20",
//     },
//     "file-upload": {
//       icon: FileUpIcon,
//       label: "File Upload",
//       color: "text-green-400",
//       bgColor: "bg-green-500/20",
//     },
//   };

//   // Handle X subtypes
//   if (taskType === "x") {
//     switch (subType) {
//       case "spaces":
//         return {
//           ...configs.x,
//           label: "X Spaces",
//           icon: () => (
//             <div className="relative">
//               <XIcon size={16} />
//               <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-purple-500"></div>
//             </div>
//           ),
//         };
//       case "follow":
//         return { ...configs.x, label: "X Follow" };
//       case "tweet":
//         return { ...configs.x, label: "X Tweet Engagement" };
//       default:
//         return configs.x;
//     }
//   }

//   return (
//     configs[taskType] || {
//       icon: FileTextIcon,
//       label: "Task",
//       color: "text-gray-400",
//       bgColor: "bg-gray-500/20",
//     }
//   );
// };

// // Status badge component
// const StatusBadge = ({ verified, className = "" }) => {
//   if (verified) {
//     return (
//       <div
//         className={`flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 ${className}`}
//       >
//         <CheckCircleIcon size={12} />
//         Verified
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400 ${className}`}
//     >
//       <AlertCircleIcon size={12} />
//       Pending
//     </div>
//   );
// };

// // Enhanced task answer renderer
// const TaskAnswerRenderer = ({ task, answer, taskId }) => {
//   const taskConfig = getTaskConfig(task?.name, task?.twitterTaskType);
//   const IconComponent = taskConfig.icon;

//   // Render verification status
//   const renderVerificationStatus = () => {
//     if (typeof answer === "object" && answer?.verified !== undefined) {
//       return <StatusBadge verified={answer.verified} className="ml-auto" />;
//     }
//     return null;
//   };

//   // Main answer content renderer
//   const renderAnswerContent = () => {
//     if (!answer) {
//       return (
//         <div className="flex items-center gap-2 text-gray-400">
//           <XCircleIcon size={16} />
//           <span className="italic">No answer provided</span>
//         </div>
//       );
//     }

//     // Handle string answers
//     if (typeof answer === "string") {
//       if (answer.startsWith("http")) {
//         return (
//           <Link
//             href={answer}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//           >
//             <ExternalLinkIcon size={16} />
//             <span className="break-all">Visit Link</span>
//           </Link>
//         );
//       }

//       return (
//         <div className="text-gray-200">
//           <span className="break-words">{answer}</span>
//         </div>
//       );
//     }

//     // Handle object answers based on task type
//     if (typeof answer === "object") {
//       switch (task?.name) {
//         case "x":
//           return renderXTaskAnswer(answer, task?.twitterTaskType);
//         case "discord":
//           return renderDiscordAnswer(answer);
//         case "telegram":
//           return renderTelegramAnswer(answer);
//         case "file-upload":
//           return renderFileUploadAnswer(answer);
//         default:
//           return renderGenericAnswer(answer);
//       }
//     }

//     return <span className="text-gray-200">{String(answer)}</span>;
//   };

//   return (
//     <div className="rounded-lg border border-gray-600 bg-gradient-dark p-4 transition-colors hover:border-gray-500">
//       {/* Header */}
//       <div className="mb-3 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className={`flex items-center justify-center rounded-lg p-2.5 ${taskConfig.bgColor}`}
//           >
//             <IconComponent size={18} className={`${taskConfig.color}`} />
//           </div>

//           <div>
//             <h4 className="font-medium text-white">
//               {task?.instruction || taskConfig.label}
//             </h4>
//             <p className="text-sm text-gray-400">
//               {taskConfig.label} • #{taskId.slice(-8)}
//             </p>
//           </div>
//         </div>

//         {renderVerificationStatus()}
//       </div>

//       {/* Description */}
//       {task?.description && (
//         <p className="mb-3 pl-12 text-sm text-gray-300">{task.description}</p>
//       )}

//       {/* Answer Content */}
//       <div className="pl-12">
//         <div className="rounded-lg border-l-2 border-gray-600 bg-gray-800/50 p-3">
//           {renderAnswerContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// // X Task specific renderer
// const renderXTaskAnswer = (answer, taskType) => {
//   switch (taskType) {
//     case "spaces":
//       return renderSpacesAnswer(answer);
//     case "follow":
//       return renderFollowAnswer(answer);
//     case "tweet":
//       return renderTweetAnswer(answer);
//     default:
//       return renderGenericXAnswer(answer);
//   }
// };

// const renderSpacesAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       {/* Space URL */}
//       {answer.spaceUrl && (
//         <Link
//           href={answer.spaceUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//         >
//           <ExternalLinkIcon size={16} />
//           <span>Listen to Space</span>
//         </Link>
//       )}

//       {/* Proof of Attendance */}
//       {answer.fileUrl && (
//         <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//           <ImageIcon size={20} className="text-purple-400" />
//           <div className="flex-1">
//             <p className="font-medium text-white">Screenshot Proof</p>
//             <p className="text-sm text-gray-300">
//               {answer.fileName || "Attendance proof"}
//             </p>
//           </div>
//           <Link
//             href={answer.fileUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 rounded px-3 py-1 text-sm text-white transition-colors"
//           >
//             <EyeIcon size={14} />
//             View
//           </Link>
//         </div>
//       )}

//       {/* Verification Details */}
//       <div className="space-y-1 text-xs text-gray-400">
//         {answer.verifiedAt && (
//           <div className="flex items-center gap-2">
//             <CalendarIcon size={12} />
//             <span>
//               Verified: {new Date(answer.verifiedAt).toLocaleString()}
//             </span>
//           </div>
//         )}
//         {answer.method && <div>Method: {answer.method.replace(/_/g, " ")}</div>}
//       </div>
//     </div>
//   );
// };

// const renderFollowAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//         <UsersIcon size={20} className="text-blue-400" />
//         <div className="flex-1">
//           <p className="font-medium text-white">Following Confirmed</p>
//           {answer.username && (
//             <p className="text-sm text-gray-300">@{answer.username}</p>
//           )}
//         </div>
//       </div>

//       {answer.verifiedAt && (
//         <div className="flex items-center gap-2 text-xs text-gray-400">
//           <CalendarIcon size={12} />
//           <span>Verified: {new Date(answer.verifiedAt).toLocaleString()}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderTweetAnswer = (answer) => {
//   const completionSummary = answer.completionSummary;
//   const verificationResults = answer.verificationResults;

//   return (
//     <div className="space-y-3">
//       {/* Tweet Link */}
//       {answer.replyUrl && (
//         <Link
//           href={answer.replyUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//         >
//           <ExternalLinkIcon size={16} />
//           <span>View Tweet</span>
//         </Link>
//       )}

//       {/* Engagement Summary */}
//       {completionSummary && (
//         <div className="rounded-lg bg-gray-700/50 p-3">
//           <div className="mb-2 flex items-center justify-between">
//             <span className="font-medium text-white">Engagement Status</span>
//             <span className="text-sm text-gray-300">
//               {completionSummary.completionRate}% complete
//             </span>
//           </div>

//           <div className="grid grid-cols-3 gap-2">
//             {/* Like */}
//             <div
//               className={`flex items-center gap-2 rounded p-2 ${
//                 verificationResults?.liked
//                   ? "bg-green-500/20 text-green-400"
//                   : "bg-red-500/20 text-red-400"
//               }`}
//             >
//               <HeartIcon size={14} />
//               <span className="text-xs">Like</span>
//               {verificationResults?.liked && <CheckCircleIcon size={12} />}
//             </div>

//             {/* Retweet */}
//             <div
//               className={`flex items-center gap-2 rounded p-2 ${
//                 verificationResults?.retweeted
//                   ? "bg-green-500/20 text-green-400"
//                   : "bg-red-500/20 text-red-400"
//               }`}
//             >
//               <RepeatIcon size={14} />
//               <span className="text-xs">Retweet</span>
//               {verificationResults?.retweeted && <CheckCircleIcon size={12} />}
//             </div>

//             {/* Reply */}
//             <div
//               className={`flex items-center gap-2 rounded p-2 ${
//                 verificationResults?.replied
//                   ? "bg-green-500/20 text-green-400"
//                   : "bg-red-500/20 text-red-400"
//               }`}
//             >
//               <MessageCircleIcon size={14} />
//               <span className="text-xs">Reply</span>
//               {verificationResults?.replied && <CheckCircleIcon size={12} />}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Verification Details */}
//       {answer.verifiedAt && (
//         <div className="flex items-center gap-2 text-xs text-gray-400">
//           <CalendarIcon size={12} />
//           <span>Verified: {new Date(answer.verifiedAt).toLocaleString()}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderGenericXAnswer = (answer) => {
//   return (
//     <div className="space-y-2">
//       {answer.url && (
//         <Link
//           href={answer.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//         >
//           <ExternalLinkIcon size={16} />
//           <span>View Content</span>
//         </Link>
//       )}

//       {answer.verifiedAt && (
//         <div className="text-xs text-gray-400">
//           Verified: {new Date(answer.verifiedAt).toLocaleString()}
//         </div>
//       )}
//     </div>
//   );
// };

// const renderDiscordAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//         <DiscordIcon size={20} className="text-indigo-400" />
//         <div className="flex-1">
//           <p className="font-medium text-white">Discord Connected</p>
//           {answer.discord_username && (
//             <p className="text-sm text-gray-300">{answer.discord_username}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const renderTelegramAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//         <TelegramIcon size={20} className="text-blue-400" />
//         <div className="flex-1">
//           <p className="font-medium text-white">Telegram Connected</p>
//           {answer.telegram_username && (
//             <p className="text-sm text-gray-300">@{answer.telegram_username}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const renderFileUploadAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       {answer.fileUrl && (
//         <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//           <FileUpIcon size={20} className="text-green-400" />
//           <div className="flex-1">
//             <p className="font-medium text-white">
//               {answer.fileName || "Uploaded File"}
//             </p>
//             {answer.fileSize && (
//               <p className="text-sm text-gray-300">
//                 {(answer.fileSize / 1024).toFixed(1)} KB • {answer.fileType}
//               </p>
//             )}
//           </div>
//           <Link
//             href={answer.fileUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
//           >
//             <DownloadIcon size={14} />
//             View
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderGenericAnswer = (answer) => {
//   // Show only the most important fields for unknown task types
//   const importantFields = ["url", "username", "value", "result", "status"];
//   const relevantData = Object.entries(answer)
//     .filter(([key]) => importantFields.includes(key) || key.includes("url"))
//     .slice(0, 3); // Limit to 3 most relevant fields

//   if (relevantData.length === 0) {
//     return <span className="italic text-gray-400">Response received</span>;
//   }

//   return (
//     <div className="space-y-2">
//       {relevantData.map(([key, value]) => (
//         <div key={key} className="flex items-center justify-between">
//           <span className="text-sm capitalize text-gray-300">
//             {key.replace(/_/g, " ")}:
//           </span>
//           <span className="text-sm font-medium text-gray-200">
//             {String(value).length > 50
//               ? String(value).substring(0, 50) + "..."
//               : String(value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Updated ReviewDetailsSubmissions component
// const ReviewDetailsSubmissions = ({ submission }) => {
//   const taskCount =
//     submission.computed?.task_count ||
//     Object.keys(submission.submission_data || {}).length;
//   const submissionTasks = Object.entries(submission.submission_data || {});

//   // Get quest tasks from the quest_data
//   const questTasks = submission.quest_data?.tasks || [];
//   const getTaskById = (taskId) => {
//     return questTasks.find((task) => task.id === taskId);
//   };

//   return (
//     <div className="rounded-xl bg-gradient-dark p-4">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <ListIcon className="h-5 w-5 text-gray-200" />
//           <h3 className="font-semibold text-white">
//             Submission Tasks ({taskCount})
//           </h3>
//         </div>

//         {/* Overall completion status */}
//         <StatusBadge verified={submission.review_status !== "pending"} />
//       </div>

//       <div className="space-y-4">
//         {submissionTasks.map(([taskId, taskData]) => {
//           const questTask = getTaskById(taskId);

//           return (
//             <TaskAnswerRenderer
//               key={taskId}
//               task={questTask}
//               answer={taskData}
//               taskId={taskId}
//             />
//           );
//         })}

//         {submissionTasks.length === 0 && (
//           <div className="py-8 text-center text-gray-400">
//             <AlertCircleIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
//             <p>No submission data found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewDetailsSubmissions;

// import React from "react";
// import Link from "next/link";
// import {
//   ExternalLinkIcon,
//   ListIcon,
//   LinkIcon,
//   FileTextIcon,
//   ImageIcon,
//   UsersIcon,
//   FileUpIcon,
//   LetterTextIcon,
//   ArrowUp01Icon,
//   CheckCircleIcon,
//   XCircleIcon,
//   AlertCircleIcon,
//   HeartIcon,
//   RepeatIcon,
//   MessageCircleIcon,
//   EyeIcon,
//   CalendarIcon,
//   DownloadIcon,
//   Coins,
//   PlayIcon,
// } from "lucide-react";

// import XIcon from "@/components/ui/socialIcons/XIcon";
// import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
// import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

// // Task type configuration
// const getTaskConfig = (taskType, subType = null) => {
//   const configs = {
//     x: {
//       icon: XIcon,
//       label: "X (Twitter)",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     url: {
//       icon: LinkIcon,
//       label: "URL",
//       color: "text-green-400",
//       bgColor: "bg-green-500/20",
//     },
//     discord: {
//       icon: DiscordIcon,
//       label: "Discord",
//       color: "text-indigo-400",
//       bgColor: "bg-indigo-500/20",
//     },
//     telegram: {
//       icon: TelegramIcon,
//       label: "Telegram",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     text: {
//       icon: LetterTextIcon,
//       label: "Text Response",
//       color: "text-gray-400",
//       bgColor: "bg-gray-500/20",
//     },
//     number: {
//       icon: ArrowUp01Icon,
//       label: "Number",
//       color: "text-cyan-400",
//       bgColor: "bg-cyan-500/20",
//     },
//     "file-upload": {
//       icon: FileUpIcon,
//       label: "File Upload",
//       color: "text-green-400",
//       bgColor: "bg-green-500/20",
//     },
//     link: {
//       icon: ExternalLinkIcon,
//       label: "Visit Link",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     invite: {
//       icon: UsersIcon,
//       label: "Invite Friends",
//       color: "text-orange-400",
//       bgColor: "bg-orange-500/20",
//     },
//     nft: {
//       icon: ImageIcon,
//       label: "NFT Verification",
//       color: "text-purple-400",
//       bgColor: "bg-purple-500/20",
//     },
//     token: {
//       icon: Coins,
//       label: "Token Verification",
//       color: "text-yellow-400",
//       bgColor: "bg-yellow-500/20",
//     },
//   };

//   // Handle X subtypes
//   if (taskType === "x") {
//     switch (subType) {
//       case "spaces":
//         return { ...configs.x, label: "X Spaces" };
//       case "follow":
//         return { ...configs.x, label: "X Follow" };
//       case "react":
//         return { ...configs.x, label: "X Tweet Engagement" };
//       case "tweet":
//         return { ...configs.x, label: "X Tweet" };
//       default:
//         return configs.x;
//     }
//   }

//   return (
//     configs[taskType] || {
//       icon: FileTextIcon,
//       label: "Task",
//       color: "text-gray-400",
//       bgColor: "bg-gray-500/20",
//     }
//   );
// };

// // Status badge component
// const StatusBadge = ({ verified, className = "" }) => {
//   if (verified) {
//     return (
//       <div
//         className={`flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 ${className}`}
//       >
//         <CheckCircleIcon size={12} />
//         Verified
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400 ${className}`}
//     >
//       <AlertCircleIcon size={12} />
//       Pending
//     </div>
//   );
// };

// // Enhanced task answer renderer
// const TaskAnswerRenderer = ({ task, answer, taskId }) => {
//   const taskConfig = getTaskConfig(task?.name, task?.twitterTaskType);
//   const IconComponent = taskConfig.icon;

//   // Render verification status
//   const renderVerificationStatus = () => {
//     // For boolean answers (nft, token, invite, link)
//     if (typeof answer === "boolean") {
//       return <StatusBadge verified={answer} className="ml-auto" />;
//     }

//     // For object answers with verified field
//     if (typeof answer === "object" && answer?.verified !== undefined) {
//       return <StatusBadge verified={answer.verified} className="ml-auto" />;
//     }

//     return null;
//   };

//   // Main answer content renderer
//   const renderAnswerContent = () => {
//     if (!answer) {
//       return (
//         <div className="flex items-center gap-2 text-gray-400">
//           <XCircleIcon size={16} />
//           <span className="italic">No answer provided</span>
//         </div>
//       );
//     }

//     // Handle boolean answers (simple completed tasks)
//     if (typeof answer === "boolean") {
//       return renderBooleanAnswer(answer);
//     }

//     // Handle string answers
//     if (typeof answer === "string") {
//       return renderStringAnswer(answer);
//     }

//     // Handle number answers
//     if (typeof answer === "number") {
//       return (
//         <div className="text-gray-200">
//           <span className="font-mono">{answer}</span>
//         </div>
//       );
//     }

//     // Handle object answers based on task type
//     if (typeof answer === "object") {
//       switch (task?.name) {
//         case "x":
//           return renderXTaskAnswer(answer, task?.twitterTaskType);
//         case "discord":
//           return renderDiscordAnswer(answer);
//         case "telegram":
//           return renderTelegramAnswer(answer);
//         case "file-upload":
//           return renderFileUploadAnswer(answer);
//         default:
//           return renderGenericAnswer(answer);
//       }
//     }

//     return <span className="text-gray-200">{String(answer)}</span>;
//   };

//   return (
//     <div className="rounded-lg border border-gray-600 bg-gradient-dark p-4 transition-colors hover:border-gray-500">
//       {/* Header */}
//       <div className="mb-3 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className={`flex items-center justify-center rounded-lg p-2.5 ${taskConfig.bgColor}`}
//           >
//             <IconComponent size={18} className={`${taskConfig.color}`} />
//           </div>

//           <div>
//             <h4 className="font-medium text-white">
//               {task?.instruction || taskConfig.label}
//             </h4>
//             <p className="text-sm text-gray-400">
//               {taskConfig.label} • #{taskId.slice(-8)}
//             </p>
//           </div>
//         </div>

//         {renderVerificationStatus()}
//       </div>

//       {/* Description */}
//       {task?.description && (
//         <p className="mb-3 pl-12 text-sm text-gray-300">{task.description}</p>
//       )}

//       {/* Answer Content */}
//       <div className="pl-12">
//         <div className="rounded-lg border-l-2 border-gray-600 bg-gray-800/50 p-3">
//           {renderAnswerContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Boolean answer renderer (for nft, token, invite, link tasks)
// const renderBooleanAnswer = (answer) => {
//   if (answer === true) {
//     return (
//       <div className="flex items-center gap-2 text-green-400">
//         <CheckCircleIcon size={16} />
//         <span>Task completed successfully</span>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center gap-2 text-gray-400">
//       <XCircleIcon size={16} />
//       <span>Not completed</span>
//     </div>
//   );
// };

// // String answer renderer
// const renderStringAnswer = (answer) => {
//   // URL/Link answers
//   if (answer.startsWith("http")) {
//     return (
//       <Link
//         href={answer}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center gap-2 break-all text-blue-400 transition-colors hover:text-blue-300"
//       >
//         <ExternalLinkIcon size={16} />
//         <span>{answer}</span>
//       </Link>
//     );
//   }

//   // Regular text answers
//   return <p className="break-words text-gray-200">{answer}</p>;
// };

// // X Task specific renderer
// const renderXTaskAnswer = (answer, taskType) => {
//   switch (taskType) {
//     case "spaces":
//       return renderSpacesAnswer(answer);
//     case "follow":
//       return renderFollowAnswer(answer);
//     case "react":
//       return renderTweetReactAnswer(answer);
//     case "tweet":
//       return renderTweetAnswer(answer);
//     default:
//       return renderGenericXAnswer(answer);
//   }
// };

// const renderSpacesAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       {/* Space URL */}
//       {answer.spaceUrl && (
//         <Link
//           href={answer.spaceUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//         >
//           <ExternalLinkIcon size={16} />
//           <span>Listen to Space</span>
//         </Link>
//       )}

//       {/* Screenshot Proof */}
//       {answer.fileUrl && (
//         <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//           <ImageIcon size={20} className="text-purple-400" />
//           <div className="flex-1">
//             <p className="font-medium text-white">Screenshot Proof</p>
//             <p className="text-sm text-gray-300">
//               {answer.fileName || "Attendance proof"}
//             </p>
//           </div>
//           <Link
//             href={answer.fileUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 rounded px-3 py-1 text-sm text-white transition-colors"
//           >
//             <EyeIcon size={14} />
//             View
//           </Link>
//         </div>
//       )}

//       {/* Verification Details */}
//       <div className="space-y-1 text-xs text-gray-400">
//         {answer.verifiedAt && (
//           <div className="flex items-center gap-2">
//             <CalendarIcon size={12} />
//             <span>
//               Verified: {new Date(answer.verifiedAt).toLocaleString()}
//             </span>
//           </div>
//         )}
//         {answer.method && <div>Method: {answer.method.replace(/_/g, " ")}</div>}
//       </div>
//     </div>
//   );
// };

// const renderFollowAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//         <UsersIcon size={20} className="text-blue-400" />
//         <div className="flex-1">
//           <p className="font-medium text-white">Following Confirmed</p>
//           {answer.username && (
//             <p className="text-sm text-gray-300">@{answer.username}</p>
//           )}
//         </div>
//       </div>

//       {answer.verifiedAt && (
//         <div className="flex items-center gap-2 text-xs text-gray-400">
//           <CalendarIcon size={12} />
//           <span>Verified: {new Date(answer.verifiedAt).toLocaleString()}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderTweetReactAnswer = (answer) => {
//   const completionSummary = answer.completionSummary;
//   const verificationResults = answer.verificationResults;

//   return (
//     <div className="space-y-3">
//       {/* Tweet Link */}
//       {answer.replyUrl && (
//         <Link
//           href={answer.replyUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//         >
//           <ExternalLinkIcon size={16} />
//           <span>View Tweet/Reply</span>
//         </Link>
//       )}

//       {/* Engagement Summary */}
//       {completionSummary && (
//         <div className="rounded-lg bg-gray-700/50 p-3">
//           <div className="mb-2 flex items-center justify-between">
//             <span className="font-medium text-white">Engagement Status</span>
//             <span className="text-sm text-gray-300">
//               {completionSummary.completionRate}% complete
//             </span>
//           </div>

//           <div className="grid grid-cols-3 gap-2">
//             {/* Like */}
//             <div
//               className={`flex items-center gap-2 rounded p-2 ${
//                 verificationResults?.liked
//                   ? "bg-green-500/20 text-green-400"
//                   : "bg-red-500/20 text-red-400"
//               }`}
//             >
//               <HeartIcon size={14} />
//               <span className="text-xs">Like</span>
//               {verificationResults?.liked && <CheckCircleIcon size={12} />}
//             </div>

//             {/* Retweet */}
//             <div
//               className={`flex items-center gap-2 rounded p-2 ${
//                 verificationResults?.retweeted
//                   ? "bg-green-500/20 text-green-400"
//                   : "bg-red-500/20 text-red-400"
//               }`}
//             >
//               <RepeatIcon size={14} />
//               <span className="text-xs">Retweet</span>
//               {verificationResults?.retweeted && <CheckCircleIcon size={12} />}
//             </div>

//             {/* Reply */}
//             <div
//               className={`flex items-center gap-2 rounded p-2 ${
//                 verificationResults?.replied
//                   ? "bg-green-500/20 text-green-400"
//                   : "bg-red-500/20 text-red-400"
//               }`}
//             >
//               <MessageCircleIcon size={14} />
//               <span className="text-xs">Reply</span>
//               {verificationResults?.replied && <CheckCircleIcon size={12} />}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Verification Details */}
//       {answer.verifiedAt && (
//         <div className="flex items-center gap-2 text-xs text-gray-400">
//           <CalendarIcon size={12} />
//           <span>Verified: {new Date(answer.verifiedAt).toLocaleString()}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderTweetAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       {/* Tweet URL */}
//       {answer.tweetUrl && (
//         <Link
//           href={answer.tweetUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//         >
//           <ExternalLinkIcon size={16} />
//           <span>View Tweet</span>
//         </Link>
//       )}

//       {/* Verification Data */}
//       {answer.verificationData && (
//         <div className="rounded-lg bg-gray-700/50 p-3">
//           <p className="mb-2 font-medium text-white">Tweet Verified</p>
//           <div className="space-y-1 text-xs text-gray-300">
//             {answer.verificationData.username && (
//               <p>✓ Author: @{answer.verificationData.username}</p>
//             )}
//             {answer.verificationData.createdAt && (
//               <p>
//                 ✓ Posted:{" "}
//                 {new Date(answer.verificationData.createdAt).toLocaleString()}
//               </p>
//             )}
//             {answer.verificationData.requirementsMet?.containsRequiredText && (
//               <p>✓ Contains required text</p>
//             )}
//           </div>
//         </div>
//       )}

//       {answer.verifiedAt && (
//         <div className="flex items-center gap-2 text-xs text-gray-400">
//           <CalendarIcon size={12} />
//           <span>Verified: {new Date(answer.verifiedAt).toLocaleString()}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderGenericXAnswer = (answer) => {
//   return (
//     <div className="space-y-2">
//       {answer.url && (
//         <Link
//           href={answer.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
//         >
//           <ExternalLinkIcon size={16} />
//           <span>View Content</span>
//         </Link>
//       )}

//       {answer.verifiedAt && (
//         <div className="text-xs text-gray-400">
//           Verified: {new Date(answer.verifiedAt).toLocaleString()}
//         </div>
//       )}
//     </div>
//   );
// };

// const renderDiscordAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//         <DiscordIcon size={20} className="text-indigo-400" />
//         <div className="flex-1">
//           <p className="font-medium text-white">Discord Server Joined</p>
//           {answer.serverName && (
//             <p className="text-sm text-gray-300">{answer.serverName}</p>
//           )}
//         </div>
//       </div>

//       <div className="space-y-1 text-xs text-gray-400">
//         {answer.joinedAt && (
//           <div className="flex items-center gap-2">
//             <CalendarIcon size={12} />
//             <span>Joined: {new Date(answer.joinedAt).toLocaleString()}</span>
//           </div>
//         )}
//         {answer.verifiedAt && (
//           <div className="flex items-center gap-2">
//             <CheckCircleIcon size={12} />
//             <span>
//               Verified: {new Date(answer.verifiedAt).toLocaleString()}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const renderTelegramAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//         <TelegramIcon size={20} className="text-blue-400" />
//         <div className="flex-1">
//           <p className="font-medium text-white">
//             Telegram {answer.groupType === "supergroup" ? "Group" : "Channel"}{" "}
//             Joined
//           </p>
//           {answer.groupName && (
//             <p className="text-sm text-gray-300">{answer.groupName}</p>
//           )}
//         </div>
//       </div>

//       <div className="space-y-1 text-xs text-gray-400">
//         {answer.joinedAt && (
//           <div className="flex items-center gap-2">
//             <CalendarIcon size={12} />
//             <span>Joined: {new Date(answer.joinedAt).toLocaleString()}</span>
//           </div>
//         )}
//         {answer.verifiedAt && (
//           <div className="flex items-center gap-2">
//             <CheckCircleIcon size={12} />
//             <span>
//               Verified: {new Date(answer.verifiedAt).toLocaleString()}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const renderFileUploadAnswer = (answer) => {
//   return (
//     <div className="space-y-3">
//       {answer.fileUrl && (
//         <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
//           <FileUpIcon size={20} className="text-green-400" />
//           <div className="flex-1">
//             <p className="font-medium text-white">
//               {answer.fileName || "Uploaded File"}
//             </p>
//             {answer.fileSize && (
//               <p className="text-sm text-gray-300">
//                 {(answer.fileSize / 1024).toFixed(1)} KB • {answer.fileType}
//               </p>
//             )}
//           </div>
//           <Link
//             href={answer.fileUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
//           >
//             <DownloadIcon size={14} />
//             View
//           </Link>
//         </div>
//       )}

//       <div className="space-y-1 text-xs text-gray-400">
//         {answer.selectedAt && (
//           <div className="flex items-center gap-2">
//             <CalendarIcon size={12} />
//             <span>
//               Selected: {new Date(answer.selectedAt).toLocaleString()}
//             </span>
//           </div>
//         )}
//         {answer.uploadedAt && (
//           <div className="flex items-center gap-2">
//             <CheckCircleIcon size={12} />
//             <span>
//               Uploaded: {new Date(answer.uploadedAt).toLocaleString()}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const renderGenericAnswer = (answer) => {
//   // Show only the most important fields for unknown task types
//   const importantFields = [
//     "url",
//     "username",
//     "value",
//     "result",
//     "status",
//     "verified",
//     "verifiedAt",
//   ];
//   const relevantData = Object.entries(answer)
//     .filter(([key]) => importantFields.includes(key))
//     .slice(0, 4); // Limit to 4 most relevant fields

//   if (relevantData.length === 0) {
//     return <span className="italic text-gray-400">Response received</span>;
//   }

//   return (
//     <div className="space-y-2">
//       {relevantData.map(([key, value]) => (
//         <div key={key} className="flex items-center justify-between">
//           <span className="text-sm capitalize text-gray-300">
//             {key.replace(/_/g, " ")}:
//           </span>
//           <span className="text-sm font-medium text-gray-200">
//             {key === "verifiedAt" && value
//               ? new Date(value).toLocaleString()
//               : String(value).length > 30
//                 ? String(value).substring(0, 30) + "..."
//                 : String(value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Updated ReviewDetailsSubmissions component
// const ReviewDetailsSubmissions = ({ submission }) => {
//   console.log(submission);
//   const taskCount =
//     submission.computed?.task_count ||
//     Object.keys(submission.submission_data || {}).length;
//   const submissionTasks = Object.entries(submission.submission_data || {});

//   // Get quest tasks from the quest_data
//   const questTasks = submission.quest_data?.tasks || [];
//   const getTaskById = (taskId) => {
//     return questTasks.find((task) => task.id === taskId);
//   };

//   return (
//     <div className="rounded-xl bg-gradient-dark p-4">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <ListIcon className="h-5 w-5 text-gray-200" />
//           <h3 className="font-semibold text-white">
//             Submission Tasks ({taskCount})
//           </h3>
//         </div>

//         {/* Overall completion status */}
//         <StatusBadge verified={submission.review_status !== "pending"} />
//       </div>

//       <div className="space-y-4">
//         {submissionTasks.map(([taskId, taskData]) => {
//           const questTask = getTaskById(taskId);

//           return (
//             <TaskAnswerRenderer
//               key={taskId}
//               task={questTask}
//               answer={taskData}
//               taskId={taskId}
//             />
//           );
//         })}

//         {submissionTasks.length === 0 && (
//           <div className="py-8 text-center text-gray-400">
//             <AlertCircleIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
//             <p>No submission data found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewDetailsSubmissions;

// import React from "react";
// import Link from "next/link";
// import {
//   ExternalLinkIcon,
//   ListIcon,
//   LinkIcon,
//   FileTextIcon,
//   ImageIcon,
//   UsersIcon,
//   FileUpIcon,
//   LetterTextIcon,
//   ArrowUp01Icon,
//   CheckCircleIcon,
//   XCircleIcon,
//   AlertCircleIcon,
//   HeartIcon,
//   RepeatIcon,
//   MessageCircleIcon,
//   EyeIcon,
//   CalendarIcon,
//   DownloadIcon,
//   Coins,
//   PlayIcon,
// } from "lucide-react";

// import XIcon from "@/components/ui/socialIcons/XIcon";
// import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
// import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";
// import FormattedSubmissionAnswer from "../../details/FormatSubmissionAnswer";

// // Task type configuration
// const getTaskConfig = (taskType, subType = null) => {
//   const configs = {
//     x: {
//       icon: XIcon,
//       label: "X (Twitter)",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     url: {
//       icon: LinkIcon,
//       label: "URL",
//       color: "text-green-400",
//       bgColor: "bg-green-500/20",
//     },
//     discord: {
//       icon: DiscordIcon,
//       label: "Discord",
//       color: "text-indigo-400",
//       bgColor: "bg-indigo-500/20",
//     },
//     telegram: {
//       icon: TelegramIcon,
//       label: "Telegram",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     text: {
//       icon: LetterTextIcon,
//       label: "Text Response",
//       color: "text-gray-400",
//       bgColor: "bg-gray-500/20",
//     },
//     number: {
//       icon: ArrowUp01Icon,
//       label: "Number",
//       color: "text-cyan-400",
//       bgColor: "bg-cyan-500/20",
//     },
//     "file-upload": {
//       icon: FileUpIcon,
//       label: "File Upload",
//       color: "text-green-400",
//       bgColor: "bg-green-500/20",
//     },
//     link: {
//       icon: ExternalLinkIcon,
//       label: "Visit Link",
//       color: "text-blue-400",
//       bgColor: "bg-blue-500/20",
//     },
//     invite: {
//       icon: UsersIcon,
//       label: "Invite Friends",
//       color: "text-orange-400",
//       bgColor: "bg-orange-500/20",
//     },
//     nft: {
//       icon: ImageIcon,
//       label: "NFT Verification",
//       color: "text-purple-400",
//       bgColor: "bg-purple-500/20",
//     },
//     token: {
//       icon: Coins,
//       label: "Token Verification",
//       color: "text-yellow-400",
//       bgColor: "bg-yellow-500/20",
//     },
//   };

//   // Handle X subtypes
//   if (taskType === "x") {
//     switch (subType) {
//       case "spaces":
//         return { ...configs.x, label: "X Spaces" };
//       case "follow":
//         return { ...configs.x, label: "X Follow" };
//       case "react":
//         return { ...configs.x, label: "X Tweet Engagement" };
//       case "tweet":
//         return { ...configs.x, label: "X Tweet" };
//       default:
//         return configs.x;
//     }
//   }

//   return (
//     configs[taskType] || {
//       icon: FileTextIcon,
//       label: "Task",
//       color: "text-gray-400",
//       bgColor: "bg-gray-500/20",
//     }
//   );
// };

// // Status badge component
// const StatusBadge = ({ verified, className = "" }) => {
//   if (verified) {
//     return (
//       <div
//         className={`flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 ${className}`}
//       >
//         <CheckCircleIcon size={12} />
//         Verified
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400 ${className}`}
//     >
//       <AlertCircleIcon size={12} />
//       Pending
//     </div>
//   );
// };

// // Enhanced task answer renderer
// const TaskAnswerRenderer = ({ task, answer, taskId }) => {
//   const taskConfig = getTaskConfig(task?.name, task?.twitterTaskType);
//   const IconComponent = taskConfig.icon;

//   // Render verification status
//   const renderVerificationStatus = () => {
//     // For boolean answers (nft, token, invite, link)
//     if (typeof answer === "boolean") {
//       return <StatusBadge verified={answer} className="ml-auto" />;
//     }

//     // For object answers with verified field
//     if (typeof answer === "object" && answer?.verified !== undefined) {
//       return <StatusBadge verified={answer.verified} className="ml-auto" />;
//     }

//     return null;
//   };

//   // Check if we should show detailed submission info
//   const shouldShowDetailedSubmission = () => {
//     // Don't show details for simple boolean tasks (nft, token, invite, link)
//     if (typeof answer === "boolean") return false;

//     // Don't show details for simple text/number/url
//     if (typeof answer === "string" || typeof answer === "number") return false;

//     // Show details for complex object submissions
//     if (typeof answer === "object" && answer !== null) {
//       const taskType = task?.name;
//       const isComplexTask = [
//         "x",
//         "discord",
//         "telegram",
//         "file-upload",
//       ].includes(taskType);
//       return isComplexTask;
//     }

//     return false;
//   };

//   // Render detailed submission based on task type
//   const renderDetailedSubmission = () => {
//     if (!shouldShowDetailedSubmission()) return null;

//     switch (task?.name) {
//       case "x":
//         return renderXTaskSubmission(answer, task?.twitterTaskType);
//       case "discord":
//         return renderSocialSubmission(answer, "Discord");
//       case "telegram":
//         return renderSocialSubmission(answer, "Telegram");
//       case "file-upload":
//         return renderFileSubmission(answer);
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="rounded-lg border border-gray-600 bg-gradient-dark p-4 transition-colors hover:border-gray-500">
//       {/* Header */}
//       <div className="mb-3 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className={`flex items-center justify-center rounded-lg p-2.5 ${taskConfig.bgColor}`}
//           >
//             <IconComponent size={18} className={`${taskConfig.color}`} />
//           </div>

//           <div>
//             <h4 className="font-medium text-white">
//               {task?.instruction || taskConfig.label}
//             </h4>
//             <p className="text-sm text-gray-400">
//               {taskConfig.label} • #{taskId.slice(-8)}
//             </p>
//           </div>
//         </div>

//         {renderVerificationStatus()}
//       </div>

//       {/* Description */}
//       {task?.description && (
//         <p className="mb-3 pl-12 text-sm text-gray-300">{task.description}</p>
//       )}

//       {/* Detailed Submission Content (for complex tasks) */}
//       {shouldShowDetailedSubmission() && (
//         <div className="mb-3 pl-12">
//           <p className="mb-2 text-sm font-medium text-blue-300">
//             User Submission:
//           </p>
//           <div className="bg-blue-900/20 rounded-lg border border-blue-500/30 p-3">
//             {renderDetailedSubmission()}
//           </div>
//         </div>
//       )}

//       {/* Standard Answer Content */}
//       <div className="pl-12">
//         <div className="rounded-lg border-l-2 border-gray-600 bg-gray-800/50 p-3">
//           <FormattedSubmissionAnswer answer={answer} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Detailed submission renderers for admin review
// const renderXTaskSubmission = (answer, taskType) => {
//   switch (taskType) {
//     case "spaces":
//       return (
//         <div className="space-y-3">
//           {/* Space URL they attended */}
//           {answer.spaceUrl && (
//             <div>
//               <p className="mb-1 text-sm font-medium text-blue-300">
//                 Attended Space:
//               </p>
//               <Link
//                 href={answer.spaceUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="break-all text-sm text-blue-400 underline hover:text-blue-300"
//               >
//                 {answer.spaceUrl}
//               </Link>
//             </div>
//           )}

//           {/* Screenshot proof - this is the key part for X Spaces */}
//           {(answer.fileUrl || answer.fileKey) && (
//             <div>
//               <p className="mb-2 text-sm font-medium text-blue-300">
//                 Screenshot Proof:
//               </p>
//               <div className="rounded-lg bg-gray-800/50 p-3">
//                 <FormattedSubmissionAnswer
//                   answer={{
//                     fileName: answer.fileName,
//                     fileKey: answer.fileKey,
//                     fileUrl: answer.fileUrl,
//                     fileSize: answer.fileSize,
//                     fileType: answer.fileType,
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       );

//     case "react":
//       return (
//         <div className="space-y-3">
//           {answer.replyUrl && (
//             <div>
//               <p className="mb-1 text-sm font-medium text-blue-300">
//                 Reply Tweet:
//               </p>
//               <Link
//                 href={answer.replyUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="break-all text-sm text-blue-400 underline hover:text-blue-300"
//               >
//                 {answer.replyUrl}
//               </Link>
//             </div>
//           )}

//           {answer.completionSummary && (
//             <div>
//               <p className="mb-2 text-sm font-medium text-blue-300">
//                 Actions Completed:
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {answer.completionSummary.completed?.map((action) => (
//                   <span
//                     key={action}
//                     className="rounded bg-green-600/20 px-2 py-1 text-xs text-green-400"
//                   >
//                     ✓ {action}
//                   </span>
//                 ))}
//                 {answer.completionSummary.missing?.map((action) => (
//                   <span
//                     key={action}
//                     className="rounded bg-red-600/20 px-2 py-1 text-xs text-red-400"
//                   >
//                     ✗ {action}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       );

//     case "tweet":
//       return (
//         <div>
//           {answer.tweetUrl && (
//             <div>
//               <p className="mb-1 text-sm font-medium text-blue-300">
//                 Submitted Tweet:
//               </p>
//               <Link
//                 href={answer.tweetUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="break-all text-sm text-blue-400 underline hover:text-blue-300"
//               >
//                 {answer.tweetUrl}
//               </Link>
//             </div>
//           )}
//         </div>
//       );

//     case "follow":
//       return (
//         <div>
//           {answer.username && (
//             <div>
//               <p className="mb-1 text-sm font-medium text-blue-300">
//                 Following:
//               </p>
//               <p className="text-sm text-white">@{answer.username}</p>
//             </div>
//           )}
//         </div>
//       );

//     default:
//       return <p className="text-sm text-blue-300">X task completed</p>;
//   }
// };

// const renderSocialSubmission = (answer, platform) => {
//   const name = platform === "Discord" ? answer.serverName : answer.groupName;
//   const joinType =
//     platform === "Telegram" && answer.groupType === "supergroup"
//       ? "Group"
//       : platform === "Telegram"
//         ? "Channel"
//         : "Server";

//   return (
//     <div>
//       {name && (
//         <div>
//           <p className="mb-1 text-sm font-medium text-blue-300">
//             Joined {platform} {joinType}:
//           </p>
//           <p className="text-sm text-white">{name}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderFileSubmission = (answer) => {
//   return (
//     <div>
//       <p className="mb-2 text-sm font-medium text-blue-300">Uploaded File:</p>
//       <div className="rounded-lg bg-gray-800/50 p-3">
//         <FormattedSubmissionAnswer answer={answer} />
//       </div>
//     </div>
//   );
// };

// // Updated ReviewDetailsSubmissions component
// const ReviewDetailsSubmissions = ({ submission }) => {
//   const taskCount =
//     submission.computed?.task_count ||
//     Object.keys(submission.submission_data || {}).length;
//   const submissionTasks = Object.entries(submission.submission_data || {});

//   // Get quest tasks from the quest_data
//   const questTasks = submission.quest_data?.tasks || [];
//   const getTaskById = (taskId) => {
//     return questTasks.find((task) => task.id === taskId);
//   };

//   return (
//     <div className="rounded-xl bg-gradient-dark p-4">
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <ListIcon className="h-5 w-5 text-gray-200" />
//           <h3 className="font-semibold text-white">
//             Submission Tasks ({taskCount})
//           </h3>
//         </div>

//         {/* Overall completion status */}
//         <StatusBadge verified={submission.review_status !== "pending"} />
//       </div>

//       <div className="space-y-4">
//         {submissionTasks.map(([taskId, taskData]) => {
//           const questTask = getTaskById(taskId);

//           return (
//             <TaskAnswerRenderer
//               key={taskId}
//               task={questTask}
//               answer={taskData}
//               taskId={taskId}
//             />
//           );
//         })}

//         {submissionTasks.length === 0 && (
//           <div className="py-8 text-center text-gray-400">
//             <AlertCircleIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
//             <p>No submission data found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewDetailsSubmissions;

import {
  Coins,
  ListIcon,
  LinkIcon,
  ImageIcon,
  UsersIcon,
  FileUpIcon,
  FileTextIcon,
  ArrowUp01Icon,
  LetterTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
} from "lucide-react";
import React from "react";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

import FormattedSubmissionAnswer from "../../details/FormatSubmissionAnswer";

// Task type configuration
const getTaskConfig = (taskType, subType = null) => {
  const configs = {
    x: {
      icon: XIcon,
      label: "X (Twitter)",
      color: "text-black",
      bgColor: "bg-white/80",
    },
    url: {
      icon: LinkIcon,
      label: "URL",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    discord: {
      icon: DiscordIcon,
      label: "Discord",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
    },
    telegram: {
      icon: TelegramIcon,
      label: "Telegram",
      color: "text-blue-400",
      bgColor: "bg-white/10",
    },
    text: {
      icon: LetterTextIcon,
      label: "Text Response",
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
    },
    number: {
      icon: ArrowUp01Icon,
      label: "Number",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
    },
    "file-upload": {
      icon: FileUpIcon,
      label: "File Upload",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    link: {
      icon: ExternalLinkIcon,
      label: "Visit Link",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    invite: {
      icon: UsersIcon,
      label: "Invite Friends",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    nft: {
      icon: ImageIcon,
      label: "NFT Verification",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    token: {
      icon: Coins,
      label: "Token Verification",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
  };

  // Handle X subtypes
  if (taskType === "x") {
    switch (subType) {
      case "spaces":
        return { ...configs.x, label: "X Spaces" };
      case "follow":
        return { ...configs.x, label: "X Follow" };
      case "react":
        return { ...configs.x, label: "X Tweet Engagement" };
      case "tweet":
        return { ...configs.x, label: "X Tweet" };
      default:
        return configs.x;
    }
  }

  return (
    configs[taskType] || {
      icon: FileTextIcon,
      label: "Task",
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
    }
  );
};

// Status badge component
const StatusBadge = ({ verified, className = "" }) => {
  if (verified) {
    return (
      <div
        className={`flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 ${className}`}
      >
        <CheckCircleIcon size={12} />
        Verified
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400 ${className}`}
    >
      <AlertCircleIcon size={12} />
      Pending
    </div>
  );
};

// Enhanced task answer renderer
const TaskAnswerRenderer = ({ task, answer, taskId }) => {
  const taskConfig = getTaskConfig(task?.name, task?.twitterTaskType);
  const IconComponent = taskConfig.icon;

  // Render verification status
  const renderVerificationStatus = () => {
    // For boolean answers (nft, token, invite, link)
    if (typeof answer === "boolean") {
      return <StatusBadge verified={answer} className="ml-auto" />;
    }

    // For object answers with verified field
    if (typeof answer === "object" && answer?.verified !== undefined) {
      return <StatusBadge verified={answer.verified} className="ml-auto" />;
    }

    return null;
  };

  return (
    <div className="rounded-lg border border-gray-600 bg-gradient-dark p-4 transition-colors hover:border-gray-500">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center rounded-lg p-2.5 ${taskConfig.bgColor}`}
          >
            <IconComponent
              size={18}
              className={`h-4 w-4 ${taskConfig.color}`}
            />
          </div>

          <div>
            <h4 className="font-medium text-white">
              {task?.instruction || taskConfig.label}
            </h4>
            <p className="text-sm text-gray-400">
              {taskConfig.label} • #{taskId.slice(-8)}
            </p>
          </div>
        </div>

        {renderVerificationStatus()}
      </div>

      {task?.description && (
        <p className="mb-3 pl-12 text-sm text-gray-300">{task.description}</p>
      )}

      <div className="pl-12">
        <div className="rounded-lg border-l-2 border-gray-600 bg-gray-700/50 p-3">
          <FormattedSubmissionAnswer
            task={task}
            answer={answer}
            taskType={task?.name}
            taskSubType={task?.twitterTaskType}
          />
        </div>
      </div>
    </div>
  );
};

// Updated ReviewDetailsSubmissions component
const ReviewDetailsSubmissions = ({ submission }) => {
  const taskCount =
    submission.computed?.task_count ||
    Object.keys(submission.submission_data || {}).length;
  const submissionTasks = Object.entries(submission.submission_data || {});

  // Get quest tasks from the quest_data
  const questTasks = submission.quest_data?.tasks || [];
  const getTaskById = (taskId) => {
    return questTasks.find((task) => task.id === taskId);
  };

  return (
    <div className="rounded-xl bg-gradient-dark p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListIcon className="h-5 w-5 text-gray-200" />

          <h3 className="font-semibold text-white">
            Submission Tasks ({taskCount})
          </h3>
        </div>

        <StatusBadge verified={submission.review_status !== "pending"} />
      </div>

      <div className="space-y-4">
        {submissionTasks.map(([taskId, taskData]) => {
          const questTask = getTaskById(taskId);

          return (
            <TaskAnswerRenderer
              key={taskId}
              task={questTask}
              answer={taskData}
              taskId={taskId}
            />
          );
        })}

        {submissionTasks.length === 0 && (
          <div className="py-8 text-center text-gray-400">
            <AlertCircleIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No submission data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailsSubmissions;
