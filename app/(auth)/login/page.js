import React from "react";

import AuthMain from "@/components/layout/auth/AuthMain";
import SocialModal from "@/components/ui/modals/SocialModal";

export const metadata = {
  title: "Login to NeoPod | Ambassador Dashboard Access",
  description:
    "Securely log in to your NeoPod account to access ambassador quests, track your contributions, and earn rewards for supporting the NEO ecosystem. Connect your wallet or use email to continue.",

  keywords: [
    "NeoPod Login",
    "NEO Ambassador Sign In",
    "Crypto Login Page",
    "Web3 Wallet Login",
    "NEO Dashboard Access",
    "Login to NEO Quests",
    "Sign In NEO Community",
    "NEO Contributor Platform",
    "Crypto Account Access",
    "Ambassador Program Login",
    "NEO Wallet Connect",
    "Secure Web3 Login",
    "Connect to NeoPod",
    "NEO Rewards Dashboard",
    "Sign In to Earn GAS",
  ],

  openGraph: {
    title: "Login to NeoPod | Ambassador Dashboard Access",
    description:
      "Securely log in to your NeoPod account to access ambassador quests, track your contributions, and earn rewards for supporting the NEO ecosystem. Connect your wallet or use email to continue.",
    url: "https://app.neopod.org",
    siteName: "NeoPod - Ambassador Program",
    type: "website",
    images: [
      {
        url: "/og/social-banner.png",
        width: 1200,
        height: 630,
        alt: "NeoPod Login Social Banner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Login to NeoPod | Ambassador Dashboard Access",
    description:
      "Securely log in to your NeoPod account to access ambassador quests, track your contributions, and earn rewards for supporting the NEO ecosystem. Connect your wallet or use email to continue.",
    images: ["/og/social-banner.png"],
    creator: "@neo_blockchain",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const LoginPage = async ({ searchParams }) => {
  const { inviteCode } = await searchParams;

  return (
    <>
      <SocialModal />
      <AuthMain inviteCode={inviteCode} />
    </>
  );
};

export default LoginPage;
