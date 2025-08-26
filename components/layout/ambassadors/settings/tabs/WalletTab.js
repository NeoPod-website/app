// "use client";

// import { Spinner } from "@heroui/react";
// import { WalletIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { usePrivy } from "@privy-io/react-auth";
// import { useAccount, useDisconnect } from "wagmi";
// import React, { useState, useEffect } from "react";

// import WalletSigningFlow from "./wallet/WalletSigningFlow";
// import WalletConnectedState from "./wallet/WalletConnectedState";
// import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

// const WalletTab = ({ ambassadorAddress }) => {
//   const router = useRouter();
//   const { ready } = usePrivy();

//   const { disconnect } = useDisconnect();
//   const { status, address } = useAccount();

//   // Simplified state - only verification related
//   const [verificationState, setVerificationState] = useState({
//     error: null,
//     isVerified: null,
//     lastUpdated: null,
//     signatureError: null,
//     isSigningMessage: false,
//     isCheckingVerification: false,
//   });

//   // Primary logic: ambassadorAddress is the source of truth
//   const hasAmbassadorAddress = !!ambassadorAddress;
//   const isWalletConnectedViaWagmi = status === "connected" && address && ready;
//   const isWalletConnecting = status === "connecting";

//   // Verification logic
//   const needsSignature =
//     !hasAmbassadorAddress &&
//     isWalletConnectedViaWagmi &&
//     verificationState.isVerified === false;

//   const isVerified =
//     verificationState.isVerified === true || hasAmbassadorAddress;

//   // Set ambassador address as verified immediately
//   useEffect(() => {
//     if (hasAmbassadorAddress && verificationState.isVerified === null) {
//       setVerificationState((prev) => ({
//         ...prev,
//         isVerified: true,
//         lastUpdated: new Date(),
//       }));
//     }
//   }, [hasAmbassadorAddress]);

//   // Check verification for wagmi-connected wallets (only if no ambassadorAddress)
//   useEffect(() => {
//     if (
//       !hasAmbassadorAddress &&
//       isWalletConnectedViaWagmi &&
//       verificationState.isVerified === null
//     ) {
//       checkWalletVerificationStatus();
//     }
//   }, [
//     hasAmbassadorAddress,
//     isWalletConnectedViaWagmi,
//     verificationState.isVerified,
//   ]);

//   // Reset verification state when wallet disconnects and no ambassador address
//   useEffect(() => {
//     if (!hasAmbassadorAddress && status === "disconnected") {
//       resetVerificationState();
//     }
//   }, [hasAmbassadorAddress, status]);

//   const checkWalletVerificationStatus = async () => {
//     if (!address || !isWalletConnectedViaWagmi || hasAmbassadorAddress) return;

//     setVerificationState((prev) => ({
//       ...prev,
//       isCheckingVerification: true,
//       error: null,
//     }));

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/wallet_address/${address}`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         },
//       );

//       if (response.ok) {
//         setVerificationState((prev) => ({
//           ...prev,
//           isVerified: true,
//           isCheckingVerification: false,
//           lastUpdated: new Date(),
//         }));
//       } else if (response.status === 404) {
//         setVerificationState((prev) => ({
//           ...prev,
//           isVerified: false,
//           isCheckingVerification: false,
//         }));
//       } else {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error checking wallet status:", error);
//       setVerificationState((prev) => ({
//         ...prev,
//         isCheckingVerification: false,
//         error: error.message || "Failed to verify wallet status",
//         isVerified: false,
//       }));
//     }
//   };

//   const handleSignatureSuccess = async () => {
//     setVerificationState((prev) => ({
//       ...prev,
//       isVerified: true,
//       isSigningMessage: false,
//       signatureError: null,
//       lastUpdated: new Date(),
//     }));
//   };

//   const handleSignatureError = (error) => {
//     console.error("Signature error:", error);
//     setVerificationState((prev) => ({
//       ...prev,
//       isSigningMessage: false,
//       signatureError: error.message || "Signature verification failed",
//       isVerified: false,
//     }));
//   };

//   const handleBackFromSigning = () => {
//     disconnect();
//     setVerificationState((prev) => ({
//       ...prev,
//       isVerified: null,
//       isSigningMessage: false,
//       signatureError: null,
//     }));
//   };

//   const handleDisconnectWallet = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/disconnect-wallet`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to disconnect wallet from backend");
//       }

//       // Disconnect wagmi if connected
//       if (status === "connected") {
//         disconnect();
//       }

