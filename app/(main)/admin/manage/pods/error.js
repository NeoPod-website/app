"use client";

import Link from "next/link";
import { useEffect } from "react";

import PodContainerWrapper from "@/components/layout/pods/PodContainerWrapper";

const breadcrumbsList = [
  {
    title: "Admin PODS",
    href: "/admin/manage/pods",
  },

  {
    title: "Error",
    href: "/admin/manage/pods",
  },
];

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error in Manage Pods:", error);
  }, [error]);

  return (
    <PodContainerWrapper list={breadcrumbsList}>
      <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 p-8">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Something went wrong!
        </h2>

        <p className="mb-6 text-center text-red-300">
          {error.message || "Failed to load PODs. Please try again."}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-white transition-colors hover:bg-white/20"
          >
            Try Again
          </button>

          <Link
            href="/admin/manage/pods"
            className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-white transition-colors hover:bg-white/20"
          >
            Back to PODS
          </Link>
        </div>
      </div>
    </PodContainerWrapper>
  );
}
