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
  title: "NEO POD - Ambassador Program",
  description: "NEO POD - Ambassador Program",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunitoSans.className} ${workSans.variable} antialiased`}
      >
        <WalletProvider>
          <ReduxProvider>
            <UiProvider>{children}</UiProvider>
          </ReduxProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
