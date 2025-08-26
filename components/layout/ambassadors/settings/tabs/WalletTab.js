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

// "use client";

// import { Spinner } from "@heroui/react";
// import { WalletIcon, AlertCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { usePrivy } from "@privy-io/react-auth";
// import { useAccount, useDisconnect } from "wagmi";
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";

// import WalletSigningFlow from "./wallet/WalletSigningFlow";
// import WalletConnectedState from "./wallet/WalletConnectedState";
// import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

// // Constants
// const CONNECTION_TIMEOUT = 30000; // 30 seconds
// const VERIFICATION_TIMEOUT = 15000; // 15 seconds
// const MAX_RETRY_ATTEMPTS = 1;
// const RETRY_DELAY = 2000; // 2 seconds

// // Initial state
// const createInitialVerificationState = () => ({
//   error: null,
//   isVerified: null,
//   lastUpdated: null,
//   signatureError: null,
//   isSigningMessage: false,
//   isCheckingVerification: false,
//   retryCount: 0,
//   lastAddress: null, // Track address changes
// });

// const WalletTab = ({ ambassadorAddress }) => {
//   const router = useRouter();
//   const { ready } = usePrivy();
//   const { disconnect } = useDisconnect();
//   const { status, address } = useAccount();

//   // Refs for preventing memory leaks and race conditions
//   const isMountedRef = useRef(true);
//   const connectionTimeoutRef = useRef(null);
//   const verificationTimeoutRef = useRef(null);
//   const retryTimeoutRef = useRef(null);

//   // State management
//   const [verificationState, setVerificationState] = useState(
//     createInitialVerificationState,
//   );
//   const [hasConnectionError, setHasConnectionError] = useState(false);
//   const [lastStatusChange, setLastStatusChange] = useState(Date.now());

//   // Memoized values to prevent unnecessary re-renders
//   const hasAmbassadorAddress = useMemo(
//     () => Boolean(ambassadorAddress),
//     [ambassadorAddress],
//   );

//   const connectionState = useMemo(
//     () => ({
//       isConnected: status === "connected" && Boolean(address) && ready,
//       isConnecting: status === "connecting",
//       isDisconnected: status === "disconnected",
//       hasAddress: Boolean(address),
//     }),
//     [status, address, ready],
//   );

//   const walletState = useMemo(() => {
//     const needsSignature =
//       !hasAmbassadorAddress &&
//       connectionState.isConnected &&
//       address && // Ensure address exists
//       verificationState.isVerified === false &&
//       !verificationState.isCheckingVerification;

//     const isVerified =
//       verificationState.isVerified === true || hasAmbassadorAddress;

//     const showConnected =
//       (connectionState.isConnected &&
//         address &&
//         verificationState.isVerified === true) ||
//       hasAmbassadorAddress;

//     // NEW: Should show checking state when connected but verification is null or checking
//     const shouldShowChecking =
//       connectionState.isConnected &&
//       address &&
//       !hasAmbassadorAddress &&
//       (verificationState.isVerified === null ||
//         verificationState.isCheckingVerification);

//     console.log("🎯 Wallet state computed:", {
//       needsSignature,
//       isVerified,
//       showConnected,
//       shouldShowChecking, // Add this to logs
//       connectionState: connectionState.isConnected,
//       address: Boolean(address),
//       verificationState: verificationState.isVerified,
//       isCheckingVerification: verificationState.isCheckingVerification,
//       hasAmbassadorAddress,
//     });

//     return {
//       needsSignature,
//       isVerified,
//       showConnected,
//       shouldShowChecking, // Add this to return
//     };
//   }, [
//     hasAmbassadorAddress,
//     connectionState.isConnected,
//     address, // Add address as dependency
//     verificationState.isVerified,
//     verificationState.isCheckingVerification,
//   ]);

