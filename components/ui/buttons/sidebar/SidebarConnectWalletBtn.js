"use client";

import React from "react";
import { Button } from "@heroui/react";

const SidebarConnectWalletBtn = () => {
  return (
    <Button
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 h-auto rounded !px-0 !py-0 text-xs text-white underline"
      onPress={() => {
        console.log("Connect wallet clicked");
      }}
    >
      Connect Wallet
    </Button>
  );
};

export default SidebarConnectWalletBtn;
