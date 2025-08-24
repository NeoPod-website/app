// import React from "react";
// import {
//   Trophy,
//   TrendingUp,
//   Users,
//   Crown,
//   Shield,
//   ChevronUp,
//   Star,
// } from "lucide-react";

// const ProfileRightSidebar = ({ user, stats, onRefresh }) => {
//   const currentRole = user?.role_type || "initiate";

//   // Get role progression logic
//   const getRoleProgression = () => {
//     const totalPoints = user?.total_points || 0;
//     const previousMonthRank = stats?.previous_month?.role_specific?.rank;

//     switch (currentRole) {
//       case "initiate":
//         return {
//           canPromote: totalPoints >= 100,
//           nextRole: "operator",
//           requirement: "100 total points",
//           progress: Math.min((totalPoints / 100) * 100, 100),
//           message:
//             totalPoints >= 90
//               ? `So close! Just ${100 - totalPoints} more points to become an Operator.`
//               : totalPoints >= 30
//                 ? `Keep going! You have ${totalPoints} points - just ${100 - totalPoints} more to reach Operator.`
//                 : "Welcome! Start contributing to earn points and unlock the Operator tier.",
//         };

//       case "operator":
//         const canPromoteToSentinel =
//           previousMonthRank && previousMonthRank <= 10;
//         return {
//           canPromote: canPromoteToSentinel,
//           nextRole: "sentinel",
//           requirement: "Top 10 previous month ranking",
//           progress: canPromoteToSentinel
//             ? 100
//             : previousMonthRank
//               ? Math.max(100 - previousMonthRank * 10, 0)
//               : 0,
//           message: canPromoteToSentinel
//             ? "Excellent! You achieved top 10 last month. Ready for Sentinel promotion."
//             : previousMonthRank
//               ? `You ranked #${previousMonthRank} last month. Reach top 10 for Sentinel eligibility.`
//               : "Participate in monthly activities to earn a ranking for Sentinel consideration.",
//         };

//       case "sentinel":
//         return {
//           canPromote: false,
//           nextRole: "architect",
//           requirement: "Admin discretion",
//           progress: 100,
//           message:
//             "Sentinel to Architect promotions are handled manually by administrators based on exceptional contributions.",
//           isManualPromotion: true,
//         };

//       default:
//         return {
//           canPromote: false,
//           nextRole: null,
//           requirement: "Maximum tier reached",
//           progress: 100,
//           message:
//             "You've reached the highest tier. Continue your exceptional contributions!",
//         };
//     }
//   };

//   const roleProgression = getRoleProgression();

//   // Get rank display data
//   const getRankData = () => {
//     const currentMonth = stats?.current_month?.role_specific;
//     const allTime = stats?.all_time?.all_roles;

//     return {
//       currentMonthRank: currentMonth?.rank || "N/A",
//       currentMonthTotal: currentMonth?.total_in_category || "N/A",
//       allTimeRank: allTime?.rank || "N/A",
//       allTimeTotal: allTime?.total_in_category || "N/A",
//       rankChange: currentMonth?.rank_change || 0,
//     };
//   };

//   const rankData = getRankData();

//   const getRoleConfig = (role) => {
//     const configs = {
//       initiate: {
//         color: "text-gray-400",
//         icon: Users,
//         bgColor: "border-gray-500/30 bg-gray-500/10",
//       },
//       operator: {
//         color: "text-blue-400",
//         icon: Shield,
//         bgColor: "border-blue-500/30 bg-blue-500/10",
//       },
//       sentinel: {
//         color: "text-purple-400",
//         icon: Crown,
//         bgColor: "border-purple-500/30 bg-purple-500/10",
//       },
//       architect: {
//         color: "text-yellow-400",
//         icon: Star,
//         bgColor: "border-yellow-500/30 bg-yellow-500/10",
//       },
//     };
//     return configs[role] || configs.initiate;
//   };

//   const roleConfig = getRoleConfig(currentRole);
//   const RoleIcon = roleConfig.icon;

//   const getTierNumber = (role) => {
//     switch (role) {
//       case "initiate":
//         return "1";
//       case "operator":
//         return "2";
//       case "sentinel":
//         return "3";
//       case "architect":
//         return "4";
//       default:
//         return "1";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with Refresh */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-bold text-white">Rankings & Progress</h2>
//         <button
//           onClick={onRefresh}
//           className="rounded-lg border border-gray-400 bg-gradient-dark px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-opacity-80"
//         >
//           Refresh
//         </button>
//       </div>

