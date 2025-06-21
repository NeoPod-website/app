import { useState, useCallback } from "react";

import { ERC721_ABI } from "@/utils/blockchain/abis";
import { createBlockchainProvider } from "@/utils/blockchain/provider";

export const useNFTVerification = ({
  walletAddress,
  tokenId = null,
  contractAddress,
  requiredAmount = 1,
  network = "ethereum",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nftDetails, setNftDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);

  const blockchainProvider = createBlockchainProvider(network);

  // Separate function to fetch collection info without verification
  const fetchCollectionInfo = useCallback(async () => {
    if (!contractAddress) return null;

    try {
      const nftContract = await blockchainProvider.createContract(
        contractAddress,
        ERC721_ABI,
      );

      // Only fetch basic collection details - no wallet interaction
      const [collectionName, collectionSymbol] = await Promise.all([
        nftContract.name().catch(() => "Unknown Collection"),
        nftContract.symbol().catch(() => ""),
      ]);

      return {
        name: collectionName,
        symbol: collectionSymbol,
        network: blockchainProvider.getNetworkInfo().name,
      };
    } catch (error) {
      return null;
    }
  }, [contractAddress, blockchainProvider]);

  const verifyNFTOwnership = useCallback(async () => {
    if (!walletAddress) {
      setErrorMessage("Please connect your wallet first");
      setVerificationStatus("failed");
      return false;
    }

    if (!contractAddress) {
      setErrorMessage("Contract address not provided");
      setVerificationStatus("failed");
      return false;
    }

    setIsLoading(true);
    setVerificationStatus("checking");
    setErrorMessage("");

    try {
      const nftContract = await blockchainProvider.createContract(
        contractAddress,
        ERC721_ABI,
      );

      // Get collection details
      let collectionName = "Unknown Collection";
      let collectionSymbol = "";

      try {
        [collectionName, collectionSymbol] = await Promise.all([
          nftContract.name(),
          nftContract.symbol(),
        ]);
      } catch (e) {
        console.log("Could not fetch collection details:", e.message);
      }

      let hasRequiredNFTs = false;
      let details = {
        name: collectionName,
        symbol: collectionSymbol,
        network: blockchainProvider.getNetworkInfo().name,
      };

      if (tokenId) {
        // Check specific token ownership
        try {
          const owner = await nftContract.ownerOf(tokenId);
          const isOwner = owner.toLowerCase() === walletAddress.toLowerCase();

          details = {
            ...details,
            tokenId: tokenId,
            isSpecificToken: true,
          };

          if (isOwner) {
            hasRequiredNFTs = true;
            setVerificationStatus("verified");
          } else {
            setVerificationStatus("failed");
            setErrorMessage(
              `You don't own token #${tokenId} from this collection`,
            );
          }
        } catch (error) {
          setVerificationStatus("failed");
          setErrorMessage(`Token #${tokenId} does not exist or contract error`);
        }
      } else {
        // Check general balance
        const balance = await nftContract.balanceOf(walletAddress);
        const balanceNumber = balance.toNumber();

        details = {
          ...details,
          balance: balanceNumber,
          isSpecificToken: false,
        };

        if (balanceNumber >= requiredAmount) {
          hasRequiredNFTs = true;
          setVerificationStatus("verified");
        } else {
          setVerificationStatus("failed");
          setErrorMessage(
            `You own ${balanceNumber} NFTs, but need ${requiredAmount} from this collection`,
          );
        }
      }

      setNftDetails(details);
      return hasRequiredNFTs;
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
    tokenId,
    walletAddress,
    requiredAmount,
    contractAddress,
    blockchainProvider,
  ]);

  const reset = useCallback(() => {
    setVerificationStatus(null);
    setNftDetails(null);
    setErrorMessage("");
    setIsLoading(false);
  }, []);

  const getExplorerUrl = useCallback(() => {
    return contractAddress
      ? blockchainProvider.getExplorerUrl("nft", contractAddress)
      : null;
  }, [contractAddress, blockchainProvider]);

  return {
    reset,
    isLoading,
    nftDetails,
    errorMessage,
    getExplorerUrl,
    verificationStatus,
    verifyNFTOwnership,
    fetchCollectionInfo,
    networkName: blockchainProvider.getNetworkInfo().name,
  };
};
