"use client";

import { useEffect } from "react";
import { RefreshCcw, AlertTriangle, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/20">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>

          <h1 className="mb-2 text-3xl font-bold text-white">
            Oops! Something went wrong
          </h1>

          <p className="text-lg text-gray-400">
            We encountered an unexpected error. Don't worry, it's not your
            fault.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-950/30 p-4">
            <h3 className="mb-2 font-medium text-red-300">Error Details:</h3>
            <p className="break-words font-mono text-sm text-red-200">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact our support team.
          </p>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
            <span>Error ID: {Date.now().toString(36)}</span>
            <span>•</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