//       {/* Current Role Card */}
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <div className="mb-4 flex items-center gap-3">
//           <RoleIcon className={`h-6 w-6 ${roleConfig.color}`} />
//           <div>
//             <h3 className="font-semibold text-white">
//               Tier {getTierNumber(currentRole)}:{" "}
//               {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
//             </h3>
//             <p className="text-sm text-gray-400">{roleProgression.message}</p>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Total Points</span>
//             <span className="font-medium text-white">
//               {(user?.total_points || 0).toLocaleString()} PODS
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Quests Completed</span>
//             <span className="font-medium text-white">
//               {user?.total_quests_completed || 0}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Valid Invites</span>
//             <span className="font-medium text-white">
//               {user?.valid_invite_count || 0}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Rankings Card */}
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <div className="mb-4 flex items-center gap-3">
//           <Trophy className="h-6 w-6 text-yellow-500" />
//           <h3 className="font-semibold text-white">Your Rankings</h3>
//         </div>

//         <div className="space-y-4">
//           {/* Current Month Rank */}
//           <div className="rounded-lg border border-gray-600 bg-black/20 p-4">
//             <div className="mb-2 flex items-center justify-between">
//               <span className="text-sm text-gray-300">
//                 This Month (Role-Specific)
//               </span>
//               {rankData.rankChange !== 0 && (
//                 <div
//                   className={`flex items-center gap-1 text-xs ${
//                     rankData.rankChange > 0 ? "text-red-400" : "text-green-400"
//                   }`}
//                 >
//                   <ChevronUp
//                     className={`h-3 w-3 ${rankData.rankChange > 0 ? "rotate-180" : ""}`}
//                   />
//                   {Math.abs(rankData.rankChange)}
//                 </div>
//               )}
//             </div>
//             <div className="flex items-baseline gap-2">
//               <span className="text-2xl font-bold text-white">
//                 #{rankData.currentMonthRank}
//               </span>
//               <span className="text-sm text-gray-400">
//                 of {rankData.currentMonthTotal}
//               </span>
//             </div>
//           </div>

//           {/* All Time Rank */}
//           <div className="rounded-lg border border-gray-600 bg-black/20 p-4">
//             <span className="text-sm text-gray-300">All Time (Overall)</span>
//             <div className="flex items-baseline gap-2">
//               <span className="text-2xl font-bold text-white">
//                 #{rankData.allTimeRank}
//               </span>
//               <span className="text-sm text-gray-400">
//                 of {rankData.allTimeTotal}
//               </span>
//             </div>
//           </div>

//           {/* Previous Month Rank if available */}
//           {stats?.previous_month?.role_specific && (
//             <div className="rounded-lg border border-gray-600 bg-black/20 p-4">
//               <span className="text-sm text-gray-300">Previous Month</span>
//               <div className="flex items-baseline gap-2">
//                 <span className="text-2xl font-bold text-white">
//                   #{stats.previous_month.role_specific.rank}
//                 </span>
//                 <span className="text-sm text-gray-400">
//                   ({stats.previous_month.role_specific.points} pts)
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Role Progression */}
//       {roleProgression.nextRole && (
//         <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//           <div className="mb-4 flex items-center gap-3">
//             <TrendingUp className="h-6 w-6 text-green-500" />
//             <h3 className="font-semibold text-white">Tier Progression</h3>
//           </div>

//           <div className={`rounded-lg border p-4 ${roleConfig.bgColor}`}>
//             <div className="mb-3 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 {React.createElement(
//                   getRoleConfig(roleProgression.nextRole).icon,
//                   {
//                     className: `h-5 w-5 ${getRoleConfig(roleProgression.nextRole).color}`,
//                   },
//                 )}
//                 <span
//                   className={`font-medium ${getRoleConfig(roleProgression.nextRole).color}`}
//                 >
//                   Next:{" "}
//                   {roleProgression.nextRole.charAt(0).toUpperCase() +
//                     roleProgression.nextRole.slice(1)}
//                 </span>
//               </div>
//             </div>

//             <p className="mb-3 text-sm text-gray-300">
//               Requirement: {roleProgression.requirement}
//             </p>

