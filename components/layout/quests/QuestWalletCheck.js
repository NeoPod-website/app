import React from "react";
import { Button, Link } from "@heroui/react";
import { Wallet, ShieldAlertIcon, Settings } from "lucide-react";
import QuestTask from "./tasks/QuestTask";

const QuestWalletCheck = ({ user, quest, children }) => {
  // Check if quest has rewards that require a wallet (token or NFT)
  const hasWalletRequiredRewards = quest?.rewards?.some(
    (reward) => reward.type === "token" || reward.type === "nft",
  );

  // Check if wallet is connected
  const isWalletConnected =
    user?.wallet_address && user.wallet_address.trim() !== "";

  // If quest has wallet-required rewards but wallet is not connected
  if (hasWalletRequiredRewards && !isWalletConnected) {
    return (
      <QuestTask
        isAdmin={false}
        color="#0369a1"
        text="Wallet Not Connected"
        heading="Wallet Not Connected"
        description="This quest has token or NFT rewards that require a connected wallet to claim."
        icon={<Wallet size={12} className="text-white" />}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-900/20 p-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <Wallet className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-grow space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <ShieldAlertIcon className="h-3 w-3" />

                <span>Required for claiming non-POD rewards</span>
              </div>

              <div className="text-xs text-amber-300">
                <span className="font-medium">Rewards requiring wallet:</span>

                <div className="mt-1 flex flex-wrap gap-1">
                  {quest.rewards
                    .filter(
                      (reward) =>
                        reward.type === "token" || reward.type === "nft",
                    )
                    .map((reward, index) => (
                      <span
                        key={index}
                        className="rounded bg-amber-900/30 px-2 py-0.5 font-mono"
                      >
                        {reward.amount}{" "}
                        {reward.type === "token"
                          ? reward.tokenSymbol || "Token"
                          : "NFT"}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
            <Wallet className="h-4 w-4 text-gray-100" />

            <p className="text-sm text-gray-100">
              Connect your wallet to complete this quest and claim token/NFT
              rewards.
            </p>
          </div>

          <div className="flex w-full justify-end">
            <Button
              as={Link}
              href="/settings?tab=wallet"
              className="border border-white bg-gradient-primary hover:opacity-90"
              endContent={<Settings className="h-4 w-4" />}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </QuestTask>
    );
  }

  return children;
};

export default QuestWalletCheck;