//       // Reset states
//       resetVerificationState();

//       // Update JWT token
//       const data = await response.json();
//       localStorage.removeItem("neo-jwt");
//       localStorage.setItem("neo-jwt", data.token);

//       // Reload to refresh ambassadorAddress from server
//       router.refresh();
//     } catch (error) {
//       console.error("Error disconnecting wallet:", error);

//       // Fallback: disconnect locally
//       if (status === "connected") {
//         disconnect();
//       }
//       resetVerificationState();
//     }
//   };

//   const resetVerificationState = () => {
//     setVerificationState({
//       error: null,
//       isVerified: null,
//       lastUpdated: null,
//       signatureError: null,
//       isSigningMessage: false,
//       isCheckingVerification: false,
//     });
//   };

//   const updateVerificationState = (updates) => {
//     setVerificationState((prev) => ({ ...prev, ...updates }));
//   };

//   // MAIN LOGIC: If ambassadorAddress exists, show connected state directly
//   if (hasAmbassadorAddress) {
//     return (
//       <WalletConnectedState
//         address={ambassadorAddress}
//         isUsingAmbassadorAddress={true}
//         verificationState={verificationState}
//         onDisconnect={handleDisconnectWallet}
//         updateVerificationState={updateVerificationState}
//       />
//     );
//   }

//   // Traditional wagmi flow when no ambassadorAddress

//   // Wait for Privy to be ready
//   if (!ready) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-lg font-medium text-white">
//           Initializing Wallet
//         </h3>

//         <p className="text-sm text-gray-200">Preparing wallet connection...</p>
//       </div>
//     );
//   }

//   // Wallet connecting state
//   if (isWalletConnecting) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <div className="bg-blue-600/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
//           <WalletIcon size={32} className="text-gray-100" />
//         </div>

//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-xl font-bold text-white">Connecting Wallet</h3>

//         <p className="text-gray-200">
//           Please approve the connection in your wallet...
//         </p>
//       </div>
//     );
//   }

//   // Wallet verification checking state
//   if (isWalletConnectedViaWagmi && verificationState.isCheckingVerification) {
//     return (
//       <div className="flex min-h-[400px] flex-col items-center justify-center">
//         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
//           <WalletIcon size={32} className="text-purple-400" />
//         </div>

//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-xl font-bold text-white">Verifying Wallet</h3>

//         <p className="text-gray-400">
//           Checking your wallet verification status...
//         </p>
//       </div>
//     );
//   }

//   // Signature required state
//   if (needsSignature) {
//     return (
//       <WalletSigningFlow
//         address={address}
//         onBack={handleBackFromSigning}
//         verificationState={verificationState}
//         onSignatureError={handleSignatureError}
//         onSignatureSuccess={handleSignatureSuccess}
//         updateVerificationState={updateVerificationState}
//       />
//     );
//   }

//   // Wallet connected and verified state
//   if (isWalletConnectedViaWagmi && isVerified) {
//     return (
//       <WalletConnectedState
//         address={address}
//         verificationState={verificationState}
//         onDisconnect={handleDisconnectWallet}
//         updateVerificationState={updateVerificationState}
//         isUsingAmbassadorAddress={false}
//       />
//     );
//   }

//   // Default: Wallet disconnected state
//   return (
//     <WalletDisconnectedState
//       verificationState={verificationState}
//       updateVerificationState={updateVerificationState}
//     />
//   );
// };

// export default WalletTab;

"use client";

