import React from "react";
import { Textarea } from "@heroui/react";
import { MessageCircleIcon } from "lucide-react";

import QuestTaskContainer from "@/components/layout/quests/tasks/QuestTaskContainer";

const ReviewDetailsComment = ({
  submission,
  reviewComment,
  setReviewComment,
}) => {
  return (
    <QuestTaskContainer
      isAdmin={false}
      color="#746b21"
      text="Your Comment"
      icon={<MessageCircleIcon size={12} />}
    >
      <div
        style={{ borderColor: "#746b21" }}
        className="rounded-2xl rounded-tl-none border bg-gradient-dark p-5 pt-3"
      >
        <Textarea
          type="text"
          isClearable
          minRows={3}
          maxLength={400}
          variant="bordered"
          value={reviewComment}
          name="review_comment"
          label="Review Comment"
          className="text-white"
          onValueChange={setReviewComment}
          isInvalid={reviewComment.length >= 400}
          disabled={submission.review_status !== "pending"}
          placeholder={
            submission.review_comment !== "pending"
              ? "No comment provided"
              : "Provide more details about your category"
          }
          errorMessage="The description cannot be 400 characters long."
          classNames={{
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          }}
        />
      </div>
    </QuestTaskContainer>
  );
};

export default ReviewDetailsComment;
