// "use client";

// import { useSelector } from "react-redux";
// import { Card, CardBody } from "@heroui/react";
// import { FilterIcon, InboxIcon } from "lucide-react";
// import { useState, useEffect, useCallback } from "react";

// import ReviewDetailsPanel from "./ReviewDetailsPanel";
// import MainPageScroll from "@/components/common/MainPageScroll";
// import WrapperContainer from "@/components/common/WrapperContainer";
// import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";

// const mockSubmissions = [
//   {
//     submission_id: "sub_2f434a9b-a320-436e-94f3-14eea2044c61",
//     category_id: "category_cc749aa5-c16b-438c-9c33-b437a28f06c5",
//     pod_id: "pod_7843a5df-8978-439e-892c-378443cf0825",
//     quest_id: "quest_aca8f2c5-5913-4885-8f32-eaaa678043da",
//     ambassador_id: "user_742cafdc-5575-4eb9-89a0-ecef31396264",
//     submitted_at: "2025-07-02T13:47:16.611Z",
//     updated_at: "2025-07-02T13:47:16.611Z",
//     review_status: "pending",
//     is_read_by_admin: false,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [],
//     submission_data: {
//       "003e3145-42b4-46fa-954a-ffbb3a9770e7": {
//         verified: true,
//         verifiedAt: "2025-07-02T13:47:13.157Z",
//         method: "user_confirmation",
//         userConfirmed: true,
//         username: "NooberBoy",
//       },
//     },
//     additional_context:
//       "User completed the Twitter engagement quest successfully",
//     quest_name: "Share a Tweet on NEO POD Ambassador Program",
//     ambassador_name: "NooberBoy",
//     category_name: "Social Media",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567890",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-02T13:47:16.611Z",
//         details: "Share a Tweet on NEO POD Ambassador Program",
//       },
//     ],
//   },
//   {
//     submission_id: "sub_3g545b9c-b431-547f-a5g4-25ffb3b155c72",
//     category_id: "category_dd859bb6-d27c-549d-ad44-c548b39g17d6",
//     pod_id: "pod_8954b6eg-9089-54af-9a3d-489554dg1936",
//     quest_id: "quest_bdb9g3d6-6024-5996-9g43-fbbf789154eb",
//     ambassador_id: "user_853dbgdd-6686-5fba-9ab1-fdgg42407375",
//     submitted_at: "2025-07-02T09:23:42.445Z",
//     updated_at: "2025-07-02T14:23:42.445Z",
//     review_status: "highlighted",
//     is_read_by_admin: true,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [{ amount: 200, type: "points" }],
//     submission_data: {
//       "114f4256-53c5-57gb-965b-gggcc4a881f8": {
//         verified: true,
//         verifiedAt: "2025-07-02T09:23:39.001Z",
//         method: "automated_verification",
//         userConfirmed: true,
//         username: "CryptoMaven",
//       },
//     },
//     additional_context: "Excellent engagement and reach metrics",
//     quest_name: "Discord Community Building",
//     ambassador_name: "Sarah Wilson",
//     category_name: "Community",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567891",
//     reviewed_by: "Admin Alice",
//     reviewed_at: "2025-07-02T14:23:42.445Z",
//     review_comment:
//       "Outstanding work! The analysis was thorough and well-documented.",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-02T09:23:42.445Z",
//         details: "Discord Community Building",
//       },
//       {
//         action: "reviewed",
//         result: "Success",
//         timestamp: "2025-07-02T10:23:42.445Z",
//         details: "Reviewed submission with Success",
//       },
//       {
//         action: "reviewed",
//         result: "Highlighted",
//         timestamp: "2025-07-02T14:23:42.445Z",
//         details: "Reviewed submission with Highlighted status",
//       },
//     ],
//   },
//   {
//     submission_id: "sub_4h656c9d-c542-658g-b6h5-36gga4c266d83",
//     category_id: "category_ee969cc7-e38d-65ae-be55-d659c4ah28e7",
//     pod_id: "pod_9a65c7fh-a19a-65bg-ab4e-59a665eh2a47",
//     quest_id: "quest_ceca4e7-7135-6aa7-ah54-gccg89a265fc",
//     ambassador_id: "user_964ecgee-7797-6gcb-abc2-gehrr53518486",
//     submitted_at: "2025-07-02T04:15:28.223Z",
//     updated_at: "2025-07-02T16:42:15.889Z",
//     review_status: "approved",
//     is_read_by_admin: true,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [{ amount: 150, type: "points" }],
//     submission_data: {
//       "225g5367-64d6-68hc-a76c-hhhdd5b992g9": {
//         verified: true,
//         verifiedAt: "2025-07-02T04:15:25.001Z",
//         method: "automated_verification",
//         userConfirmed: true,
//         username: "DefiExplorer",
//       },
//     },
//     additional_context: "Great community engagement",
//     quest_name: "DeFi Protocol Analysis",
//     ambassador_name: "Mike Chen",
//     category_name: "Research",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567892",
//     review_comment: "Good submission with proper documentation.",
//     reviewed_by: "Admin Bob",
//     reviewed_at: "2025-07-02T16:42:15.889Z",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-02T04:15:28.223Z",
//         details: "DeFi Protocol Analysis",
//       },
//       {
//         action: "reviewed",
//         result: "Success",
//         timestamp: "2025-07-02T16:42:15.889Z",
//         details: "Reviewed submission with Success",
//       },
//     ],
//   },
//   {
//     submission_id: "sub_5i767d9e-d653-769h-c7i6-47hha5d377e94",
//     category_id: "category_ff979dd8-f49e-76bf-cf66-e769d5bi39f8",
//     pod_id: "pod_ab76d8gi-b2ab-76ch-bc5f-69b776fi3b58",
//     quest_id: "quest_dfdb5f8-8246-7bb8-bi65-hddh9ab376gd",
//     ambassador_id: "user_a75fdhff-8898-7hdc-bcd3-hfiis64629597",
//     submitted_at: "2025-07-02T02:25:48.334Z",
//     updated_at: "2025-07-02T15:53:26.778Z",
//     review_status: "rejected",
//     is_read_by_admin: true,
//     is_flagged: true,
//     resubmission_count: 1,
//     rewards: [],
//     submission_data: {
//       "336h6478-75e7-79id-b87d-iiief6c9a3ha": {
//         verified: false,
//         verifiedAt: null,
//         method: "manual_review",
//         userConfirmed: true,
//         username: "TestUser123",
//       },
//     },
//     additional_context: "Resubmission after initial feedback",
//     quest_name: "Twitter Engagement Challenge",
//     ambassador_name: "John Doe",
//     category_name: "Social Media",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567893",
//     review_comment:
//       "The submission does not meet the quality standards required.",
//     reviewed_by: "Admin Charlie",
//     reviewed_at: "2025-07-02T15:53:26.778Z",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-02T02:25:48.334Z",
//         details: "Twitter Engagement Challenge",
//       },
//     ],
//   },
// ];

