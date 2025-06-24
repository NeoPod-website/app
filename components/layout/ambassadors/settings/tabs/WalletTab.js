// "use client";

// import { Spinner } from "@heroui/react";
// import { WalletIcon } from "lucide-react";
// import { usePrivy } from "@privy-io/react-auth";
// import { useAccount, useDisconnect } from "wagmi";
// import React, { useState, useEffect } from "react";

// import { getSupportedNetworks } from "@/config/networks";

// // Import wallet sub-components
// import WalletSigningFlow from "./wallet/WalletSigningFlow";
// import WalletConnectedState from "./wallet/WalletConnectedState";
// import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

// const WalletTab = ({ ambassadorAddress }) => {
//   const { ready } = usePrivy();
//   const { disconnect } = useDisconnect();
//   const { status, address } = useAccount();

//   // Only track verification and data loading states - not connection states
//   const [verificationState, setVerificationState] = useState({
//     error: null,
//     isVerified: null,
//     lastUpdated: null,
//     signatureError: null,
//     isLoadingData: false,
//     selectedNetwork: "neo",
//     isSigningMessage: false,
//     isCheckingVerification: false,
//   });

//   const [networkBalances, setNetworkBalances] = useState(() => {
//     // Initialize empty balances for all supported networks
//     const supportedNetworks = getSupportedNetworks();

//     return supportedNetworks.reduce((acc, networkKey) => {
//       acc[networkKey] = { balance: "0", balanceUSD: "0", isLoading: false };
//       return acc;
//     }, {});
//   });

//   // Derived states based on actual wallet connection status
//   const isWalletConnected = status === "connected" && address && ready;
//   const isWalletConnecting = status === "connecting";
//   const isWalletDisconnected = status === "disconnected";

//   // Verification states
//   const needsVerificationCheck =
//     isWalletConnected &&
//     verificationState.isVerified === null &&
//     !verificationState.isCheckingVerification;
//   const isVerified = verificationState.isVerified === true;
//   const needsSignature = verificationState.isVerified === false;

//   const isFullyAuthenticated = isWalletConnected && isVerified;

//   // Check verification status when wallet connects
//   useEffect(() => {
//     if (needsVerificationCheck && address) {
//       checkWalletVerificationStatus();
//     }
//   }, [needsVerificationCheck, address]);

//   // Reset verification state when wallet disconnects
//   useEffect(() => {
//     if (isWalletDisconnected) {
//       resetVerificationState();
//     }
//   }, [isWalletDisconnected]);

//   const checkWalletVerificationStatus = async () => {
//     if (!address || !isWalletConnected) return;

//     setVerificationState((prev) => ({
//       ...prev,
//       isCheckingVerification: true,
//       error: null,
//     }));

