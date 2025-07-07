// "use client";

// import {
//   StarIcon,
//   FlagIcon,
//   ClockIcon,
//   XCircleIcon,
//   CheckCircleIcon,
//   AlertTriangleIcon,
//   CalendarIcon,
// } from "lucide-react";
// import { Card, CardBody, Checkbox, Avatar, Badge, Chip } from "@heroui/react";

// const getTimeAgo = (timestamp) => {
//   const now = new Date();
//   const submittedDate = new Date(timestamp);
//   const diffInMs = now.getTime() - submittedDate.getTime();
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInHours < 1) {
//     const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
//     return `${diffInMinutes}m ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours}h ago`;
//   } else {
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays}d ago`;
//   }
// };

// const getStatusConfig = (status) => {
//   const configs = {
//     pending: {
//       icon: ClockIcon,
//       color: "text-gray-400",
//       borderColor: "border-l-gray-500",
//       bgColor: "bg-gray-500/10",
//       chipColor: "default",
//     },
//     approved: {
//       icon: CheckCircleIcon,
//       color: "text-success-400",
//       borderColor: "border-l-success-500",
//       bgColor: "bg-success-500/10",
//       chipColor: "success",
//     },
//     rejected: {
//       icon: XCircleIcon,
//       color: "text-danger-400",
//       borderColor: "border-l-danger-500",
//       bgColor: "bg-danger-500/10",
//       chipColor: "danger",
//     },
//     highlighted: {
//       icon: StarIcon,
//       color: "text-warning-400",
//       borderColor: "border-l-warning-500",
//       bgColor: "bg-warning-500/10",
//       chipColor: "warning",
//     },
//   };
//   return configs[status] || configs.pending;
// };

// const SubmissionCardItem = ({ submission, isSelected, onSelectSubmission }) => {
//   const statusConfig = getStatusConfig(submission.review_status);
//   const StatusIcon = statusConfig.icon;
//   const isUnread = !submission.is_read_by_admin;

//   return (
//     <Card
//       isPressable
//       onPress={() => onSelectSubmission(submission)}
//       className={`mb-2 border-l-4 transition-all duration-200 ${statusConfig.borderColor} ${
//         isSelected
//           ? "dark:bg-primary-950 bg-primary-50 ring-2 ring-primary-200 dark:ring-primary-800"
//           : isUnread
//             ? "bg-content2 shadow-md"
//             : "bg-content1 hover:bg-content2"
//       }`}
//     >
//       <CardBody className="p-4">
//         <div className="flex items-start gap-4">
//           {/* Checkbox */}
//           <Checkbox
//             isSelected={isSelected}
//             color="primary"
//             size="sm"
//             className="mt-1"
//             aria-label="Select submission"
//           />

//           {/* Avatar */}
//           <Avatar
//             name={submission.ambassador_name?.charAt(0) || "A"}
//             size="sm"
//             className="flex-shrink-0"
//             color={isUnread ? "primary" : "default"}
//             isBordered={isUnread}
//           />

//           {/* Content */}
//           <div className="min-w-0 flex-1">
//             {/* Header */}
//             <div className="mb-2 flex items-start justify-between">
//               <div className="flex flex-wrap items-center gap-2">
//                 <span
//                   className={`text-sm font-semibold ${
//                     isUnread ? "text-foreground" : "text-foreground-600"
//                   }`}
//                 >
//                   {submission.ambassador_name}
//                 </span>
//                 <span className="text-xs text-foreground-400">submitted</span>
//                 <div className="flex items-center gap-1 text-xs text-foreground-500">
//                   <CalendarIcon className="h-3 w-3" />
//                   <span>{getTimeAgo(submission.submitted_at)}</span>
//                 </div>
//               </div>

//               {/* Status and Flags */}
//               <div className="flex items-center gap-2">
//                 {submission.is_flagged && (
//                   <Badge color="danger" variant="flat" size="sm">
//                     <FlagIcon className="h-3 w-3" />
//                   </Badge>
//                 )}
//                 <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
//                 {isUnread && (
//                   <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
//                 )}
//               </div>
//             </div>

//             {/* Quest Name */}
//             <h3
//               className={`mb-2 line-clamp-2 text-sm ${
//                 isUnread ? "font-medium text-foreground" : "text-foreground-700"
//               }`}
//             >
//               {submission.quest_name}
//             </h3>

//             {/* Metadata */}
//             <div className="mb-3 flex items-center gap-2 text-xs text-foreground-500">
//               <Chip size="sm" variant="flat" color="default">
//                 {submission.category_name}
//               </Chip>
//               <span>•</span>
//               <span>{submission.pod_name}</span>
//               {submission.resubmission_count > 0 && (
//                 <>
//                   <span>•</span>
//                   <Chip size="sm" variant="flat" color="warning">
//                     Resubmission #{submission.resubmission_count}
//                   </Chip>
//                 </>
//               )}
//             </div>

//             {/* Status Badges */}
//             <div className="flex items-center gap-2">
//               {submission.review_status === "highlighted" && (
//                 <Chip
//                   size="sm"
//                   color="warning"
//                   variant="flat"
//                   startContent={<StarIcon className="h-3 w-3" />}
//                 >
//                   Highlighted
//                 </Chip>
//               )}
//               {submission.is_flagged && (
//                 <Chip
//                   size="sm"
//                   color="danger"
//                   variant="flat"
//                   startContent={<AlertTriangleIcon className="h-3 w-3" />}
//                 >
//                   Flagged
//                 </Chip>
//               )}
//               {submission.review_status !== "pending" && (
//                 <Chip
//                   size="sm"
//                   color={statusConfig.chipColor}
//                   variant="flat"
//                   startContent={<StatusIcon className="h-3 w-3" />}
//                 >
//                   {submission.review_status.charAt(0).toUpperCase() +
//                     submission.review_status.slice(1)}
//                 </Chip>
//               )}
//             </div>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default SubmissionCardItem;

// "use client";

// import {
//   StarIcon,
//   FlagIcon,
//   ClockIcon,
//   XCircleIcon,
//   CalendarIcon,
//   CheckCircleIcon,
//   AlertTriangleIcon,
// } from "lucide-react";
// import { memo, useEffect, useState, useCallback } from "react";
// import { Card, CardBody, Checkbox, Avatar, Badge, Chip } from "@heroui/react";
// import SubmissionItemLoader from "@/components/ui/loader/submission/admin/SubmissionItemLoader";

// const getTimeAgo = (timestamp) => {
//   const now = new Date();
//   const submittedDate = new Date(timestamp);
//   const diffInMs = now.getTime() - submittedDate.getTime();
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInHours < 1) {
//     const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
//     return `${diffInMinutes}m ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours}h ago`;
//   } else {
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays}d ago`;
//   }
// };

// const getStatusConfig = (status) => {
//   const configs = {
//     pending: {
//       icon: ClockIcon,
//       color: "text-gray-400",
//       borderColor: "border-l-gray-500 border-gray-700",
//       bgColor: "bg-gray-900/50",
//       chipColor: "default",
//     },

//     approved: {
//       icon: CheckCircleIcon,
//       color: "text-green-400",
//       borderColor: "border-l-green-500 border-green-700",
//       bgColor: "bg-green-900/30",
//       chipColor: "success",
//     },

//     rejected: {
//       icon: XCircleIcon,
//       color: "text-red-400",
//       borderColor: "border-l-red-500 border-red-700",
//       bgColor: "bg-red-900/30",
//       chipColor: "danger",
//     },

//     highlighted: {
//       icon: StarIcon,
//       color: "text-yellow-400",
//       borderColor: "border-l-yellow-500 border-yellow-700",
//       bgColor: "bg-yellow-900/30",
//       chipColor: "warning",
//     },
//   };
//   return configs[status] || configs.pending;
// };

// const apiRequest = async (url, options = {}) => {
//   const response = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     cache: "no-store",
//     ...options,
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.json();
// };

// // const SubmissionCardItem = memo(
// //   ({ submission, isSelected, onSelectSubmission }) => {
// //     const statusConfig = getStatusConfig(submission.review_status);

// //     const StatusIcon = statusConfig.icon;
// //     const isUnread = !submission.is_read_by_admin;

// //     const handlePress = () => {
// //       onSelectSubmission(submission);
// //     };

// //     return (
// //       <Card
// //         isPressable
// //         onPress={handlePress}
// //         className={`mb-2 w-full cursor-pointer border border-l-4 transition-all duration-200 ${statusConfig.borderColor} ${statusConfig.bgColor} ${
// //           isSelected
// //             ? "scale-[1.02] shadow-lg ring-2 ring-primary-600"
// //             : isUnread
// //               ? "shadow-md hover:shadow-lg"
// //               : "hover:shadow-md"
// //         } ${isUnread ? "font-medium" : ""} `}
// //       >
// //         <CardBody className="p-4">
// //           <div className="flex items-start gap-4">
// //             <Checkbox
// //               isSelected={isSelected}
// //               color="primary"
// //               size="sm"
// //               className="mt-1 flex-shrink-0"
// //               aria-label={`Select submission from ${submission.ambassador_name}`}
// //             />

// //             <Avatar
// //               name={submission.ambassador_name?.charAt(0) || "A"}
// //               size="sm"
// //               className="flex-shrink-0"
// //               color={isUnread ? "primary" : "default"}
// //               isBordered={isUnread}
// //             />

// //             <div className="min-w-0 flex-1">
// //               <div className="mb-2 flex items-start justify-between">
// //                 <div className="flex flex-wrap items-center gap-2">
// //                   <span
// //                     className={`text-sm font-semibold ${
// //                       isUnread ? "text-foreground" : "text-foreground-600"
// //                     }`}
// //                   >
// //                     {submission.ambassador_name}
// //                   </span>

// //                   <span className="text-xs text-foreground-400">submitted</span>

// //                   <div className="flex items-center gap-1 text-xs text-foreground-500">
// //                     <CalendarIcon className="h-3 w-3" />
// //                     <span>{getTimeAgo(submission.submitted_at)}</span>
// //                   </div>
// //                 </div>

// //                 <div className="flex flex-shrink-0 items-center gap-2">
// //                   {submission.is_flagged && (
// //                     <Badge color="danger" variant="flat" size="sm">
// //                       <FlagIcon className="h-3 w-3" />
// //                     </Badge>
// //                   )}

// //                   <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />

// //                   {isUnread && (
// //                     <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
// //                   )}
// //                 </div>
// //               </div>

// //               <h3
// //                 className={`mb-2 line-clamp-2 text-sm ${
// //                   isUnread
// //                     ? "font-medium text-foreground"
// //                     : "text-foreground-700"
// //                 }`}
// //               >
// //                 {submission.quest_name}
// //               </h3>

// //               <div className="mb-3 flex items-center gap-2">
// //                 <Chip size="sm" variant="flat" color="default">
// //                   {submission.category_name}
// //                 </Chip>

// //                 {submission.resubmission_count > 0 && (
// //                   <Chip size="sm" variant="flat" color="warning">
// //                     Resubmission #{submission.resubmission_count}
// //                   </Chip>
// //                 )}
// //               </div>

// //               <div className="flex flex-wrap items-center gap-2">
// //                 {submission.review_status === "highlighted" && (
// //                   <Chip
// //                     size="sm"
// //                     color="warning"
// //                     variant="flat"
// //                     startContent={<StarIcon className="h-3 w-3" />}
// //                   >
// //                     Highlighted
// //                   </Chip>
// //                 )}

// //                 {submission.is_flagged && (
// //                   <Chip
// //                     size="sm"
// //                     color="danger"
// //                     variant="flat"
// //                     startContent={<AlertTriangleIcon className="h-3 w-3" />}
// //                   >
// //                     Flagged
// //                   </Chip>
// //                 )}

// //                 {submission.review_status !== "pending" && (
// //                   <Chip
// //                     size="sm"
// //                     color={statusConfig.chipColor}
// //                     variant="flat"
// //                     startContent={<StatusIcon className="h-3 w-3" />}
// //                   >
// //                     {submission.review_status.charAt(0).toUpperCase() +
// //                       submission.review_status.slice(1)}
// //                   </Chip>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </CardBody>
// //       </Card>
// //     );
// //   },
// // );

// // SubmissionCardItem.displayName = "SubmissionCardItem";

// // export default SubmissionCardItem;

// const SubmissionCardItem = memo(
//   ({
//     submission,
//     setSubmissions,
//     selectedSubmission,
//     setSelectedSubmission,
//   }) => {
//     const [ambassador, setAmbassador] = useState(null);
//     const [quest, setQuest] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const isSelected =
//       selectedSubmission?.submission_id === submission.submission_id;

//     // Handle submission selection
//     const handleSelectSubmission = useCallback(
//       async (submission) => {
//         if (submission.submission_id === selectedSubmission?.submission_id) {
//           return;
//         }

//         setSelectedSubmission(submission);

//         // Mark as read when selected
//         if (!submission.is_read_by_admin) {
//           try {
//             await apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submission.submission_id}/mark-read`,
//               { method: "POST" },
//             );

//             // Update local state
//             setSubmissions((prev) =>
//               prev.map((sub) =>
//                 sub.submission_id === submission.submission_id
//                   ? { ...sub, is_read_by_admin: true }
//                   : sub,
//               ),
//             );
//           } catch (error) {
//             console.error("Failed to mark submission as read:", error);
//           }
//         }
//       },
//       [selectedSubmission?.submission_id],
//     );

//     // Fetch ambassador and quest data
//     useEffect(() => {
//       const fetchData = async () => {
//         if (
//           !submission?.ambassador_id ||
//           !submission?.quest_id ||
//           !apiRequest
//         ) {
//           setLoading(false);
//           return;
//         }

//         try {
//           setLoading(true);
//           setError(null);

//           // Fetch both ambassador and quest data in parallel
//           const [ambassadorResponse, questResponse] = await Promise.all([
//             apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${submission.ambassador_id}`,
//             ),
//             apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`,
//             ),
//           ]);

//           setAmbassador(ambassadorResponse.data.ambassador);
//           setQuest(questResponse.data.quest);
//         } catch (err) {
//           setError(err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData();
//     }, [submission?.ambassador_id, submission?.quest_id, apiRequest]);

//     const statusConfig = getStatusConfig(submission.review_status);
//     const StatusIcon = statusConfig.icon;

//     const isUnread = submission.is_read_by_admin !== "true";

//     const handlePress = () => {
//       handleSelectSubmission(submission);
//     };

//     // Use fetched data or fallback to submission properties
//     const ambassadorName = ambassador?.username || "Unknown Ambassador";
//     const questName =
//       quest?.name || quest?.title || submission.quest_name || "Unknown Quest";
//     const categoryName =
//       quest?.category_name || submission.category_name || "Unknown Category";

//     if (loading) {
//       return <SubmissionItemLoader />;
//     }

//     return (
//       <Card
//         isPressable
//         onPress={handlePress}
//         className={`mb-2 w-full cursor-pointer border border-l-4 transition-all duration-200 ${statusConfig.borderColor} ${statusConfig.bgColor} ${
//           isSelected
//             ? "scale-[1.02] shadow-lg ring-2 ring-primary-600"
//             : isUnread
//               ? "shadow-md hover:shadow-lg"
//               : "hover:shadow-md"
//         } ${isUnread ? "font-medium" : ""} `}
//       >
//         <CardBody className="p-4">
//           <div className="flex items-start gap-4">
//             <Checkbox
//               isSelected={isSelected}
//               color="primary"
//               size="sm"
//               className="mt-1 flex-shrink-0"
//               aria-label={`Select submission from ${ambassadorName}`}
//             />

//             <Avatar
//               name={ambassadorName?.charAt(0) || "A"}
//               size="sm"
//               className="flex-shrink-0"
//               color={isUnread ? "primary" : "default"}
//               isBordered={isUnread}
//               src={ambassador?.avatar_url}
//             />

//             <div className="min-w-0 flex-1">
//               <div className="mb-2 flex items-start justify-between">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span
//                     className={`text-sm font-semibold ${
//                       isUnread ? "text-foreground" : "text-foreground-600"
//                     }`}
//                   >
//                     {ambassadorName}
//                   </span>

//                   <span className="text-xs text-foreground-400">submitted</span>

//                   <div className="flex items-center gap-1 text-xs text-foreground-500">
//                     <CalendarIcon className="h-3 w-3" />
//                     <span>{getTimeAgo(submission.submitted_at)}</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-shrink-0 items-center gap-2">
//                   {submission.is_flagged === "true" && (
//                     <Badge color="danger" variant="flat" size="sm">
//                       <FlagIcon className="h-3 w-3" />
//                     </Badge>
//                   )}

//                   <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />

//                   {isUnread && (
//                     <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
//                   )}
//                 </div>
//               </div>

//               <h3
//                 className={`mb-2 line-clamp-2 text-sm ${
//                   isUnread
//                     ? "font-medium text-foreground"
//                     : "text-foreground-700"
//                 }`}
//               >
//                 {questName}
//               </h3>

//               <div className="mb-3 flex items-center gap-2">
//                 <Chip size="sm" variant="flat" color="default">
//                   {categoryName}
//                 </Chip>

//                 {submission.resubmission_count > 0 && (
//                   <Chip size="sm" variant="flat" color="warning">
//                     Resubmission #{submission.resubmission_count}
//                   </Chip>
//                 )}
//               </div>

//               <div className="flex flex-wrap items-center gap-2">
//                 {submission.review_status === "highlighted" && (
//                   <Chip
//                     size="sm"
//                     color="warning"
//                     variant="flat"
//                     startContent={<StarIcon className="h-3 w-3" />}
//                   >
//                     Highlighted
//                   </Chip>
//                 )}

//                 {submission.is_flagged === "true" && (
//                   <Chip
//                     size="sm"
//                     color="danger"
//                     variant="flat"
//                     startContent={<AlertTriangleIcon className="h-3 w-3" />}
//                   >
//                     Flagged
//                   </Chip>
//                 )}

//                 {submission.review_status !== "pending" && (
//                   <Chip
//                     size="sm"
//                     color={statusConfig.chipColor}
//                     variant="flat"
//                     startContent={<StatusIcon className="h-3 w-3" />}
//                   >
//                     {submission.review_status.charAt(0).toUpperCase() +
//                       submission.review_status.slice(1)}
//                   </Chip>
//                 )}
//               </div>

//               {error && (
//                 <div className="mt-2">
//                   <Chip size="sm" color="danger" variant="flat">
//                     Failed to load details
//                   </Chip>
//                 </div>
//               )}
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     );
//   },
// );