// export default function AdminReviewPage() {
//   // Get current pod from Redux
//   const currentPod = useSelector((state) => state.pods.currentPod);
//   const podId = currentPod?.pod_id || "pod_default";

//   // State management
//   const [submissions, setSubmissions] = useState(mockSubmissions);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [reviewComment, setReviewComment] = useState("");

//   // Filter states
//   const [filters, setFilters] = useState({
//     status: "pending",
//     user: "",
//     quest: "",
//     category: "all",
//   });

//   // Auto-select first submission on load
//   useEffect(() => {
//     if (mockSubmissions.length > 0 && !selectedSubmission) {
//       setSelectedSubmission(mockSubmissions[0]);
//     }
//   }, [selectedSubmission]);

//   // Handle filter changes
//   const handleFilterChange = useCallback((newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }));
//   }, []);

//   // Handle fetch submissions with filters - simulates API call
//   const handleFetchSubmissions = useCallback(
//     async (newFilters) => {
//       setLoading(true);

//       try {
//         // Simulate API delay
//         await new Promise((resolve) => setTimeout(resolve, 800));

//         // Filter mock data (simulating backend filtering)
//         let filteredData = [...mockSubmissions];

//         // Apply filters
//         if (newFilters.status && newFilters.status !== "all") {
//           if (newFilters.status === "flagged") {
//             filteredData = filteredData.filter((sub) => sub.is_flagged);
//           } else {
//             filteredData = filteredData.filter(
//               (sub) => sub.review_status === newFilters.status,
//             );
//           }
//         }

//         if (newFilters.user) {
//           filteredData = filteredData.filter((sub) =>
//             sub.ambassador_name
//               .toLowerCase()
//               .includes(newFilters.user.toLowerCase()),
//           );
//         }

//         if (newFilters.quest) {
//           filteredData = filteredData.filter((sub) =>
//             sub.quest_name
//               .toLowerCase()
//               .includes(newFilters.quest.toLowerCase()),
//           );
//         }

//         if (newFilters.category && newFilters.category !== "all") {
//           filteredData = filteredData.filter(
//             (sub) => sub.category_name === newFilters.category,
//           );
//         }

//         // Simulate pagination (first 20 results)
//         const paginatedData = filteredData.slice(0, 20);

//         setSubmissions(paginatedData);

//         // Auto-select first submission if none selected or current selection not in results
//         if (paginatedData.length > 0) {
//           const currentSelectionExists = paginatedData.find(
//             (s) => s.submission_id === selectedSubmission?.submission_id,
//           );

//           if (!currentSelectionExists) {
//             setSelectedSubmission(paginatedData[0]);
//           }
//         } else {
//           setSelectedSubmission(null);
//         }
//       } catch (error) {
//         console.error("Failed to fetch submissions:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [selectedSubmission],
//   );

//   // Initial load
//   useEffect(() => {
//     if (podId) {
//       handleFetchSubmissions(filters);
//     }
//   }, [podId, handleFetchSubmissions, filters]);

//   const handleSelectSubmission = (submission) => {
//     setSelectedSubmission(submission);
//     setReviewComment("");

//     // Mark as read when selected
//     if (!submission.is_read_by_admin) {
//       setSubmissions((prev) =>
//         prev.map((sub) =>
//           sub.submission_id === submission.submission_id
//             ? { ...sub, is_read_by_admin: true }
//             : sub,
//         ),
//       );
//     }
//   };

//   const handleReviewSubmission = async (submissionId, action, comment = "") => {
//     setReviewLoading(true);

//     try {
//       // In real app, this would be an API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update submissions state
//       setSubmissions((prev) =>
//         prev.map((sub) => {
//           if (sub.submission_id === submissionId) {
//             const updatedSub = {
//               ...sub,
//               review_status: action,
//               is_read_by_admin: true,
//               updated_at: new Date().toISOString(),
//               reviewed_by: "Admin User",
//               reviewed_at: new Date().toISOString(),
//               review_comment: comment,
//             };

//             // Add rewards for approved/highlighted submissions
//             if (action === "approved") {
//               updatedSub.rewards = [{ amount: 100, type: "points" }];
//             } else if (action === "highlighted") {
//               updatedSub.rewards = [{ amount: 200, type: "points" }];
//             }

//             // Add to activity log
//             updatedSub.activity_log = [
//               ...updatedSub.activity_log,
//               {
//                 action: "reviewed",
//                 result:
//                   action === "approved"
//                     ? "Success"
//                     : action === "highlighted"
//                       ? "Highlighted"
//                       : "Failure",
//                 timestamp: new Date().toISOString(),
//                 details: `Reviewed submission with ${
//                   action === "approved"
//                     ? "Success"
//                     : action === "highlighted"
//                       ? "Highlighted"
//                       : "Failure"
//                 }`,
//               },
//             ];

//             return updatedSub;
//           }
//           return sub;
//         }),
//       );

//       // Update selected submission
//       if (selectedSubmission?.submission_id === submissionId) {
//         setSelectedSubmission((prev) => ({
//           ...prev,
//           review_status: action,
//           reviewed_by: "Admin User",
//           reviewed_at: new Date().toISOString(),
//           review_comment: comment,
//           rewards:
//             action === "approved"
//               ? [{ amount: 100, type: "points" }]
//               : action === "highlighted"
//                 ? [{ amount: 200, type: "points" }]
//                 : [],
//         }));
//       }

