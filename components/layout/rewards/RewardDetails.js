import {
  User,
  Hash,
  Coins,
  Clock,
  Award,
  Globe,
  Wallet,
  Target,
  XCircle,
  Loader2,
  Calendar,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";

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
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${config.className}`}
    >
      <Icon
        className={`h-4 w-4 ${status === "processing" ? "animate-spin" : ""}`}
      />
      <span>{config.label}</span>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, valueClassName = "" }) => (
  <div className="rounded-xl border border-gray-600/30 bg-gray-700/30 p-4">
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-gray-600/30 p-2">
        <Icon className="h-5 w-5 text-gray-300" />
      </div>

      <div className="flex-1">
        <p className="text-xs text-gray-200">{label}</p>

        <p
          className={`mt-1 text-base font-semibold text-gray-100 ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
    {children}
  </div>
);

const RewardDetails = ({ reward, user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
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

  const truncateAddress = (address) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const ambassador = reward.ambassador || {};

  return (
    <div className="space-y-6 overflow-y-auto scrollbar-hide">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/rewards"
            className="rounded-lg bg-gray-700/30 p-2 transition-colors hover:bg-gray-600/50"
          >
            <ArrowLeft className="h-5 w-5 text-gray-300" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-100">Reward Details</h1>
            <p className="mt-1 text-sm text-gray-300">
              Claim ID: {reward.claim_id}
            </p>
          </div>
        </div>
        <StatusBadge status={reward.status} />
      </div>

      {reward.status === "failed" && reward.error_message && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />

            <div>
              <h3 className="font-semibold text-red-400">Error</h3>
              <p className="mt-1 text-sm text-red-300">
                {reward.error_message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-600/30 bg-gray-700/30 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500/20 p-3">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>

            <div>
              <p className="text-xs text-gray-300">Reward Amount</p>
              <p className="text-2xl font-bold text-green-400">
                ${formatCurrency(reward.reward_amount_usd)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-600/30 bg-gray-700/30 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 rounded-full p-3">
              <Coins className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <p className="text-xs text-gray-300">Tokens Sent</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatTokens(reward.tokens_sent)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-600/30 bg-gray-700/30 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>

            <div>
              <p className="text-xs text-gray-300">Token Price</p>
              <p className="text-2xl font-bold text-purple-400">
                ${formatCurrency(reward.token_price_at_claim)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Section title="Ambassador Information">
        <div className="rounded-xl border border-gray-600/30 bg-gray-700/30 p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-600">
              {ambassador.profile_photo ? (
                <Image
                  width={80}
                  height={80}
                  src={ambassador.profile_photo}
                  alt={ambassador.username || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-200">Username</p>
                  <p className="mt-1 text-base font-semibold capitalize text-gray-100">
                    {ambassador.username || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-200">Email</p>
                  <p className="mt-1 text-base font-semibold text-gray-100">
                    {ambassador.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-200">Role Type</p>
                  <p className="mt-1 text-base font-semibold capitalize text-gray-100">
                    {ambassador.role_type || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-200">Total Points</p>
                  <p className="mt-1 text-base font-semibold text-gray-100">
                    {ambassador.total_points?.toLocaleString() || "0"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-200">Status</p>
                  <p className="mt-1 text-base font-semibold capitalize text-gray-100">
                    {ambassador.status || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-200">Ambassador ID</p>
                  <p className="mt-1 font-mono text-base text-gray-100">
                    {ambassador.ambassador_id || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Claim Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard
            icon={Wallet}
            label="Wallet Address"
            value={
              reward.wallet_address
                ? truncateAddress(reward.wallet_address)
                : "N/A"
            }
            valueClassName="font-mono text-sm"
          />

          <InfoCard
            icon={Globe}
            label="Network"
            value={reward.network_name?.toUpperCase() || "N/A"}
            valueClassName="uppercase"
          />

          <InfoCard
            icon={Target}
            label="Points Threshold"
            value={reward.points_threshold?.toLocaleString() || "N/A"}
          />

          <InfoCard
            icon={Award}
            label="Role Type"
            value={reward.role_type || "N/A"}
            valueClassName="capitalize"
          />

          <InfoCard
            icon={Calendar}
            label="Claim Date"
            value={formatDate(reward.claim_date)}
          />

          <InfoCard
            icon={Clock}
            label="Last Updated"
            value={formatDate(reward.last_updated)}
          />

          {reward.job_id && (
            <InfoCard
              icon={Hash}
              label="Job ID"
              value={reward.job_id}
              valueClassName="font-mono"
            />
          )}

          {reward.claim_timestamp && (
            <InfoCard
              icon={Hash}
              label="Claim Timestamp"
              value={reward.claim_timestamp}
              valueClassName="font-mono"
            />
          )}
        </div>
      </Section>

      {reward.transaction_hash && (
        <Section title="Transaction Information">
          <div className="rounded-xl border border-gray-600/30 bg-gray-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-300">Transaction Hash</p>
                <p className="mt-1 font-mono text-sm text-gray-100">
                  {reward.transaction_hash}
                </p>
              </div>

              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`https://explorer.neo.org/transaction/${reward.transaction_hash}`}
                className="flex items-center gap-2 rounded-lg bg-gray-600/30 px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-600/50"
              >
                <span>View on Explorer</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {user.role_type === "super_admin" && (
        <Section title="Raw Data (Super Admin Only)">
          <div className="rounded-xl border border-gray-600/30 bg-gray-700/30 p-6">
            <pre className="overflow-x-auto text-xs text-gray-300">
              {JSON.stringify(reward, null, 2)}
            </pre>
          </div>
        </Section>
      )}
    </div>
  );
};

export default RewardDetails;
