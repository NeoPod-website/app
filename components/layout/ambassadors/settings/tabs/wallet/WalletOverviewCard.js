// "use client";

// import React from "react";
// import {
//   Button,
//   Card,
//   CardBody,
//   Chip,
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   Spinner,
//   Tooltip,
// } from "@heroui/react";
// import {
//   WalletIcon,
//   CopyIcon,
//   ExternalLinkIcon,
//   RefreshCwIcon,
//   CheckCircleIcon,
//   MoreVerticalIcon,
//   LogOutIcon,
// } from "lucide-react";
// import { getNetworkConfig, getNativeTokenInfo } from "@/config/networks";

// const WalletOverviewCard = ({
//   address,
//   walletState,
//   networkBalances,
//   onCopyAddress,
//   onOpenExplorer,
//   onRefreshBalances,
//   onSwitchNetwork,
//   onDisconnect,
// }) => {
//   const formatAddress = (addr) => {
//     if (!addr) return "";
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   const getCurrentNetwork = () => {
//     try {
//       return getNetworkConfig(walletState.selectedNetwork);
//     } catch {
//       return getNetworkConfig("neo");
//     }
//   };

//   const getCurrentNativeToken = () => {
//     try {
//       return getNativeTokenInfo(walletState.selectedNetwork);
//     } catch {
//       return getNativeTokenInfo("neo");
//     }
//   };

//   const currentNetwork = getCurrentNetwork();
//   const currentNativeToken = getCurrentNativeToken();
//   const currentBalance = networkBalances[walletState.selectedNetwork] || {
//     balance: "0",
//     balanceUSD: "0",
//   };

//   return (
//     <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl lg:col-span-2">
//       <CardBody className="p-6">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-blue-600/20 flex h-12 w-12 items-center justify-center rounded-xl">
//               <WalletIcon size={24} className="text-blue-400" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-white">
//                 Portfolio Overview
//               </h3>
//               <p className="text-sm text-gray-400">Multi-chain assets</p>
//             </div>
//           </div>
//           <Dropdown>
//             <DropdownTrigger>
//               <Button isIconOnly size="sm" variant="flat">
//                 <MoreVerticalIcon size={16} />
//               </Button>
//             </DropdownTrigger>
//             <DropdownMenu>
//               <DropdownItem
//                 key="refresh"
//                 startContent={<RefreshCwIcon size={16} />}
//                 onClick={onRefreshBalances}
//               >
//                 Refresh Balances
//               </DropdownItem>
//               <DropdownItem
//                 key="explorer"
//                 startContent={<ExternalLinkIcon size={16} />}
//                 onClick={() => onOpenExplorer()}
//               >
//                 View on Explorer
//               </DropdownItem>
//               <DropdownItem
//                 key="copy"
//                 startContent={<CopyIcon size={16} />}
//                 onClick={onCopyAddress}
//               >
//                 Copy Address
//               </DropdownItem>
//               <DropdownItem
//                 key="disconnect"
//                 className="text-danger"
//                 color="danger"
//                 startContent={<LogOutIcon size={16} />}
//                 onClick={onDisconnect}
//               >
//                 Disconnect Wallet
//               </DropdownItem>
//             </DropdownMenu>
//           </Dropdown>
//         </div>

//         {/* Address Display */}
//         <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-800/30 p-3">
//           <code className="flex-1 font-mono text-sm text-gray-300">
//             {address}
//           </code>
//           <Tooltip content="Copy Address">
//             <Button isIconOnly size="sm" variant="flat" onClick={onCopyAddress}>
//               <CopyIcon size={16} />
//             </Button>
//           </Tooltip>
//           <Tooltip content="View on Explorer">
//             <Button
//               isIconOnly
//               size="sm"
//               variant="flat"
//               onClick={() => onOpenExplorer()}
//             >
//               <ExternalLinkIcon size={16} />
//             </Button>
//           </Tooltip>
//         </div>

//         {/* Current Network */}
//         <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-800/30 p-4">
//           <div className="flex items-center gap-3">
//             <img
//               src={currentNetwork.image}
//               alt={currentNetwork.displayName}
//               className="h-8 w-8"
//             />
//             <div>
//               <p className="font-medium text-white">
//                 {currentNetwork.displayName}
//               </p>
//               <p className="text-sm text-gray-400">Active Network</p>
//             </div>
//             {walletState.selectedNetwork === "neo" && (
//               <Chip size="sm" color="success" variant="flat">
//                 Primary
//               </Chip>
//             )}
//           </div>
//           <Button size="sm" variant="flat" onClick={() => onSwitchNetwork()}>
//             Switch Network
//           </Button>
//         </div>

//         {/* Balance Display */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="rounded-xl bg-gray-800/30 p-4">
//             <p className="mb-1 text-sm text-gray-400">Balance</p>
//             {walletState.isLoading ? (
//               <div className="flex items-center gap-2">
//                 <Spinner size="sm" />
//                 <span className="text-gray-400">Loading...</span>
//               </div>
//             ) : (
//               <>
//                 <p className="text-2xl font-bold text-white">
//                   {currentBalance.balance} {currentNativeToken.symbol}
//                 </p>
//                 <p className="text-sm text-green-400">
//                   ${currentBalance.balanceUSD}
//                 </p>
//               </>
//             )}
//           </div>
//           <div className="rounded-xl bg-gray-800/30 p-4">
//             <p className="mb-1 text-sm text-gray-400">Last Updated</p>
//             <p className="font-medium text-white">
//               {walletState.lastUpdated?.toLocaleTimeString() || "Never"}
//             </p>
//             <div className="mt-1 flex items-center gap-1">
//               {walletState.isLoading ? (
//                 <Spinner size="sm" />
//               ) : (
//                 <CheckCircleIcon size={14} className="text-green-400" />
//               )}
//               <span className="text-xs text-gray-400">
//                 {walletState.isLoading ? "Updating..." : "Up to date"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default WalletOverviewCard;

// "use client";

// import React from "react";
// import {
//   Button,
//   Card,
//   CardBody,
//   Chip,
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
//   Spinner,
//   Tooltip,
// } from "@heroui/react";
// import {
//   WalletIcon,
//   CopyIcon,
//   ExternalLinkIcon,
//   RefreshCwIcon,
//   CheckCircleIcon,
//   MoreVerticalIcon,
//   LogOutIcon,
// } from "lucide-react";
// import { getNetworkConfig, getNativeTokenInfo } from "@/config/networks";

// const WalletOverviewCard = ({
//   address,
//   verificationState,
//   networkBalances,
//   onCopyAddress,
//   onOpenExplorer,
//   onRefreshBalances,
//   onSwitchNetwork,
//   onDisconnect,
// }) => {
//   const formatAddress = (addr) => {
//     if (!addr) return "";
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   const getCurrentNetwork = () => {
//     try {
//       return getNetworkConfig(verificationState.selectedNetwork);
//     } catch {
//       return getNetworkConfig("neo");
//     }
//   };

//   const getCurrentNativeToken = () => {
//     try {
//       return getNativeTokenInfo(verificationState.selectedNetwork);
//     } catch {
//       return getNativeTokenInfo("neo");
//     }
//   };

//   const currentNetwork = getCurrentNetwork();
//   const currentNativeToken = getCurrentNativeToken();
//   const currentBalance = networkBalances[verificationState.selectedNetwork] || {
//     balance: "0",
//     balanceUSD: "0",
//   };

//   return (
//     <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl lg:col-span-2">
//       <CardBody className="p-6">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-blue-600/20 flex h-12 w-12 items-center justify-center rounded-xl">
//               <WalletIcon size={24} className="text-blue-400" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-white">
//                 Portfolio Overview
//               </h3>
//               <p className="text-sm text-gray-400">Multi-chain assets</p>
//             </div>
//           </div>
//           <Dropdown>
//             <DropdownTrigger>
//               <Button isIconOnly size="sm" variant="flat">
//                 <MoreVerticalIcon size={16} />
//               </Button>
//             </DropdownTrigger>
//             <DropdownMenu>
//               <DropdownItem
//                 key="refresh"
//                 startContent={<RefreshCwIcon size={16} />}
//                 onPress={onRefreshBalances}
//               >
//                 Refresh Balances
//               </DropdownItem>
//               <DropdownItem
//                 key="explorer"
//                 startContent={<ExternalLinkIcon size={16} />}
//                 onPress={() => onOpenExplorer()}
//               >
//                 View on Explorer
//               </DropdownItem>
//               <DropdownItem
//                 key="copy"
//                 startContent={<CopyIcon size={16} />}
//                 onPress={onCopyAddress}
//               >
//                 Copy Address
//               </DropdownItem>
//               <DropdownItem
//                 key="disconnect"
//                 className="text-danger"
//                 color="danger"
//                 startContent={<LogOutIcon size={16} />}
//                 onPress={onDisconnect}
//               >
//                 Disconnect Wallet
//               </DropdownItem>
//             </DropdownMenu>
//           </Dropdown>
//         </div>

//         {/* Address Display */}
//         <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-800/30 p-3">
//           <code className="flex-1 font-mono text-sm text-gray-300">
//             {address}
//           </code>
//           <Tooltip content="Copy Address">
//             <Button isIconOnly size="sm" variant="flat" onPress={onCopyAddress}>
//               <CopyIcon size={16} />
//             </Button>
//           </Tooltip>
//           <Tooltip content="View on Explorer">
//             <Button
//               isIconOnly
//               size="sm"
//               variant="flat"
//               onPress={() => onOpenExplorer()}
//             >
//               <ExternalLinkIcon size={16} />
//             </Button>
//           </Tooltip>
//         </div>

//         {/* Current Network */}
//         <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-800/30 p-4">
//           <div className="flex items-center gap-3">
//             <img
//               src={currentNetwork.image}
//               alt={currentNetwork.displayName}
//               className="h-8 w-8"
//             />
//             <div>
//               <p className="font-medium text-white">
//                 {currentNetwork.displayName}
//               </p>
//               <p className="text-sm text-gray-400">Active Network</p>
//             </div>
//             {verificationState.selectedNetwork === "neo" && (
//               <Chip size="sm" color="success" variant="flat">
//                 Primary
//               </Chip>
//             )}
//           </div>
//           <Button size="sm" variant="flat" onClick={() => onSwitchNetwork()}>
//             Switch Network
//           </Button>
//         </div>

//         {/* Balance Display */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="rounded-xl bg-gray-800/30 p-4">
//             <p className="mb-1 text-sm text-gray-400">Balance</p>
//             {verificationState.isLoadingData ? (
//               <div className="flex items-center gap-2">
//                 <Spinner size="sm" />
//                 <span className="text-gray-400">Loading...</span>
//               </div>
//             ) : (
//               <>
//                 <p className="text-2xl font-bold text-white">
//                   {currentBalance.balance} {currentNativeToken.symbol}
//                 </p>
//                 <p className="text-sm text-green-400">
//                   ${currentBalance.balanceUSD}
//                 </p>
//               </>
//             )}
//           </div>
//           <div className="rounded-xl bg-gray-800/30 p-4">
//             <p className="mb-1 text-sm text-gray-400">Last Updated</p>
//             <p className="font-medium text-white">
//               {verificationState.lastUpdated?.toLocaleTimeString() || "Never"}
//             </p>
//             <div className="mt-1 flex items-center gap-1">
//               {verificationState.isLoadingData ? (
//                 <Spinner size="sm" />
//               ) : (
//                 <CheckCircleIcon size={14} className="text-green-400" />
//               )}
//               <span className="text-xs text-gray-400">
//                 {verificationState.isLoadingData ? "Updating..." : "Up to date"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default WalletOverviewCard;

"use client";

import {
  Chip,
  Card,
  Button,
  Tooltip,
  Spinner,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import {
  CopyIcon,
  WalletIcon,
  LogOutIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  MoreVerticalIcon,
  ExternalLinkIcon,
} from "lucide-react";
import React, { useMemo, useCallback } from "react";

import { getNetworkConfig, getNativeTokenInfo } from "@/config/networks";

// Constants to prevent recreation
const DROPDOWN_ITEMS = [
  {
    key: "refresh",
    label: "Refresh Balances",
    icon: RefreshCwIcon,
    action: "onRefreshBalances",
  },
  {
    key: "explorer",
    label: "View on Explorer",
    icon: ExternalLinkIcon,
    action: "onOpenExplorer",
  },
  {
    key: "copy",
    label: "Copy Address",
    icon: CopyIcon,
    action: "onCopyAddress",
  },
  {
    key: "disconnect",
    label: "Disconnect Wallet",
    icon: LogOutIcon,
    action: "onDisconnect",
    className: "text-danger",
    color: "danger",
  },
];

const DEFAULT_BALANCE = {
  balance: "0",
  balanceUSD: "0",
};

const WalletOverviewCard = ({
  address,
  onDisconnect,
  onCopyAddress,
  onOpenExplorer,
  onSwitchNetwork,
  networkBalances,
  verificationState,
  onRefreshBalances,
}) => {
  // Memoize formatted address to prevent recalculation
  const formattedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  // Memoize network configurations
  const { currentNetwork, currentNativeToken } = useMemo(() => {
    try {
      const network = getNetworkConfig(verificationState.selectedNetwork);
      const token = getNativeTokenInfo(verificationState.selectedNetwork);

      return { currentNetwork: network, currentNativeToken: token };
    } catch {
      return {
        currentNetwork: getNetworkConfig("neo"),
        currentNativeToken: getNativeTokenInfo("neo"),
      };
    }
  }, [verificationState.selectedNetwork]);

  // Memoize current balance
  const currentBalance = useMemo(() => {
    return (
      networkBalances[verificationState.selectedNetwork] || DEFAULT_BALANCE
    );
  }, [networkBalances, verificationState.selectedNetwork]);

  // Memoize network status
  const isNeoNetwork = useMemo(() => {
    return verificationState.selectedNetwork === "neo";
  }, [verificationState.selectedNetwork]);

  // Memoize formatted time
  const formattedLastUpdated = useMemo(() => {
    return verificationState.lastUpdated?.toLocaleTimeString() || "Never";
  }, [verificationState.lastUpdated]);

  // Memoize loading states
  const loadingStates = useMemo(
    () => ({
      isLoadingData: verificationState.isLoadingData,
      statusText: verificationState.isLoadingData
        ? "Updating..."
        : "Up to date",
      StatusIcon: verificationState.isLoadingData ? Spinner : CheckCircleIcon,
    }),
    [verificationState.isLoadingData],
  );

  // Memoized handlers that don't depend on external state
  const handleExplorerClick = useCallback(() => {
    onOpenExplorer();
  }, [onOpenExplorer]);

  const handleSwitchNetwork = useCallback(() => {
    onSwitchNetwork();
  }, [onSwitchNetwork]);

  // Memoize dropdown action handlers
  const dropdownHandlers = useMemo(
    () => ({
      onRefreshBalances,
      onOpenExplorer: handleExplorerClick,
      onCopyAddress,
      onDisconnect,
    }),
    [onRefreshBalances, handleExplorerClick, onCopyAddress, onDisconnect],
  );

  // Memoize dropdown items with handlers
  const dropdownItems = useMemo(() => {
    return DROPDOWN_ITEMS.map((item) => {
      const Icon = item.icon;
      return (
        <DropdownItem
          key={item.key}
          className={item.className}
          color={item.color}
          startContent={<Icon size={16} />}
          onPress={dropdownHandlers[item.action]}
        >
          {item.label}
        </DropdownItem>
      );
    });
  }, [dropdownHandlers]);

  // Memoize balance display content
  const balanceDisplay = useMemo(() => {
    if (loadingStates.isLoadingData) {
      return (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-gray-400">Loading...</span>
        </div>
      );
    }

    return (
      <>
        <p className="text-2xl font-bold text-white">
          {currentBalance.balance} {currentNativeToken.symbol}
        </p>

        <p className="text-sm text-green-400">${currentBalance.balanceUSD}</p>
      </>
    );
  }, [loadingStates.isLoadingData, currentBalance, currentNativeToken.symbol]);

  // Memoize status indicator
  const statusIndicator = useMemo(() => {
    const { isLoadingData, statusText } = loadingStates;

    return (
      <div className="mt-1 flex items-center gap-1">
        {isLoadingData ? (
          <Spinner size="sm" />
        ) : (
          <CheckCircleIcon size={14} className="text-green-400" />
        )}
        <span className="text-xs text-gray-400">{statusText}</span>
      </div>
    );
  }, [loadingStates]);

  return (
    <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl lg:col-span-2">
      <CardBody className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 flex h-12 w-12 items-center justify-center rounded-xl">
              <WalletIcon size={24} className="text-blue-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Portfolio Overview
              </h3>

              <p className="text-sm text-gray-400">Multi-chain assets</p>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="flat">
                <MoreVerticalIcon size={16} />
              </Button>
            </DropdownTrigger>

            <DropdownMenu>{dropdownItems}</DropdownMenu>
          </Dropdown>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-800/30 p-3">
          <code className="flex-1 font-mono text-sm text-gray-300">
            {address}
          </code>

          <Tooltip content="Copy Address">
            <Button isIconOnly size="sm" variant="flat" onPress={onCopyAddress}>
              <CopyIcon size={16} />
            </Button>
          </Tooltip>

          <Tooltip content="View on Explorer">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={handleExplorerClick}
            >
              <ExternalLinkIcon size={16} />
            </Button>
          </Tooltip>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-800/30 p-4">
          <div className="flex items-center gap-3">
            <img
              src={currentNetwork.image}
              alt={currentNetwork.displayName}
              className="h-8 w-8"
            />

            <div>
              <p className="font-medium text-white">
                {currentNetwork.displayName}
              </p>

              <p className="text-sm text-gray-400">Active Network</p>
            </div>

            {isNeoNetwork && (
              <Chip size="sm" color="success" variant="flat">
                Primary
              </Chip>
            )}
          </div>

          <Button size="sm" variant="flat" onClick={handleSwitchNetwork}>
            Switch Network
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-800/30 p-4">
            <p className="mb-1 text-sm text-gray-400">Balance</p>
            {balanceDisplay}
          </div>

          <div className="rounded-xl bg-gray-800/30 p-4">
            <p className="mb-1 text-sm text-gray-400">Last Updated</p>

            <p className="font-medium text-white">{formattedLastUpdated}</p>
            {statusIndicator}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default React.memo(WalletOverviewCard);
