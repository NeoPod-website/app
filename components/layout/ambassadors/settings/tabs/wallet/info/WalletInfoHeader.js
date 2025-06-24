"use client";

import React from "react";
import { Chip, Button } from "@heroui/react";
import { WalletIcon, ShieldCheckIcon, RefreshCwIcon } from "lucide-react";

import DisconnectWalletBtn from "@/components/ui/buttons/settings/DisconnectWalletBtn";

const WalletInfoHeader = ({
  isRefreshing,
  verificationState,
  handleRefreshBalances,
  isUsingAmbassadorAddress,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600/20">
          <WalletIcon size={24} className="text-green-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            {isUsingAmbassadorAddress ? "Current Wallet" : "Connected Wallet"}
          </h2>

          <div className="flex items-center gap-2">
            <Chip
              color="success"
              variant="flat"
              size="sm"
              startContent={<ShieldCheckIcon size={12} />}
            >
              {isUsingAmbassadorAddress ? "Ambassador Verified" : "Verified"}
            </Chip>

            {verificationState.lastUpdated && (
              <span className="text-xs text-gray-400">
                Updated {verificationState.lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="flat"
          isLoading={isRefreshing}
          onPress={handleRefreshBalances}
          startContent={<RefreshCwIcon size={16} />}
          isDisabled={verificationState.isLoadingData}
        >
          Refresh
        </Button>

        <DisconnectWalletBtn />
      </div>
    </div>
  );
};

export default WalletInfoHeader;
