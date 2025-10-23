"use client";

import React from "react";
import { DollarSign, Coins, Award, Loader2 } from "lucide-react";

const RewardsStatistics = ({ statistics, loading = false }) => {
  const { totalRewardsUSD = 0, totalTokens = 0, count = 0 } = statistics;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-400 bg-gradient-dark p-4"
          >
            <div className="flex items-center justify-center gap-3 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-400 bg-gradient-dark p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-500/20 p-3">
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>

          <div>
            <p className="text-xs text-gray-400">Total Rewards (USD)</p>
            <p className="text-xl font-bold text-gray-100">
              ${parseFloat(totalRewardsUSD).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-400 bg-gradient-dark p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 rounded-full p-3">
            <Coins className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-gray-400">Total Tokens</p>
            <p className="text-xl font-bold text-gray-100">
              {parseFloat(totalTokens).toFixed(3)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-400 bg-gradient-dark p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-500/20 p-3">
            <Award className="h-5 w-5 text-purple-400" />
          </div>

          <div>
            <p className="text-xs text-gray-400">Total Claims</p>
            <p className="text-xl font-bold text-gray-100">{count}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsStatistics;
