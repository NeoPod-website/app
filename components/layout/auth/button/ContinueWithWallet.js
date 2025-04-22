"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "@heroui/react";
import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

const ContinueWithWallet = ({ setShowWalletForm }) => {
  const { status } = useAccount();
  const { ready, connectWallet } = usePrivy();

  useEffect(() => {
    // Only run the check if the Privy client is ready and the user is authenticated
    if (ready && status === "connected") {
      setShowWalletForm(true);
    }
  }, [ready, status, setShowWalletForm]);

  return (
    <Button
      size="lg"
      fullWidth
      variant="bordered"
      className="gap-2.5 border-gray-300 bg-dark"
      classNames={{
        content: "text-base",
      }}
      startContent={
        <Image
          width={32}
          height={32}
          src="/auth/wallet-connect.svg"
          alt="Wallet Connect"
        />
      }
      onPress={connectWallet}
      disabled={!ready && status !== "disconnected"}
    >
      Continue With Wallet
    </Button>
  );
};

export default ContinueWithWallet;