// SubmissionCardItem.displayName = "SubmissionCardItem";

// export default SubmissionCardItem;

// "use client";

// import {
//   StarIcon,
//   FlagIcon,
//   ClockIcon,
//   XCircleIcon,
//   CalendarIcon,
//   CheckCircleIcon,
//   AlertTriangleIcon,
// } from "lucide-react";
// import { memo, useEffect, useState, useCallback } from "react";
// import { Card, CardBody, Checkbox, Avatar, Badge, Chip } from "@heroui/react";
// import SubmissionItemLoader from "@/components/ui/loader/submission/admin/SubmissionItemLoader";

// const getTimeAgo = (timestamp) => {
//   const now = new Date();
//   const submittedDate = new Date(timestamp);
//   const diffInMs = now.getTime() - submittedDate.getTime();
//   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

//   if (diffInHours < 1) {
//     const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
//     return `${diffInMinutes}m ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours}h ago`;
//   } else {
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays}d ago`;
//   }
// };

// const getStatusConfig = (status) => {
//   const configs = {
//     pending: {
//       icon: ClockIcon,
//       color: "text-gray-400",
//       borderColor: "border-l-gray-500 border-gray-700",
//       bgColor: "bg-gray-900/50",
//       chipColor: "default",
//     },
//     approved: {
//       icon: CheckCircleIcon,
//       color: "text-green-400",
//       borderColor: "border-l-green-500 border-green-700",
//       bgColor: "bg-green-900/30",
//       chipColor: "success",
//     },
//     rejected: {
//       icon: XCircleIcon,
//       color: "text-red-400",
//       borderColor: "border-l-red-500 border-red-700",
//       bgColor: "bg-red-900/30",
//       chipColor: "danger",
//     },
//     highlighted: {
//       icon: StarIcon,
//       color: "text-yellow-400",
//       borderColor: "border-l-yellow-500 border-yellow-700",
//       bgColor: "bg-yellow-900/30",
//       chipColor: "warning",
//     },
//   };
//   return configs[status] || configs.pending;
// };

// const apiRequest = async (url, options = {}) => {
//   const response = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     cache: "no-store",
//     ...options,
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.json();
// };

// const SubmissionCardItem = memo(
//   ({
//     submission,
//     setSubmissions,
//     selectedSubmission,
//     setSelectedSubmission,
//   }) => {
//     const [quest, setQuest] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [ambassador, setAmbassador] = useState(null);

//     const isSelected =
//       selectedSubmission?.submission_id === submission.submission_id;
//     const statusConfig = getStatusConfig(submission.review_status);

//     const StatusIcon = statusConfig.icon;

//     const isUnread = submission.is_read_by_admin !== "true";

//     // Use fetched data or fallback to submission properties
//     const ambassadorName = ambassador?.username || "Unknown Ambassador";
//     const questName =
//       quest?.name || quest?.title || submission.quest_name || "Unknown Quest";
//     const categoryName =
//       quest?.category_name || submission.category_name || "Unknown Category";

//     useEffect(() => {
//       const fetchData = async () => {
//         if (!submission?.ambassador_id || !submission?.quest_id) {
//           setLoading(false);
//           return;
//         }

//         try {
//           setLoading(true);
//           setError(null);

//           // Fetch both ambassador and quest data in parallel
//           const [ambassadorResponse, questResponse] = await Promise.all([
//             apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${submission.ambassador_id}`,
//             ),
//             apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`,
//             ),
//           ]);