//             {/* Progress bar for initiate only */}
//             {currentRole === "initiate" && (
//               <div className="mb-3">
//                 <div className="mb-1 flex justify-between text-xs text-gray-400">
//                   <span>Progress</span>
//                   <span>{roleProgression.progress.toFixed(0)}%</span>
//                 </div>
//                 <div className="h-2 w-full rounded-full bg-gray-700">
//                   <div
//                     className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
//                     style={{ width: `${roleProgression.progress}%` }}
//                   />
//                 </div>
//               </div>
//             )}

//             {roleProgression.canPromote &&
//             !roleProgression.isManualPromotion ? (
//               <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-purple-700">
//                 Request Promotion
//               </button>
//             ) : roleProgression.isManualPromotion ? (
//               <div className="text-center text-xs text-gray-400">
//                 Manual promotion by admin required
//               </div>
//             ) : (
//               <div className="text-center text-xs text-gray-400">
//                 Keep contributing to unlock promotion
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Activity Summary */}
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <h3 className="mb-4 font-semibold text-white">This Month's Activity</h3>

//         <div className="space-y-3">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Monthly Points</span>
//             <span className="font-medium text-white">
//               {(user?.current_month_points || 0).toLocaleString()} PODS
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Monthly Quests</span>
//             <span className="font-medium text-white">
//               {user?.current_month_quests || 0}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Last Activity</span>
//             <span className="font-medium text-white">
//               {user?.last_quest_completed
//                 ? new Date(user.last_quest_completed).toLocaleDateString()
//                 : "No activity"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileRightSidebar;

// import React from "react";
// import { Trophy, TrendingUp, Users, Crown, Shield, Star } from "lucide-react";

// const ProfileRightSidebar = ({ user, stats, onRefresh }) => {
//   const currentRole = user?.role_type || "initiate";

//   // Get role progression logic
//   const getRoleProgression = () => {
//     const totalPoints = user?.total_points || 0;
//     const previousMonthRank = stats?.previous_month?.role_specific?.rank;
//     const currentMonthRank = stats?.current_month?.role_specific?.rank;

//     switch (currentRole) {
//       case "initiate":
//         return {
//           canPromote: totalPoints >= 100,
//           nextRole: "operator",
//           requirement: "100 total points",
//           progress: Math.min((totalPoints / 100) * 100, 100),
//           progressText: `${totalPoints} / 100`,
//           message:
//             totalPoints >= 90
//               ? `Keep going! You're ${totalPoints} points closer to becoming an Operator. Every contribution counts!`
//               : totalPoints >= 30
//                 ? `Keep going! You have ${totalPoints} points - just ${100 - totalPoints} more to reach Operator.`
//                 : "Keep going! You're 100 points closer to becoming an Operator. Every contribution counts!",
//         };

//       case "operator":
//         const canPromoteToSentinel =
//           previousMonthRank && previousMonthRank <= 10;
//         // For operators, show ranking progress toward top 10
//         let rankProgress = 0;
//         let progressText = "No rank yet";

//         if (currentMonthRank) {
//           if (currentMonthRank <= 10) {
//             rankProgress = 100;
//             progressText = `Top 10 (Rank #${currentMonthRank})`;
//           } else {
//             // Calculate progress from current rank to rank 10
//             // If someone is rank 50, they're 40 positions away from rank 10
//             const distanceFromTop10 = currentMonthRank - 10;
//             const maxDistance = 40; // Assume max reasonable distance is 40 ranks
//             rankProgress = Math.max(
//               0,
//               100 - (distanceFromTop10 / maxDistance) * 100,
//             );
//             progressText = `Rank #${currentMonthRank} (Need top 10)`;
//           }
//         }

//         return {
//           canPromote: canPromoteToSentinel,
//           nextRole: "sentinel",
//           requirement: "Top 10 previous month ranking",
//           progress: rankProgress,
//           progressText: progressText,
//           message: canPromoteToSentinel
//             ? "Top performance! You achieved top 10 last month and earned Sentinel eligibility."
//             : previousMonthRank
//               ? `Previous month rank: #${previousMonthRank}. Reach top 10 monthly ranking for Sentinel promotion.`
//               : "Build consistent monthly performance to unlock Sentinel tier advancement.",
//         };

//       case "sentinel":
//         return {
//           canPromote: false,
//           nextRole: "architect",
//           requirement: "Admin discretion",
//           progress: 100,
//           progressText: "Elite tier",
//           message:
//             "Elite tier achieved! Architect promotions are reserved for exceptional long-term contributors.",
//           isManualPromotion: true,
//         };

