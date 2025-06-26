"use client";

import {
  LinkIcon,
  WalletIcon,
  ShieldIcon,
  NetworkIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";
import { Card, Chip, CardBody } from "@heroui/react";

import { getNetworkConfig, getSupportedNetworks } from "@/config/networks";

import SettingsConnectWalletMain from "./SettingsConnectWallet";

import SupportedWalletModal from "@/components/ui/modals/SupportedWalletModal";

// Constants to prevent recreation
const FEATURE_CARDS = [
  {
    id: "neo",
    borderColor: "border-green-500/20",
    bgGradient: "from-green-900/20 to-blue-900/20",
    iconBg: "bg-green-600/20",
    useNetworkImage: true,
    networkKey: "neo",
    title: null,
    chip: { color: "success", text: "Primary Network" },
    description:
      "Our main blockchain ecosystem with advanced smart contract capabilities.",
  },
  {
    id: "multichain",
    borderColor: "border-purple-500/20",
    bgGradient: "from-purple-900/20 to-pink-900/20",
    iconBg: "bg-purple-600/20",
    icon: NetworkIcon,
    iconColor: "text-purple-400",
    title: "Multi-Chain",
    subtitle: null,
    description: "Access multiple blockchains from a single interface.",
  },
  {
    id: "secure",
    borderColor: "border-orange-500/20",
    bgGradient: "from-orange-900/20 to-red-900/20",
    iconBg: "bg-orange-600/20",
    icon: ShieldIcon,
    iconColor: "text-orange-400",
    title: "Secure",
    subtitle: "Non-custodial",
    description: "Your private keys never leave your wallet.",
  },
];

const WalletDisconnectedState = ({ verificationState }) => {
  // Memoize network configurations
  const { neoNetwork, supportedNetworks, supportedNetworksData } =
    useMemo(() => {
      const neo = getNetworkConfig("neo");
      const networks = getSupportedNetworks();
      const networksData = networks
        .map((networkKey) => {
          try {
            return { key: networkKey, config: getNetworkConfig(networkKey) };
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean);

      return {
        neoNetwork: neo,
        supportedNetworks: networks,
        supportedNetworksData: networksData,
      };
    }, []);

  // Memoize feature cards with dynamic data
  const featureCards = useMemo(() => {
    return FEATURE_CARDS.map((card) => {
      if (card.id === "neo") {
        return {
          ...card,
          title: neoNetwork.displayName,
          image: neoNetwork.image,
        };
      }
      if (card.id === "multichain") {
        return {
          ...card,
          subtitle: `${supportedNetworks.length} Networks`,
        };
      }
      return card;
    });
  }, [neoNetwork, supportedNetworks.length]);

  // Memoize supported networks grid
  const supportedNetworksGrid = useMemo(() => {
    return supportedNetworksData.map(({ key, config }) => (
      <div
        key={key}
        className="flex flex-col items-center rounded-xl border border-gray-400/50 bg-gray-700/50 p-4 transition-all hover:border-gray-600/50"
      >
        <Image
          width={40}
          height={40}
          src={config.image}
          alt={config.displayName}
          className="mb-2 h-10 w-10"
        />
        <h4 className="text-center text-sm font-medium text-white">
          {config.displayName}
        </h4>
        <p className="text-center text-xs text-gray-100">
          {config.nativeToken.symbol}
        </p>
        {key === "neo" && (
          <Chip size="sm" variant="flat" color="success" className="mt-1">
            Primary
          </Chip>
        )}
      </div>
    ));
  }, [supportedNetworksData]);

  return (
    <>
      <SupportedWalletModal />

      <div className="space-y-8">
        <Card className="border border-gray-500/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
          <CardBody className="flex flex-col items-center gap-8 p-8 lg:flex-row">
            <div className="flex-shrink-0 text-center lg:text-left">
              <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-400/10">
                <WalletIcon size={36} className="text-blue-400" />
              </div>

              <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                <Chip
                  size="sm"
                  variant="flat"
                  color="warning"
                  startContent={
                    <AlertTriangleIcon size={12} className="mr-1" />
                  }
                >
                  Not Connected
                </Chip>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h3 className="mb-3 text-2xl font-bold text-white">
                Connect Your Wallet
              </h3>

              <p className="mb-6 max-w-xl text-base text-gray-200">
                Securely connect your wallet to manage your crypto assets across
                multiple blockchains. Your keys remain in your control at all
                times.
              </p>

              <SettingsConnectWalletMain
                verificationState={verificationState}
              />
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => (
            <Card
              key={card.id}
              className={`border ${card.borderColor} bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl`}
            >
              <CardBody className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    {card.useNetworkImage ? (
                      <Image
                        width={32}
                        height={32}
                        alt={card.title}
                        src={card.image}
                      />
                    ) : (
                      <card.icon size={24} className={card.iconColor} />
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {card.title}
                    </h4>
                    {card.chip ? (
                      <Chip color={card.chip.color} variant="flat" size="sm">
                        {card.chip.text}
                      </Chip>
                    ) : (
                      <p className="text-sm text-gray-400">{card.subtitle}</p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-300">{card.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card className="border border-gray-700/50 bg-gradient-to-br from-blue-700/5 to-blue-700/10 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-blue-400" />

              <h3 className="text-lg font-semibold text-white">
                Supported Networks
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {supportedNetworksGrid}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default React.memo(WalletDisconnectedState);
