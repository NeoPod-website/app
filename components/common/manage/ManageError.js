import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

const ManageError = ({
  error,
  message,
  linkHref,
  linkLabel,
  handleRetry = () => {
    window.location.reload();
  },
}) => {
  return (
    <div className="mt-8 flex h-full flex-col items-center justify-center rounded-xl border border-red-500/40 bg-red-500/5 p-8">
      <h2 className="mb-4 text-2xl font-semibold text-white">
        Something went wrong!
      </h2>

      <p className="mb-6 text-center text-red-300">
        {error.message || message}
      </p>

      <div className="flex gap-4">
        <Button
          onPress={handleRetry}
          className="rounded-full border border-white/20 bg-white/10 !px-6 !py-2 text-white transition-colors hover:bg-white/20"
        >
          Try Again
        </Button>

        <Link
          href={linkHref}
          className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-white hover:border-gray-600"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default ManageError;
