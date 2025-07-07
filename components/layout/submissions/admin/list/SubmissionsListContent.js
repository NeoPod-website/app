// // // components/admin/SubmissionsListContent.js
// // "use client";

// // import { FilterIcon } from "lucide-react";
// // import SubmissionCardItem from "./SubmissionCardItem";

// // const SubmissionsListContent = ({
// //   loading,
// //   submissions,
// //   selectedSubmission,
// //   onSelectSubmission,
// // }) => {
// //   if (loading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center p-12 text-center">
// //         <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
// //         <p className="text-foreground-500">Loading submissions...</p>
// //       </div>
// //     );
// //   }

// //   if (submissions.length === 0) {
// //     return (
// //       <div className="flex flex-col items-center justify-center p-12 text-center">
// //         <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-content2">
// //           <FilterIcon className="h-8 w-8 text-foreground-400" />
// //         </div>
// //         <p className="mb-2 text-lg font-medium text-foreground-500">
// //           No submissions found
// //         </p>
// //         <p className="text-sm text-foreground-400">
// //           Try adjusting your filters or search terms
// //         </p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-2">
// //       {submissions.map((submission) => (
// //         <SubmissionCardItem
// //           key={submission.submission_id}
// //           submission={submission}
// //           isSelected={
// //             selectedSubmission?.submission_id === submission.submission_id
// //           }
// //           onSelectSubmission={onSelectSubmission}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // export default SubmissionsListContent;

// // components/admin/list/SubmissionsListContent.js
// "use client";

// import { memo } from "react";
// import SubmissionCardItem from "./SubmissionCardItem";
// import SubmissionListSkeleton from "@/components/ui/loader/submission/admin/SubmissionListLoader";
// import { NoSubmissionsFound } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";

// const SubmissionsListContent = memo(
//   ({ loading, submissions, selectedSubmission, onSelectSubmission }) => {
//     if (loading) {
//       return <SubmissionListSkeleton count={6} />;
//     }

//     if (submissions.length === 0) {
//       return <NoSubmissionsFound />;
//     }

//     return (
//       <div className="p-2">
//         {submissions.map((submission) => (
//           <SubmissionCardItem
//             key={submission.submission_id}
//             submission={submission}
//             isSelected={
//               selectedSubmission?.submission_id === submission.submission_id
//             }
//             onSelectSubmission={onSelectSubmission}
//           />
//         ))}
//       </div>
//     );
//   },
// );

// SubmissionsListContent.displayName = "SubmissionsListContent";

// export default SubmissionsListContent;

"use client";

import { memo } from "react";

import SubmissionCardItem from "./SubmissionCardItem";
import LoadMoreAdminSubmissions from "./LoadMoreAdminSubmissions";

import { NoSubmissionsFound } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";
import SubmissionListSkeleton from "@/components/ui/loader/submission/admin/SubmissionListLoader";

const SubmissionsListContent = memo(
  ({
    loading,
    hasMore,
    onLoadMore,
    loadingMore,
    submissions,
    setSubmissions,
    selectedSubmission,
    setSelectedSubmission,
  }) => {
    // Show initial loading skeleton
    if (loading) {
      return <SubmissionListSkeleton count={6} />;
    }

    // Show empty state
    if (submissions.length === 0) {
      return <NoSubmissionsFound />;
    }

    return (
      <div className="p-2">
        <div className="space-y-3">
          {submissions.map((submission) => (
            <SubmissionCardItem
              submission={submission}
              key={submission.submission_id}
              setSubmissions={setSubmissions}
              selectedSubmission={selectedSubmission}
              setSelectedSubmission={setSelectedSubmission}
            />
          ))}
        </div>

        <LoadMoreAdminSubmissions
          onLoadMore={onLoadMore}
          loading={loadingMore}
          hasMore={hasMore}
        />
      </div>
    );
  },
);

SubmissionsListContent.displayName = "SubmissionsListContent";

export default SubmissionsListContent;
