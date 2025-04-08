import { Nunito_Sans, Work_Sans } from "next/font/google";

import "./globals.css";

import UiProvider from "@/providers/UiProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import WalletProvider from "@/providers/WalletProvider";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "NEO POD - Quests & Rewards for Ambassadors",
  description:
    "Join the NEO POD DApp to complete quests, earn rewards, and grow your influence in the NEO Blockchain ecosystem. Track your progress, level up, and unlock exclusive perks as an official NEO Ambassador.",

  applicationName: "NEO POD DAPP",
  referrer: "origin-when-cross-origin",

  keywords: [
    "NEO POD",
    "NEO Ambassador Quests",
    "NEO DApp",
    "GAS Token Rewards",
    "Web3 Quest Platform",
    "Complete Crypto Tasks",
    "Earn Rewards Crypto",
    "Gamified Web3 Onboarding",
    "Zealy Alternative",
    "NEO Community Platform",
    "Blockchain Ambassador Tasks",
    "NEO Missions",
    "Ambassador Progress Tracker",
    "Crypto Loyalty Program",
    "NEO Ecosystem Engagement",
    "Web3 Contribution App",
    "Crypto Task Management",
    "Grow with NEO",
    "NEO Onchain Community",
    "NEO Gamified Experience",
    "NEO Contributor Dashboard",
  ],

  authors: [
    { name: "Gautam Raj: NooberBoy.eth" },
    { name: "Anoy Roy Chowdhury: AnoyRC.eth" },
  ],

  creator: "Gautam Raj",
  publisher: "Gautam Raj",

  publisher: "NEO POD - Ambassador Program",
  metadataBase: new URL("https://app.neopod.org"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "NEO POD - Quests & Rewards for Ambassadors",
    description:
      "Join the NEO POD DApp to complete quests, earn rewards, and grow your influence in the NEO Blockchain ecosystem. Track your progress, level up, and unlock exclusive perks as an official NEO Ambassador.",
    url: "https://app.neopod.org",
    siteName: "NEO POD - Ambassador Program",
    type: "website",
    images: [
      {
        url: "/og/social-banner.png",
        width: 1200,
        height: 630,
        alt: "NEO POD Dapp Social Banner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NEO POD - Quests & Rewards for Ambassadors",
    description:
      "Join the NEO POD DApp to complete quests, earn rewards, and grow your influence in the NEO Blockchain ecosystem. Track your progress, level up, and unlock exclusive perks as an official NEO Ambassador.",
    images: ["/og/social-banner.png"],
    creator: "@neo_blockchain",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NEO POD - Quests & Rewards for Ambassadors",
  },

  other: {
    "application/ld+json": `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "NEO POD",
        "url": "https://app.neopod.org",
        "description": "Join the NEO POD DApp to complete quests, earn rewards, and grow your influence in the NEO Blockchain ecosystem. Track your progress, level up, and unlock exclusive perks as an official NEO Ambassador.",
        "logo": "https://neo-web.azureedge.net/images/logo%20files-dark.svg",
        "sameAs": [
          "https://www.facebook.com/NeoBlockchainOfficial"
          "https://x.com/neo_blockchain",
          "https://www.reddit.com/r/NEO",
          "https://neo-blockchain.medium.com",
          "https://www.linkedin.com/company/neo-blockchain",
        ]
      }
    </script>`,
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunitoSans.className} ${workSans.variable} antialiased`}
      >
        <ReduxProvider>
          <WalletProvider>
            <UiProvider>{children}</UiProvider>
          </WalletProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
