import SubmissionItemLoader from "./SubmissionItemLoader";

const SubmissionListSkeleton = ({ count = 6 }) => (
  <div className="p-2">
    {Array.from({ length: count }).map((_, index) => (
      <SubmissionItemLoader key={index} />
    ))}
  </div>
);

export default SubmissionListSkeleton;