//           setAmbassador(ambassadorResponse.data.ambassador);
//           setQuest(questResponse.data.quest);
//         } catch (err) {
//           console.error("Failed to fetch ambassador or quest data:", err);
//           setError(err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData();
//     }, [submission?.ambassador_id, submission?.quest_id]);

//     const handleSelectSubmission = useCallback(
//       async (submissionData) => {
//         if (
//           submissionData.submission_id === selectedSubmission?.submission_id
//         ) {
//           return;
//         }

//         // Create enhanced submission object with fetched data
//         const enhancedSubmission = {
//           ...submissionData,
//           // Add fetched ambassador data
//           ambassador_data: ambassador,
//           // Add fetched quest data
//           quest_data: quest,
//           // Computed values for easy access
//           computed: {
//             ambassador_name: ambassadorName,
//             quest_name: questName,
//             category_name: categoryName,
//             is_unread: isUnread,
//           },
//         };

//         setSelectedSubmission(enhancedSubmission);

//         // Mark as read when selected
//         if (isUnread) {
//           try {
//             await apiRequest(
//               `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionData.submission_id}/read-by-admin`,
//               { method: "PATCH" },
//             );

//             // Update local state
//             setSubmissions((prev) =>
//               prev.map((sub) =>
//                 sub.submission_id === submissionData.submission_id
//                   ? { ...sub, is_read_by_admin: "true" }
//                   : sub,
//               ),
//             );
//           } catch (error) {
//             console.error("Failed to mark submission as read:", error);
//           }
//         }
//       },
//       [
//         selectedSubmission?.submission_id,
//         ambassador,
//         quest,
//         ambassadorName,
//         questName,
//         categoryName,
//         isUnread,
//         setSelectedSubmission,
//         setSubmissions,
//       ],
//     );

