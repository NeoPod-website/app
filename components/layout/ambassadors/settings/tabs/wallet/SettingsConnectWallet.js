"use client";

import React from "react";
import { Button } from "@heroui/react";
import { WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { usePrivy } from "@privy-io/react-auth";

import { toggleSupportedWalletModal } from "@/redux/slice/modalsSlice";

const SettingsWalletConnect = ({ isLoading }) => {
  const { ready, connectWallet } = usePrivy();

  const handleConnect = () => {
    if (ready) {
      connectWallet();
    }
  };

  return (
    <Button
      size="lg"
      color="primary"
      onPress={handleConnect}
      disabled={!ready || isLoading}
      startContent={
        <WalletIcon size={20} className="h-4 w-4 3xl:h-5 3xl:w-5" />
      }
      className="h-11 bg-gradient-primary px-6 py-2 text-sm font-medium 3xl:h-auto 3xl:px-8 3xl:py-3 3xl:text-base"
    >
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

const SettingsConnectWalletMain = ({ verificationState }) => {
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(toggleSupportedWalletModal());
  };

  return (
    <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
      <SettingsWalletConnect isLoading={verificationState.isLoadingData} />

      <Button
        size="lg"
        variant="bordered"
        onPress={handleOpen}
        className="h-11 border-gray-400 px-6 py-2 text-sm font-medium text-gray-100 3xl:h-auto 3xl:px-8 3xl:py-3 3xl:text-base"
      >
        View All Wallets
      </Button>
    </div>
  );
};

export default SettingsConnectWalletMain;
