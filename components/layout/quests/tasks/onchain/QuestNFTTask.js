"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { ImageIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  truncateAddress,
  getVerificationStatusIcon,
  getVerificationButtonText,
  getVerificationButtonColor,
  getVerificationStatusClasses,
  getVerificationButtonDisabled,
  getVerificationStatusTextClasses,
} from "./UIHelper";
import QuestTask from "../QuestTask";
import CopyToClipboard from "@/components/ui/CopyToClipboard";

import {
  updateTaskAnswer,
  selectTaskAnswer,
} from "@/redux/slice/submissionSlice";

import { useNFTVerification } from "@/hooks/useNFTVerification";

const QuestNFTTask = ({ task, wallet, questId }) => {
  const dispatch = useDispatch();

  const [collectionInfo, setCollectionInfo] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoadingCollectionInfo, setIsLoadingCollectionInfo] = useState(false);

  // Get current answer from Redux store
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  // Check if task is completed (answer is true)
  const isCompleted = currentAnswer === true;

  // Default NFT image fallback
  const tokenId = task?.tokenId || null;
  const network = task?.network || "ethereum";
  const amount = parseInt(task?.amount || "1");
  const contractAddress = task?.contractAddress;
  const NFTImage = task?.nftImage || "/neo-pod-logo.png";
  const NFTName = task?.nftName || task?.name || "NFT Collection";

  // Use the NFT verification hook
  const {
    nftDetails,
    networkName,
    errorMessage,
    getExplorerUrl,
    verificationStatus,
    fetchCollectionInfo,
    verifyNFTOwnership: hookVerify,
  } = useNFTVerification({
    network,
    tokenId,
    contractAddress,
    requiredAmount: amount,
    walletAddress: wallet,
  });

  // Fetch collection info on initial load ONLY
  useEffect(() => {
    const loadInitialData = async () => {
      if (!contractAddress || initialLoadComplete) return;

      setIsLoadingCollectionInfo(true);
      try {
        // Fetch basic collection info from blockchain only
        const info = await fetchCollectionInfo();
        if (info) {
          setCollectionInfo(info);
        }
      } catch (error) {
        console.log("Error loading collection info:", error);
      } finally {
        setIsLoadingCollectionInfo(false);
        setInitialLoadComplete(true);
      }
    };

    loadInitialData();
  }, [contractAddress, fetchCollectionInfo, initialLoadComplete]);

  // Wrapper function to handle verification and Redux updates
  const handleVerification = async () => {
    const verificationResult = await hookVerify();

    // Update Redux store based on verification result
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: verificationResult,
      }),
    );
  };

  const getStatusText = () => {
    if (isCompleted) {
      return tokenId
        ? `✓ You own token #${tokenId}`
        : `✓ NFT ownership verified`;
    }

    switch (verificationStatus) {
      case "checking":
        return "Verifying ownership...";
      case "verified":
        return tokenId
          ? `✓ You own token #${tokenId}`
          : `✓ You own ${nftDetails?.balance || amount}+ NFTs`;
      case "failed":
        return errorMessage || "Verification failed";
      default:
        return wallet
          ? "Click to verify ownership"
          : "Connect wallet to verify";
    }
  };

  // Get the display name and image
  const displayName = nftDetails?.name || collectionInfo?.name || NFTName;
  const displayImage = NFTImage; // Always use the provided/default image
  const isLoadingName =
    isLoadingCollectionInfo && !collectionInfo?.name && !nftDetails?.name;

  return (
    <QuestTask
      text="nft"
      isAdmin={false}
      color="#9333ea"
      description={task?.description}
      icon={<ImageIcon size={12} className="text-white" />}
      heading={
        task?.instruction ||
        `Own ${amount} ${NFTName}${tokenId ? ` (Token #${tokenId})` : ""}`
      }
    >
      <div className="mb-4 flex items-start gap-3">
        <Image
          width={48}
          height={48}
          alt={displayName}
          src={displayImage}
          className="rounded-lg border border-gray-600"
        />

        <div className="flex-1 space-y-1">
          <h4 className="text-lg font-bold text-white">
            {isLoadingName ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-20 animate-pulse rounded bg-gray-600"></span>
              </span>
            ) : (
              displayName
            )}
            {tokenId && (
              <span className="ml-1 text-sm text-gray-300">
                (Token #{tokenId})
              </span>
            )}
          </h4>

          <p className="text-sm text-gray-200">
            Required: {amount} NFT{amount > 1 ? "s" : ""}
          </p>

          {contractAddress && (
            <div className="flex items-center gap-1.5">
              <p className="font-mono text-xs text-gray-200">
                {truncateAddress(contractAddress)}
              </p>

              <CopyToClipboard
                iconSize={12}
                text={contractAddress}
                textType="NFT Contract Address"
              />
            </div>
          )}

          {(nftDetails || collectionInfo) && (
            <div className="text-xs text-gray-50">
              {(nftDetails?.symbol || collectionInfo?.symbol) && (
                <span>
                  Symbol: {nftDetails?.symbol || collectionInfo?.symbol}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex items-center gap-2 rounded-lg border p-3 ${getVerificationStatusClasses(verificationStatus, isCompleted)}`}
      >
        {getVerificationStatusIcon(verificationStatus, isCompleted)}
        <span
          className={`text-sm font-medium ${getVerificationStatusTextClasses(verificationStatus, isCompleted)}`}
        >
          {getStatusText()}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          fullWidth
          disabled={getVerificationButtonDisabled(
            verificationStatus,
            !!wallet,
            isCompleted,
          )}
          onPress={handleVerification}
          className="bg-[#9333ea] font-semibold disabled:opacity-70"
          style={{
            backgroundColor: getVerificationButtonColor(
              verificationStatus,
              isCompleted,
            ),
            opacity: getVerificationButtonDisabled(
              verificationStatus,
              !!wallet,
              isCompleted,
            )
              ? 0.7
              : 1,
          }}
        >
          {getVerificationButtonText(verificationStatus, isCompleted, !!wallet)}
        </Button>

        {getExplorerUrl() && (
          <Button
            as={Link}
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="bordered"
            className="border-purple-400 font-semibold text-purple-400 hover:bg-purple-400/10"
          >
            View Collection
          </Button>
        )}
      </div>

      <div className="mt-3 text-center text-xs text-gray-50">
        Network: {networkName}
      </div>
    </QuestTask>
  );
};

export default QuestNFTTask;