//     const handlePress = useCallback(() => {
//       if (!loading && !error) {
//         handleSelectSubmission(submission);
//       }
//     }, [handleSelectSubmission, submission, loading, error]);

//     if (loading) {
//       return <SubmissionItemLoader />;
//     }

//     return (
//       <Card
//         isPressable
//         onPress={handlePress}
//         className={`mb-2 w-full cursor-pointer border border-l-4 transition-all duration-200 ${statusConfig.borderColor} ${statusConfig.bgColor} ${
//           isSelected
//             ? "scale-[1.02] shadow-lg ring-2 ring-primary-600"
//             : isUnread
//               ? "shadow-md hover:shadow-lg"
//               : "hover:shadow-md"
//         } ${isUnread ? "font-medium" : ""} `}
//       >
//         <CardBody className="p-4">
//           <div className="flex items-start gap-4">
//             <Checkbox
//               isSelected={isSelected}
//               color="primary"
//               size="sm"
//               className="mt-1 flex-shrink-0"
//               aria-label={`Select submission from ${ambassadorName}`}
//             />

//             <Avatar
//               name={ambassadorName?.charAt(0) || "A"}
//               size="sm"
//               className="flex-shrink-0"
//               color={isUnread ? "primary" : "default"}
//               isBordered={isUnread}
//               src={ambassador?.avatar_url}
//             />

