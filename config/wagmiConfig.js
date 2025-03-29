import { metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";
import { http, createConfig } from "wagmi";
import {
  arbitrum,
  mainnet,
  moonbeam,
  optimism,
  polygon,
  sepolia,
  zksync,
} from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, optimism, zksync, arbitrum, polygon, moonbeam],

  ssr: true,

  connectors: [
    metaMask(),
    coinbaseWallet(),
    walletConnect({
      projectId: "678a4a86ff4f89d192c79eea1d8faf18",
    }),
  ],

  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [zksync.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [moonbeam.id]: http(),
  },
});
