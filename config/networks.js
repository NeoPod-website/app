const NETWORK_CONFIGS = {
  neo: {
    chainId: 47763,
    isEVM: true,
    name: "neo",
    displayName: "Neo X",
    nativeToken: {
      name: "GAS",
      symbol: "GAS",
      decimals: 18,
    },
    rpcUrl: "https://mainnet-1.rpc.banelabs.org",
    fallbackRpcUrls: ["https://mainnet-2.rpc.banelabs.org"],
    explorerUrls: {
      base: "https://xexplorer.neo.org",
      address: (address) => `https://xexplorer.neo.org/address/${address}`,
      token: (address) => `https://xexplorer.neo.org/token/${address}`,
      nft: (address) => `https://xexplorer.neo.org/token/${address}`,
      tx: (hash) => `https://xexplorer.neo.org/tx/${hash}`,
    },
    image: "/neo-logo.svg",
  },

  ethereum: {
    chainId: 1,
    isEVM: true,
    name: "homestead",
    displayName: "Ethereum",
    nativeToken: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl:
      process.env.NEXT_PUBLIC_ETHEREUM_RPC ||
      "https://ethereum-rpc.publicnode.com",
    fallbackRpcUrls: [
      "https://rpc.ankr.com/eth",
      "https://ethereum.blockpi.network/v1/rpc/public",
    ],
    explorerUrls: {
      base: "https://etherscan.io",
      address: (address) => `https://etherscan.io/address/${address}`,
      token: (address) => `https://etherscan.io/token/${address}`,
      nft: (address) => `https://opensea.io/assets/ethereum/${address}`,
      tx: (hash) => `https://etherscan.io/tx/${hash}`,
    },
    image: "/token/ethereum-logo.svg",
  },

  polygon: {
    isEVM: true,
    chainId: 137,
    name: "matic",
    displayName: "Polygon",
    nativeToken: {
      name: "Polygon",
      symbol: "Polygon", // Fixed: should be MATIC not Polygon
      decimals: 18,
    },
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com",
    fallbackRpcUrls: [
      "https://rpc.ankr.com/polygon",
      "https://polygon-mainnet.public.blastapi.io",
    ],
    explorerUrls: {
      base: "https://polygonscan.com",
      address: (address) => `https://polygonscan.com/address/${address}`,
      token: (address) => `https://polygonscan.com/token/${address}`,
      nft: (address) => `https://opensea.io/assets/matic/${address}`,
      tx: (hash) => `https://polygonscan.com/tx/${hash}`,
    },
    image: "/token/polygon-logo.svg",
  },

  bsc: {
    name: "bsc",
    chainId: 56,
    isEVM: true,
    displayName: "BNB Smart Chain",
    nativeToken: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrl:
      process.env.NEXT_PUBLIC_BSC_RPC || "https://bsc-dataseed.binance.org/",
    fallbackRpcUrls: [
      "https://rpc.ankr.com/bsc",
      "https://bsc-mainnet.public.blastapi.io",
    ],
    explorerUrls: {
      base: "https://bscscan.com",
      address: (address) => `https://bscscan.com/address/${address}`,
      token: (address) => `https://bscscan.com/token/${address}`,
      nft: (address) => `https://opensea.io/assets/bsc/${address}`,
      tx: (hash) => `https://bscscan.com/tx/${hash}`,
    },
    image: "/token/bnb-logo.svg",
  },

  arbitrum: {
    isEVM: true,
    chainId: 42161,
    name: "arbitrum",
    displayName: "Arbitrum",
    nativeToken: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl:
      process.env.NEXT_PUBLIC_ARBITRUM_RPC || "https://arb1.arbitrum.io/rpc",
    fallbackRpcUrls: [
      "https://rpc.ankr.com/arbitrum",
      "https://arbitrum-mainnet.public.blastapi.io",
    ],
    explorerUrls: {
      base: "https://arbiscan.io",
      address: (address) => `https://arbiscan.io/address/${address}`,
      token: (address) => `https://arbiscan.io/token/${address}`,
      nft: (address) => `https://opensea.io/assets/arbitrum/${address}`,
      tx: (hash) => `https://arbiscan.io/tx/${hash}`,
    },
    image: "/token/arbitrum-logo.svg",
  },

  base: {
    name: "base",
    chainId: 8453,
    isEVM: true,
    displayName: "Base",
    nativeToken: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: process.env.BASE_RPC_URL || "https://mainnet.base.org",
    fallbackRpcUrls: [
      "https://rpc.ankr.com/base",
      "https://base-mainnet.public.blastapi.io",
    ],
    explorerUrls: {
      base: "https://basescan.org",
      address: (address) => `https://basescan.org/address/${address}`,
      token: (address) => `https://basescan.org/token/${address}`,
      nft: (address) => `https://opensea.io/assets/base/${address}`,
      tx: (hash) => `https://basescan.org/tx/${hash}`,
    },
    image: "/token/base-logo.svg",
  },
};

export const getNetworkConfig = (networkKey) => {
  const config = NETWORK_CONFIGS[networkKey];

  if (!config) {
    throw new Error(`Network configuration not found for: ${networkKey}`);
  }

  return config;
};

export const getSupportedNetworks = () => {
  return Object.keys(NETWORK_CONFIGS);
};

export const getEVMNetworks = () => {
  return Object.entries(NETWORK_CONFIGS)
    .filter(([_, config]) => config.isEVM)
    .reduce((acc, [key, config]) => {
      acc[key] = config;
      return acc;
    }, {});
};

// Helper function to get native token info for any network
export const getNativeTokenInfo = (networkKey) => {
  const config = getNetworkConfig(networkKey);
  return {
    ...config.nativeToken,
    image: config.image,
    network: networkKey,
    displayName: config.displayName,
  };
};

export default NETWORK_CONFIGS;
