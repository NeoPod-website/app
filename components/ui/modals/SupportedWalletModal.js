"use client";

import React from "react";
import { InfoIcon } from "lucide-react";
import { Button, Chip } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import MainModal from "./MainModal";

import { toggleSupportedWalletModal } from "@/redux/slice/modalsSlice";

const WalletProviders = [
  {
    name: "MetaMask",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    popular: true,
    status: "available",
  },
  {
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect any mobile wallet",
    popular: true,
    status: "available",
  },
  {
    name: "Coinbase Wallet",
    icon: "💙",
    description: "Coinbase's self-custody wallet",
    popular: false,
    status: "available",
  },
  {
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Multi-chain mobile wallet",
    popular: false,
    status: "available",
  },
  {
    name: "Phantom",
    icon: "👻",
    description: "Best for Solana ecosystem",
    popular: false,
    status: "available",
  },
  // {
  //   name: "Ledger",
  //   icon: "🔐",
  //   description: "Hardware wallet security",
  //   popular: false,
  //   status: "coming_soon",
  // },
];

const SupportedWalletModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state) => state.modals.isSupportedWalletModalOpen,
  );

  const handleOnClose = () => {
    dispatch(toggleSupportedWalletModal());
  };

  return (
    <MainModal
      isOpen={isOpen}
      title="Choose Your Wallet"
      handleOnClose={handleOnClose}
      description="Select your preferred wallet provider to get started."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {WalletProviders.map((wallet) => (
          <Button
            key={wallet.name}
            variant="bordered"
            disabled={wallet.status !== "available"}
            onPress={() => wallet.status === "available" && handleOnClose()}
            className={`flex h-20 items-center justify-start gap-4 border-gray-700 p-4 ${
              wallet.status === "available"
                ? "hover:bg-blue-500/10 hover:border-pink-pink/50"
                : "cursor-not-allowed opacity-60"
            }`}
          >
            <span className="text-3xl">{wallet.icon}</span>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{wallet.name}</span>

                {wallet.popular && wallet.status === "available" && (
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="bg-gradient-primary text-white"
                  >
                    Popular
                  </Chip>
                )}

                {wallet.status === "coming_soon" && (
                  <Chip size="sm" color="warning" variant="flat">
                    Soon
                  </Chip>
                )}
              </div>

              <span className="text-sm text-gray-200">
                {wallet.description}
              </span>
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-400/20 bg-gray-700/40 p-4">
        <InfoIcon size={20} className="mt-0.5 text-pink-pink" />

        <div>
          <p className="text-sm font-medium text-gray-200">Secure Connection</p>

          <p className="text-sm text-gray-300">
            We never store your private keys. Your wallet remains in your full
            control.
          </p>
        </div>
      </div>
    </MainModal>
  );
};

export default SupportedWalletModal;
