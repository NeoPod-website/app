import React from "react";
import { auth0 } from "@/lib/auth0";

import SignUpMain from "@/components/layout/auth/SignUpMain";

export const metadata = {
  title: "Sign Up for NEO POD | Join the Ambassador Program",
  description:
    "Create your NEO POD account to start your journey as an ambassador. Complete quests, grow your impact, and earn rewards by supporting the NEO ecosystem. Sign up with your wallet or email.",

  keywords: [
    "NEO POD Sign Up",
    "Join NEO Ambassador Program",
    "Create NEO Account",
    "Web3 Wallet Sign Up",
    "NEO Dashboard Registration",
    "Register for NEO Quests",
    "Sign Up NEO Community",
    "NEO Contributor Onboarding",
    "Crypto Account Creation",
    "Ambassador Program Registration",
    "Connect Wallet to Join NEO",
    "Secure Web3 Sign Up",
    "Get Started with NEO POD",
    "NEO Rewards Onboarding",
    "Earn GAS with NEO POD",
  ],

  openGraph: {
    title: "Sign Up for NEO POD | Join the Ambassador Program",
    description:
      "Create your NEO POD account to start your journey as an ambassador. Complete quests, grow your impact, and earn rewards by supporting the NEO ecosystem. Sign up with your wallet or email.",
    url: "https://app.neopod.org/signup",
    siteName: "NEO POD - Ambassador Program",
    type: "website",
    images: [
      {
        url: "/og/social-banner.png",
        width: 1200,
        height: 630,
        alt: "NEO POD Sign Up Social Banner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sign Up for NEO POD | Join the Ambassador Program",
    description:
      "Create your NEO POD account to start your journey as an ambassador. Complete quests, grow your impact, and earn rewards by supporting the NEO ecosystem. Sign up with your wallet or email.",
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

const SignUpPage = async ({ searchParams }) => {
  const { inviteCode } = await searchParams;

  const session = await auth0.getSession();

  return <SignUpMain session={session} inviteCode={inviteCode} />;
};

export default SignUpPage;
