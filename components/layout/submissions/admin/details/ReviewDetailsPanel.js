// import { MessageSquareIcon } from "lucide-react";

// import ReviewDetailsBtn from "./ReviewDetailsBtn";
// import ReviewDetailsHeader from "./ReviewDetailsHeader";
// import ReviewDetailsComment from "./ReviewDetailsComment";
// import ReviewDetailsTimeline from "./ReviewDetailsTimeline";
// import ReviewDetailsSubmissions from "./ReviewDetailsSubmissions";

// import WrapperContainer from "@/components/common/WrapperContainer";

// const ReviewDetailsPanel = ({
//   submission,
//   reviewComment,
//   setReviewComment,
//   onSubmissionUpdate,
// }) => {
//   if (!submission) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-900">
//         <div className="text-center text-gray-400">
//           <MessageSquareIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
//           <p>Select a submission to view details</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-[2] flex-col space-y-3 overflow-hidden">
//       <ReviewDetailsHeader
//         submission={submission}
//         onSubmissionUpdate={onSubmissionUpdate}
//       />

//       <WrapperContainer className="flex flex-1 flex-col justify-between space-y-6 overflow-y-auto p-6 scrollbar-hide">
//         <ReviewDetailsSubmissions submission={submission} />

//         <div className="space-y-6">
//           <ReviewDetailsTimeline submission={submission} />

//           <ReviewDetailsComment
//             submission={submission}
//             reviewComment={reviewComment}
//             setReviewComment={setReviewComment}
//           />
//         </div>
//       </WrapperContainer>

//       <ReviewDetailsBtn
//         submission={submission}
//         reviewComment={reviewComment}
//         setReviewComment={setReviewComment}
//         onSubmissionUpdate={onSubmissionUpdate}
//       />
//     </div>
//   );
// };

// export default ReviewDetailsPanel;

import { MessageSquareIcon } from "lucide-react";

import ReviewDetailsBtn from "./ReviewDetailsBtn";
import ReviewDetailsHeader from "./ReviewDetailsHeader";
import ReviewDetailsComment from "./ReviewDetailsComment";
import ReviewDetailsTimeline from "./ReviewDetailsTimeline";
import ReviewDetailsSubmissions from "./ReviewDetailsSubmissions";

import WrapperContainer from "@/components/common/WrapperContainer";

const ReviewDetailsPanel = ({
  submission,
  reviewComment,
  setReviewComment,
  onSubmissionUpdate,
  isTransitioning = false,
}) => {
  if (!submission) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <MessageSquareIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Select a submission to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-[2] flex-col space-y-3 overflow-hidden transition-opacity duration-300 ${
        isTransitioning ? "opacity-50" : "opacity-100"
      }`}
    >
      <ReviewDetailsHeader
        submission={submission}
        onSubmissionUpdate={onSubmissionUpdate}
      />

      <WrapperContainer className="flex flex-1 flex-col justify-between space-y-6 overflow-y-auto p-6 scrollbar-hide">
        <ReviewDetailsSubmissions submission={submission} />

        <div className="space-y-6">
          <ReviewDetailsTimeline submission={submission} />

          <ReviewDetailsComment
            submission={submission}
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
          />
        </div>
      </WrapperContainer>

      <ReviewDetailsBtn
        submission={submission}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        onSubmissionUpdate={onSubmissionUpdate}
        isTransitioning={isTransitioning}
      />
    </div>
  );
};

export default ReviewDetailsPanel;
