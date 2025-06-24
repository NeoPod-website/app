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
      startContent={<WalletIcon size={20} />}
      className="bg-gradient-primary px-8 py-3 text-base font-medium"
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
        className="border-gray-400 text-gray-200"
      >
        View All Wallets
      </Button>
    </div>
  );
};

export default SettingsConnectWalletMain;
