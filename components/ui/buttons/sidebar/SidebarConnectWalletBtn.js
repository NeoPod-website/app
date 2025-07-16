"use client";

import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

import shortAddress from "@/utils/shortAddress";

import CopyToClipboard from "../../CopyToClipboard";

const SidebarConnectWalletBtn = () => {
  const { isConnected, address } = useAccount();

  if (isConnected) {
    return (
      <div className="flex items-center gap-1">
        <p>{shortAddress(address)}</p>
        <CopyToClipboard text={address} />
      </div>
    );
  }

  return (
    <Link
      href="/settings?tab=wallet"
      className="bg-blue-600 hover:bg-blue-700 h-auto rounded !px-0 !py-0 text-xs text-white underline"
    >
      Connect Wallet
    </Link>
  );
};

export default SidebarConnectWalletBtn;
