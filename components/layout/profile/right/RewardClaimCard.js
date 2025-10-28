// "use client";

// import { Coins, Clock, RefreshCw, AlertCircle } from "lucide-react";
// import React, { useState, useEffect, useCallback, useMemo } from "react";

// const InfoRow = React.memo(({ label, value, valueColor = "text-white" }) => (
//   <div className="flex justify-between text-sm">
//     <span className="text-gray-200">{label}</span>
//     <span className={`font-medium ${valueColor}`}>{value}</span>
//   </div>
// ));

// InfoRow.displayName = "InfoRow";

// const RewardClaimCard = React.memo(({ user, me = false }) => {
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [claiming, setClaiming] = useState(false);
//   const [rewardData, setRewardData] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   // Memoized API calls
//   const fetchRewardStatus = useCallback(async (isRefresh = false) => {
//     if (isRefresh) {
//       setRefreshing(true);
//     } else {
//       setLoading(true);
//     }
//     setError(null);

//     const url = me
//       ? `${process.env.NEXT_PUBLIC_API_URL}/rewards/status`
//       : `${process.env.NEXT_PUBLIC_API_URL}/rewards/status?username=${user.username}`;

//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         credentials: "include",
//       });

//       const data = await response.json();

//       if (data.success) {
//         setRewardData(data.data);
//       } else {
//         setError(data.message || "Failed to fetch reward status");
//       }
//     } catch (err) {
//       setError("Network error");
//       console.error("Reward status fetch error:", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   const claimReward = useCallback(async () => {
//     setClaiming(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/rewards/claim`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ networkName: "neo" }),
//           credentials: "include",
//         },
//       );

//       const data = await response.json();

//       if (data.success) {
//         // Immediate refresh to show processing state
//         await fetchRewardStatus(true);
//       } else {
//         setError(data.message || "Failed to claim reward");
//       }
//     } catch (err) {
//       setError("Network error");
//     } finally {
//       setClaiming(false);
//     }
//   }, [fetchRewardStatus]);

//   useEffect(() => {
//     fetchRewardStatus();
//   }, [fetchRewardStatus]);

//   // Memoized computed values
//   const computedValues = useMemo(() => {
//     if (!rewardData) return null;

//     const progressToNext =
//       rewardData.totalPoints - rewardData.lastClaimedThreshold;
//     const progressPercentage = Math.min((progressToNext / 1000) * 100, 100);
//     const claimingUpTo =
//       rewardData.lastClaimedThreshold +
//       Math.floor(rewardData.claimableAmount / rewardData.rewardRate) * 1000;

//     return {
//       progressPercentage,
//       claimingUpTo,
//     };
//   }, [rewardData]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <div className="mb-4 flex items-center gap-3">
//           <Coins className="h-5 w-5 text-yellow-500" />
//           <h3 className="font-semibold text-white">Token Rewards</h3>
//         </div>

//         <div className="flex items-center justify-center py-8">
//           <RefreshCw className="h-5 w-5 animate-spin text-yellow-500" />
//           <span className="ml-3 text-gray-400">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error && !rewardData) {
//     return (
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <div className="mb-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <AlertCircle className="h-5 w-5 text-red-500" />
//             <h3 className="font-semibold text-white">Token Rewards</h3>
//           </div>

//           <button
//             disabled={refreshing}
//             onClick={() => fetchRewardStatus()}
//             className="p-2 text-gray-400 transition-colors hover:text-white"
//           >
//             <RefreshCw
//               className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
//             />
//           </button>
//         </div>

//         <p className="text-sm text-red-400">{error}</p>
//       </div>
//     );
//   }

//   if (!rewardData) return null;

//   // Header with refresh button
//   const CardHeader = () => (
//     <div className="mb-4 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <Coins
//           className={`h-5 w-5 ${
//             rewardData.canClaim
//               ? "text-green-500"
//               : rewardData.pendingClaim
//                 ? "text-blue-500"
//                 : "text-gray-500"
//           }`}
//         />

