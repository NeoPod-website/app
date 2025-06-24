import React from "react";
import Link from "next/link";

const SidebarConnectWalletBtn = () => {
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
