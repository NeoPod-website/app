"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ShareIcon } from "lucide-react";

const ShareQuestBtn = () => {
  return (
    <Button
      size="lg"
      radius="full"
      className="neo-button border border-gray-400 bg-gradient-dark"
      endContent={<ShareIcon size={16} />}
    >
      Share
    </Button>
  );
};

export default ShareQuestBtn;
