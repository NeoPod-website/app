"use client";

import React from "react";
import { Button } from "@heroui/react";
import { HighlighterIcon } from "lucide-react";

const HighlightSubmissionBtn = () => {
  return (
    <Button
      size="lg"
      radius="full"
      className="neo-button border border-gray-400 bg-gradient-dark"
      endContent={<HighlighterIcon size={16} />}
    >
      Highlight
    </Button>
  );
};

export default HighlightSubmissionBtn;