//             <div className="min-w-0 flex-1">
//               <div className="mb-2 flex items-start justify-between">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span
//                     className={`text-sm font-semibold ${
//                       isUnread ? "text-foreground" : "text-foreground-600"
//                     }`}
//                   >
//                     {ambassadorName}
//                   </span>

//                   <span className="text-xs text-foreground-400">submitted</span>

//                   <div className="flex items-center gap-1 text-xs text-foreground-500">
//                     <CalendarIcon className="h-3 w-3" />
//                     <span>{getTimeAgo(submission.submitted_at)}</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-shrink-0 items-center gap-2">
//                   {submission.is_flagged === "true" && (
//                     <Badge color="danger" variant="flat" size="sm">
//                       <FlagIcon className="h-3 w-3" />
//                     </Badge>
//                   )}

//                   <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />

//                   {isUnread && (
//                     <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
//                   )}
//                 </div>
//               </div>

//               <h3
//                 className={`mb-2 line-clamp-2 text-sm ${
//                   isUnread
//                     ? "font-medium text-foreground"
//                     : "text-foreground-700"
//                 }`}
//               >
//                 {questName}
//               </h3>

//               <div className="mb-3 flex items-center gap-2">
//                 <Chip size="sm" variant="flat" color="default">
//                   {categoryName}
//                 </Chip>

