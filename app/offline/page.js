"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { WifiOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const OfflinePage = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url('/hero-background.png')] bg-cover bg-center px-6 py-12">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md rounded-3xl bg-white/15 p-10 shadow-xl ring-1 ring-white/10 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
          <WifiOffIcon className="h-7 w-7 text-white" />
        </div>

        <h1 className="mt-6 text-center text-2xl font-semibold leading-tight text-white">
          You&rsquo;re offline
        </h1>

        <p className="mt-3 text-center text-sm text-white/80">
          It looks like you&rsquo;ve lost your connection. Check your network
          and try again.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onPress={handleRetry}
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black shadow-sm transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            Retry Connection
          </Button>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-transparent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            Go to Login
          </Link>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-white opacity-5 blur-2xl" />
      </div>
    </div>
  );
};

export default OfflinePage;
