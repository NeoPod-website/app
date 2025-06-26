"use client";

import React, { useMemo } from "react";
import { CheckCircleIcon } from "lucide-react";
import { Button, Card, CardBody, Chip, Badge } from "@heroui/react";

import { getNetworkConfig } from "@/config/networks";

const WalletConnectionBanner = ({
  address,
  onDisconnect,
  verificationState,
}) => {
  // Memoize formatted address
  const formattedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  // Memoize current network
  const currentNetwork = useMemo(() => {
    try {
      return getNetworkConfig(verificationState.selectedNetwork);
    } catch {
      return getNetworkConfig("neo");
    }
  }, [verificationState.selectedNetwork]);

  // Memoize address and network display
  const addressDisplay = useMemo(() => {
    return `${formattedAddress} • ${currentNetwork.displayName}`;
  }, [formattedAddress, currentNetwork.displayName]);

  return (
    <Card className="border border-green-500/20 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/20">
              <CheckCircleIcon size={20} className="text-green-400" />
            </div>

            <div>
              <h4 className="font-medium text-white">
                Wallet Connected & Verified
              </h4>

              <p className="text-sm text-gray-400">{addressDisplay}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Chip color="success" variant="flat" size="sm">
              <Badge
                content=""
                color="success"
                shape="circle"
                placement="top-right"
              >
                <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
              </Badge>
              Verified
            </Chip>

            <Button
              size="sm"
              color="danger"
              variant="flat"
              onPress={onDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default React.memo(WalletConnectionBanner);