//   // Cleanup function
//   const cleanup = useCallback(() => {
//     if (connectionTimeoutRef.current) {
//       clearTimeout(connectionTimeoutRef.current);
//       connectionTimeoutRef.current = null;
//     }
//     if (verificationTimeoutRef.current) {
//       clearTimeout(verificationTimeoutRef.current);
//       verificationTimeoutRef.current = null;
//     }
//     if (retryTimeoutRef.current) {
//       clearTimeout(retryTimeoutRef.current);
//       retryTimeoutRef.current = null;
//     }
//   }, []);

//   // Safe state update function
//   const safeSetVerificationState = useCallback((updater) => {
//     if (isMountedRef.current) {
//       setVerificationState(updater);
//     }
//   }, []);

//   // Reset verification state
//   const resetVerificationState = useCallback(() => {
//     cleanup();
//     safeSetVerificationState(() => createInitialVerificationState());
//     setHasConnectionError(false);
//   }, [cleanup, safeSetVerificationState]);

//   // Connection timeout handler
//   const handleConnectionTimeout = useCallback(() => {
//     console.warn("🚨 Wallet connection timeout detected");

//     if (isMountedRef.current && connectionState.isConnecting) {
//       setHasConnectionError(true);

//       try {
//         disconnect();
//       } catch (error) {
//         console.error("Error disconnecting wallet:", error);
//       }

//       resetVerificationState();
//     }
//   }, [connectionState.isConnecting, disconnect, resetVerificationState]);

//   // Verification timeout handler
//   const handleVerificationTimeout = useCallback(() => {
//     console.warn("🚨 Wallet verification timeout detected");

//     safeSetVerificationState((prev) => ({
//       ...prev,
//       isCheckingVerification: false,
//       error: "Verification timed out. Please try again.",
//       isVerified: false,
//     }));
//   }, [safeSetVerificationState]);

//   // Check wallet verification status with improved error handling
//   const checkWalletVerificationStatus = useCallback(async () => {
//     if (
//       !address ||
//       !connectionState.isConnected ||
//       hasAmbassadorAddress ||
//       verificationState.isCheckingVerification
//     ) {
//       return;
//     }

//     // Prevent multiple simultaneous checks
//     safeSetVerificationState((prev) => ({
//       ...prev,
//       isCheckingVerification: true,
//       error: null,
//     }));

//     // Set verification timeout
//     verificationTimeoutRef.current = setTimeout(
//       handleVerificationTimeout,
//       VERIFICATION_TIMEOUT,
//     );

//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(
//         () => controller.abort(),
//         VERIFICATION_TIMEOUT - 1000,
//       );

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/wallet_address/${address}`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           signal: controller.signal,
//         },
//       );

//       clearTimeout(timeoutId);
//       clearTimeout(verificationTimeoutRef.current);

//       if (!isMountedRef.current) return;

//       if (response.ok) {
//         safeSetVerificationState((prev) => ({
//           ...prev,
//           isVerified: true,
//           isCheckingVerification: false,
//           lastUpdated: new Date(),
//           error: null,
//           retryCount: 0,
//         }));
//       } else if (response.status === 404) {
//         safeSetVerificationState((prev) => ({
//           ...prev,
//           isVerified: false,
//           isCheckingVerification: false,
//           error: null,
//           retryCount: 0,
//         }));
//       } else {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       if (!isMountedRef.current) return;

//       console.error("Error checking wallet verification:", error);

//       const isAbortError = error.name === "AbortError";
//       const shouldRetry =
//         !isAbortError && verificationState.retryCount < MAX_RETRY_ATTEMPTS;

//       if (shouldRetry) {
//         // Retry with exponential backoff
//         const retryDelay =
//           RETRY_DELAY * Math.pow(2, verificationState.retryCount);

//         retryTimeoutRef.current = setTimeout(() => {
//           if (isMountedRef.current) {
//             safeSetVerificationState((prev) => ({
//               ...prev,
//               retryCount: prev.retryCount + 1,
//               isCheckingVerification: false,
//             }));
//           }
//         }, retryDelay);
//       } else {
//         safeSetVerificationState((prev) => ({
//           ...prev,
//           isCheckingVerification: false,
//           error: isAbortError
//             ? "Request timed out"
//             : error.message || "Failed to verify wallet status",
//           isVerified: false,
//         }));
//       }
//     }
//   }, [
//     address,
//     connectionState.isConnected,
//     hasAmbassadorAddress,
//     verificationState.isCheckingVerification,
//     verificationState.retryCount,
//     safeSetVerificationState,
//     handleVerificationTimeout,
//   ]);

//   // Handle signature success
//   const handleSignatureSuccess = useCallback(() => {
//     safeSetVerificationState((prev) => ({
//       ...prev,
//       isVerified: true,
//       isSigningMessage: false,
//       signatureError: null,
//       lastUpdated: new Date(),
//       error: null,
//     }));
//   }, [safeSetVerificationState]);

//   // Handle signature error
//   const handleSignatureError = useCallback(
//     (error) => {
//       console.error("Signature error:", error);
//       safeSetVerificationState((prev) => ({
//         ...prev,
//         isSigningMessage: false,
//         signatureError: error?.message || "Signature verification failed",
//         isVerified: false,
//       }));
//     },
//     [safeSetVerificationState],
//   );

//   // Handle back from signing
//   const handleBackFromSigning = useCallback(() => {
//     try {
//       disconnect();
//     } catch (error) {
//       console.error("Error disconnecting during back action:", error);
//     }

//     resetVerificationState();
//   }, [disconnect, resetVerificationState]);

//   // Handle wallet disconnect
//   const handleDisconnectWallet = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/disconnect-wallet`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         },
//       );