//       default:
//         return {
//           canPromote: false,
//           nextRole: null,
//           requirement: "Maximum tier reached",
//           progress: 100,
//           progressText: "Max tier",
//           message:
//             "You've reached the highest tier. Continue your exceptional contributions!",
//         };
//     }
//   };

//   const roleProgression = getRoleProgression();

//   const getRoleConfig = (role) => {
//     const configs = {
//       initiate: {
//         color: "text-gray-400",
//         icon: Users,
//         bgColor: "border-gray-500/30 bg-gray-500/10",
//         tierColor: "from-gray-400 to-gray-600",
//       },
//       operator: {
//         color: "text-blue-400",
//         icon: Shield,
//         bgColor: "border-blue-500/30 bg-blue-500/10",
//         tierColor: "from-blue-400 to-blue-600",
//       },
//       sentinel: {
//         color: "text-purple-400",
//         icon: Crown,
//         bgColor: "border-purple-500/30 bg-purple-500/10",
//         tierColor: "from-purple-400 to-purple-600",
//       },
//       architect: {
//         color: "text-yellow-400",
//         icon: Star,
//         bgColor: "border-yellow-500/30 bg-yellow-500/10",
//         tierColor: "from-yellow-400 to-yellow-600",
//       },
//     };
//     return configs[role] || configs.initiate;
//   };

//   const roleConfig = getRoleConfig(currentRole);
//   const RoleIcon = roleConfig.icon;

//   const getTierNumber = (role) => {
//     switch (role) {
//       case "initiate":
//         return "1";
//       case "operator":
//         return "2";
//       case "sentinel":
//         return "3";
//       case "architect":
//         return "4";
//       default:
//         return "1";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with Refresh */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-bold text-white">Progress & Rankings</h2>
//         <button
//           onClick={onRefresh}
//           className="rounded-lg border border-gray-400 bg-gradient-dark px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-opacity-80"
//         >
//           Refresh
//         </button>
//       </div>

//       {/* Tier Progress Card */}
//       <div className="rounded-xl border border-gray-400 bg-gradient-dark p-6">
//         <div className="flex items-start gap-4">
//           {/* Profile Avatar with Tier Badge */}
//           <div className="relative">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600">
//               <RoleIcon className={`h-8 w-8 ${roleConfig.color}`} />
//             </div>
//             <div className="absolute -bottom-1 -right-1 rounded-full bg-black p-1">
//               <div
//                 className={`h-6 w-6 rounded-full bg-gradient-to-r ${roleConfig.tierColor} flex items-center justify-center`}
//               >
//                 <span className="text-xs font-bold text-white">
//                   {getTierNumber(currentRole)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Tier Info */}
//           <div className="flex-1">
//             <h3 className="mb-1 text-lg font-bold text-white">
//               Tier {getTierNumber(currentRole)}:{" "}
//               {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
//             </h3>

//             {/* Progress Info */}
//             <div className="mb-2 flex items-center justify-between text-sm text-gray-300">
//               <span>Progress</span>
//               <span>{roleProgression.progressText}</span>
//             </div>

//             {/* Progress Bar */}
//             <div className="mb-3 h-2 w-full rounded-full bg-gray-700">
//               <div
//                 className={`h-2 rounded-full bg-gradient-to-r ${roleConfig.tierColor} transition-all duration-300`}
//                 style={{ width: `${roleProgression.progress}%` }}
//               />
//             </div>

//             {/* Message */}
//             <p className="text-sm text-gray-300">{roleProgression.message}</p>
//           </div>
//         </div>
//       </div>

//       {/* Statistics Grid */}
//       <div className="grid grid-cols-2 gap-4">
//         {/* Total Points */}
//         <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
//           <h4 className="mb-1 text-sm text-gray-400">Total Points</h4>
//           <p className="text-3xl font-bold text-white">
//             {user?.total_points || 0}
//           </p>
//         </div>

//         {/* Total Quests */}
//         <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
//           <h4 className="mb-1 text-sm text-gray-400">Total Quests</h4>
//           <p className="text-3xl font-bold text-white">
//             {user?.total_quests_completed || 0}
//           </p>
//         </div>

//         {/* Monthly Points */}
//         <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
//           <h4 className="mb-1 text-sm text-gray-400">Monthly Points</h4>
//           <p className="text-3xl font-bold text-blue-400">
//             {user?.current_month_points || 0}
//           </p>
//         </div>

