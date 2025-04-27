"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { ImageIcon, SendHorizonalIcon } from "lucide-react";

import QuestTask from "../QuestTask";

const QuestNFTTask = () => {
  const NFTImage = "/neo-pod-logo.png";
  const NFTname = "NEO POD";
  const NFTDesp = "NEO POD";

  return (
    <QuestTask
      text="NFT"
      color="#9333ea"
      icon={<ImageIcon size={12} className="text-white" />}
    >
      <Image
        src={NFTImage}
        alt={NFTname}
        width={32}
        height={32}
        className="mb-2"
      />

      <h4 className="mb-1">Own 1 {NFTname}</h4>

      <p className="mb-2.5 text-sm text-gray-100">{NFTDesp}</p>

      <Button
        fullWidth
        endContent={<SendHorizonalIcon size={12} className="text-white" />}
        className="mt-4"
        style={{
          backgroundColor: "#9333ea",
          color: "#fff",
        }}
      >
        Open Collection
      </Button>
    </QuestTask>
  );
};

export default QuestNFTTask;