import { Spinner } from "@heroui/react";
import { WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";
import React, { useState, useEffect, useCallback } from "react";

import WalletSigningFlow from "./wallet/WalletSigningFlow";
import WalletConnectedState from "./wallet/WalletConnectedState";
import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

// Simple verification states
const VERIFICATION_STATES = {
  IDLE: "idle",
  ERROR: "error",
  CHECKING: "checking",
  VERIFIED: "verified",
  NEEDS_SIGNATURE: "needs_signature",
};

const WalletTab = ({ ambassadorAddress }) => {
  const router = useRouter();
  const { ready } = usePrivy();
  const { disconnect } = useDisconnect();
  const { status, address } = useAccount();

  // Simplified state management
  const [verificationStatus, setVerificationStatus] = useState(
    VERIFICATION_STATES.IDLE,
  );
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simple derived state
  const hasAmbassadorAddress = Boolean(ambassadorAddress);
  const isWalletConnected = status === "connected" && Boolean(address) && ready;
  const isWalletConnecting = status === "connecting";

  // Check wallet verification
  const checkVerification = useCallback(async () => {
    if (!address || hasAmbassadorAddress) return;

    setVerificationStatus(VERIFICATION_STATES.CHECKING);
    setError(null);

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
        setVerificationStatus(VERIFICATION_STATES.VERIFIED);
      } else if (response.status === 404) {
        setVerificationStatus(VERIFICATION_STATES.NEEDS_SIGNATURE);
      } else {
        throw new Error(`Verification failed: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
      setVerificationStatus(VERIFICATION_STATES.ERROR);
    }
  }, [address, hasAmbassadorAddress]);

  // Handle signature success
  const handleSignatureSuccess = useCallback(() => {
    setVerificationStatus(VERIFICATION_STATES.VERIFIED);
    setError(null);
  }, []);

  // Handle signature error
  const handleSignatureError = useCallback((err) => {
    setError(err.message);
    setVerificationStatus(VERIFICATION_STATES.ERROR);
  }, []);

  // Handle disconnect
  const handleDisconnect = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/disconnect-wallet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.token) {
          localStorage.removeItem("neo-jwt");
          localStorage.setItem("neo-jwt", data.token);
        }
      }
    } catch (err) {
      console.error("Disconnect error:", err);
    } finally {
      disconnect();
      setVerificationStatus(VERIFICATION_STATES.IDLE);
      setError(null);
      setIsLoading(false);
      router.refresh();
    }
  }, [disconnect, router]);

  // Handle back from signing
  const handleBack = useCallback(() => {
    disconnect();
    setVerificationStatus(VERIFICATION_STATES.IDLE);
    setError(null);
  }, [disconnect]);

  // Update verification state helper (for child components)
  const updateVerificationState = useCallback((updates) => {
    if (updates.isSigningMessage !== undefined) {
      setIsLoading(updates.isSigningMessage);
    }
    if (updates.error !== undefined) {
      setError(updates.error);
    }
  }, []);

  // Main effect: Handle wallet connection changes
  useEffect(() => {
    if (hasAmbassadorAddress) {
      setVerificationStatus(VERIFICATION_STATES.VERIFIED);
    } else if (
      isWalletConnected &&
      verificationStatus === VERIFICATION_STATES.IDLE
    ) {
      checkVerification();
    } else if (!isWalletConnected) {
      setVerificationStatus(VERIFICATION_STATES.IDLE);
      setError(null);
    }
  }, [
    isWalletConnected,
    hasAmbassadorAddress,
    verificationStatus,
    checkVerification,
  ]);

  // Create legacy verificationState object for child components
  const legacyVerificationState = {
    error,
    isVerified: verificationStatus === VERIFICATION_STATES.VERIFIED,
    isSigningMessage: isLoading,
    isCheckingVerification: verificationStatus === VERIFICATION_STATES.CHECKING,
  };

  // Render logic - simple and clear
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

  if (verificationStatus === VERIFICATION_STATES.CHECKING) {
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

  if (verificationStatus === VERIFICATION_STATES.NEEDS_SIGNATURE) {
    return (
      <WalletSigningFlow
        address={address}
        onBack={handleBack}
        verificationState={legacyVerificationState}
        onSignatureError={handleSignatureError}
        onSignatureSuccess={handleSignatureSuccess}
        updateVerificationState={updateVerificationState}
      />
    );
  }

  if (verificationStatus === VERIFICATION_STATES.VERIFIED) {
    return (
      <WalletConnectedState
        address={hasAmbassadorAddress ? ambassadorAddress : address}
        isUsingAmbassadorAddress={hasAmbassadorAddress}
        verificationState={legacyVerificationState}
        onDisconnect={handleDisconnect}
        updateVerificationState={updateVerificationState}
      />
    );
  }

  if (verificationStatus === VERIFICATION_STATES.ERROR) {
    return (
      <div className="mx-auto mt-10 text-center">
        <h3 className="mb-2 text-lg font-medium text-red-400">
          Verification Error
        </h3>
        <p className="mb-4 text-sm text-gray-300">{error}</p>
        <button
          onClick={() => {
            setVerificationStatus(VERIFICATION_STATES.IDLE);
            setError(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Default: Disconnected state
  return (
    <WalletDisconnectedState
      verificationState={legacyVerificationState}
      updateVerificationState={updateVerificationState}
    />
  );
};

export default React.memo(WalletTab);
