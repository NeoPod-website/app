"use client";

import React from "react";
import { Button } from "@heroui/react";
import { SendHorizonalIcon } from "lucide-react";

const SubmitQuestBtn = () => {
  return (
    <Button
      size="lg"
      radius="full"
      className="neo-button border border-white bg-gradient-primary"
      endContent={<SendHorizonalIcon size={16} />}
    >
      Submit
    </Button>
  );
};

export default SubmitQuestBtn;
