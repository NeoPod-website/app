"use client";

import React from "react";
import { Button } from "@heroui/react";
import { HighlighterIcon } from "lucide-react";

const HighlightsQuestBtn = () => {
  return (
    <Button
      size="lg"
      radius="full"
      className="neo-button border border-gray-400 bg-gradient-dark"
      endContent={<HighlighterIcon size={16} />}
    >
      Highlights
    </Button>
  );
};

export default HighlightsQuestBtn;
