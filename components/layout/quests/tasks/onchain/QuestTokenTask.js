"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";

import QuestTask from "../QuestTask";

const QuestTokenTask = () => {
  const amount = 100;

  return (
    <QuestTask
      text="Token"
      color="#000"
      icon={
        <div className="flex h-[12px] w-[12px] items-center justify-center overflow-hidden rounded">
          <Image src="/neo-logo.svg" width={12} height={12} alt="token" />
        </div>
      }
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded">
          <Image src="/neo-logo.svg" width={36} height={36} alt="token" />
        </div>

        <p>At least {amount} NEO required</p>
      </div>

      <Button
        fullWidth
        className="mt-4 border border-gray-400 bg-black text-white"
      >
        Verify Now
      </Button>
    </QuestTask>
  );
};

export default QuestTokenTask;
