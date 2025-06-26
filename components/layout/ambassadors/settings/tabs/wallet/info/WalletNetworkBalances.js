"use client";

import {
  Tab,
  Card,
  Tabs,
  Chip,
  Button,
  Spinner,
  CardBody,
} from "@heroui/react";
import {
  RefreshCwIcon,
  DollarSignIcon,
  TrendingUpIcon,
  AlertCircleIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useMemo, useCallback } from "react";

import { getNetworkConfig, getSupportedNetworks } from "@/config/networks";

// Constants to prevent recreation
const COINGECKO_IDS = {
  gas: "gas",
  eth: "ethereum",
  bnb: "binancecoin",
  pol: "polygon-ecosystem-token",
  matic: "polygon-ecosystem-token",
};

const BALANCE_DEFAULTS = {
  balance: "0",
  balanceUSD: "0",
  isLoading: false,
  error: null,
};

const WEI_TO_ETHER = Math.pow(10, 18);

const WalletNetworkBalances = ({ address }) => {
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkBalances, setNetworkBalances] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState("neo");

  // Memoize supported networks to prevent repeated calls
  const supportedNetworks = useMemo(() => getSupportedNetworks(), []);

  // Memoize network configs to prevent repeated getNetworkConfig calls
  const networkConfigs = useMemo(() => {
    return supportedNetworks.reduce((acc, networkKey) => {
      try {
        acc[networkKey] = getNetworkConfig(networkKey);
      } catch (error) {
        console.error(`Failed to get config for ${networkKey}:`, error);
      }
      return acc;
    }, {});
  }, [supportedNetworks]);

  // Memoize current network to prevent repeated lookups
  const currentNetwork = useMemo(() => {
    return networkConfigs[selectedNetwork] || networkConfigs.neo;
  }, [networkConfigs, selectedNetwork]);

  // Memoize current network balance
  const currentNetworkBalance = useMemo(() => {
    return networkBalances[selectedNetwork] || BALANCE_DEFAULTS;
  }, [networkBalances, selectedNetwork]);

  // Memoize total balance calculation
  const totalBalance = useMemo(() => {
    return Object.values(networkBalances).reduce((total, network) => {
      const usdValue = parseFloat(network.balanceUSD) || 0;
      return total + usdValue;
    }, 0);
  }, [networkBalances]);

  // Memoize formatted total balance
  const formattedTotalBalance = useMemo(() => {
    return totalBalance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [totalBalance]);

  // Memoize formatted last updated time
  const formattedLastUpdated = useMemo(() => {
    return lastUpdated?.toLocaleTimeString();
  }, [lastUpdated]);

  // Initialize balances state
  useEffect(() => {
    const initialBalances = supportedNetworks.reduce((acc, networkKey) => {
      acc[networkKey] = { ...BALANCE_DEFAULTS };
      return acc;
    }, {});

    setNetworkBalances(initialBalances);
  }, [supportedNetworks]);

  // Load balances when address changes
  useEffect(() => {
    if (address) {
      loadAllBalances();
    }
  }, [address]);

  const fetchNativeBalance = useCallback(
    async (networkKey, walletAddress) => {
      try {
        const config = networkConfigs[networkKey];
        if (!config)
          throw new Error(`Network config not found for ${networkKey}`);

        const response = await fetch(config.rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [walletAddress, "latest"],
            id: 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        // Convert from wei to ether (hex to decimal)
        const balanceInWei = BigInt(data.result);
        const balanceInEther = Number(balanceInWei) / WEI_TO_ETHER;

        return balanceInEther.toFixed(6);
      } catch (error) {
        console.error(`Error fetching balance for ${networkKey}:`, error);
        throw error;
      }
    },
    [networkConfigs],
  );

  const fetchTokenPrice = useCallback(
    async (networkKey) => {
      try {
        const config = networkConfigs[networkKey];
        if (!config) return 0;

        const symbol = config.nativeToken.symbol.toLowerCase();
        const coinId = COINGECKO_IDS[symbol] || symbol;

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Price API error: ${response.status}`);
        }

        const data = await response.json();
        return data[coinId]?.usd || 0;
      } catch (error) {
        console.error(`Error fetching price for ${networkKey}:`, error);
        return 0;
      }
    },
    [networkConfigs],
  );

  const loadBalanceForNetwork = useCallback(
    async (networkKey) => {
      if (!address) return;

      setNetworkBalances((prev) => ({
        ...prev,
        [networkKey]: { ...prev[networkKey], isLoading: true, error: null },
      }));

      try {
        const [balance, price] = await Promise.all([
          fetchNativeBalance(networkKey, address),
          fetchTokenPrice(networkKey),
        ]);

        const balanceNum = parseFloat(balance);
        const usdValue = (balanceNum * price).toFixed(2);

        setNetworkBalances((prev) => ({
          ...prev,
          [networkKey]: {
            balance: balance,
            balanceUSD: usdValue,
            isLoading: false,
            error: null,
          },
        }));
      } catch (error) {
        setNetworkBalances((prev) => ({
          ...prev,
          [networkKey]: {
            balance: "0",
            balanceUSD: "0",
            isLoading: false,
            error: error.message,
          },
        }));
      }
    },
    [address, fetchNativeBalance, fetchTokenPrice],
  );

  const loadAllBalances = useCallback(async () => {
    if (!address) return;

    setError(null);
    setIsRefreshing(true);

    try {
      await Promise.all(
        supportedNetworks.map((networkKey) =>
          loadBalanceForNetwork(networkKey),
        ),
      );

      setLastUpdated(new Date());
    } catch (error) {
      setError("Failed to load some network balances");
    } finally {
      setIsRefreshing(false);
    }
  }, [address, supportedNetworks, loadBalanceForNetwork]);

  const handleRefresh = useCallback(() => {
    loadAllBalances();
  }, [loadAllBalances]);

  const handleRetryNetwork = useCallback(() => {
    loadBalanceForNetwork(selectedNetwork);
  }, [loadBalanceForNetwork, selectedNetwork]);

  // Memoize tab titles to prevent recreation
  const tabTitles = useMemo(() => {
    return supportedNetworks.reduce((acc, networkKey) => {
      const network = networkConfigs[networkKey];
      const balance = networkBalances[networkKey];

      if (!network) return acc;

      acc[networkKey] = (
        <div className="flex items-center gap-2">
          <Image
            width={20}
            height={20}
            src={network.image}
            alt={network.displayName}
            className="rounded-full"
          />
          <span>{network.displayName}</span>
          {balance?.isLoading && <Spinner size="sm" color="purple" />}
          {balance?.error && (
            <div
              className="h-2 w-2 rounded-full bg-red-400"
              title={balance.error}
            />
          )}
        </div>
      );

      return acc;
    }, {});
  }, [supportedNetworks, networkConfigs, networkBalances]);

  // Memoize balance display content
  const balanceDisplay = useMemo(() => {
    if (currentNetworkBalance.isLoading) {
      return (
        <div className="py-8 text-center">
          <Spinner size="lg" color="purple" />
          <p className="mt-2 text-gray-400">Loading balance...</p>
        </div>
      );
    }

    if (currentNetworkBalance.error) {
      return (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/20">
            <AlertCircleIcon size={24} className="text-red-400" />
          </div>
          <p className="mb-2 font-medium text-red-400">
            Failed to Load Balance
          </p>
          <p className="text-sm text-gray-400">{currentNetworkBalance.error}</p>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            className="mt-3"
            onPress={handleRetryNetwork}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className="mb-1 text-sm text-gray-400">Token Balance</p>
          <p className="text-2xl font-bold text-white">
            {currentNetworkBalance.balance} {currentNetwork.nativeToken.symbol}
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm text-gray-400">USD Value</p>
          <p className="text-2xl font-bold text-green-400">
            ${currentNetworkBalance.balanceUSD}
          </p>
        </div>
      </div>
    );
  }, [currentNetworkBalance, currentNetwork, handleRetryNetwork]);

  // Memoize network cards
  const networkCards = useMemo(() => {
    return supportedNetworks
      .map((networkKey) => {
        const network = networkConfigs[networkKey];
        const balance = networkBalances[networkKey] || BALANCE_DEFAULTS;

        if (!network) return null;

        return (
          <Card
            key={networkKey}
            onPress={() => setSelectedNetwork(networkKey)}
            className={`cursor-pointer border transition-all hover:border-purple-500/50 ${
              selectedNetwork === networkKey
                ? "border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-blue-900/30"
                : "border-gray-600/50 bg-gray-800/50"
            }`}
          >
            <CardBody className="p-4">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  width={24}
                  height={24}
                  src={network.image}
                  alt={network.displayName}
                  className="rounded-full"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">
                      {network.displayName}
                    </h4>
                    {balance.isLoading && <Spinner size="sm" color="purple" />}
                    {balance.error && (
                      <div
                        className="h-2 w-2 rounded-full bg-red-400"
                        title={balance.error}
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {network.nativeToken.symbol}
                  </p>
                </div>

                {networkKey === "neo" && (
                  <Chip size="sm" variant="flat" color="success">
                    Primary
                  </Chip>
                )}
              </div>

              {balance.error ? (
                <div className="py-2 text-center">
                  <p className="text-xs text-red-400">Failed to load</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-white">
                    {balance.balance} {network.nativeToken.symbol}
                  </p>
                  <p className="text-xs text-green-400">
                    ${balance.balanceUSD}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })
      .filter(Boolean);
  }, [supportedNetworks, networkConfigs, networkBalances, selectedNetwork]);

  // Early return for no address
  if (!address) {
    return (
      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-600/20">
            <DollarSignIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            No Wallet Connected
          </h3>
          <p className="text-gray-400">
            Connect your wallet to view network balances
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border border-green-500/20 bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUpIcon size={20} className="text-green-400" />
              <h3 className="text-lg font-semibold text-white">
                Total Portfolio Value
              </h3>
            </div>

            <Button
              size="sm"
              variant="flat"
              isDisabled={!address}
              onPress={handleRefresh}
              isLoading={isRefreshing}
              startContent={<RefreshCwIcon size={16} />}
            >
              Refresh
            </Button>
          </div>

          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-white">
              ${formattedTotalBalance}
            </div>

            <p className="text-gray-400">
              Across {supportedNetworks.length} networks
              {formattedLastUpdated && (
                <span className="ml-2 text-xs">
                  • Updated {formattedLastUpdated}
                </span>
              )}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Network Balances
            </h3>
            <DollarSignIcon size={20} className="text-purple-400" />
          </div>

          <Tabs
            variant="underlined"
            selectedKey={selectedNetwork}
            onSelectionChange={setSelectedNetwork}
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-gray-700",
              cursor: "w-full bg-purple-500",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-purple-400",
            }}
          >
            {supportedNetworks.map((networkKey) => {
              if (!networkConfigs[networkKey]) return null;

              return <Tab key={networkKey} title={tabTitles[networkKey]} />;
            })}
          </Tabs>

          <div className="mt-6">
            <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
              <CardBody className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-600/20">
                    <Image
                      width={32}
                      height={32}
                      src={currentNetwork.image}
                      alt={currentNetwork.displayName}
                      className="rounded-full"
                    />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {currentNetwork.displayName}
                    </h4>
                    <p className="text-gray-400">
                      {currentNetwork.nativeToken.symbol}
                    </p>
                    {selectedNetwork === "neo" && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        className="mt-1"
                      >
                        Primary
                      </Chip>
                    )}
                  </div>
                </div>

                {balanceDisplay}
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">
            All Networks
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {networkCards}
          </div>
        </CardBody>
      </Card>

      {error && (
        <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircleIcon size={20} className="mt-0.5 text-red-400" />
              <div>
                <h4 className="mb-2 font-medium text-red-400">
                  Error Loading Data
                </h4>
                <p className="text-sm text-gray-300">{error}</p>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  className="mt-3"
                  onClick={handleRefresh}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default React.memo(WalletNetworkBalances);
