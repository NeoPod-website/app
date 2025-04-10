"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";

const ContinueWithWallet = () => {
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
    >
      Continue With Wallet
    </Button>
  );
};

export default ContinueWithWallet;