//       setReviewComment("");
//     } catch (error) {
//       console.error("Failed to review submission:", error);
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   if (!currentPod) {
//     return (
//       <MainPageScroll scrollable={false}>
//         <div className="flex h-full items-center justify-center">
//           <div className="mx-auto max-w-md p-8 text-center">
//             <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-content2 shadow-lg">
//               <InboxIcon className="h-12 w-12 text-foreground-400" />
//             </div>
//             <h2 className="mb-4 text-2xl font-bold text-foreground-600">
//               Select a Pod
//             </h2>
//             <p className="mb-6 leading-relaxed text-foreground-400">
//               Please select a pod from the sidebar to view and manage
//               submissions. Each pod contains unique quests and ambassador
//               activities.
//             </p>
//             <Card className="bg-content2">
//               <CardBody className="p-4">
//                 <div className="flex items-center gap-2 text-sm text-foreground-500">
//                   <FilterIcon className="h-4 w-4" />
//                   <span>Use the pod selector to get started</span>
//                 </div>
//               </CardBody>
//             </Card>
//           </div>
//         </div>
//       </MainPageScroll>
//     );
//   }

//   return (
//     <MainPageScroll scrollable={false}>
//       <div className="flex h-full flex-1 gap-4">
//         <WrapperContainer scrollable={true} className="">
//           <SubmissionsList
//             loading={loading}
//             filters={filters}
//             currentPod={currentPod}
//             submissions={submissions}
//             onFilterChange={handleFilterChange}
//             selectedSubmission={selectedSubmission}
//             onSelectSubmission={handleSelectSubmission}
//             onFetchSubmissions={handleFetchSubmissions}
//           />
//         </WrapperContainer>

//         <WrapperContainer
//           scrollable={false}
//           className="flex-[2] overflow-y-auto scrollbar-hide"
//         >
//           <ReviewDetailsPanel
//             isLoading={detailsLoading} // Use separate details loading
//             reviewComment={reviewComment}
//             submission={selectedSubmission}
//             onReview={handleReviewSubmission}
//             setReviewComment={setReviewComment}
//             reviewLoading={reviewLoading}
//           />
//         </WrapperContainer>
//       </div>
//     </MainPageScroll>
//   );
// }

// "use client";

// import { useSelector } from "react-redux";
// import { useState, useEffect, useCallback } from "react";

// import ReviewDetailsPanel from "./ReviewDetailsPanel";
// import MainPageScroll from "@/components/common/MainPageScroll";
// import WrapperContainer from "@/components/common/WrapperContainer";
// import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
// import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";

// // Complete mock data with all statuses
// const mockSubmissions = [
//   {
//     submission_id: "sub_1a234b5c-d678-9012-3456-789abcdef123",
//     category_id: "category_cc749aa5-c16b-438c-9c33-b437a28f06c5",
//     pod_id: "pod_7843a5df-8978-439e-892c-378443cf0825",
//     quest_id: "quest_aca8f2c5-5913-4885-8f32-eaaa678043da",
//     ambassador_id: "user_742cafdc-5575-4eb9-89a0-ecef31396264",
//     submitted_at: "2025-07-03T10:30:16.611Z",
//     updated_at: "2025-07-03T10:30:16.611Z",
//     review_status: "pending",
//     is_read_by_admin: false,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [],
//     submission_data: {
//       "003e3145-42b4-46fa-954a-ffbb3a9770e7": {
//         verified: true,
//         verifiedAt: "2025-07-03T10:30:13.157Z",
//         method: "user_confirmation",
//         userConfirmed: true,
//         username: "CryptoExplorer",
//       },
//     },
//     additional_context:
//       "User completed the blockchain analysis quest successfully",
//     quest_name: "Blockchain Technology Deep Dive",
//     ambassador_name: "Alice Johnson",
//     category_name: "Research",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567890",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-03T10:30:16.611Z",
//         details: "Blockchain Technology Deep Dive",
//       },
//     ],
//   },
//   {
//     submission_id: "sub_2b345c6d-e789-0123-4567-890abcdef234",
//     category_id: "category_dd859bb6-d27c-549d-ad44-c548b39g17d6",
//     pod_id: "pod_8954b6eg-9089-54af-9a3d-489554dg1936",
//     quest_id: "quest_bdb9g3d6-6024-5996-9g43-fbbf789154eb",
//     ambassador_id: "user_853dbgdd-6686-5fba-9ab1-fdgg42407375",
//     submitted_at: "2025-07-03T08:15:42.445Z",
//     updated_at: "2025-07-03T08:15:42.445Z",
//     review_status: "pending",
//     is_read_by_admin: false,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [],
//     submission_data: {
//       "114f4256-53c5-57gb-965b-gggcc4a881f8": {
//         verified: true,
//         verifiedAt: "2025-07-03T08:15:39.001Z",
//         method: "user_confirmation",
//         userConfirmed: true,
//         username: "SocialMediaPro",
//       },
//     },
//     additional_context: "Strong engagement metrics on social platforms",
//     quest_name: "Social Media Campaign Management",
//     ambassador_name: "Bob Smith",
//     category_name: "Social Media",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567891",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-03T08:15:42.445Z",
//         details: "Social Media Campaign Management",
//       },
//     ],
//   },
//   {
//     submission_id: "sub_3c456d7e-f890-1234-5678-901abcdef345",
//     category_id: "category_ee969cc7-e38d-65ae-be55-d659c4ah28e7",
//     pod_id: "pod_9a65c7fh-a19a-65bg-ab4e-59a665eh2a47",
//     quest_id: "quest_ceca4e7-7135-6aa7-ah54-gccg89a265fc",
//     ambassador_id: "user_964ecgee-7797-6gcb-abc2-gehrr53518486",
//     submitted_at: "2025-07-03T06:45:28.223Z",
//     updated_at: "2025-07-03T06:45:28.223Z",
//     review_status: "pending",
//     is_read_by_admin: true,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [],
//     submission_data: {
//       "225g5367-64d6-68hc-a76c-hhhdd5b992g9": {
//         verified: true,
//         verifiedAt: "2025-07-03T06:45:25.001Z",
//         method: "automated_verification",
//         userConfirmed: true,
//         username: "CommunityBuilder",
//       },
//     },
//     additional_context: "Excellent community engagement and participation",
//     quest_name: "Community Building Initiative",
//     ambassador_name: "Carol Davis",
//     category_name: "Community",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567892",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-03T06:45:28.223Z",
//         details: "Community Building Initiative",
//       },
//     ],
//   },
//   {
//     submission_id: "sub_4d567e8f-0123-2345-6789-012abcdef456",
//     category_id: "category_ff979dd8-f49e-76bf-cf66-e769d5bi39f8",
//     pod_id: "pod_ab76d8gi-b2ab-76ch-bc5f-69b776fi3b58",
//     quest_id: "quest_dfdb5f8-8246-7bb8-bi65-hddh9ab376gd",
//     ambassador_id: "user_a75fdhff-8898-7hdc-bcd3-hfiis64629597",
//     submitted_at: "2025-07-03T04:20:48.334Z",
//     updated_at: "2025-07-03T04:20:48.334Z",
//     review_status: "pending",
//     is_read_by_admin: false,
//     is_flagged: true,
//     resubmission_count: 0,
//     rewards: [],
//     submission_data: {
//       "336h6478-75e7-79id-b87d-iiief6c9a3ha": {
//         verified: false,
//         verifiedAt: null,
//         method: "manual_review",
//         userConfirmed: true,
//         username: "NewContributor",
//       },
//     },
//     additional_context: "Requires manual review due to verification issues",
//     quest_name: "Smart Contract Development",
//     ambassador_name: "David Wilson",
//     category_name: "Technical",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567893",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-03T04:20:48.334Z",
//         details: "Smart Contract Development",
//       },
//     ],
//   },
//   {
//     submission_id: "sub_5e678f90-1234-3456-7890-123abcdef567",
//     category_id: "category_gg079ee9-g50f-87cg-dg77-f870e6cj40g9",
//     pod_id: "pod_bc87e9hj-c3bc-87di-cd6g-70c887gj4c69",
//     quest_id: "quest_egec6g9-9357-8cc9-cj76-ieei0bc487he",
//     ambassador_id: "user_b86geigg-9909-8ied-cde4-igjjt75740608",
//     submitted_at: "2025-07-03T02:10:12.445Z",
//     updated_at: "2025-07-03T02:10:12.445Z",
//     review_status: "pending",
//     is_read_by_admin: false,
//     is_flagged: false,
//     resubmission_count: 1,
//     rewards: [],
//     submission_data: {
//       "447i7589-86f8-80je-c98e-jjjgg6d003ib": {
//         verified: true,
//         verifiedAt: "2025-07-03T02:10:09.001Z",
//         method: "user_confirmation",
//         userConfirmed: true,
//         username: "ContentCreator",
//       },
//     },
//     additional_context: "Resubmission with improved content quality",
//     quest_name: "Content Creation Workshop",
//     ambassador_name: "Emma Brown",
//     category_name: "Content",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567894",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-03T02:10:12.445Z",
//         details: "Content Creation Workshop",
//       },
//     ],
//   },
//   // Approved submissions
//   {
//     submission_id: "sub_2f434a9b-a320-436e-94f3-14eea2044c61",
//     category_id: "category_cc749aa5-c16b-438c-9c33-b437a28f06c5",
//     pod_id: "pod_9a65c7fh-a19a-65bg-ab4e-59a665eh2a47",
//     quest_id: "quest_ceca4e7-7135-6aa7-ah54-gccg89a265fc",
//     ambassador_id: "user_964ecgee-7797-6gcb-abc2-gehrr53518486",
//     submitted_at: "2025-07-02T04:15:28.223Z",
//     updated_at: "2025-07-02T16:42:15.889Z",
//     review_status: "approved",
//     is_read_by_admin: true,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [{ amount: 150, type: "points" }],
//     submission_data: {
//       "225g5367-64d6-68hc-a76c-hhhdd5b992g9": {
//         verified: true,
//         verifiedAt: "2025-07-02T04:15:25.001Z",
//         method: "automated_verification",
//         userConfirmed: true,
//         username: "DefiExplorer",
//       },
//     },
//     additional_context: "Great community engagement",
//     quest_name: "DeFi Protocol Analysis",
//     ambassador_name: "Mike Chen",
//     category_name: "Research",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567892",
//     review_comment: "Good submission with proper documentation.",
//     reviewed_by: "Admin Bob",
//     reviewed_at: "2025-07-02T16:42:15.889Z",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-02T04:15:28.223Z",
//         details: "DeFi Protocol Analysis",
//       },
//       {
//         action: "reviewed",
//         result: "Success",
//         timestamp: "2025-07-02T16:42:15.889Z",
//         details: "Reviewed submission with Success",
//       },
//     ],
//   },
//   // Highlighted submission
//   {
//     submission_id: "sub_6f789g01-2345-4567-8901-234abcdef678",
//     category_id: "category_dd859bb6-d27c-549d-ad44-c548b39g17d6",
//     pod_id: "pod_8954b6eg-9089-54af-9a3d-489554dg1936",
//     quest_id: "quest_bdb9g3d6-6024-5996-9g43-fbbf789154eb",
//     ambassador_id: "user_853dbgdd-6686-5fba-9ab1-fdgg42407375",
//     submitted_at: "2025-07-02T09:23:42.445Z",
//     updated_at: "2025-07-02T14:23:42.445Z",
//     review_status: "highlighted",
//     is_read_by_admin: true,
//     is_flagged: false,
//     resubmission_count: 0,
//     rewards: [{ amount: 200, type: "points" }],
//     submission_data: {
//       "114f4256-53c5-57gb-965b-gggcc4a881f8": {
//         verified: true,
//         verifiedAt: "2025-07-02T09:23:39.001Z",
//         method: "automated_verification",
//         userConfirmed: true,
//         username: "CryptoMaven",
//       },
//     },
//     additional_context: "Excellent engagement and reach metrics",
//     quest_name: "Discord Community Building",
//     ambassador_name: "Sarah Wilson",
//     category_name: "Community",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567891",
//     reviewed_by: "Admin Alice",
//     reviewed_at: "2025-07-02T14:23:42.445Z",
//     review_comment:
//       "Outstanding work! The analysis was thorough and well-documented.",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-02T09:23:42.445Z",
//         details: "Discord Community Building",
//       },
//       {
//         action: "reviewed",
//         result: "Success",
//         timestamp: "2025-07-02T10:23:42.445Z",
//         details: "Reviewed submission with Success",
//       },
//       {
//         action: "reviewed",
//         result: "Highlighted",
//         timestamp: "2025-07-02T14:23:42.445Z",
//         details: "Reviewed submission with Highlighted status",
//       },
//     ],
//   },
//   // Rejected submission
//   {
//     submission_id: "sub_5i767d9e-d653-769h-c7i6-47hha5d377e94",
//     category_id: "category_ff979dd8-f49e-76bf-cf66-e769d5bi39f8",
//     pod_id: "pod_ab76d8gi-b2ab-76ch-bc5f-69b776fi3b58",
//     quest_id: "quest_dfdb5f8-8246-7bb8-bi65-hddh9ab376gd",
//     ambassador_id: "user_a75fdhff-8898-7hdc-bcd3-hfiis64629597",
//     submitted_at: "2025-07-02T02:25:48.334Z",
//     updated_at: "2025-07-02T15:53:26.778Z",
//     review_status: "rejected",
//     is_read_by_admin: true,
//     is_flagged: true,
//     resubmission_count: 1,
//     rewards: [],
//     submission_data: {
//       "336h6478-75e7-79id-b87d-iiief6c9a3ha": {
//         verified: false,
//         verifiedAt: null,
//         method: "manual_review",
//         userConfirmed: true,
//         username: "TestUser123",
//       },
//     },
//     additional_context: "Resubmission after initial feedback",
//     quest_name: "Twitter Engagement Challenge",
//     ambassador_name: "John Doe",
//     category_name: "Social Media",
//     twitter_link: "https://twitter.com/neo_blockchain/status/1234567893",
//     review_comment:
//       "The submission does not meet the quality standards required.",
//     reviewed_by: "Admin Charlie",
//     reviewed_at: "2025-07-02T15:53:26.778Z",
//     activity_log: [
//       {
//         action: "submitted",
//         timestamp: "2025-07-02T02:25:48.334Z",
//         details: "Twitter Engagement Challenge",
//       },
//     ],
//   },
// ];

// const AdminReviewPage = () => {
//   // Fixed Redux selector - get pod_id directly and create mock currentPod
//   const podId = useSelector((state) => state.pods.currentPod);

//   // Create mock currentPod object since you only store pod_id in Redux
//   const currentPod = podId
//     ? {
//         pod_id: podId,
//         name: "Selected Pod", // You can customize this or get it from another source
//       }
//     : null;

//   // State management
//   const [submissions, setSubmissions] = useState([]);
//   const [listLoading, setListLoading] = useState(false);
//   const [reviewComment, setReviewComment] = useState("");
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   // Filter states
//   const [filters, setFilters] = useState({
//     status: "pending",
//     user: "",
//     quest: "",
//     category: "all",
//   });

//   // Memoized filter change handler
//   const handleFilterChange = useCallback((newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }));
//   }, []);

//   // Optimized fetch submissions function
//   const handleFetchSubmissions = useCallback(
//     async (newFilters) => {
//       if (!podId) return;

//       setListLoading(true);

//       try {
//         // Simulate API delay
//         await new Promise((resolve) => setTimeout(resolve, 800));

//         // Filter mock data (simulating backend filtering)
//         let filteredData = [...mockSubmissions];

//         // Apply filters
//         if (newFilters.status && newFilters.status !== "all") {
//           if (newFilters.status === "flagged") {
//             filteredData = filteredData.filter((sub) => sub.is_flagged);
//           } else {
//             filteredData = filteredData.filter(
//               (sub) => sub.review_status === newFilters.status,
//             );
//           }
//         }

//         if (newFilters.user) {
//           filteredData = filteredData.filter((sub) =>
//             sub.ambassador_name
//               .toLowerCase()
//               .includes(newFilters.user.toLowerCase()),
//           );
//         }

//         if (newFilters.quest) {
//           filteredData = filteredData.filter((sub) =>
//             sub.quest_name
//               .toLowerCase()
//               .includes(newFilters.quest.toLowerCase()),
//           );
//         }

//         if (newFilters.category && newFilters.category !== "all") {
//           filteredData = filteredData.filter(
//             (sub) => sub.category_name === newFilters.category,
//           );
//         }

//         // Sort by priority (unread first, then by date)
//         filteredData.sort((a, b) => {
//           // Unread submissions first
//           if (a.is_read_by_admin !== b.is_read_by_admin) {
//             return a.is_read_by_admin ? 1 : -1;
//           }
//           // Then by submitted date (newest first)
//           return new Date(b.submitted_at) - new Date(a.submitted_at);
//         });

//         // Simulate pagination (first 20 results)
//         const paginatedData = filteredData.slice(0, 20);

//         setSubmissions(paginatedData);

//         // Auto-select first submission if none selected or current selection not in results
//         if (paginatedData.length > 0) {
//           const currentSelectionExists = paginatedData.find(
//             (s) => s.submission_id === selectedSubmission?.submission_id,
//           );

//           if (!currentSelectionExists) {
//             setSelectedSubmission(paginatedData[0]);
//           }
//         } else {
//           setSelectedSubmission(null);
//         }
//       } catch (error) {
//         console.error("Failed to fetch submissions:", error);
//       } finally {
//         setListLoading(false);
//       }
//     },
//     [podId, selectedSubmission?.submission_id],
//   );

//   // Initial load effect
//   useEffect(() => {
//     if (podId) {
//       handleFetchSubmissions(filters);
//     }
//   }, [podId, handleFetchSubmissions, filters]);

//   // Handle submission selection with details loading
//   const handleSelectSubmission = useCallback(
//     async (submission) => {
//       if (submission.submission_id === selectedSubmission?.submission_id) {
//         return; // Already selected
//       }

//       setDetailsLoading(true);
//       setReviewComment("");

//       try {
//         // Simulate API call for submission details
//         await new Promise((resolve) => setTimeout(resolve, 300));

//         setSelectedSubmission(submission);

//         // Mark as read when selected
//         if (!submission.is_read_by_admin) {
//           setSubmissions((prev) =>
//             prev.map((sub) =>
//               sub.submission_id === submission.submission_id
//                 ? { ...sub, is_read_by_admin: true }
//                 : sub,
//             ),
//           );
//         }
//       } catch (error) {
//         console.error("Failed to load submission details:", error);
//       } finally {
//         setDetailsLoading(false);
//       }
//     },
//     [selectedSubmission?.submission_id],
//   );

//   // Optimized review submission handler
//   const handleReviewSubmission = useCallback(
//     async (submissionId, action, comment = "") => {
//       setReviewLoading(true);

//       try {
//         // Simulate API call
//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         const now = new Date().toISOString();

//         // Update submissions state
//         setSubmissions((prev) =>
//           prev.map((sub) => {
//             if (sub.submission_id === submissionId) {
//               const updatedSub = {
//                 ...sub,
//                 review_status: action,
//                 is_read_by_admin: true,
//                 updated_at: now,
//                 reviewed_by: "Admin User",
//                 reviewed_at: now,
//                 review_comment: comment,
//               };

//               // Add rewards for approved/highlighted submissions
//               if (action === "approved") {
//                 updatedSub.rewards = [{ amount: 100, type: "points" }];
//               } else if (action === "highlighted") {
//                 updatedSub.rewards = [{ amount: 200, type: "points" }];
//               }

//               // Add to activity log
//               updatedSub.activity_log = [
//                 ...updatedSub.activity_log,
//                 {
//                   action: "reviewed",
//                   result:
//                     action === "approved"
//                       ? "Success"
//                       : action === "highlighted"
//                         ? "Highlighted"
//                         : "Failure",
//                   timestamp: now,
//                   details: `Reviewed submission with ${
//                     action === "approved"
//                       ? "Success"
//                       : action === "highlighted"
//                         ? "Highlighted"
//                         : "Failure"
//                   }`,
//                 },
//               ];

//               return updatedSub;
//             }
//             return sub;
//           }),
//         );

//         // Update selected submission
//         if (selectedSubmission?.submission_id === submissionId) {
//           setSelectedSubmission((prev) => ({
//             ...prev,
//             review_status: action,
//             reviewed_by: "Admin User",
//             reviewed_at: now,
//             review_comment: comment,
//             rewards:
//               action === "approved"
//                 ? [{ amount: 100, type: "points" }]
//                 : action === "highlighted"
//                   ? [{ amount: 200, type: "points" }]
//                   : [],
//           }));
//         }

//         setReviewComment("");
//       } catch (error) {
//         console.error("Failed to review submission:", error);
//       } finally {
//         setReviewLoading(false);
//       }
//     },
//     [selectedSubmission?.submission_id],
//   );

//   // Show no pod selected state
//   if (!currentPod) {
//     return (
//       <MainPageScroll scrollable={false}>
//         <NoPodSelected />
//       </MainPageScroll>
//     );
//   }

//   return (
//     <MainPageScroll scrollable={false}>
//       <div className="flex h-full flex-1 gap-4">
//         <WrapperContainer scrollable={true} className="flex-1">
//           <SubmissionsList
//             loading={listLoading}
//             filters={filters}
//             currentPod={currentPod}
//             submissions={submissions}
//             onFilterChange={handleFilterChange}
//             selectedSubmission={selectedSubmission}
//             onSelectSubmission={handleSelectSubmission}
//             onFetchSubmissions={handleFetchSubmissions}
//           />
//         </WrapperContainer>

//         <WrapperContainer
//           scrollable={false}
//           className="flex-[2] overflow-y-auto scrollbar-hide"
//         >
//           <ReviewDetailsPanel
//             isLoading={detailsLoading}
//             reviewComment={reviewComment}
//             submission={selectedSubmission}
//             onReview={handleReviewSubmission}
//             setReviewComment={setReviewComment}
//             reviewLoading={reviewLoading}
//           />
//         </WrapperContainer>
//       </div>
//     </MainPageScroll>
//   );
// };

// export default AdminReviewPage;

// "use client";

// import { useSelector } from "react-redux";
// import { useState, useEffect, useCallback } from "react";

// import ReviewDetailsPanel from "./ReviewDetailsPanel";
// import MainPageScroll from "@/components/common/MainPageScroll";
// import WrapperContainer from "@/components/common/WrapperContainer";
// import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
// import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";

// // API utility functions
// const buildApiUrl = (podId, status) => {
//   const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

//   switch (status) {
//     case "all":
//       return baseUrl;
//     case "flagged":
//       return `${baseUrl}/flagged`;
//     case "pending":
//     case "approved":
//     case "rejected":
//     case "highlighted":
//       return `${baseUrl}/${status}`;
//     default:
//       return `${baseUrl}/pending`;
//   }
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

// const AdminReviewPage = () => {
//   const podId = useSelector((state) => state.pods.currentPod);

//   // Create currentPod object for components that need it
//   const currentPod = podId
//     ? {
//         pod_id: podId,
//         name: "Selected Pod",
//       }
//     : null;

//   // Pagination state
//   const [hasMore, setHasMore] = useState(true);
//   const [nextKey, setNextKey] = useState(null);

//   // Core state
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [currentStatus, setCurrentStatus] = useState("pending");

//   // Loading states
//   const [listLoading, setListLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Fetch submissions from API
//   const fetchSubmissions = useCallback(
//     async (status, lastEvaluatedKey = null, isLoadMore = false) => {
//       if (!podId) return;

//       try {
//         // Set loading states
//         if (!isLoadMore) {
//           setHasMore(true);
//           setNextKey(null);
//           setSubmissions([]);
//           setListLoading(true);
//         } else {
//           setLoadingMore(true);
//         }

//         // Build API URL and params
//         const apiUrl = buildApiUrl(podId, status);
//         const params = new URLSearchParams({ limit: "10" });

//         if (lastEvaluatedKey) {
//           params.append("next_key", lastEvaluatedKey);
//         }

//         // Make API request
//         const data = await apiRequest(`${apiUrl}?${params}`);

//         // Extract response data
//         const newNextKey = data.data.next_key || null;
//         const rawSubmissions = data.data.submissions || [];
//         const newHasMore = newNextKey !== null;

//         // Update state
//         if (isLoadMore) {
//           setSubmissions((prev) => [...prev, ...rawSubmissions]);
//         } else {
//           setSubmissions(rawSubmissions);
//           setSelectedSubmission(
//             rawSubmissions.length > 0 ? rawSubmissions[0] : null,
//           );
//         }

//         setNextKey(newNextKey);
//         setHasMore(newHasMore);
//       } catch (error) {
//         console.error("Failed to fetch submissions:", error);
//         if (!isLoadMore) {
//           setSubmissions([]);
//           setSelectedSubmission(null);
//         }
//       } finally {
//         setListLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [podId],
//   );

//   // Handle status filter change
//   const handleStatusChange = useCallback(
//     (status) => {
//       setCurrentStatus(status);
//       fetchSubmissions(status, null, false);
//     },
//     [fetchSubmissions],
//   );

//   // Handle load more
//   const handleLoadMore = useCallback(() => {
//     if (!hasMore || loadingMore) return;
//     fetchSubmissions(currentStatus, nextKey, true);
//   }, [currentStatus, nextKey, hasMore, loadingMore, fetchSubmissions]);

//   // Handle submission selection
//   const handleSelectSubmission = useCallback(
//     async (submission) => {
//       if (submission.submission_id === selectedSubmission?.submission_id) {
//         return;
//       }

//       setSelectedSubmission(submission);

//       // Mark as read when selected
//       if (!submission.is_read_by_admin) {
//         try {
//           await apiRequest(
//             `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submission.submission_id}/mark-read`,
//             { method: "POST" },
//           );

//           // Update local state
//           setSubmissions((prev) =>
//             prev.map((sub) =>
//               sub.submission_id === submission.submission_id
//                 ? { ...sub, is_read_by_admin: true }
//                 : sub,
//             ),
//           );
//         } catch (error) {
//           console.error("Failed to mark submission as read:", error);
//         }
//       }
//     },
//     [selectedSubmission?.submission_id],
//   );

//   // Update submission in local state after review
//   const handleSubmissionUpdate = useCallback(
//     (updatedSubmission) => {
//       setSubmissions((prev) =>
//         prev.map((sub) =>
//           sub.submission_id === updatedSubmission.submission_id
//             ? updatedSubmission
//             : sub,
//         ),
//       );

//       if (
//         selectedSubmission?.submission_id === updatedSubmission.submission_id
//       ) {
//         setSelectedSubmission(updatedSubmission);
//       }
//     },
//     [selectedSubmission?.submission_id],
//   );

//   // Initial load
//   useEffect(() => {
//     if (podId) {
//       fetchSubmissions(currentStatus, null, false);
//     }
//   }, [podId, fetchSubmissions, currentStatus]);

//   // Early return if no pod selected
//   if (!currentPod) {
//     return (
//       <MainPageScroll scrollable={false}>
//         <NoPodSelected />
//       </MainPageScroll>
//     );
//   }

//   return (
//     <MainPageScroll scrollable={false}>
//       <div className="flex h-full flex-1 gap-4">
//         <WrapperContainer scrollable={true} className="flex-1">
//           <SubmissionsList
//             hasMore={hasMore}
//             loading={listLoading}
//             currentPod={currentPod}
//             loadingMore={loadingMore}
//             submissions={submissions}
//             onLoadMore={handleLoadMore}
//             currentStatus={currentStatus}
//             onStatusChange={handleStatusChange}
//             selectedSubmission={selectedSubmission}
//             onSelectSubmission={handleSelectSubmission}
//           />
//         </WrapperContainer>

//         <WrapperContainer
//           scrollable={false}
//           className="flex-[2] overflow-y-auto scrollbar-hide"
//         >
//           <ReviewDetailsPanel
//             submission={selectedSubmission}
//             onSubmissionUpdate={handleSubmissionUpdate}
//           />
//         </WrapperContainer>
//       </div>
//     </MainPageScroll>
//   );
// };

// export default AdminReviewPage;

// "use client";

// import { useSelector } from "react-redux";
// import { useState, useEffect, useCallback } from "react";

// import ReviewDetailsPanel from "./ReviewDetailsPanel";
// import MainPageScroll from "@/components/common/MainPageScroll";
// import WrapperContainer from "@/components/common/WrapperContainer";
// import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
// import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";

// // API utility functions
// const buildApiUrl = (podId, status) => {
//   const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

//   switch (status) {
//     case "all":
//       return baseUrl;
//     case "flagged":
//       return `${baseUrl}/flagged`;
//     case "pending":
//     case "approved":
//     case "rejected":
//     case "highlighted":
//       return `${baseUrl}/${status}`;
//     default:
//       return `${baseUrl}/pending`;
//   }
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

// const AdminReviewPage = () => {
//   const podId = useSelector((state) => state.pods.currentPod);

//   // Pagination state
//   const [hasMore, setHasMore] = useState(true);
//   const [nextKey, setNextKey] = useState(null);

//   // Core state
//   const [submissions, setSubmissions] = useState([]);
//   const [currentStatus, setCurrentStatus] = useState("pending");
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   // Loading states
//   const [listLoading, setListLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Fetch submissions from API
//   const fetchSubmissions = useCallback(
//     async (status, lastEvaluatedKey = null, isLoadMore = false) => {
//       if (!podId) return;

//       try {
//         // Set loading states
//         if (!isLoadMore) {
//           setHasMore(true);
//           setNextKey(null);
//           setSubmissions([]);
//           setListLoading(true);
//         } else {
//           setLoadingMore(true);
//         }

//         // Build API URL and params
//         const apiUrl = buildApiUrl(podId, status);
//         const params = new URLSearchParams({ limit: "10" });

//         if (lastEvaluatedKey) {
//           params.append("last_key", lastEvaluatedKey);
//         }

//         // Make API request
//         const { data } = await apiRequest(`${apiUrl}?${params}`);

//         // Extract response data
//         const newNextKey = data.next_key || null;
//         const rawSubmissions = data.submissions || [];

//         const newHasMore = newNextKey !== null;

//         // Update state
//         if (isLoadMore) {
//           setSubmissions((prev) => [...prev, ...rawSubmissions]);
//         } else {
//           setSubmissions(rawSubmissions);
//           setSelectedSubmission(
//             rawSubmissions.length > 0 ? rawSubmissions[0] : null,
//           );
//         }

//         setNextKey(newNextKey);
//         setHasMore(newHasMore);
//       } catch (error) {
//         console.error("Failed to fetch submissions:", error);
//         if (!isLoadMore) {
//           setSubmissions([]);
//           setSelectedSubmission(null);
//         }
//       } finally {
//         setListLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [podId],
//   );

//   // Handle status filter change
//   const handleStatusChange = useCallback(
//     (status) => {
//       setCurrentStatus(status);
//       fetchSubmissions(status, null, false);
//     },
//     [fetchSubmissions],
//   );

//   // Handle load more
//   const handleLoadMore = useCallback(() => {
//     if (!hasMore || loadingMore) return;
//     fetchSubmissions(currentStatus, nextKey, true);
//   }, [currentStatus, nextKey, hasMore, loadingMore, fetchSubmissions]);

//   // Update submission in local state after review
//   const handleSubmissionUpdate = useCallback(
//     (updatedSubmission) => {
//       setSubmissions((prev) =>
//         prev.map((sub) =>
//           sub.submission_id === updatedSubmission.submission_id
//             ? updatedSubmission
//             : sub,
//         ),
//       );

//       if (
//         selectedSubmission?.submission_id === updatedSubmission.submission_id
//       ) {
//         setSelectedSubmission(updatedSubmission);
//       }
//     },
//     [selectedSubmission?.submission_id],
//   );

//   // Initial load
//   useEffect(() => {
//     if (podId) {
//       fetchSubmissions(currentStatus, null, false);
//     }
//   }, [podId, fetchSubmissions, currentStatus]);

//   // Early return if no pod selected
//   if (!podId) {
//     return (
//       <MainPageScroll scrollable={false}>
//         <NoPodSelected />
//       </MainPageScroll>
//     );
//   }

//   return (
//     <MainPageScroll scrollable={false}>
//       <div className="flex h-full flex-1 gap-4">
//         <WrapperContainer scrollable={true} className="flex-1">
//           <SubmissionsList
//             hasMore={hasMore}
//             loading={listLoading}
//             loadingMore={loadingMore}
//             submissions={submissions}
//             onLoadMore={handleLoadMore}
//             currentStatus={currentStatus}
//             setSubmissions={setSubmissions}
//             onStatusChange={handleStatusChange}
//             selectedSubmission={selectedSubmission}
//             setSelectedSubmission={setSelectedSubmission}
//           />
//         </WrapperContainer>

//         <WrapperContainer
//           scrollable={false}
//           className="flex-[2] overflow-y-auto scrollbar-hide"
//         >
//           <ReviewDetailsPanel
//             submission={selectedSubmission}
//             onSubmissionUpdate={handleSubmissionUpdate}
//           />
//         </WrapperContainer>
//       </div>
//     </MainPageScroll>
//   );
// };

// export default AdminReviewPage;

"use client";

import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";
import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";
import NoSubmissionSelected from "@/components/layout/submissions/admin/NoSubmissionSelected";
import ReviewDetailsPanel from "@/components/layout/submissions/admin/details/ReviewDetailsPanel";

// API utility functions
const buildApiUrl = (podId, status) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

  switch (status) {
    case "all":
      return baseUrl;
    case "flagged":
      return `${baseUrl}/flagged`;
    case "pending":
    case "approved":
    case "rejected":
    case "highlighted":
      return `${baseUrl}/${status}`;
    default:
      return `${baseUrl}/pending`;
  }
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const AdminReviewPage = () => {
  const podId = useSelector((state) => state.pods.currentPod);

  // Pagination state
  const [hasMore, setHasMore] = useState(true);
  const [nextKey, setNextKey] = useState(null);

  // Core state
  const [submissions, setSubmissions] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Loading states
  const [listLoading, setListLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Review functionality state
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Fetch submissions from API
  const fetchSubmissions = useCallback(
    async (status, lastEvaluatedKey = null, isLoadMore = false) => {
      if (!podId) return;

      try {
        // Set loading states
        if (!isLoadMore) {
          setHasMore(true);
          setNextKey(null);
          setSubmissions([]);
          setListLoading(true);
          // Clear selection when fetching new list
          setSelectedSubmission(null);
        } else {
          setLoadingMore(true);
        }

        // Build API URL and params
        const apiUrl = buildApiUrl(podId, status);
        const params = new URLSearchParams({ limit: "10" });

        if (lastEvaluatedKey) {
          params.append("last_key", lastEvaluatedKey);
        }

        // Make API request
        const { data } = await apiRequest(`${apiUrl}?${params}`);

        // Extract response data
        const newNextKey = data.next_key || null;
        const rawSubmissions = data.submissions || [];

        const newHasMore = newNextKey !== null;

        // Update state
        if (isLoadMore) {
          setSubmissions((prev) => [...prev, ...rawSubmissions]);
        } else {
          setSubmissions(rawSubmissions);
          // DON'T auto-select first submission - let user choose
        }

        setNextKey(newNextKey);
        setHasMore(newHasMore);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        if (!isLoadMore) {
          setSubmissions([]);
          setSelectedSubmission(null);
        }
      } finally {
        setListLoading(false);
        setLoadingMore(false);
      }
    },
    [podId],
  );

  // Handle status filter change
  const handleStatusChange = useCallback(
    (status) => {
      setCurrentStatus(status);
      setSelectedSubmission(null); // Clear selection immediately
      setReviewComment(""); // Clear any pending review comment
      fetchSubmissions(status, null, false);
    },
    [fetchSubmissions],
  );

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchSubmissions(currentStatus, nextKey, true);
  }, [currentStatus, nextKey, hasMore, loadingMore, fetchSubmissions]);

  // Handle review submission
  const handleReview = useCallback(
    async (submissionId, action, comment) => {
      try {
        setReviewLoading(true);

        const response = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
          {
            method: "PATCH",
            body: JSON.stringify({
              action,
              comment,
            }),
          },
        );

        // Update the submission in local state
        const updatedSubmission = response.data || response;

        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.submission_id === submissionId ? updatedSubmission : sub,
          ),
        );

        // Update selected submission if it's the one being reviewed
        if (selectedSubmission?.submission_id === submissionId) {
          setSelectedSubmission(updatedSubmission);
        }

        // Clear review comment
        setReviewComment("");

        // Show success message or handle success state
        console.log(`Submission ${action} successfully`);
      } catch (error) {
        console.error("Failed to review submission:", error);
        alert(`Failed to ${action} submission. Please try again.`);
      } finally {
        setReviewLoading(false);
      }
    },
    [selectedSubmission?.submission_id],
  );

  // Update submission in local state after review
  const handleSubmissionUpdate = useCallback(
    (updatedSubmission) => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.submission_id === updatedSubmission.submission_id
            ? updatedSubmission
            : sub,
        ),
      );

      if (
        selectedSubmission?.submission_id === updatedSubmission.submission_id
      ) {
        setSelectedSubmission(updatedSubmission);
      }
    },
    [selectedSubmission?.submission_id],
  );

  // Initial load
  useEffect(() => {
    if (podId) {
      fetchSubmissions(currentStatus, null, false);
    }
  }, [podId, fetchSubmissions, currentStatus]);

  // Early return if no pod selected
  if (!podId) {
    return (
      <MainPageScroll scrollable={false}>
        <NoPodSelected />
      </MainPageScroll>
    );
  }

  return (
    <MainPageScroll scrollable={false}>
      <div className="flex h-full flex-1 gap-4">
        <WrapperContainer scrollable={true} className="flex-1">
          <SubmissionsList
            hasMore={hasMore}
            loading={listLoading}
            loadingMore={loadingMore}
            submissions={submissions}
            onLoadMore={handleLoadMore}
            currentStatus={currentStatus}
            setSubmissions={setSubmissions}
            onStatusChange={handleStatusChange}
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
          />
        </WrapperContainer>

        {selectedSubmission ? (
          <ReviewDetailsPanel
            onReview={handleReview}
            reviewComment={reviewComment}
            submission={selectedSubmission}
            setReviewComment={setReviewComment}
            onSubmissionUpdate={handleSubmissionUpdate}
          />
        ) : (
          <NoSubmissionSelected
            currentStatus={currentStatus}
            submissionCount={submissions.length}
          />
        )}
      </div>
    </MainPageScroll>
  );
};

export default AdminReviewPage;
