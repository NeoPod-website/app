import {
  Clock,
  XCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      className: "bg-green-500/20 text-green-400 border-green-500/30",
      label: "Completed",
    },

    failed: {
      icon: XCircle,
      className: "bg-red-500/20 text-red-400 border-red-500/30",
      label: "Failed",
    },

    processing: {
      icon: Loader2,
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      label: "Processing",
    },

    pending: {
      icon: Clock,
      className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      label: "Pending",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon
        className={`h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`}
      />
      <span>{config.label}</span>
    </div>
  );
};

const AmbassadorInfo = memo(({ ambassador }) => {
  if (!ambassador) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-200">Unknown User</p>
          <p className="text-xs text-gray-500">No data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        width={40}
        height={40}
        alt={ambassador.username || "User"}
        className="h-10 w-10 rounded-full object-cover"
        src={
          ambassador.profile_photo || "/dashboard/profile/default-profile.png"
        }
      />

      <div>
        <p className="text-sm font-medium capitalize text-gray-100">
          {ambassador.username}
        </p>

        <p className="text-xs capitalize text-gray-200">
          {ambassador.role_type}
        </p>
      </div>
    </div>
  );
});

AmbassadorInfo.displayName = "AmbassadorInfo";

const RewardRow = ({ reward }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const formatTokens = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.000" : num.toFixed(3);
  };

  return (
    <div className="flex items-center justify-between rounded-2xl p-4 transition-all duration-200 hover:bg-gray-700/60">
      <div className="flex flex-1 items-center gap-6">
        <div className="w-64 flex-shrink-0">
          <AmbassadorInfo ambassador={reward.ambassador} />
        </div>

        <div className="hidden w-28 flex-shrink-0 md:block">
          <StatusBadge status={reward.status} />
        </div>

        <div className="w-32 flex-shrink-0 text-right">
          <p className="text-xs text-gray-400">Reward Amount</p>
          <p className="text-lg font-bold text-green-400">
            ${formatCurrency(reward.reward_amount_usd)}
          </p>
        </div>

        <div className="hidden w-32 flex-shrink-0 text-right lg:block">
          <p className="text-xs text-gray-400">Tokens</p>
          <p className="text-sm font-semibold text-blue-400">
            {formatTokens(reward.tokens_sent)}
          </p>
        </div>

        <div className="hidden w-44 flex-shrink-0 xl:block">
          <p className="text-xs text-gray-400">Claim Date</p>
          <p className="text-sm text-gray-50">
            {formatDate(reward.claim_date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {reward.transaction_hash && (
          <Link
            href={`https://explorer.neo.org/transaction/${reward.transaction_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition-colors hover:bg-gray-600/50"
            aria-label="View transaction on Neo Explorer"
          >
            <ExternalLink size={16} className="text-gray-300" />
          </Link>
        )}

        <Link
          href={`/admin/rewards/${reward.claim_id}`}
          className="rounded-md border border-gray-400/50 bg-gray-600/30 px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-600/50"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default memo(RewardRow);