//         <h3 className="font-semibold text-white">
//           {rewardData.canClaim
//             ? "Reward Available!"
//             : rewardData.pendingClaim
//               ? "Processing Reward"
//               : "Token Rewards"}
//         </h3>
//       </div>

//       <button
//         onClick={() => fetchRewardStatus(true)}
//         disabled={refreshing}
//         className="p-2 text-gray-400 transition-colors hover:text-white"
//         title="Refresh status"
//       >
//         <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//       </button>
//     </div>
//   );

//   // Not eligible (show only stats for viewing other users)
//   if (!rewardData.isEligibleRole) {
//     return (
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <CardHeader />

//         <div className="py-4 text-center">
//           <p className="mb-2 text-sm text-gray-100">
//             {me ? "Your" : "This"} role ({rewardData.roleType}) is not eligible
//             for rewards
//           </p>

//           <p className="text-xs text-gray-200">
//             Only operators and sentinels earn rewards
//           </p>
//         </div>

//         {rewardData.totalEarned > 0 && (
//           <div className="bg-blue-500/10 mt-4 rounded border border-blue-500/20 p-3">
//             <InfoRow
//               label="Total Earned"
//               value={`$${rewardData.totalEarned}`}
//               valueColor="text-blue-400"
//             />

//             <InfoRow
//               label="Total Tokens"
//               value={rewardData.totalTokensEarned.toString()}
//               valueColor="text-green-400"
//             />
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Invalid wallet (only for own profile)
//   if (!rewardData.hasValidWallet && me) {
//     return (
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <CardHeader />

//         <div className="rounded border border-yellow-500/20 bg-yellow-500/10 p-4">
//           <p className="mb-1 text-sm font-medium text-yellow-400">
//             Wallet Required
//           </p>

