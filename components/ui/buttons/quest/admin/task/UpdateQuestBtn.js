"use client";

import React from "react";
import { Button } from "@heroui/react";
import { SendIcon } from "lucide-react";

const UpdateQuestBtn = ({ isLoading, handleUpdateQuest }) => {
  const getButtonText = () => {
    if (isLoading) return "Updating...";

    return "Update";
  };

  return (
    <Button
      type="submit"
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault();
        const form = e.target.closest("form");

        if (form && form.checkValidity()) {
          handleUpdateQuest(e);
        } else {
          // Show validation messages
          form.reportValidity();
        }
      }}
      className="!h-8 max-h-8 min-h-8 !w-24 rounded border border-white bg-gradient-primary text-xs capitalize focus-within:!border-gray-300 focus-within:!ring-1 focus-within:!ring-gray-300 hover:!bg-black disabled:opacity-50 data-[hover=true]:!bg-black"
      endContent={<SendIcon size={16} />}
    >
      {getButtonText()}
    </Button>
  );
};

export default UpdateQuestBtn;