//                 {submission.resubmission_count > 0 && (
//                   <Chip size="sm" variant="flat" color="warning">
//                     {submission.resubmission_count} Resubmission
//                   </Chip>
//                 )}
//               </div>

//               <div className="flex flex-wrap items-center gap-2">
//                 {submission.review_status === "highlighted" && (
//                   <Chip
//                     size="sm"
//                     color="warning"
//                     variant="flat"
//                     startContent={<StarIcon className="h-3 w-3" />}
//                   >
//                     Highlighted
//                   </Chip>
//                 )}

//                 {submission.is_flagged === "true" && (
//                   <Chip
//                     size="sm"
//                     color="danger"
//                     variant="flat"
//                     startContent={<AlertTriangleIcon className="h-3 w-3" />}
//                   >
//                     Flagged
//                   </Chip>
//                 )}

//                 {submission.review_status !== "pending" && (
//                   <Chip
//                     size="sm"
//                     color={statusConfig.chipColor}
//                     variant="flat"
//                     startContent={<StatusIcon className="h-3 w-3" />}
//                   >
//                     {submission.review_status.charAt(0).toUpperCase() +
//                       submission.review_status.slice(1)}
//                   </Chip>
//                 )}
//               </div>

//               {error && (
//                 <div className="mt-2">
//                   <Chip size="sm" color="danger" variant="flat">
//                     Failed to load details
//                   </Chip>
//                 </div>
//               )}
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     );
//   },
// );