//       if (response.ok) {
//         const data = await response.json();

//         // Update JWT token if provided
//         if (data?.token) {
//           localStorage.removeItem("neo-jwt");
//           localStorage.setItem("neo-jwt", data.token);
//         }
//       }
//     } catch (error) {
//       console.error("Error disconnecting wallet from backend:", error);
//     } finally {
//       // Always perform local cleanup
//       try {
//         if (connectionState.isConnected) {
//           disconnect();
//         }
//       } catch (error) {
//         console.error("Error disconnecting wallet locally:", error);
//       }

//       resetVerificationState();

//       // Refresh to update ambassador address from server
//       router.refresh();
//     }
//   }, [connectionState.isConnected, disconnect, resetVerificationState, router]);

//   // Update verification state helper
//   const updateVerificationState = useCallback(
//     (updates) => {
//       safeSetVerificationState((prev) => ({ ...prev, ...updates }));
//     },
//     [safeSetVerificationState],
//   );

//   // Effect: Set ambassador address as verified immediately
//   useEffect(() => {
//     if (hasAmbassadorAddress && verificationState.isVerified === null) {
//       safeSetVerificationState((prev) => ({
//         ...prev,
//         isVerified: true,
//         lastUpdated: new Date(),
//       }));
//     }
//   }, [
//     hasAmbassadorAddress,
//     verificationState.isVerified,
//     safeSetVerificationState,
//   ]);

//   // Effect: Connection timeout protection
//   useEffect(() => {
//     if (connectionState.isConnecting) {
//       setLastStatusChange(Date.now());

//       connectionTimeoutRef.current = setTimeout(
//         handleConnectionTimeout,
//         CONNECTION_TIMEOUT,
//       );

//       return () => {
//         if (connectionTimeoutRef.current) {
//           clearTimeout(connectionTimeoutRef.current);
//           connectionTimeoutRef.current = null;
//         }
//       };
//     }
//   }, [connectionState.isConnecting, handleConnectionTimeout]);

//   // Effect: Check verification for connected wallets
//   useEffect(() => {
//     console.log("🔍 Checking wallet connection state:", {
//       hasAmbassadorAddress,
//       isConnected: connectionState.isConnected,
//       address,
//       verificationState: verificationState.isVerified,
//       isCheckingVerification: verificationState.isCheckingVerification,
//       status,
//       ready,
//     });

//     if (
//       !hasAmbassadorAddress &&
//       connectionState.isConnected &&
//       address && // Ensure address exists
//       verificationState.isVerified === null &&
//       !verificationState.isCheckingVerification
//     ) {
//       console.log("🚀 Triggering wallet verification check");

