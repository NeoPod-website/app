import { ethers } from "ethers";
import { getNetworkConfig } from "@/config/networks";

export class BlockchainProvider {
  constructor(networkKey) {
    this.networkConfig = getNetworkConfig(networkKey);
    this.provider = null;
  }

  async getProvider() {
    if (!this.provider) {
      // Check if it's a non-EVM network
      if (this.networkConfig.isEVM === false) {
        throw new Error(
          `${this.networkConfig.displayName} network is not yet supported`,
        );
      }

      this.provider = new ethers.providers.JsonRpcProvider(
        {
          url: this.networkConfig.rpcUrl,
          timeout: 30000, // 30 seconds timeout
        },
        {
          name: this.networkConfig.name,
          chainId: this.networkConfig.chainId,
        },
      );

      // Test network connection
      await this.provider.getNetwork();
    }

    return this.provider;
  }

  async createContract(contractAddress, abi) {
    const provider = await this.getProvider();
    return new ethers.Contract(contractAddress, abi, provider);
  }

  async getNativeBalance(walletAddress) {
    const provider = await this.getProvider();
    return await provider.getBalance(walletAddress);
  }

  getNetworkInfo() {
    return {
      name: this.networkConfig.displayName,
      chainId: this.networkConfig.chainId,
      nativeToken: this.networkConfig.nativeToken,
      explorerUrls: this.networkConfig.explorerUrls,
    };
  }

  getExplorerUrl(type = "base", address = null) {
    const { explorerUrls } = this.networkConfig;

    switch (type) {
      case "token":
        return address ? explorerUrls.token(address) : explorerUrls.base;
      case "nft":
        return address ? explorerUrls.nft(address) : explorerUrls.base;
      default:
        return explorerUrls.base;
    }
  }
}

export const createBlockchainProvider = (networkKey) => {
  return new BlockchainProvider(networkKey);
};