// SubmissionCardItem.displayName = "SubmissionCardItem";

// export default SubmissionCardItem;

"use client";

import {
  EyeIcon,
  StarIcon,
  FlagIcon,
  ListIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { memo, useEffect, useState, useCallback } from "react";
import { Card, CardBody, Checkbox, Avatar, Badge, Chip } from "@heroui/react";

import SubmissionItemLoader from "@/components/ui/loader/submission/admin/SubmissionItemLoader";

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const submittedDate = new Date(timestamp);
  const diffInMs = now.getTime() - submittedDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      icon: ClockIcon,
      color: "text-gray-400",
      borderColor: "border-l-gray-400 border-gray-500",
      chipColor: "warning",
      label: "Pending Review",
    },

    approved: {
      icon: CheckCircleIcon,
      color: "text-green-400",
      borderColor: "border-l-green-500 border-green-500/50",
      chipColor: "success",
      label: "Approved",
    },

    rejected: {
      icon: XCircleIcon,
      color: "text-red-400",
      borderColor: "border-l-red-500 border-red-500/50",
      chipColor: "danger",
      label: "Rejected",
    },

    highlighted: {
      icon: StarIcon,
      color: "text-yellow-400",
      borderColor: "border-l-yellow-500 border-yellow-500/50",
      chipColor: "warning",
      label: "Highlighted",
    },
  };
  return configs[status] || configs.pending;
};

const getTaskCount = (submissionData) => {
  if (!submissionData || typeof submissionData !== "object") {
    return 0;
  }

  // Count the number of task responses in submission_data
  return Object.keys(submissionData).length;
};

const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      cache: "no-store",
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
};