//       // Small delay to ensure wallet is fully connected
//       const timeoutId = setTimeout(() => {
//         if (isMountedRef.current) {
//           checkWalletVerificationStatus();
//         }
//       }, 1000); // Increased delay

//       return () => clearTimeout(timeoutId);
//     }
//   }, [
//     hasAmbassadorAddress,
//     connectionState.isConnected,
//     address, // Add address as dependency
//     verificationState.isVerified,
//     verificationState.isCheckingVerification,
//     checkWalletVerificationStatus,
//     status, // Add status as dependency
//     ready, // Add ready as dependency
//   ]);

//   // Effect: Reset state when wallet disconnects AND handle address changes
//   useEffect(() => {
//     if (!hasAmbassadorAddress && connectionState.isDisconnected) {
//       console.log("🔄 Wallet disconnected - resetting state");
//       resetVerificationState();
//     }
//   }, [
//     hasAmbassadorAddress,
//     connectionState.isDisconnected,
//     resetVerificationState,
//   ]);

//   // Effect: Handle address changes (important for wallet switching)
//   useEffect(() => {
//     console.log("📍 Address changed:", {
//       address,
//       previousAddress: verificationState.lastAddress,
//     });

//     if (
//       address &&
//       address !== verificationState.lastAddress &&
//       !hasAmbassadorAddress
//     ) {
//       console.log("🔄 New address detected - resetting verification state");

//       // Reset verification state for new address
//       safeSetVerificationState((prev) => ({
//         ...createInitialVerificationState(),
//         lastAddress: address,
//       }));
//     }
//   }, [
//     address,
//     hasAmbassadorAddress,
//     verificationState.lastAddress,
//     safeSetVerificationState,
//   ]);

//   // Effect: Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//       cleanup();
//     };
//   }, [cleanup]);

//   // Effect: Handle retry logic
//   useEffect(() => {
//     if (
//       verificationState.retryCount > 0 &&
//       verificationState.retryCount <= MAX_RETRY_ATTEMPTS &&
//       !verificationState.isCheckingVerification &&
//       connectionState.isConnected &&
//       !hasAmbassadorAddress
//     ) {
//       checkWalletVerificationStatus();
//     }
//   }, [
//     verificationState.retryCount,
//     verificationState.isCheckingVerification,
//     connectionState.isConnected,
//     hasAmbassadorAddress,
//     checkWalletVerificationStatus,
//   ]);

//   // Error boundary for connection issues
//   if (hasConnectionError) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
//           <AlertCircle size={32} className="text-red-400" />
//         </div>

//         <h3 className="mb-2 text-lg font-medium text-white">
//           Connection Failed
//         </h3>

//         <p className="mb-4 text-sm text-gray-200">
//           Unable to establish wallet connection. Please try again.
//         </p>

//         <button
//           onClick={() => {
//             setHasConnectionError(false);
//             resetVerificationState();
//           }}
//           className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm text-white"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // MAIN LOGIC: Ambassador address takes precedence
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

//   // Wallet connecting state with timeout protection
//   if (connectionState.isConnecting) {
//     const elapsedTime = Date.now() - lastStatusChange;
//     const isNearTimeout = elapsedTime > CONNECTION_TIMEOUT * 0.8; // 80% of timeout

//     return (
//       <div className="mx-auto mt-10 text-center">
//         <div className="bg-blue-600/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
//           <WalletIcon size={32} className="text-gray-100" />
//         </div>

//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-xl font-bold text-white">Connecting Wallet</h3>

//         <p className="text-gray-200">
//           {isNearTimeout
//             ? "Taking longer than expected..."
//             : "Please approve the connection in your wallet..."}
//         </p>
//       </div>
//     );
//   }

//   // Wallet verification checking state - MOVE THIS UP BEFORE OTHER CHECKS
//   if (walletState.shouldShowChecking) {
//     console.log("🔍 Showing verification checking state");
//     return (
//       <div className="flex min-h-[400px] flex-col items-center justify-center">
//         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
//           <WalletIcon size={32} className="text-purple-400" />
//         </div>

//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-xl font-bold text-white">Verifying Wallet</h3>

