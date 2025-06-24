"use client";

import Link from "next/link";
import Image from "next/image";
import { Coins } from "lucide-react";
import { Button } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useMemo, useCallback } from "react";

import QuestTask from "../QuestTask";
import CopyToClipboard from "@/components/ui/CopyToClipboard";

import { getNetworkConfig, getNativeTokenInfo } from "@/config/networks";

import {
  truncateAddress,
  formatTokenAmount,
  getVerificationStatusIcon,
  getVerificationButtonText,
  getVerificationButtonColor,
  getVerificationStatusClasses,
  getVerificationButtonDisabled,
  getVerificationStatusTextClasses,
} from "./UIHelper";

import {
  updateTaskAnswer,
  selectTaskAnswer,
} from "@/redux/slice/submissionSlice";

import { useTokenVerification } from "@/hooks/useTokenVerification";

const QuestTokenTask = ({ task, wallet, questId }) => {
  const dispatch = useDispatch();

  const [tokenInfo, setTokenInfo] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoadingTokenInfo, setIsLoadingTokenInfo] = useState(false);

  // Memoized task properties to prevent recalculation
  const taskProps = useMemo(
    () => ({
      requiredAmount: task?.amount || "100",
      contractAddress: task?.contractAddress,
      network: task?.network || "ethereum",
      isNativeToken:
        !task?.contractAddress || task.contractAddress.trim() === "",
      tokenName: task?.tokenName || task?.name || "Token",
      tokenSymbol: task?.tokenSymbol || "TOKEN",
      tokenImage: task?.tokenImage || "/tokens/default.svg",
    }),
    [task],
  );

  // Redux selectors
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );
  const isCompleted = currentAnswer === true;

  // Token verification hook
  const {
    tokenDetails,
    errorMessage,
    fetchTokenInfo,
    getExplorerUrl,
    verificationStatus,
    verifyTokenHolding: hookVerify,
    networkName,
  } = useTokenVerification({
    walletAddress: wallet,
    network: taskProps.network,
    isNativeToken: taskProps.isNativeToken,
    requiredAmount: taskProps.requiredAmount,
    contractAddress: taskProps.contractAddress,
  });

  // Optimized initial data loading
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (initialLoadComplete) return;

      setIsLoadingTokenInfo(true);
      try {
        const info = await fetchTokenInfo();
        if (info && isMounted) {
          setTokenInfo(info);
        }
      } catch (error) {
        console.error("Failed to load token info:", error);
      } finally {
        if (isMounted) {
          setIsLoadingTokenInfo(false);
          setInitialLoadComplete(true);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [fetchTokenInfo, initialLoadComplete]);

  // Memoized verification handler
  const handleVerification = useCallback(async () => {
    const verificationResult = await hookVerify();
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: verificationResult,
      }),
    );
  }, [hookVerify, dispatch, questId, task.id]);

  // Memoized native token details getter using network config
  const getNativeTokenDetails = useCallback((network) => {
    try {
      return getNativeTokenInfo(network);
    } catch (error) {
      console.error(`Failed to get native token info for ${network}:`, error);
      // Fallback to Ethereum
      return getNativeTokenInfo("ethereum");
    }
  }, []);

  // Memoized token display info
  const tokenDisplayInfo = useMemo(() => {
    if (taskProps.isNativeToken) {
      const nativeToken = getNativeTokenDetails(taskProps.network);
      return {
        name: nativeToken.name,
        symbol: nativeToken.symbol,
        image: nativeToken.image,
        isNative: true,
      };
    }

    if (tokenDetails) {
      return {
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        image: `/tokens/${tokenDetails.symbol.toLowerCase()}.svg`,
        fallbackImage: "/tokens/default.svg",
        isNative: false,
      };
    }

    // Fallback
    return {
      name: taskProps.tokenName,
      symbol: taskProps.tokenSymbol,
      image: taskProps.tokenImage,
      fallbackImage: "/tokens/default.svg",
      isNative: false,
    };
  }, [taskProps, tokenDetails, getNativeTokenDetails]);

  // Memoized network display name
  const networkDisplayName = useMemo(() => {
    try {
      const networkConfig = getNetworkConfig(taskProps.network);
      return networkConfig.displayName;
    } catch (error) {
      return (
        taskProps.network.charAt(0).toUpperCase() + taskProps.network.slice(1)
      );
    }
  }, [taskProps.network]);

  // Memoized status text
  const statusText = useMemo(() => {
    if (isCompleted) {
      return "✓ Token holding verified";
    }

    switch (verificationStatus) {
      case "checking":
        return "Verifying token balance...";
      case "verified":
        return `✓ You have ${formatTokenAmount(tokenDetails?.balance)} ${tokenDetails?.symbol || tokenDisplayInfo.symbol}`;
      case "failed":
        return errorMessage || "Verification failed";
      default:
        return wallet ? "Click to verify holdings" : "Connect wallet to verify";
    }
  }, [
    wallet,
    isCompleted,
    tokenDetails,
    errorMessage,
    verificationStatus,
    tokenDisplayInfo.symbol,
  ]);

  // Memoized loading state
  const isLoadingName = useMemo(
    () => isLoadingTokenInfo && !tokenInfo?.name && !tokenDetails?.name,
    [isLoadingTokenInfo, tokenInfo?.name, tokenDetails?.name],
  );

  // Memoized formatted required amount
  const formattedRequiredAmount = useMemo(
    () => formatTokenAmount(parseFloat(taskProps.requiredAmount)),
    [taskProps.requiredAmount],
  );

  return (
    <QuestTask
      text="Token"
      isAdmin={false}
      color="#000"
      description={task?.description}
      icon={<Coins size={12} className="text-white" />}
      heading={
        task?.instruction ||
        `Hold ${formattedRequiredAmount} ${tokenDisplayInfo.symbol}`
      }
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg">
          <Image
            fill
            sizes="48px"
            objectFit="contain"
            className="rounded-lg"
            alt={tokenDisplayInfo.name}
            src={tokenDisplayInfo.image}
            onError={(e) => {
              if (tokenDisplayInfo.fallbackImage) {
                e.target.src = tokenDisplayInfo.fallbackImage;
              }
            }}
          />
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="text-lg font-bold text-white">
            {isLoadingName ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-20 animate-pulse rounded bg-gray-600" />
                <span className="text-xs text-gray-400">Loading...</span>
              </span>
            ) : (
              tokenDisplayInfo.name
            )}
          </h4>

          <p className="text-sm text-gray-200">
            Required: {formattedRequiredAmount} {tokenDisplayInfo.symbol}
          </p>

          {!taskProps.isNativeToken && taskProps.contractAddress && (
            <div className="flex items-center gap-1.5">
              <p className="font-mono text-xs text-gray-200">
                {truncateAddress(taskProps.contractAddress)}
              </p>
              <CopyToClipboard
                iconSize={12}
                text={taskProps.contractAddress}
                textType="Token Contract Address"
              />
            </div>
          )}

          {taskProps.isNativeToken && (
            <div className="text-xs text-gray-200">
              Native {networkDisplayName} token
            </div>
          )}

          {(tokenDetails || tokenInfo) && (
            <div className="text-xs text-gray-50">
              {(tokenDetails?.symbol || tokenInfo?.symbol) && (
                <span>Symbol: {tokenDetails?.symbol || tokenInfo?.symbol}</span>
              )}
              {tokenDetails?.balance !== undefined && (
                <span className="ml-3">
                  Your balance: {formatTokenAmount(tokenDetails.balance)}{" "}
                  {tokenDetails.symbol}
                </span>
              )}
            </div>
          )}

          {isLoadingTokenInfo && !tokenInfo && (
            <div className="text-xs text-gray-50">
              <span className="h-3 w-16 animate-pulse rounded bg-gray-600" />
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
          {statusText}
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
          className="bg-gray-50 font-semibold text-black"
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
            target="_blank"
            variant="bordered"
            href={getExplorerUrl()}
            rel="noopener noreferrer"
            className="border-gray-100 !px-6 font-semibold text-gray-100 hover:bg-gray-100/10"
          >
            {taskProps.isNativeToken ? "View Explorer" : "View Token"}
          </Button>
        )}
      </div>

      <div className="mt-3 text-center text-xs text-gray-50">
        Network: {networkDisplayName}
      </div>
    </QuestTask>
  );
};

export default QuestTokenTask;