const SubmissionCardItem = memo(
  ({
    submission,
    setSubmissions,
    selectedSubmission,
    setSelectedSubmission,
  }) => {
    const [quest, setQuest] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ambassador, setAmbassador] = useState(null);

    const isSelected =
      selectedSubmission?.submission_id === submission.submission_id;
    const statusConfig = getStatusConfig(submission.review_status);

    const StatusIcon = statusConfig.icon;

    const isUnread = submission.is_read_by_admin !== "true";

    const taskCount = getTaskCount(submission.submission_data);

    // Use fetched data or fallback values
    const ambassadorName =
      ambassador?.username || ambassador?.name || "Unknown Ambassador";
    const questName = quest?.name || quest?.title || "Unknown Quest";
    const questDescription = quest?.description || "";

    useEffect(() => {
      const fetchData = async () => {
        if (!submission?.ambassador_id || !submission?.quest_id) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(null);

          // Fetch both ambassador and quest data in parallel
          const [ambassadorResponse, questResponse] = await Promise.all([
            apiRequest(
              `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${submission.ambassador_id}`,
            ),
            apiRequest(
              `${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`,
            ),
          ]);

          // Handle different response structures
          const ambassadorData =
            ambassadorResponse?.data?.ambassador ||
            ambassadorResponse?.ambassador ||
            ambassadorResponse;
          const questData =
            questResponse?.data?.quest || questResponse?.quest || questResponse;

          setAmbassador(ambassadorData);
          setQuest(questData);
        } catch (err) {
          console.error("Failed to fetch data:", err);
          setError(err);

          // Set fallback data to prevent UI breaks
          setAmbassador({ username: "Unknown Ambassador" });
          setQuest({ name: "Unknown Quest" });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [submission?.ambassador_id, submission?.quest_id]);

    const handleSelectSubmission = useCallback(
      async (submissionData) => {
        if (
          submissionData.submission_id === selectedSubmission?.submission_id
        ) {
          return;
        }

        // Create enhanced submission object with fetched data
        const enhancedSubmission = {
          ...submissionData,
          ambassador_data: ambassador,
          quest_data: quest,
          computed: {
            ambassador_name: ambassadorName,
            quest_name: questName,
            quest_description: questDescription,
            is_unread: isUnread,
            task_count: taskCount,
            status_config: statusConfig,
          },
        };

        setSelectedSubmission(enhancedSubmission);

        // Mark as read when selected (only if unread)
        if (isUnread) {
          try {
            await apiRequest(
              `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionData.submission_id}/read-by-admin`,
              { method: "PATCH" },
            );

            // Update local state optimistically
            setSubmissions((prev) =>
              prev.map((sub) =>
                sub.submission_id === submissionData.submission_id
                  ? { ...sub, is_read_by_admin: "true" }
                  : sub,
              ),
            );
          } catch (error) {
            console.error("Failed to mark submission as read:", error);
            // Note: We don't revert the selection on read failure
          }
        }
      },
      [
        selectedSubmission?.submission_id,
        ambassador,
        quest,
        ambassadorName,
        questName,
        questDescription,
        isUnread,
        taskCount,
        statusConfig,
        setSelectedSubmission,
        setSubmissions,
      ],
    );

    const handlePress = useCallback(() => {
      if (!loading) {
        handleSelectSubmission(submission);
      }
    }, [handleSelectSubmission, submission, loading]);

    if (loading) {
      return <SubmissionItemLoader />;
    }

    return (
      <Card
        isPressable={!loading}
        onPress={handlePress}
        className={`mb-2 w-full border border-l-5 transition-all duration-200 ${statusConfig.borderColor} ${
          isSelected
            ? "scale-[1.02] ring-1 ring-white"
            : isUnread
              ? "bg-content2 font-medium shadow-md"
              : "bg-content1 hover:bg-content2"
        } ${loading ? "pointer-events-none" : ""}`}
      >
        <CardBody className="p-4">
          <div className="flex items-start gap-4">
            <Checkbox
              size="sm"
              color="primary"
              isDisabled={loading}
              isSelected={isSelected}
              className="mt-1 flex-shrink-0 pr-0 pt-0"
              aria-label={`Select submission from ${ambassadorName}`}
            />

            <Avatar
              size="sm"
              isBordered={isUnread}
              className="flex-shrink-0"
              color={isUnread ? "primary" : "default"}
              name={ambassadorName?.charAt(0)?.toUpperCase() || "A"}
              src={ambassador?.avatar_url || ambassador?.profile_picture}
              showFallback
            />

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      isUnread ? "text-foreground" : "text-foreground-600"
                    }`}
                  >
                    {ambassadorName}
                  </span>

                  <span className="text-xs text-foreground-400">submitted</span>

                  <div className="flex items-center gap-1 text-xs text-foreground-500">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{getTimeAgo(submission.submitted_at)}</span>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  {submission.is_flagged === "true" && (
                    <Badge color="danger" variant="flat" size="sm">
                      <FlagIcon className="h-3 w-3" />
                    </Badge>
                  )}

                  <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />

                  {isUnread && (
                    <EyeIcon
                      size={16}
                      className="animate-pulse text-gray-200"
                    />
                  )}
                </div>
              </div>

              <h3
                className={`mb-2 line-clamp-2 text-sm ${
                  isUnread
                    ? "font-medium text-foreground"
                    : "text-foreground-700"
                }`}
                title={questName}
              >
                {questName}
              </h3>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                {taskCount > 0 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="default"
                    startContent={<ListIcon className="h-3 w-3" />}
                  >
                    {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
                  </Chip>
                )}

                {submission.resubmission_count > 0 && (
                  <Chip size="sm" variant="flat" color="warning">
                    {submission.resubmission_count} Resubmission
                  </Chip>
                )}

                <Chip
                  size="sm"
                  color={statusConfig.chipColor}
                  variant="flat"
                  startContent={<StatusIcon className="h-3 w-3" />}
                >
                  {statusConfig.label}
                </Chip>

                {submission.review_status === "highlighted" && (
                  <Chip
                    size="sm"
                    color="warning"
                    variant="solid"
                    startContent={<StarIcon className="h-3 w-3" />}
                  >
                    Featured
                  </Chip>
                )}

                {submission.is_flagged === "true" && (
                  <Chip
                    size="sm"
                    color="danger"
                    variant="flat"
                    startContent={<AlertTriangleIcon className="h-3 w-3" />}
                  >
                    Flagged
                  </Chip>
                )}
              </div>

              {error && (
                <div className="mt-2">
                  <Chip size="sm" color="danger" variant="flat">
                    ⚠️ Failed to load complete details
                  </Chip>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    );
  },
);

SubmissionCardItem.displayName = "SubmissionCardItem";

export default SubmissionCardItem;