//           <p className="text-xs text-gray-300">
//             Add a valid wallet address to claim rewards
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (rewardData.pendingClaim) {
//     return (
//       <div className="rounded-lg border border-blue-500/30 bg-gradient-dark p-6">
//         <CardHeader />

//         <div className="mb-4 space-y-3">
//           <InfoRow
//             label="Amount"
//             value={`$${rewardData.pendingClaim.rewardAmount}`}
//             valueColor="text-blue-400"
//           />

//           <InfoRow
//             label="Status"
//             value="Processing"
//             valueColor="text-yellow-400"
//           />

//           <InfoRow
//             label="Started"
//             value={new Date(
//               rewardData.pendingClaim.claimDate,
//             ).toLocaleTimeString()}
//             valueColor="text-gray-300"
//           />
//         </div>

//         <div className="bg-blue-500/10 rounded border border-blue-500/20 p-3">
//           <div className="flex items-center">
//             <Clock className="mr-2 h-4 w-4 text-blue-400" />

//             <p className="text-xs text-blue-300">
//               Transaction processing... Check back in a few minutes
//             </p>
//           </div>
//         </div>

//         {error && (
//           <div className="mt-3 rounded border border-red-500/20 bg-red-500/10 p-2">
//             <p className="text-xs text-red-400">{error}</p>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // No rewards available
//   if (!rewardData.canClaim) {
//     return (
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <CardHeader />

//         <div className="mb-4 space-y-3">
//           <InfoRow
//             label="Current Points"
//             value={rewardData.totalPoints.toLocaleString()}
//           />

//           <InfoRow
//             label="Next Reward At"
//             value={`${rewardData.nextClaimAt.toLocaleString()} pts`}
//             valueColor="text-yellow-400"
//           />

//           <InfoRow
//             label="Points Needed"
//             value={rewardData.pointsNeeded.toLocaleString()}
//             valueColor="text-red-400"
//           />

//           <InfoRow
//             label="Rate"
//             value={`$${rewardData.rewardRate}/1K pts`}
//             valueColor="text-green-400"
//           />
//         </div>

//         <div className="mb-4 rounded border border-gray-600/30 bg-gray-700/30 p-3">
//           <InfoRow
//             label="Total Earned"
//             value={`$${rewardData.totalEarned}`}
//             valueColor="text-blue-400"
//           />

//           <InfoRow
//             label="Total Tokens"
//             value={rewardData.totalTokensEarned.toString()}
//             valueColor="text-green-400"
//           />
//         </div>

//         {computedValues && (
//           <>
//             <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-700">
//               <div
//                 className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
//                 style={{ width: `${computedValues.progressPercentage}%` }}
//               />
//             </div>

//             <p className="text-center text-xs text-gray-400">
//               Progress to next reward
//             </p>
//           </>
//         )}
//       </div>
//     );
//   }

//   // Ready to claim (only show claim button for own profile)
//   return (
//     <div className="rounded-lg border border-green-500/30 bg-gradient-dark p-6">
//       <CardHeader />

//       <div className="mb-6 text-center">
//         <div className="mb-2 text-3xl font-bold text-green-400">
//           ${rewardData.claimableAmount}
//         </div>

//         <p className="text-sm text-gray-300">Ready to claim</p>
//       </div>

//       <div className="mb-6 space-y-3">
//         <InfoRow
//           label="Current Points"
//           value={rewardData.totalPoints.toLocaleString()}
//         />

//         <InfoRow
//           label="Claiming Up To"
//           value={`${computedValues?.claimingUpTo.toLocaleString()} pts`}
//           valueColor="text-blue-400"
//         />

//         <InfoRow
//           label="Rate"
//           value={`$${rewardData.rewardRate}/1K pts`}
//           valueColor="text-green-400"
//         />
//       </div>

//       {me && (
//         <button
//           onClick={claimReward}
//           disabled={claiming || refreshing}
//           className={`w-full rounded-lg px-4 py-3 font-semibold transition-all duration-200 ${
//             claiming || refreshing
//               ? "cursor-not-allowed bg-gray-600 text-gray-300"
//               : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:scale-[1.02] hover:from-green-700 hover:to-blue-700 active:scale-[0.98]"
//           }`}
//         >
//           {claiming ? (
//             <span className="flex items-center justify-center">
//               <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//               Processing...
//             </span>
//           ) : (
//             `Claim $${rewardData.claimableAmount}`
//           )}
//         </button>
//       )}

//       {rewardData.totalEarned > 0 && (
//         <div className="bg-blue-500/10 mt-4 rounded border border-blue-500/20 p-3">
//           <InfoRow
//             label="Lifetime Earned"
//             value={`$${rewardData.totalEarned} (${rewardData.totalTokensEarned} tokens)`}
//             valueColor="text-blue-400"
//           />
//         </div>
//       )}

//       {error && (
//         <div className="mt-3 rounded border border-red-500/20 bg-red-500/10 p-2">
//           <p className="text-center text-xs text-red-400">{error}</p>
//         </div>
//       )}

//       {me && (
//         <p className="mt-3 text-center text-xs text-gray-500">
//           Native tokens sent to your wallet
//         </p>
//       )}
//     </div>
//   );
// });

// RewardClaimCard.displayName = "RewardClaimCard";

// export default RewardClaimCard;

"use client";

import {
  Coins,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Reusable InfoRow component
const InfoRow = React.memo(({ label, value, valueColor = "text-white" }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-200">{label}</span>
    <span className={`font-medium ${valueColor}`}>{value}</span>
  </div>
));

InfoRow.displayName = "InfoRow";

// Alert component for messages
const Alert = React.memo(({ type = "error", message }) => {
  const styles = {
    error: "border-red-500/20 bg-red-500/10 text-red-400",
    success: "border-green-500/20 bg-green-500/10 text-green-400",
    warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    info: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  };

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle,
    info: Clock,
  };

  const Icon = icons[type];

  return (
    <div className={`mt-4 rounded border p-3 ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <p className="text-xs leading-relaxed">{message}</p>
      </div>
    </div>
  );
});

Alert.displayName = "Alert";

const RewardClaimCard = React.memo(({ user, me = false }) => {
  // State management
  const [state, setState] = useState({
    loading: true,
    claiming: false,
    refreshing: false,
    error: null,
    successMessage: null,
    data: null,
  });

  const { loading, claiming, refreshing, error, successMessage, data } = state;

  // Update state helper
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fetch reward status
  const fetchRewardStatus = useCallback(
    async (isRefresh = false) => {
      updateState({
        [isRefresh ? "refreshing" : "loading"]: true,
        error: null,
        successMessage: null,
      });

      const url = me
        ? `${process.env.NEXT_PUBLIC_API_URL}/rewards/status`
        : `${process.env.NEXT_PUBLIC_API_URL}/rewards/status?username=${user.username}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          updateState({
            data: result.data,
            loading: false,
            refreshing: false,
          });
        } else {
          updateState({
            error: result.message || "Failed to fetch reward status",
            loading: false,
            refreshing: false,
          });
        }
      } catch (err) {
        console.error("Reward status fetch error:", err);
        updateState({
          error: "Unable to connect. Please check your internet connection.",
          loading: false,
          refreshing: false,
        });
      }
    },
    [me, user?.username, updateState],
  );

  // Claim reward
  const claimReward = useCallback(async () => {
    updateState({ claiming: true, error: null, successMessage: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rewards/claim`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ networkName: "neo" }),
          credentials: "include",
        },
      );

      const result = await response.json();

      if (result.success) {
        updateState({
          successMessage: result.message || "Claim initiated successfully!",
          claiming: false,
        });
        // Refresh to show processing state
        setTimeout(() => fetchRewardStatus(true), 500);
      } else {
        updateState({
          error: result.message || "Failed to claim reward",
          claiming: false,
        });
      }
    } catch (err) {
      console.error("Claim error:", err);
      updateState({
        error: "Unable to process claim. Please try again.",
        claiming: false,
      });
    }
  }, [fetchRewardStatus, updateState]);

  // Initial load
  useEffect(() => {
    fetchRewardStatus();
  }, [fetchRewardStatus]);

  // Computed values
  const computed = useMemo(() => {
    if (!data) return null;

    const progressToNext = data.totalPoints - data.lastClaimedThreshold;
    const progressPercentage = Math.min((progressToNext / 1000) * 100, 100);

    // Always claiming only 1000 XPs (1 threshold) at a time
    const claimingThreshold = data.lastClaimedThreshold + 1000;
    const remainingThresholds = Math.floor(
      (data.totalPoints - claimingThreshold) / 1000,
    );

    return {
      progressPercentage,
      claimingThreshold,
      remainingThresholds,
    };
  }, [data]);

  // Card header with refresh button
  const CardHeader = useCallback(
    ({ title, iconColor }) => (
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coins className={`h-5 w-5 ${iconColor}`} />
          <h3 className="font-semibold text-white">{title}</h3>
        </div>

        <button
          onClick={() => fetchRewardStatus(true)}
          disabled={refreshing}
          className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          title="Refresh status"
          aria-label="Refresh reward status"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    ),
    [fetchRewardStatus, refreshing],
  );

  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
        <div className="mb-4 flex items-center gap-3">
          <Coins className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold text-white">Token Rewards</h3>
        </div>

        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-5 w-5 animate-spin text-yellow-500" />
          <span className="ml-3 text-gray-400">Loading reward status...</span>
        </div>
      </div>
    );
  }

  // Error state (no data)
  if (error && !data) {
    return (
      <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
        <CardHeader title="Token Rewards" iconColor="text-red-500" />

        <Alert type="error" message={error} />

        <button
          onClick={() => fetchRewardStatus()}
          className="mt-4 w-full rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Not eligible role
  if (!data.isEligibleRole) {
    return (
      <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
        <CardHeader title="Token Rewards" iconColor="text-gray-300" />

        <div className="py-4 text-center">
          <p className="mb-2 text-sm text-gray-300">
            {me ? "Your" : "This"} role ({data.roleType}) is not eligible for
            rewards
          </p>

          <p className="text-xs text-gray-300">
            Only Operators and Sentinels earn token rewards
          </p>
        </div>

        {data.totalEarned > 0 && (
          <div className="bg-blue-500/10 mt-4 space-y-2 rounded border border-blue-500/20 p-3">
            <InfoRow
              label="Total Earned"
              value={`$${data.totalEarned.toFixed(2)}`}
              valueColor="text-blue-400"
            />

            <InfoRow
              label="Total Tokens"
              value={data.totalTokensEarned.toFixed(3)}
              valueColor="text-green-400"
            />
          </div>
        )}
      </div>
    );
  }

  // Invalid wallet (only for own profile)
  if (!data.hasValidWallet && me) {
    return (
      <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
        <CardHeader title="Wallet Required" iconColor="text-yellow-500" />

        <Alert
          type="warning"
          message="Please add a valid wallet address in your profile settings to claim rewards."
        />
      </div>
    );
  }

  // Pending claim (processing)
  if (data.pendingClaim) {
    return (
      <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
        <CardHeader title="Processing Reward" iconColor="text-blue-500" />

        <div className="mb-4 space-y-2">
          <InfoRow
            label="Amount"
            value={`$${data.pendingClaim.rewardAmount.toFixed(2)}`}
            valueColor="text-blue-400"
          />

          <InfoRow
            label="Status"
            value={data.pendingClaim.status.toUpperCase()}
            valueColor="text-yellow-400"
          />

          <InfoRow
            label="Started"
            value={new Date(data.pendingClaim.claimDate).toLocaleString()}
            valueColor="text-gray-400"
          />
        </div>

        <Alert
          type="info"
          message="Your transaction is being processed. This usually takes 30-60 seconds. Click refresh to check status."
        />

        {error && <Alert type="error" message={error} />}
      </div>
    );
  }

  // Already claimed today
  if (data.todaysClaim) {
    return (
      <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
        <CardHeader title="Claimed Today!" iconColor="text-green-500" />

        <div className="mb-4 text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />

          <p className="mb-1 text-lg font-semibold text-white">
            You've already claimed today!
          </p>

          <p className="text-sm text-gray-400">
            Come back tomorrow for your next reward
          </p>
        </div>

        <div className="mb-4 space-y-2">
          <InfoRow
            label="Amount Claimed"
            value={`$${data.todaysClaim.rewardAmount.toFixed(2)}`}
            valueColor="text-green-400"
          />

          <InfoRow
            label="Tokens Received"
            value={data.todaysClaim.tokensSent.toFixed(3)}
            valueColor="text-blue-400"
          />

          <InfoRow
            label="Claimed At"
            value={new Date(data.todaysClaim.claimedAt).toLocaleString()}
            valueColor="text-gray-400"
          />
        </div>

        <div className="rounded border border-yellow-500/20 bg-yellow-500/10 p-3">
          <p className="text-center text-sm text-yellow-400">
            Next claim available in {data.todaysClaim.nextClaimIn}
          </p>
        </div>

        {data.totalEarned > 0 && (
          <div className="bg-blue-500/10 mt-4 space-y-2 rounded border border-blue-500/20 p-3">
            <InfoRow
              label="Lifetime Earned"
              value={`$${data.totalEarned.toFixed(2)}`}
              valueColor="text-blue-400"
            />
            <InfoRow
              label="Total Tokens"
              value={data.totalTokensEarned.toFixed(3)}
              valueColor="text-green-400"
            />
          </div>
        )}
      </div>
    );
  }

  // No rewards available yet
  if (!data.canClaim) {
    return (
      <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
        <CardHeader title="Token Rewards" iconColor="text-gray-300" />

        <div className="mb-4 space-y-2">
          <InfoRow
            label="Current Points"
            value={data.totalPoints.toLocaleString()}
          />

          <InfoRow
            label="Next Reward At"
            value={`${data.nextClaimAt.toLocaleString()} pts`}
            valueColor="text-yellow-400"
          />

          <InfoRow
            label="Points Needed"
            value={data.pointsNeeded.toLocaleString()}
            valueColor="text-orange-400"
          />

          <InfoRow
            label="Reward Rate"
            value={`$${data.rewardRate}/1,000 pts`}
            valueColor="text-green-400"
          />
        </div>

        {data.totalEarned > 0 && (
          <div className="mb-4 space-y-2 rounded border border-gray-700 bg-gray-800/50 p-3">
            <InfoRow
              label="Lifetime Earned"
              value={`$${data.totalEarned.toFixed(2)}`}
              valueColor="text-blue-400"
            />

            <InfoRow
              label="Total Tokens"
              value={data.totalTokensEarned.toFixed(3)}
              valueColor="text-green-400"
            />
          </div>
        )}

        {computed && (
          <>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${computed.progressPercentage}%` }}
              />
            </div>

            <p className="text-center text-xs text-gray-300">
              {computed.progressPercentage.toFixed(0)}% progress to next reward
            </p>
          </>
        )}
      </div>
    );
  }

  // Ready to claim
  return (
    <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
      <CardHeader title="Reward Available!" iconColor="text-green-500" />

      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl font-bold text-green-400">
          ${data.claimableAmount.toFixed(2)}
        </div>

        <p className="text-sm text-gray-400">Ready to claim</p>
      </div>

      <div className="mb-6 space-y-2">
        <InfoRow
          label="Current Points"
          value={data.totalPoints.toLocaleString()}
        />

        <InfoRow
          label="Claiming"
          value={`1,000 pts ($${data.rewardRate})`}
          valueColor="text-blue-400"
        />

        {computed && computed.remainingThresholds > 0 && (
          <InfoRow
            label="Remaining After"
            value={`${computed.remainingThresholds.toLocaleString()} more threshold${computed.remainingThresholds > 1 ? "s" : ""}`}
            valueColor="text-yellow-400"
          />
        )}

        <InfoRow
          label="Reward Rate"
          value={`$${data.rewardRate}/1,000 pts`}
          valueColor="text-green-400"
        />
      </div>

      {me && (
        <button
          onClick={claimReward}
          disabled={claiming || refreshing}
          className={`w-full rounded-lg px-4 py-3 font-semibold transition-all duration-200 ${
            claiming || refreshing
              ? "cursor-not-allowed bg-gray-700 text-gray-400"
              : "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg hover:scale-[1.02] hover:from-green-700 hover:to-blue-700 hover:shadow-xl active:scale-[0.98]"
          }`}
          aria-label="Claim reward"
        >
          {claiming ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processing Claim...
            </span>
          ) : (
            `Claim $${data.claimableAmount.toFixed(2)}`
          )}
        </button>
      )}

      {data.totalEarned > 0 && (
        <div className="bg-blue-500/10 mt-4 rounded border border-blue-500/20 p-3">
          <InfoRow
            label="Lifetime Earned"
            value={`$${data.totalEarned.toFixed(2)} (${data.totalTokensEarned.toFixed(3)} tokens)`}
            valueColor="text-blue-400"
          />
        </div>
      )}

      {successMessage && <Alert type="success" message={successMessage} />}
      {error && <Alert type="error" message={error} />}

      {me && (
        <p className="mt-4 text-center text-xs text-gray-300">
          Native tokens sent directly to your wallet
        </p>
      )}
    </div>
  );
});

RewardClaimCard.displayName = "RewardClaimCard";

export default RewardClaimCard;
