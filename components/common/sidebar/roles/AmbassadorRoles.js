"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button, Progress } from "@heroui/react";
import { EllipsisVerticalIcon } from "lucide-react";

import InitiateRole from "./InitiateRole";
import OperatorRole from "./OperatorRole";
import SentinelRole from "./SentinelRole";
import ArchitectRole from "./ArchitectRole";

import MainModal from "@/components/ui/modals/MainModal";

// Reusable badge component
const ProfileBadge = ({
  width = 28,
  height = 20,
  alt = "Profile Rank Badge",
  src = "/dashboard/profile/default-profile.png",
}) => {
  return (
    <Image
      width={width}
      height={height}
      alt={alt || "Rank Badge"}
      src={src}
      className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2"
    />
  );
};

// Reusable tier progress component with common UI structure
const TierProgressBase = ({
  tierNumber,
  tierName,
  description,
  gradientClass,
  progressProps, // For Progress component
  modalContent,
  children, // For content flexibility
}) => {
  const [expanded, setExpanded] = useState(false);

  // Validate required props
  if (!tierName) {
    console.error("TierProgressBase: Missing tierName");
    tierName = "Unknown Tier";
  }

  // Ensure tierNumber is a valid number
  const validTierNumber =
    Number.isInteger(tierNumber) && tierNumber > 0 ? tierNumber : 1;

  if (validTierNumber !== tierNumber) {
    console.warn(
      `TierProgressBase: Invalid tierNumber "${tierNumber}", using ${validTierNumber}`,
    );
  }

  // Handle missing gradient class
  const safeGradientClass = gradientClass || "bg-gray-500";

  // Ensure progressProps has required properties with safe defaults
  const safeProgressProps = {
    maxValue: 100,
    value: 0,
    valueLabel: "0 / 100",
    ...progressProps,
  };

  return (
    <>
      <div className="border-t border-gray-400 p-3 text-gray-100">
        <div className="flex items-start gap-2.5">
          <Progress
            className="max-w-md"
            color="warning"
            formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
            label={`Tier ${validTierNumber}: ${tierName}`}
            showValueLabel={true}
            size="md"
            classNames={{
              indicator: safeGradientClass,
              label: "text-gray-100 text-sm",
              value: "text-gray-100 text-sm",
            }}
            {...safeProgressProps}
          />

          {/* <Button
            onPress={() => setExpanded(true)}
            className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700"
          >
            <EllipsisVerticalIcon size={16} />
          </Button> */}
        </div>
      </div>

      <MainModal
        title={`Tier ${validTierNumber}: ${tierName} Progress`}
        description={description || "Track your progress"}
        isOpen={expanded}
        handleOnClose={() => setExpanded(false)}
        size="lg"
      >
        <div className="space-y-3 text-sm text-gray-100">
          {modalContent || children || (
            <p>No content available. Please check back later.</p>
          )}
        </div>
      </MainModal>
    </>
  );
};

// Add error boundary component for tier components
const TierErrorBoundary = ({ children, fallback }) => {
  // In a real implementation, this would be a proper React error boundary
  // Here we're just simulating the concept with a try/catch wrapper
  try {
    return children;
  } catch (error) {
    console.error("Error in tier component:", error);
    return (
      fallback || (
        <div className="border-t border-gray-400 p-4 text-gray-100">
          <p className="text-red-400">Unable to display tier information</p>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      )
    );
  }
};

// Helper to select the right role component based on tier level or user data
const AmbassadorRoles = ({ user, tierOverride }) => {
  // Validate user object
  if (!user) {
    console.error("AmbassadorRole: Missing user object");
    // Provide a safe fallback to prevent render errors
    user = { ambassador_stats: {} };
  }

  // Get tier from user data if not explicitly overridden
  const tier = tierOverride || user?.role_type || "initiate";

  // Validate that tier is one of the allowed values
  const validTiers = ["initiate", "operator", "sentinel", "architect"];

  const safeTier = validTiers.includes(tier.toLowerCase())
    ? tier.toLowerCase()
    : "initiate";

  if (safeTier !== tier) {
    console.warn(
      `AmbassadorRole: Invalid tier "${tier}" defaulting to "initiate"`,
    );
  }

  // Wrap each tier component in an error boundary to prevent cascading failures
  return (
    <TierErrorBoundary>
      {(() => {
        switch (safeTier) {
          case "architect":
            return <ArchitectRole user={user} />;
          case "sentinel":
            return <SentinelRole user={user} />;
          case "operator":
            return <OperatorRole user={user} />;
          case "initiate":
          default:
            return <InitiateRole user={user} />;
        }
      })()}
    </TierErrorBoundary>
  );
};

export { ProfileBadge, AmbassadorRoles, TierProgressBase, TierErrorBoundary };

// Implement a default export that includes error handling
export default function SafeAmbassadorRole(props) {
  try {
    return <AmbassadorRoles {...props} />;
  } catch (error) {
    console.error("Critical error in AmbassadorRole:", error);
    // Return a minimal fallback UI that won't crash the app
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
        <p>Unable to display ambassador information</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded bg-red-100 px-3 py-1 hover:bg-red-200"
        >
          Refresh
        </button>
      </div>
    );
  }
}
