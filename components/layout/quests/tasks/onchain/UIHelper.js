"use client";

import { Spinner } from "@heroui/react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const getVerificationStatusIcon = (verificationStatus, isCompleted) => {
  if (isCompleted) {
    return <CheckCircle size={16} className="text-green-400" />;
  }

  switch (verificationStatus) {
    case "checking":
      return <Spinner size="sm" className="text-blue-400" />;
    case "verified":
      return <CheckCircle size={16} className="text-green-400" />;
    case "failed":
      return <XCircle size={16} className="text-red-400" />;
    default:
      return <AlertCircle size={16} className="text-gray-400" />;
  }
};

export const getVerificationButtonText = (
  verificationStatus,
  isCompleted,
  walletConnected,
) => {
  if (isCompleted) {
    return "Verified ✓";
  }

  switch (verificationStatus) {
    case "checking":
      return "Verifying...";
    case "verified":
      return "Verified ✓";
    case "failed":
      return "Retry Verification";
    default:
      return walletConnected ? "Verify" : "Connect Wallet";
  }
};

export const getVerificationButtonColor = (verificationStatus, isCompleted) => {
  if (isCompleted || verificationStatus === "verified") {
    return "#10b981"; // green
  }
  if (verificationStatus === "failed") {
    return "#ef4444"; // red
  }
};

export const getVerificationButtonDisabled = (
  verificationStatus,
  walletConnected,
  isCompleted,
) => {
  return verificationStatus === "checking" || !walletConnected || isCompleted;
};

export const getVerificationStatusClasses = (
  verificationStatus,
  isCompleted,
) => {
  if (isCompleted) {
    return "border-green-500/30 bg-green-500/10";
  }

  switch (verificationStatus) {
    case "failed":
      return "border-red-500/30 bg-red-500/10";
    default:
      return "border-gray-500/30 bg-gray-500/10";
  }
};

export const getVerificationStatusTextClasses = (
  verificationStatus,
  isCompleted,
) => {
  if (isCompleted) {
    return "text-green-400";
  }

  switch (verificationStatus) {
    case "failed":
      return "text-red-400";
    default:
      return "text-gray-300";
  }
};

export const formatTokenAmount = (amount, decimals = 2) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0";
  }

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const truncateAddress = (address, startLength = 8, endLength = 6) => {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};