//     try {
//       // Check if wallet exists and is verified in database
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/wallet_address/${address}`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         },
//       );

//       if (response.ok) {
//         // Wallet exists and is verified
//         setVerificationState((prev) => ({
//           ...prev,
//           isVerified: true,
//           isCheckingVerification: false,
//         }));

//         // Load wallet data
//         await loadWalletData();
//       } else if (response.status === 404) {
//         // Wallet not found, needs signature verification
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

//   const loadWalletData = async () => {
//     setVerificationState((prev) => ({ ...prev, isLoadingData: true }));

//     try {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Mock balances for different networks
//       const mockBalances = {
//         neo: { balance: "142.75", balanceUSD: "8,565.00", isLoading: false },
//         ethereum: { balance: "2.34", balanceUSD: "5,850.00", isLoading: false },
//         polygon: {
//           balance: "1,250.00",
//           balanceUSD: "1,125.00",
//           isLoading: false,
//         },
//         bsc: { balance: "15.67", balanceUSD: "9,402.00", isLoading: false },
//         arbitrum: { balance: "1.89", balanceUSD: "4,725.00", isLoading: false },
//         base: { balance: "0.95", balanceUSD: "2,375.00", isLoading: false },
//       };

//       setNetworkBalances(mockBalances);
//       setVerificationState((prev) => ({
//         ...prev,
//         isLoadingData: false,
//         lastUpdated: new Date(),
//         error: null,
//       }));
//     } catch (error) {
//       console.error("Error loading wallet data:", error);
//       setVerificationState((prev) => ({
//         ...prev,
//         isLoadingData: false,
//         error: "Failed to load wallet data",
//       }));
//     }
//   };

//   const handleSignatureSuccess = async () => {
//     setVerificationState((prev) => ({
//       ...prev,
//       isVerified: true,
//       isSigningMessage: false,
//       signatureError: null,
//     }));

//     // Load wallet data after successful signature
//     await loadWalletData();
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
//     // Reset verification state when user goes back
//     setVerificationState((prev) => ({
//       ...prev,
//       isVerified: null,
//       isSigningMessage: false,
//       signatureError: null,
//     }));
//   };

//   const resetVerificationState = () => {
//     setVerificationState({
//       error: null,
//       isVerified: null,
//       lastUpdated: null,
//       signatureError: null,
//       isLoadingData: false,
//       selectedNetwork: "neo",
//       isSigningMessage: false,
//       isCheckingVerification: false,
//     });

//     // Reset balances
//     const supportedNetworks = getSupportedNetworks();
//     const resetBalances = supportedNetworks.reduce((acc, networkKey) => {
//       acc[networkKey] = { balance: "0", balanceUSD: "0", isLoading: false };
//       return acc;
//     }, {});
//     setNetworkBalances(resetBalances);
//   };

//   const updateVerificationState = (updates) => {
//     setVerificationState((prev) => ({ ...prev, ...updates }));
//   };

//   const updateNetworkBalances = (updates) => {
//     setNetworkBalances((prev) => ({ ...prev, ...updates }));
//   };

//   // Don't render anything until Privy is ready
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

//   // Show connecting state
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

//   // Show verification checking state (only when wallet is connected)
//   if (isWalletConnected && verificationState.isCheckingVerification) {
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

//   // Show disconnected state (wallet not connected)
//   if (isWalletDisconnected || !isWalletConnected) {
//     return (
//       <WalletDisconnectedState
//         verificationState={verificationState}
//         updateVerificationState={updateVerificationState}
//       />
//     );
//   }

//   // Show signing flow (wallet connected but needs signature)
//   if (isWalletConnected && needsSignature) {
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

//   // Show connected state (wallet connected and verified)
//   if (isFullyAuthenticated) {
//     return (
//       <WalletConnectedState
//         status={status}
//         address={address}
//         onRefreshData={loadWalletData}
//         networkBalances={networkBalances}
//         verificationState={verificationState}
//         onDisconnect={resetVerificationState}
//         updateNetworkBalances={updateNetworkBalances}
//         updateVerificationState={updateVerificationState}
//       />
//     );
//   }

//   // Fallback - should not reach here, but show disconnected state
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
// import { WalletIcon } from "lucide-react";
// import { usePrivy } from "@privy-io/react-auth";
// import { useAccount, useDisconnect } from "wagmi";
// import React, { useState, useEffect } from "react";

// import { getSupportedNetworks } from "@/config/networks";

// // Import wallet sub-components
// import WalletSigningFlow from "./wallet/WalletSigningFlow";
// import WalletConnectedState from "./wallet/WalletConnectedState";
// import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

// const WalletTab = ({ ambassadorAddress }) => {
//   const { ready } = usePrivy();
//   const { disconnect } = useDisconnect();
//   const { status, address } = useAccount();

//   // State for managing wallet data and UI
//   const [verificationState, setVerificationState] = useState({
//     error: null,
//     isVerified: null,
//     lastUpdated: null,
//     signatureError: null,
//     isLoadingData: false,
//     selectedNetwork: "neo",
//     isSigningMessage: false,
//     isCheckingVerification: false,
//   });

//   const [networkBalances, setNetworkBalances] = useState(() => {
//     const supportedNetworks = getSupportedNetworks();
//     return supportedNetworks.reduce((acc, networkKey) => {
//       acc[networkKey] = { balance: "0", balanceUSD: "0", isLoading: false };
//       return acc;
//     }, {});
//   });

//   // Primary logic: ambassadorAddress is the source of truth
//   const hasAmbassadorAddress = !!ambassadorAddress;
//   const isWalletConnectedViaWagmi = status === "connected" && address && ready;
//   const isWalletConnecting = status === "connecting";

//   // Verification logic - simplified
//   const needsSignature =
//     !hasAmbassadorAddress &&
//     isWalletConnectedViaWagmi &&
//     verificationState.isVerified === false;

//   const isVerified =
//     verificationState.isVerified === true || hasAmbassadorAddress;

//   // Load wallet data when ambassadorAddress is available
//   useEffect(() => {
//     if (hasAmbassadorAddress && verificationState.isVerified === null) {
//       setVerificationState((prev) => ({
//         ...prev,
//         isVerified: true,
//       }));
//       loadWalletData();
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
//         }));
//         await loadWalletData();
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

//   const loadWalletData = async () => {
//     setVerificationState((prev) => ({ ...prev, isLoadingData: true }));

//     try {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Mock balances - replace with actual API call
//       const mockBalances = {
//         neo: { balance: "142.75", balanceUSD: "8,565.00", isLoading: false },
//         ethereum: { balance: "2.34", balanceUSD: "5,850.00", isLoading: false },
//         polygon: {
//           balance: "1,250.00",
//           balanceUSD: "1,125.00",
//           isLoading: false,
//         },
//         bsc: { balance: "15.67", balanceUSD: "9,402.00", isLoading: false },
//         arbitrum: { balance: "1.89", balanceUSD: "4,725.00", isLoading: false },
//         base: { balance: "0.95", balanceUSD: "2,375.00", isLoading: false },
//       };

//       setNetworkBalances(mockBalances);
//       setVerificationState((prev) => ({
//         ...prev,
//         isLoadingData: false,
//         lastUpdated: new Date(),
//         error: null,
//       }));
//     } catch (error) {
//       console.error("Error loading wallet data:", error);
//       setVerificationState((prev) => ({
//         ...prev,
//         isLoadingData: false,
//         error: "Failed to load wallet data",
//       }));
//     }
//   };

//   const handleSignatureSuccess = async () => {
//     setVerificationState((prev) => ({
//       ...prev,
//       isVerified: true,
//       isSigningMessage: false,
//       signatureError: null,
//     }));
//     await loadWalletData();
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
//       window.location.reload();
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
//       isLoadingData: false,
//       selectedNetwork: "neo",
//       isSigningMessage: false,
//       isCheckingVerification: false,
//     });

//     const supportedNetworks = getSupportedNetworks();
//     const resetBalances = supportedNetworks.reduce((acc, networkKey) => {
//       acc[networkKey] = { balance: "0", balanceUSD: "0", isLoading: false };
//       return acc;
//     }, {});
//     setNetworkBalances(resetBalances);
//   };

//   const updateVerificationState = (updates) => {
//     setVerificationState((prev) => ({ ...prev, ...updates }));
//   };

//   const updateNetworkBalances = (updates) => {
//     setNetworkBalances((prev) => ({ ...prev, ...updates }));
//   };

//   // MAIN LOGIC: If ambassadorAddress exists, show connected state directly
//   if (hasAmbassadorAddress) {
//     return (
//       <WalletConnectedState
//         address={ambassadorAddress}
//         networkBalances={networkBalances}
//         verificationState={verificationState}
//         onDisconnect={handleDisconnectWallet}
//         updateNetworkBalances={updateNetworkBalances}
//         updateVerificationState={updateVerificationState}
//         isUsingAmbassadorAddress={true}
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

//         <h3 className="mb-2 text-xl font-bold text-white">
//           Checking Wallet Status
//         </h3>

//         <p className="text-gray-200">
//           Please wait while we check your wallet status...
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
//         isUsingAmbassadorAddress={false}
//         verificationState={verificationState}
//         onDisconnect={handleDisconnectWallet}
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
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";
import React, { useState, useEffect } from "react";

// Import wallet sub-components
import WalletSigningFlow from "./wallet/WalletSigningFlow";
import WalletConnectedState from "./wallet/WalletConnectedState";
import WalletDisconnectedState from "./wallet/WalletDisconnectedState";

const WalletTab = ({ ambassadorAddress }) => {
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
      window.location.reload();
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
        verificationState={verificationState}
        onDisconnect={handleDisconnectWallet}
        updateVerificationState={updateVerificationState}
        isUsingAmbassadorAddress={true}
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
