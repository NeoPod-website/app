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
