"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";

import QuestTask from "../QuestTask";
import CopyToClipboard from "@/components/ui/CopyToClipboard";

const QuestTokenTask = ({ task }) => {
  const amount = task?.amount || "100";
  const tokenName = task?.tokenName || "Token";
  const tokenSymbol = task?.tokenSymbol || "NEO";
  const tokenImage = task?.tokenImage || "/neo-logo.svg";

  const contractAddress = task?.contractAddress;

  const handleVerifyHolding = () => {
    // TODO: Implement token holding verification logic
    // This could check user's wallet balance for the specific token
    console.log("Verifying token holding:", {
      amount,
      tokenName,
      tokenSymbol,
      contractAddress,
    });
    console.log("Task data:", task);
  };

  return (
    <QuestTask
      text="Token"
      color="#000"
      isAdmin={false}
      heading={task?.instruction || `Hold ${amount} ${tokenSymbol}`}
      description={task?.description}
      icon={
        <div className="flex h-[12px] w-[12px] items-center justify-center overflow-hidden rounded">
          <Image src={tokenImage} width={12} height={12} alt="token" />
        </div>
      }
    >
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded">
            <Image src={tokenImage} width={36} height={36} alt="token" />
          </div>

          <div>
            <p className="text-gray-100">
              At least {amount} {tokenSymbol} required
            </p>
            <p className="text-sm text-gray-400">{tokenName}</p>
          </div>
        </div>

        {/* Contract address if provided */}
        {contractAddress && (
          <div className="flex items-center gap-1.5">
            <p className="font-mono text-sm text-gray-300">
              Contract: {contractAddress.slice(0, 6)}...
              {contractAddress.slice(-4)}
            </p>

            <CopyToClipboard iconSize={14} text={contractAddress} />
          </div>
        )}
      </div>

      <Button
        fullWidth
        className="mt-4 border border-gray-400 bg-black text-white"
        onPress={handleVerifyHolding}
      >
        Verify Holdings
      </Button>
    </QuestTask>
  );
};

export default QuestTokenTask;