//         {/* Monthly Quests */}
//         <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
//           <h4 className="mb-1 text-sm text-gray-400">Monthly Quests</h4>
//           <p className="text-3xl font-bold text-blue-400">
//             {user?.current_month_quests || 0}
//           </p>
//         </div>
//       </div>

//       {/* Rankings Card */}
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <div className="mb-4 flex items-center gap-3">
//           <Trophy className="h-5 w-5 text-yellow-500" />
//           <h3 className="font-semibold text-white">Your Rankings</h3>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="text-center">
//             <p className="mb-1 text-xs text-gray-400">This Month</p>
//             <p className="text-xl font-bold text-white">
//               #{stats?.current_month?.role_specific?.rank || "N/A"}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="mb-1 text-xs text-gray-400">All Time</p>
//             <p className="text-xl font-bold text-white">
//               #{stats?.all_time?.all_roles?.rank || "N/A"}
//             </p>
//           </div>
//         </div>

//         {/* Previous Month Rank if available */}
//         {stats?.previous_month?.role_specific && (
//           <div className="mt-4 border-t border-gray-600 pt-4">
//             <div className="text-center">
//               <p className="mb-1 text-xs text-gray-400">Previous Month</p>
//               <p className="text-lg font-bold text-white">
//                 #{stats.previous_month.role_specific.rank}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {stats.previous_month.role_specific.points} points
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Promotion Section */}
//       {roleProgression.nextRole && !roleProgression.isManualPromotion && (
//         <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//           <div className="mb-4 flex items-center gap-3">
//             <TrendingUp className="h-5 w-5 text-green-500" />
//             <h3 className="font-semibold text-white">Tier Advancement</h3>
//           </div>

//           <div className={`rounded-lg border p-4 ${roleConfig.bgColor}`}>
//             <div className="mb-2 flex items-center gap-2">
//               {React.createElement(
//                 getRoleConfig(roleProgression.nextRole).icon,
//                 {
//                   className: `h-5 w-5 ${getRoleConfig(roleProgression.nextRole).color}`,
//                 },
//               )}
//               <span
//                 className={`font-medium ${getRoleConfig(roleProgression.nextRole).color}`}
//               >
//                 Next:{" "}
//                 {roleProgression.nextRole.charAt(0).toUpperCase() +
//                   roleProgression.nextRole.slice(1)}
//               </span>
//             </div>

//             <p className="mb-3 text-xs text-gray-400">
//               Requirement: {roleProgression.requirement}
//             </p>

//             {roleProgression.canPromote ? (
//               <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-purple-700">
//                 Request Promotion
//               </button>
//             ) : (
//               <div className="py-2 text-center text-xs text-gray-400">
//                 Continue contributing to unlock promotion
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Quick Info */}
//       <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
//         <h3 className="mb-4 font-semibold text-white">Quick Info</h3>

//         <div className="space-y-3">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Valid Invites</span>
//             <span className="font-medium text-white">
//               {user?.valid_invite_count || 0}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Member Since</span>
//             <span className="font-medium text-white">
//               {user?.joining_date
//                 ? new Date(user.joining_date).toLocaleDateString("en-US", {
//                     month: "short",
//                     year: "numeric",
//                   })
//                 : "Unknown"}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-400">Last Active</span>
//             <span className="font-medium text-white">
//               {user?.last_quest_completed
//                 ? new Date(user.last_quest_completed).toLocaleDateString()
//                 : "No activity"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileRightSidebar;

import React from "react";

import RankingsCard from "@/components/layout/profile/right/RankingsCard";
import PromotionCard from "@/components/layout/profile/right/PromotionCard";
import QuickInfoCard from "@/components/layout/profile/right/QuickInfoCard";
import StatisticsGrid from "@/components/layout/profile/right/StatisticsGrid";
import TierProgressCard from "@/components/layout/profile/right/TierProgressCard";
import RefreshTokenBtn from "@/components/ui/buttons/profile/RefreshTokenBtn";

const ProfileRightSidebar = ({ user, stats }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Progress & Rankings</h2>

        <RefreshTokenBtn />
      </div>

      <TierProgressCard user={user} stats={stats} />
      <StatisticsGrid user={user} />
      <RankingsCard stats={stats} />
      <PromotionCard user={user} stats={stats} />
      <QuickInfoCard user={user} />
    </div>
  );
};

export default ProfileRightSidebar;
