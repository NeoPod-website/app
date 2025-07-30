"use client";

import { Spinner } from "@heroui/react";
import { WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";
import React, { useState, useEffect } from "react";

import WalletSigningFlow from "./wallet/WalletSigningFlow";
import WalletConnectedState from "./wallet/WalletConnectedState";
import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

const WalletTab = ({ ambassadorAddress }) => {
  const router = useRouter();
  const { ready } = usePrivy();

  const { disconnect } = useDisconnect();
  const { status, address } = useAccount();

  // Simplified state - only verification related
  const [verificationState, setVerificationState] = useState({
    error: null,
    isVerified: null,
    lastUpdated: null,
    signatureError: null,
    isSigningMessage: false,
    isCheckingVerification: false,
  });

  // Primary logic: ambassadorAddress is the source of truth
  const hasAmbassadorAddress = !!ambassadorAddress;
  const isWalletConnectedViaWagmi = status === "connected" && address && ready;
  const isWalletConnecting = status === "connecting";

  // Verification logic
  const needsSignature =
    !hasAmbassadorAddress &&
    isWalletConnectedViaWagmi &&
    verificationState.isVerified === false;

  const isVerified =
    verificationState.isVerified === true || hasAmbassadorAddress;

  // Set ambassador address as verified immediately
  useEffect(() => {
    if (hasAmbassadorAddress && verificationState.isVerified === null) {
      setVerificationState((prev) => ({
        ...prev,
        isVerified: true,
        lastUpdated: new Date(),
      }));
    }
  }, [hasAmbassadorAddress]);

  // Check verification for wagmi-connected wallets (only if no ambassadorAddress)
  useEffect(() => {
    if (
      !hasAmbassadorAddress &&
      isWalletConnectedViaWagmi &&
      verificationState.isVerified === null
    ) {
      checkWalletVerificationStatus();
    }
  }, [
    hasAmbassadorAddress,
    isWalletConnectedViaWagmi,
    verificationState.isVerified,
  ]);

  // Reset verification state when wallet disconnects and no ambassador address
  useEffect(() => {
    if (!hasAmbassadorAddress && status === "disconnected") {
      resetVerificationState();
    }
  }, [hasAmbassadorAddress, status]);

  const checkWalletVerificationStatus = async () => {
    if (!address || !isWalletConnectedViaWagmi || hasAmbassadorAddress) return;

    setVerificationState((prev) => ({
      ...prev,
      isCheckingVerification: true,
      error: null,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/wallet_address/${address}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (response.ok) {
        setVerificationState((prev) => ({
          ...prev,
          isVerified: true,
          isCheckingVerification: false,
          lastUpdated: new Date(),
        }));
      } else if (response.status === 404) {
        setVerificationState((prev) => ({
          ...prev,
          isVerified: false,
          isCheckingVerification: false,
        }));
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error checking wallet status:", error);
      setVerificationState((prev) => ({
        ...prev,
        isCheckingVerification: false,
        error: error.message || "Failed to verify wallet status",
        isVerified: false,
      }));
    }
  };

  const handleSignatureSuccess = async () => {
    setVerificationState((prev) => ({
      ...prev,
      isVerified: true,
      isSigningMessage: false,
      signatureError: null,
      lastUpdated: new Date(),
    }));
  };

  const handleSignatureError = (error) => {
    console.error("Signature error:", error);
    setVerificationState((prev) => ({
      ...prev,
      isSigningMessage: false,
      signatureError: error.message || "Signature verification failed",
      isVerified: false,
    }));
  };

  const handleBackFromSigning = () => {
    disconnect();
    setVerificationState((prev) => ({
      ...prev,
      isVerified: null,
      isSigningMessage: false,
      signatureError: null,
    }));
  };

  const handleDisconnectWallet = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/disconnect-wallet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to disconnect wallet from backend");
      }

      // Disconnect wagmi if connected
      if (status === "connected") {
        disconnect();
      }

      // Reset states
      resetVerificationState();

      // Update JWT token
      const data = await response.json();
      localStorage.removeItem("neo-jwt");
      localStorage.setItem("neo-jwt", data.token);

      // Reload to refresh ambassadorAddress from server
      router.refresh();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);

      // Fallback: disconnect locally
      if (status === "connected") {
        disconnect();
      }
      resetVerificationState();
    }
  };

  const resetVerificationState = () => {
    setVerificationState({
      error: null,
      isVerified: null,
      lastUpdated: null,
      signatureError: null,
      isSigningMessage: false,
      isCheckingVerification: false,
    });
  };

  const updateVerificationState = (updates) => {
    setVerificationState((prev) => ({ ...prev, ...updates }));
  };

  // MAIN LOGIC: If ambassadorAddress exists, show connected state directly
  if (hasAmbassadorAddress) {
    return (
      <WalletConnectedState
        address={ambassadorAddress}
        isUsingAmbassadorAddress={true}
        verificationState={verificationState}
        onDisconnect={handleDisconnectWallet}
        updateVerificationState={updateVerificationState}
      />
    );
  }

  // Traditional wagmi flow when no ambassadorAddress

  // Wait for Privy to be ready
  if (!ready) {
    return (
      <div className="mx-auto mt-10 text-center">
        <Spinner size="lg" className="mb-4" color="white" />

        <h3 className="mb-2 text-lg font-medium text-white">
          Initializing Wallet
        </h3>

        <p className="text-sm text-gray-200">Preparing wallet connection...</p>
      </div>
    );
  }

  // Wallet connecting state
  if (isWalletConnecting) {
    return (
      <div className="mx-auto mt-10 text-center">
        <div className="bg-blue-600/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <WalletIcon size={32} className="text-gray-100" />
        </div>

        <Spinner size="lg" className="mb-4" color="white" />

        <h3 className="mb-2 text-xl font-bold text-white">Connecting Wallet</h3>

        <p className="text-gray-200">
          Please approve the connection in your wallet...
        </p>
      </div>
    );
  }

  // Wallet verification checking state
  if (isWalletConnectedViaWagmi && verificationState.isCheckingVerification) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
          <WalletIcon size={32} className="text-purple-400" />
        </div>

        <Spinner size="lg" className="mb-4" color="white" />

        <h3 className="mb-2 text-xl font-bold text-white">Verifying Wallet</h3>

        <p className="text-gray-400">
          Checking your wallet verification status...
        </p>
      </div>
    );
  }

  // Signature required state
  if (needsSignature) {
    return (
      <WalletSigningFlow
        address={address}
        onBack={handleBackFromSigning}
        verificationState={verificationState}
        onSignatureError={handleSignatureError}
        onSignatureSuccess={handleSignatureSuccess}
        updateVerificationState={updateVerificationState}
      />
    );
  }

  // Wallet connected and verified state
  if (isWalletConnectedViaWagmi && isVerified) {
    return (
      <WalletConnectedState
        address={address}
        verificationState={verificationState}
        onDisconnect={handleDisconnectWallet}
        updateVerificationState={updateVerificationState}
        isUsingAmbassadorAddress={false}
      />
    );
  }

  // Default: Wallet disconnected state
  return (
    <WalletDisconnectedState
      verificationState={verificationState}
      updateVerificationState={updateVerificationState}
    />
  );
};

export default WalletTab;
