"use client";

import React, { useState, useEffect } from "react";

const RewardClaimButton = () => {
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch reward status on component mount
  useEffect(() => {
    fetchRewardStatus();
  }, []);

  const fetchRewardStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rewards/status`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setRewardData(data.data);
      } else {
        setError(data.message || "Failed to fetch reward status");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async () => {
    setClaiming(true);
    setError(null);
    setClaimResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rewards/claim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            networkName: "neotestnet",
          }),
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setClaimResult(data);
        // Refresh reward status after successful claim
        setTimeout(fetchRewardStatus, 2000);
      } else {
        setError(data.message || "Failed to claim reward");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-gray-50 p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading reward status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchRewardStatus}
          className="mt-2 rounded bg-red-100 px-4 py-2 text-red-700 transition-colors hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!rewardData) {
    return null;
  }

  // Success message after claiming
  if (claimResult) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="mb-4 flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
            <span className="font-bold text-white">✓</span>
          </div>
          <h3 className="ml-3 text-lg font-semibold text-green-800">
            Reward Claimed Successfully!
          </h3>
        </div>

        <div className="space-y-2 text-sm text-green-700">
          <p>
            <strong>Reward Amount:</strong> ${claimResult.data.rewardAmountUSD}
          </p>
          <p>
            <strong>Tokens Sent:</strong> {claimResult.data.tokensToSend} tokens
          </p>
          <p>
            <strong>Transaction Status:</strong> {claimResult.data.status}
          </p>
          <p>
            <strong>Estimated Processing:</strong>{" "}
            {claimResult.data.estimatedProcessingTime}
          </p>
        </div>

        <button
          onClick={() => setClaimResult(null)}
          className="mt-4 rounded bg-green-100 px-4 py-2 text-green-700 transition-colors hover:bg-green-200"
        >
          Close
        </button>
      </div>
    );
  }

  // Not eligible for rewards
  if (!rewardData.isEligibleRole) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-gray-600">
          Your role ({rewardData.roleType}) is not eligible for token rewards.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Only operators and sentinels can earn token rewards.
        </p>
      </div>
    );
  }

  // Invalid wallet
  if (!rewardData.hasValidWallet) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="font-medium text-yellow-800">Wallet Required</p>
        <p className="mt-1 text-sm text-yellow-700">
          Please add a valid wallet address to your profile to claim token
          rewards.
        </p>
      </div>
    );
  }

  // Pending claim
  if (rewardData.pendingClaim) {
    return (
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="mb-2 flex items-center">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <h3 className="ml-3 font-medium text-blue-800">Claim Processing</h3>
        </div>

        <div className="space-y-1 text-sm text-blue-700">
          <p>
            <strong>Amount:</strong> ${rewardData.pendingClaim.rewardAmount}
          </p>
          <p>
            <strong>Status:</strong> {rewardData.pendingClaim.status}
          </p>
          <p>Your reward is being processed. Please wait...</p>
        </div>
      </div>
    );
  }

  // No rewards available
  if (!rewardData.canClaim) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <span className="text-2xl text-gray-500">💰</span>
          </div>

          <h3 className="mb-2 font-medium text-gray-800">
            No Rewards Available
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Current Points:</strong>{" "}
              {rewardData.totalPoints.toLocaleString()}
            </p>
            <p>
              <strong>Next Claim At:</strong>{" "}
              {rewardData.nextClaimAt.toLocaleString()} points
            </p>
            <p>
              <strong>Points Needed:</strong>{" "}
              {rewardData.pointsNeeded.toLocaleString()}
            </p>
            <p>
              <strong>Reward Rate:</strong> ${rewardData.rewardRate} per 1,000
              points
            </p>
          </div>

          <div className="bg-blue-50 mt-4 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Total Earned:</strong> ${rewardData.totalEarned}(
              {rewardData.totalTokensEarned} tokens)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Ready to claim
  return (
    <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
          <span className="text-2xl text-white">🎉</span>
        </div>

        <h3 className="mb-2 text-xl font-bold text-green-800">Reward Ready!</h3>

        <div className="mb-6 space-y-2 text-sm text-gray-700">
          <p className="text-lg font-semibold text-green-600">
            ${rewardData.claimableAmount} Available
          </p>
          <p>
            <strong>Current Points:</strong>{" "}
            {rewardData.totalPoints.toLocaleString()}
          </p>
          <p>
            <strong>Claiming up to:</strong>{" "}
            {rewardData.lastClaimedThreshold +
              Math.floor(rewardData.claimableAmount / rewardData.rewardRate) *
                1000}{" "}
            points
          </p>
          <p>
            <strong>Role Rate:</strong> ${rewardData.rewardRate} per 1,000
            points
          </p>
        </div>

        <button
          onClick={claimReward}
          disabled={claiming}
          className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-all duration-200 ${
            claiming
              ? "cursor-not-allowed bg-gray-400"
              : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 active:scale-95"
          }`}
        >
          {claiming ? (
            <span className="flex items-center justify-center">
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              Claiming Reward...
            </span>
          ) : (
            `Claim $${rewardData.claimableAmount} Reward`
          )}
        </button>

        <div className="bg-blue-50 mt-4 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>Total Earned:</strong> ${rewardData.totalEarned}(
            {rewardData.totalTokensEarned} tokens)
          </p>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Rewards are sent as native tokens to your wallet address
        </p>
      </div>
    </div>
  );
};

export default RewardClaimButton;