//         <p className="text-gray-400">
//           {verificationState.retryCount > 0
//             ? `Retry attempt ${verificationState.retryCount}/${MAX_RETRY_ATTEMPTS}...`
//             : "Checking your wallet verification status..."}
//         </p>
//       </div>
//     );
//   }

//   // Signature required state
//   if (walletState.needsSignature) {
//     console.log("✍️ Showing signature flow");
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
//   if (walletState.showConnected) {
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

// export default React.memo(WalletTab);

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

const WalletTab = ({ ambassadorAddress }) => {
  const router = useRouter();
  const { ready } = usePrivy();
  const { disconnect } = useDisconnect();
  const { status, address } = useAccount();

  const [verificationState, setVerificationState] = useState({
    error: null,
    isVerified: null,
    lastUpdated: null,
    signatureError: null,
    isSigningMessage: false,
    isCheckingVerification: false,
  });

  const hasAmbassadorAddress = Boolean(ambassadorAddress);

  // Check wallet verification status
  const checkWalletVerificationStatus = useCallback(async () => {
    if (!address || !ready || hasAmbassadorAddress) return;

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
      setVerificationState((prev) => ({
        ...prev,
        isCheckingVerification: false,
        error: error.message || "Failed to verify wallet status",
        isVerified: false,
      }));
    }
  }, [address, ready, hasAmbassadorAddress]);

  const handleSignatureSuccess = useCallback(() => {
    setVerificationState((prev) => ({
      ...prev,
      isVerified: true,
      isSigningMessage: false,
      signatureError: null,
      lastUpdated: new Date(),
    }));
  }, []);

  const handleSignatureError = useCallback((error) => {
    setVerificationState((prev) => ({
      ...prev,
      isSigningMessage: false,
      signatureError: error.message || "Signature verification failed",
      isVerified: false,
    }));
  }, []);

  const handleBackFromSigning = useCallback(() => {
    disconnect();
    setVerificationState({
      error: null,
      isVerified: null,
      lastUpdated: null,
      signatureError: null,
      isSigningMessage: false,
      isCheckingVerification: false,
    });
  }, [disconnect]);

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
        if (data?.token) {
          localStorage.removeItem("neo-jwt");
          localStorage.setItem("neo-jwt", data.token);
        }
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    } finally {
      if (status === "connected") {
        disconnect();
      }
      setVerificationState({
        error: null,
        isVerified: null,
        lastUpdated: null,
        signatureError: null,
        isSigningMessage: false,
        isCheckingVerification: false,
      });
      router.refresh();
    }
  }, [status, disconnect, router]);

  const updateVerificationState = useCallback((updates) => {
    setVerificationState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Set ambassador address as verified immediately
  useEffect(() => {
    if (hasAmbassadorAddress && verificationState.isVerified === null) {
      setVerificationState((prev) => ({
        ...prev,
        isVerified: true,
        lastUpdated: new Date(),
      }));
    }
  }, [hasAmbassadorAddress, verificationState.isVerified]);

  // Check verification when wallet connects (like your login flow)
  useEffect(() => {
    if (
      ready &&
      status === "connected" &&
      !hasAmbassadorAddress &&
      verificationState.isVerified === null
    ) {
      checkWalletVerificationStatus();
    }
  }, [
    ready,
    status,
    hasAmbassadorAddress,
    verificationState.isVerified,
    checkWalletVerificationStatus,
  ]);

  // Reset verification state when wallet disconnects
  useEffect(() => {
    if (!hasAmbassadorAddress && status === "disconnected") {
      setVerificationState({
        error: null,
        isVerified: null,
        lastUpdated: null,
        signatureError: null,
        isSigningMessage: false,
        isCheckingVerification: false,
      });
    }
  }, [hasAmbassadorAddress, status]);

  // Ambassador address - show connected immediately
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
  if (status === "connecting") {
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
  if (status === "connected" && verificationState.isCheckingVerification) {
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
  if (status === "connected" && verificationState.isVerified === false) {
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
  if (status === "connected" && verificationState.isVerified === true) {
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
