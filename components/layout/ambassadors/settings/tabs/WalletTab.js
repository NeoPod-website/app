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

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Spinner } from "@heroui/react";
import { WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";

import WalletSigningFlow from "./wallet/WalletSigningFlow";
import WalletConnectedState from "./wallet/WalletConnectedState";
import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

/**
 * Production-ready WalletTab
 *
 * Key rules:
 * - Always wait for Privy `ready` before using wagmi state
 * - Use wagmi booleans (isConnected, isConnecting, isDisconnected)
 * - Protection for network requests (timeout using AbortController)
 * - Avoid state updates after unmount
 */

const FETCH_TIMEOUT_MS = 8000; // sensible timeout to avoid infinite loaders

const WalletTab = ({ ambassadorAddress }) => {
  const router = useRouter();
  const { ready } = usePrivy();

  const { isConnected, isConnecting, isDisconnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  // verification state kept simple
  const [verificationState, setVerificationState] = useState({
    error: null,
    isVerified: null, // null = unknown, true/false = known
    lastUpdated: null,
    signatureError: null,
    isSigningMessage: false,
    isCheckingVerification: false,
  });

  // ref to avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // helper to update verification state safely
  const safeSetVerificationState = useCallback((updater) => {
    if (!mountedRef.current) return;
    setVerificationState((prev) =>
      typeof updater === "function" ? updater(prev) : { ...prev, ...updater },
    );
  }, []);

  const resetVerificationState = useCallback(() => {
    safeSetVerificationState({
      error: null,
      isVerified: null,
      lastUpdated: null,
      signatureError: null,
      isSigningMessage: false,
      isCheckingVerification: false,
    });
  }, [safeSetVerificationState]);

  // If ambassadorAddress exists, treat it as verified (single source of truth)
  useEffect(() => {
    if (ambassadorAddress) {
      safeSetVerificationState({
        isVerified: true,
        lastUpdated: new Date(),
        error: null,
      });
      return;
    }

    // If ambassador removed and wallet disconnected, reset
    if (!ambassadorAddress && isDisconnected) {
      resetVerificationState();
    }
  }, [
    ambassadorAddress,
    isDisconnected,
    resetVerificationState,
    safeSetVerificationState,
  ]);

  // Check verification for wagmi-connected wallets (only when Privy ready and no ambassador)
  useEffect(() => {
    if (!ready) return; // don't run until Privy finished init
    if (ambassadorAddress) return; // ambassador trumps checks
    if (!isConnected || !address) return; // nothing to check
    if (verificationState.isVerified !== null) return; // already known

    let controller = new AbortController();
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, FETCH_TIMEOUT_MS);

    (async () => {
      safeSetVerificationState({ isCheckingVerification: true, error: null });
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/wallet_address/${address}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            signal: controller.signal,
          },
        );

        if (!mountedRef.current) return;

        if (res.ok) {
          safeSetVerificationState({
            isVerified: true,
            isCheckingVerification: false,
            lastUpdated: new Date(),
            error: null,
          });
        } else if (res.status === 404) {
          safeSetVerificationState({
            isVerified: false,
            isCheckingVerification: false,
            error: null,
          });
        } else {
          // non-404 non-ok -> treat as error
          const text = await res.text().catch(() => res.statusText);
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
      } catch (err) {
        if (!mountedRef.current) return;
        if (timedOut) {
          safeSetVerificationState({
            isCheckingVerification: false,
            error: "Verification request timed out. Please try again.",
            isVerified: false,
          });
          return;
        }
        if (err.name === "AbortError") {
          safeSetVerificationState({
            isCheckingVerification: false,
            error: "Verification aborted.",
            isVerified: false,
          });
          return;
        }
        console.error("Error checking wallet status:", err);
        safeSetVerificationState({
          isCheckingVerification: false,
          error: err.message || "Failed to verify wallet status",
          isVerified: false,
        });
      } finally {
        clearTimeout(timeout);
      }
    })();

    // cleanup should abort fetch
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
    // Intentionally exclude verificationState from deps to avoid rerunning while in-progress
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ready,
    ambassadorAddress,
    isConnected,
    isDisconnected,
    address,
    safeSetVerificationState,
  ]);

  // Derived flags (keep simple)
  const hasAmbassadorAddress = Boolean(ambassadorAddress);
  const needsSignature =
    !hasAmbassadorAddress &&
    isConnected &&
    verificationState.isVerified === false;
  const isVerified =
    verificationState.isVerified === true || hasAmbassadorAddress;

  // Signature handlers exposed to WalletSigningFlow
  const handleSignatureSuccess = useCallback(() => {
    safeSetVerificationState({
      isVerified: true,
      isSigningMessage: false,
      signatureError: null,
      lastUpdated: new Date(),
    });
  }, [safeSetVerificationState]);

  const handleSignatureError = useCallback(
    (error) => {
      console.error("Signature error:", error);
      safeSetVerificationState({
        isSigningMessage: false,
        signatureError: error?.message || "Signature verification failed",
        isVerified: false,
      });
    },
    [safeSetVerificationState],
  );

  const handleBackFromSigning = useCallback(() => {
    // If user backs out, disconnect locally and reset verification flow
    try {
      disconnect();
    } catch (e) {
      console.warn("Error disconnecting:", e);
    } finally {
      resetVerificationState();
    }
  }, [disconnect, resetVerificationState]);

  // Disconnect wallet both backend and wagmi, reset states and refresh server state
  const handleDisconnectWallet = useCallback(async () => {
    try {
      // try backend first (non-blocking if fails)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/disconnect-wallet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: controller.signal,
        },
      ).catch((e) => {
        console.warn("Backend disconnect request failed:", e);
        return null;
      });

      clearTimeout(timeout);

      // If backend provides updated JWT, replace it
      if (response && response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.token) {
          try {
            localStorage.removeItem("neo-jwt");
            localStorage.setItem("neo-jwt", data.token);
          } catch (e) {
            console.warn("LocalStorage write failed:", e);
          }
        }
      }
    } catch (err) {
      console.warn("Error during backend disconnect:", err);
    } finally {
      // Always disconnect wagmi locally and reset
      try {
        disconnect();
      } catch (e) {
        console.warn("Wagmi disconnect failed:", e);
      }
      resetVerificationState();

      // refresh to get updated ambassadorAddress / server state
      try {
        router.refresh();
      } catch (e) {
        // router.refresh might not be available in some test scenarios - ignore
      }
    }
  }, [disconnect, resetVerificationState, router]);

  // --- UI flow control (VERY explicit and easy to follow) ---

  // 1) Wait for Privy to initialize (this prevents mismatched states)
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

  // 2) Wagmi is in connecting state
  if (isConnecting) {
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

  // 3) If connected and we're actively checking verification
  if (isConnected && verificationState.isCheckingVerification) {
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
        {verificationState.error ? (
          <p className="mt-2 text-sm text-red-300">{verificationState.error}</p>
        ) : null}
      </div>
    );
  }

  // 4) If signature is required, show signing flow
  if (needsSignature) {
    return (
      <WalletSigningFlow
        address={address}
        onBack={handleBackFromSigning}
        verificationState={verificationState}
        onSignatureError={handleSignatureError}
        onSignatureSuccess={handleSignatureSuccess}
        updateVerificationState={(updates) => safeSetVerificationState(updates)}
      />
    );
  }

  // 5) If connected & verified -> connected state UI
  if (isConnected && isVerified) {
    return (
      <WalletConnectedState
        address={address}
        verificationState={verificationState}
        onDisconnect={handleDisconnectWallet}
        updateVerificationState={(updates) => safeSetVerificationState(updates)}
        isUsingAmbassadorAddress={false}
      />
    );
  }

  // 6) If ambassador address was provided (handled early) -> connected via ambassador
  if (hasAmbassadorAddress) {
    return (
      <WalletConnectedState
        address={ambassadorAddress}
        isUsingAmbassadorAddress={true}
        verificationState={verificationState}
        onDisconnect={handleDisconnectWallet}
        updateVerificationState={(updates) => safeSetVerificationState(updates)}
      />
    );
  }

  // 7) default: disconnected
  return (
    <WalletDisconnectedState
      verificationState={verificationState}
      updateVerificationState={(updates) => safeSetVerificationState(updates)}
    />
  );
};

export default WalletTab;
