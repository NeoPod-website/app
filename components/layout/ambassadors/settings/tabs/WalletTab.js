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
//   const { isConnected, status, address } = useAccount();
//   console.log(
//     "Wagmi account status:",
//     status,
//     "address:",
//     address,
//     "isConnected:",
//     isConnected,
//   );

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

import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Spinner } from "@heroui/react";
import { WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";

import WalletSigningFlow from "./wallet/WalletSigningFlow";
import WalletConnectedState from "./wallet/WalletConnectedState";
import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

const CONNECTION_TIMEOUT = 3000;

// Simplified state structure
const initialState = {
  isVerified: null,
  isCheckingVerification: false,
  error: null,
  signatureError: null,
  connectionTimedOut: false,
  lastUpdated: null,
};

const WalletTab = ({ ambassadorAddress }) => {
  const router = useRouter();
  const { ready } = usePrivy();
  const { disconnect } = useDisconnect();

  // Use useAccount hook more effectively
  const {
    address,
    isConnecting,
    isReconnecting,
    isConnected,
    isDisconnected,
    status,
  } = useAccount();

  // Refs for cleanup
  const connectionTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Simplified state management
  const [walletState, setWalletState] = useState(initialState);

  // Cleanup function
  const clearTimeouts = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, []);

  // Safe state update
  const updateWalletState = useCallback((updates) => {
    if (isMountedRef.current) {
      setWalletState((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  // Memoized current view calculation
  const currentView = useMemo(() => {
    // Ambassador address exists - always connected
    if (ambassadorAddress) {
      return "CONNECTED";
    }

    // Privy not ready
    if (!ready) {
      return "LOADING";
    }

    // Connection timed out or has error
    if (walletState.connectionTimedOut || walletState.error) {
      return "ERROR";
    }

    // Use the boolean flags from useAccount for cleaner logic
    if (isConnecting || isReconnecting) {
      return "CONNECTING";
    }

    if (isConnected && address) {
      // Connected wallet - check verification status
      if (walletState.isCheckingVerification) {
        return "VERIFYING";
      }

      if (walletState.isVerified === false) {
        return "SIGNING";
      }

      if (walletState.isVerified === true) {
        return "CONNECTED";
      }

      // Default to verifying if verification status is unknown
      return "VERIFYING";
    }

    // Default to disconnected
    return "DISCONNECTED";
  }, [
    ambassadorAddress,
    ready,
    isConnecting,
    isReconnecting,
    isConnected,
    address,
    walletState.connectionTimedOut,
    walletState.error,
    walletState.isCheckingVerification,
    walletState.isVerified,
  ]);

  // Reset state
  const resetWalletState = useCallback(() => {
    clearTimeouts();
    updateWalletState({
      ...initialState,
      lastUpdated: new Date(),
    });
  }, [clearTimeouts, updateWalletState]);

  // Check wallet verification with improved error handling
  const checkWalletVerification = useCallback(
    async (walletAddress) => {
      if (!walletAddress || ambassadorAddress) return;

      updateWalletState({
        isCheckingVerification: true,
        error: null,
      });

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/wallet_address/${walletAddress}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (!isMountedRef.current) return;

        if (response.ok) {
          updateWalletState({
            isVerified: true,
            isCheckingVerification: false,
            lastUpdated: new Date(),
            error: null,
          });
        } else if (response.status === 404) {
          updateWalletState({
            isVerified: false,
            isCheckingVerification: false,
            error: null,
          });
        } else {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(
            `Verification failed: ${response.status} - ${errorText}`,
          );
        }
      } catch (error) {
        if (!isMountedRef.current) return;

        updateWalletState({
          isCheckingVerification: false,
          error: error.message || "Failed to verify wallet",
          isVerified: false,
        });
      }
    },
    [ambassadorAddress, updateWalletState],
  );

  // Handle disconnect with improved error handling
  const handleDisconnectWallet = useCallback(async () => {
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
        localStorage.removeItem("neo-jwt");
        localStorage.setItem("neo-jwt", data.token);
      }

      // Disconnect wagmi only if connected
      if (isConnected) {
        disconnect();
      }

      // Reset state
      resetWalletState();

      // Refresh page
      window.location.reload();
    } catch (error) {
      // Fallback: disconnect locally
      if (isConnected) {
        disconnect();
      }

      updateWalletState({
        error: "Failed to disconnect properly. Please refresh the page.",
      });
    }
  }, [isConnected, disconnect, router, resetWalletState, updateWalletState]);

  // Handle signature success
  const handleSignatureSuccess = useCallback(async () => {
    updateWalletState({
      isVerified: true,
      signatureError: null,
      lastUpdated: new Date(),
    });
  }, [updateWalletState]);

  // Handle signature error
  const handleSignatureError = useCallback(
    (error) => {
      updateWalletState({
        signatureError: error?.message || "Signature verification failed",
        isVerified: false,
      });
    },
    [updateWalletState],
  );

  // Handle back from signing
  const handleBackFromSigning = useCallback(() => {
    disconnect();
    resetWalletState();
  }, [disconnect, resetWalletState]);

  // Effect: Set ambassador address as verified immediately
  useEffect(() => {
    if (ambassadorAddress && walletState.isVerified !== true) {
      updateWalletState({
        isVerified: true,
        lastUpdated: new Date(),
      });
    }
  }, [ambassadorAddress, walletState.isVerified, updateWalletState]);

  // Effect: Handle connection timeout - simplified using boolean flags
  useEffect(() => {
    if (isConnecting && ready) {
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current && isConnecting) {
          updateWalletState({
            connectionTimedOut: true,
            error: "Connection timed out. Please try again.",
          });
          disconnect();
        }
      }, CONNECTION_TIMEOUT);

      connectionTimeoutRef.current = timeoutId;
    } else {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;

      if (walletState.connectionTimedOut) {
        updateWalletState({ connectionTimedOut: false });
      }
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [
    isConnecting,
    ready,
    disconnect,
    updateWalletState,
    walletState.connectionTimedOut,
  ]);

  // Effect: Check verification when wallet connects
  useEffect(() => {
    if (
      !ambassadorAddress &&
      isConnected &&
      address &&
      ready &&
      walletState.isVerified === null &&
      !walletState.isCheckingVerification
    ) {
      checkWalletVerification(address);
    }
  }, [
    ambassadorAddress,
    isConnected,
    address,
    ready,
    walletState.isVerified,
    walletState.isCheckingVerification,
    checkWalletVerification,
  ]);

  // Effect: Reset state when disconnected (but not for ambassador)
  useEffect(() => {
    if (
      isDisconnected &&
      !ambassadorAddress &&
      currentView !== "DISCONNECTED"
    ) {
      resetWalletState();
    }
  }, [isDisconnected, ambassadorAddress, currentView, resetWalletState]);

  // Effect: Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimeouts();
    };
  }, [clearTimeouts]);

  // Render based on current view state
  switch (currentView) {
    case "LOADING":
      return (
        <div className="mx-auto mt-10 text-center">
          <Spinner size="lg" className="mb-4" color="white" />
          <h3 className="mb-2 text-lg font-medium text-white">
            Initializing Wallet
          </h3>
          <p className="text-sm text-gray-200">
            Preparing wallet connection...
          </p>
        </div>
      );

    case "ERROR":
      return (
        <div className="mx-auto mt-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
            <WalletIcon size={32} className="text-red-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-red-400">
            Connection Failed
          </h3>
          <p className="mb-4 text-gray-300">
            {walletState.error || "Connection failed. Please try again."}
          </p>
          <WalletDisconnectedState
            verificationState={walletState}
            updateVerificationState={updateWalletState}
          />
        </div>
      );

    case "CONNECTING":
      return (
        <div className="mx-auto mt-10 text-center">
          <div className="bg-blue-600/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <WalletIcon size={32} className="text-gray-100" />
          </div>
          <Spinner size="lg" className="mb-4" color="white" />
          <h3 className="mb-2 text-xl font-bold text-white">
            {isReconnecting ? "Reconnecting" : "Connecting"} Wallet
          </h3>
          <p className="text-gray-200">
            Please approve the connection in your wallet...
          </p>
        </div>
      );

    case "VERIFYING":
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
            <WalletIcon size={32} className="text-purple-400" />
          </div>
          <Spinner size="lg" className="mb-4" color="white" />
          <h3 className="mb-2 text-xl font-bold text-white">
            Verifying Wallet
          </h3>
          <p className="text-gray-400">
            Checking your wallet verification status...
          </p>
        </div>
      );

    case "SIGNING":
      return (
        <WalletSigningFlow
          address={address}
          onBack={handleBackFromSigning}
          verificationState={walletState}
          onSignatureError={handleSignatureError}
          onSignatureSuccess={handleSignatureSuccess}
          updateVerificationState={updateWalletState}
        />
      );

    case "CONNECTED":
      return (
        <WalletConnectedState
          address={ambassadorAddress || address}
          isUsingAmbassadorAddress={!!ambassadorAddress}
          verificationState={walletState}
          onDisconnect={handleDisconnectWallet}
          updateVerificationState={updateWalletState}
        />
      );

    case "DISCONNECTED":
    default:
      return (
        <WalletDisconnectedState
          verificationState={walletState}
          updateVerificationState={updateWalletState}
        />
      );
  }
};

export default WalletTab;
