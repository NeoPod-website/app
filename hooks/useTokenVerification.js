import { useState, useCallback } from "react";

import { ERC20_ABI } from "@/utils/blockchain/abis";
import { createBlockchainProvider } from "@/utils/blockchain/provider";

export const useTokenVerification = ({
  walletAddress,
  contractAddress,
  network = "ethereum",
  isNativeToken = false,
  requiredAmount = "100",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenDetails, setTokenDetails] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const blockchainProvider = createBlockchainProvider(network);

  // Separate function to fetch token info without verification
  const fetchTokenInfo = useCallback(async () => {
    if (isNativeToken) {
      // Return native token info from network config
      const networkInfo = blockchainProvider.getNetworkInfo();
      return {
        name: networkInfo.nativeToken.name,
        symbol: networkInfo.nativeToken.symbol,
        decimals: networkInfo.nativeToken.decimals,
        isNative: true,
        network: networkInfo.name,
      };
    }

    if (!contractAddress) return null;

    try {
      const tokenContract = await blockchainProvider.createContract(
        contractAddress,
        ERC20_ABI,
      );

      // Only fetch basic token details - no wallet interaction
      const [tokenName, tokenSymbol, tokenDecimals] = await Promise.all([
        tokenContract.name().catch(() => "Unknown Token"),
        tokenContract.symbol().catch(() => "TOKEN"),
        tokenContract.decimals().catch(() => 18),
      ]);

      return {
        name: tokenName,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        isNative: false,
        network: blockchainProvider.getNetworkInfo().name,
      };
    } catch (error) {
      console.log("Could not fetch token info:", error);
      return null;
    }
  }, [contractAddress, isNativeToken, blockchainProvider]);

  const verifyTokenHolding = useCallback(async () => {
    if (!walletAddress) {
      setErrorMessage("Please connect your wallet first");
      setVerificationStatus("failed");
      return false;
    }

    if (!isNativeToken && !contractAddress) {
      setErrorMessage("Contract address not provided");
      setVerificationStatus("failed");
      return false;
    }

    setIsLoading(true);
    setVerificationStatus("checking");
    setErrorMessage("");

    try {
      let hasRequiredTokens = false;
      let details = {};

      if (isNativeToken) {
        // Check native token balance
        const balance =
          await blockchainProvider.getNativeBalance(walletAddress);
        const networkInfo = blockchainProvider.getNetworkInfo();
        const balanceInEther =
          parseFloat(balance.toString()) /
          Math.pow(10, networkInfo.nativeToken.decimals);
        const requiredAmountFloat = parseFloat(requiredAmount);

        details = {
          name: networkInfo.nativeToken.name,
          symbol: networkInfo.nativeToken.symbol,
          decimals: networkInfo.nativeToken.decimals,
          balance: balanceInEther,
          isNative: true,
          network: networkInfo.name,
        };

        if (balanceInEther >= requiredAmountFloat) {
          hasRequiredTokens = true;
          setVerificationStatus("verified");
        } else {
          setVerificationStatus("failed");
          setErrorMessage(
            `You have ${balanceInEther.toFixed(4)} ${networkInfo.nativeToken.symbol}, but need ${requiredAmount}`,
          );
        }
      } else {
        // Check ERC20 token balance
        const tokenContract = await blockchainProvider.createContract(
          contractAddress,
          ERC20_ABI,
        );

        // Get token details
        let tokenName = "Unknown Token";
        let tokenSymbol = "TOKEN";
        let tokenDecimals = 18;

        try {
          [tokenName, tokenSymbol, tokenDecimals] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.decimals(),
          ]);
        } catch (e) {}

        // Get balance
        const balance = await tokenContract.balanceOf(walletAddress);
        const balanceInTokens =
          parseFloat(balance.toString()) / Math.pow(10, tokenDecimals);
        const requiredAmountFloat = parseFloat(requiredAmount);

        details = {
          name: tokenName,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          balance: balanceInTokens,
          isNative: false,
          network: blockchainProvider.getNetworkInfo().name,
        };

        if (balanceInTokens >= requiredAmountFloat) {
          hasRequiredTokens = true;
          setVerificationStatus("verified");
        } else {
          setVerificationStatus("failed");
          setErrorMessage(
            `You have ${balanceInTokens.toFixed(4)} ${tokenSymbol}, but need ${requiredAmount}`,
          );
        }
      }

      setTokenDetails(details);
      return hasRequiredTokens;
    } catch (error) {
      setVerificationStatus("failed");

      let errorMsg = "Verification failed";

      if (error.code === "CALL_EXCEPTION") {
        errorMsg = "Invalid contract address or network mismatch";
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.event === "noNetwork"
      ) {
        errorMsg =
          "Network connection failed. Please check your internet connection and try again.";
      } else if (error.code === "TIMEOUT") {
        errorMsg = "Request timed out. Please try again.";
      } else if (error.message?.includes("rate limit")) {
        errorMsg = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (error.message) {
        errorMsg = `Verification failed: ${error.message}`;
      }

      setErrorMessage(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    walletAddress,
    isNativeToken,
    requiredAmount,
    contractAddress,
    blockchainProvider,
  ]);

  const reset = useCallback(() => {
    setVerificationStatus(null);
    setTokenDetails(null);
    setErrorMessage("");
    setIsLoading(false);
  }, []);

  const getExplorerUrl = useCallback(() => {
    if (isNativeToken) {
      return blockchainProvider.getExplorerUrl("base");
    }
    return contractAddress
      ? blockchainProvider.getExplorerUrl("token", contractAddress)
      : null;
  }, [contractAddress, isNativeToken, blockchainProvider]);

  return {
    reset,
    isLoading,
    tokenDetails,
    errorMessage,
    fetchTokenInfo,
    getExplorerUrl,
    verificationStatus,
    verifyTokenHolding,
    networkName: blockchainProvider.getNetworkInfo().name,
    networkInfo: blockchainProvider.getNetworkInfo(),
  };
};
