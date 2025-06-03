"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { ImageIcon, SendHorizonalIcon } from "lucide-react";

import QuestTask from "../QuestTask";
import CopyToClipboard from "@/components/ui/CopyToClipboard";

const QuestNFTTask = ({ task }) => {
  // Default NFT image fallback
  const amount = task?.amount || "1";
  const NFTName = task?.nftName || "NFT Collection";
  const NFTImage = task?.nftImage || "/neo-pod-logo.png";

  const contractAddress = task?.contractAddress;

  // Generate collection URL (could be OpenSea, marketplace, etc.)
  const getCollectionUrl = () => {
    if (contractAddress) {
      return `https://opensea.io/assets/ethereum/${contractAddress}`;
    }

    return null;
  };

  const handleOpenCollection = () => {
    console.log("Opening NFT collection:", contractAddress);
    console.log("Task data:", task);
  };

  return (
    <QuestTask
      text="NFT"
      isAdmin={false}
      color="#9333ea"
      description={task?.description}
      icon={<ImageIcon size={12} className="text-white" />}
      heading={task?.instruction || `Own ${amount} ${NFTName}`}
    >
      <div className="mb-2 flex items-start gap-2">
        <Image
          width={48}
          height={48}
          alt={NFTName}
          src={NFTImage}
          className="mb-2 rounded-full"
        />

        <div className="space-y-1">
          <h4 className="text-lg text-gray-100">
            Own {amount} {NFTName}
          </h4>

          {task?.contractAddress && (
            <div className="flex items-center gap-1.5">
              <p className="font-mono text-sm text-gray-200">
                Contract: {task.contractAddress.slice(0, 6)}...
                {task.contractAddress.slice(-4)}{" "}
              </p>

              <CopyToClipboard iconSize={14} text={task.contractAddress} />
            </div>
          )}
        </div>
      </div>

      {getCollectionUrl() ? (
        <Link href={"#"} target="_blank" rel="noopener noreferrer">
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
        </Link>
      ) : (
        <Button
          fullWidth
          endContent={<SendHorizonalIcon size={12} className="text-white" />}
          className="mt-4"
          onPress={handleOpenCollection}
          style={{
            backgroundColor: "#9333ea",
            color: "#fff",
          }}
        >
          Verify Ownership
        </Button>
      )}
    </QuestTask>
  );
};

export default QuestNFTTask;
