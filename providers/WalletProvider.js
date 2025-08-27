"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { config } from "@/config/wagmiConfig";
import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <PrivyProvider
      appId={privyAppId}
      clientId={privyClientId}
      config={{
        appearance: {
          accentColor: "#666",
          theme: "#000000",
          logo: "https://auth.privy.io/logos/privy-logo-dark.png",

          walletChainType: "ethereum",
          walletList: [
            "detected_wallets",
            "coinbase_wallet",
            "phantom",
            "wallet_connect",
          ],

          showWalletLoginFirst: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
