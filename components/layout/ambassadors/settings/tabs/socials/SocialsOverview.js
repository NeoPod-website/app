// "use client";

// import {
//   EyeIcon,
//   Users2Icon,
//   RefreshCwIcon,
//   TrendingUpIcon,
//   ShieldCheckIcon,
// } from "lucide-react";
// import React from "react";
// import { Card, CardBody, Button, Chip } from "@heroui/react";

// const SocialsOverview = ({
//   onRefresh,
//   totalReach,
//   lastUpdated,
//   totalPlatforms,
//   verificationCount,
//   isRefreshing = false,
// }) => {
//   const formatNumber = (num) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + "M";
//     }

//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + "K";
//     }

//     return num.toString();
//   };

//   const getVerificationStatus = () => {
//     if (verificationCount === 0) {
//       return { color: "warning", text: "No Verifications", icon: Users2Icon };
//     }

//     if (verificationCount < 3) {
//       return {
//         color: "primary",
//         text: "Basic Verification",
//         icon: ShieldCheckIcon,
//       };
//     }

//     if (verificationCount < 5) {
//       return {
//         color: "success",
//         text: "Advanced Verification",
//         icon: ShieldCheckIcon,
//       };
//     }

//     return {
//       color: "success",
//       text: "Full Verification",
//       icon: ShieldCheckIcon,
//     };
//   };

//   const verificationStatus = getVerificationStatus();
//   const StatusIcon = verificationStatus.icon;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="mb-2 flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
//             <Users2Icon size={24} className="text-purple-400" />
//           </div>

//           <div>
//             <h2 className="text-2xl font-bold text-white">
//               Social Verifications
//             </h2>

//             <div className="flex items-center gap-2">
//               <Chip
//                 size="sm"
//                 variant="flat"
//                 color={verificationStatus.color}
//                 startContent={<StatusIcon size={12} />}
//               >
//                 {verificationStatus.text}
//               </Chip>

//               {lastUpdated && (
//                 <span className="text-xs text-gray-100">
//                   Updated {lastUpdated.toLocaleTimeString()}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             size="sm"
//             variant="flat"
//             onPress={onRefresh}
//             isLoading={isRefreshing}
//             startContent={<RefreshCwIcon size={16} />}
//           >
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//         <Card className="border border-green-500/20 bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-xl">
//           <CardBody className="p-6">
//             <div className="mb-4 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600/20">
//                   <EyeIcon size={20} className="text-green-400" />
//                 </div>

//                 <h3 className="text-sm font-medium text-white">Total Reach</h3>
//               </div>

//               <TrendingUpIcon size={16} className="text-green-400" />
//             </div>

//             <div className="text-center">
//               <div className="mb-1 text-3xl font-bold text-white">
//                 {formatNumber(totalReach)}
//               </div>

//               <p className="text-sm text-gray-200">Combined followers</p>
//             </div>
//           </CardBody>
//         </Card>

//         <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl">
//           <CardBody className="p-6">
//             <div className="mb-4 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20">
//                   <ShieldCheckIcon size={20} className="text-purple-400" />
//                 </div>

//                 <h3 className="text-sm font-medium text-white">Verified</h3>
//               </div>

//               <div className="text-sm text-purple-400">
//                 {Math.round((verificationCount / totalPlatforms) * 100)}%
//               </div>
//             </div>

//             <div className="text-center">
//               <div className="mb-1 text-3xl font-bold text-white">
//                 {verificationCount}
//               </div>

//               <p className="text-sm text-gray-200">
//                 of {totalPlatforms} platforms
//               </p>
//             </div>
//           </CardBody>
//         </Card>

//         <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
//           <CardBody className="p-6">
//             <div className="mb-4 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="bg-blue-600/20 flex h-10 w-10 items-center justify-center rounded-xl">
//                   <Users2Icon size={20} className="text-blue-400" />
//                 </div>

//                 <h3 className="text-sm font-medium text-white">Progress</h3>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-200">Completion</span>

//                 <span className="font-medium text-white">
//                   {Math.round((verificationCount / totalPlatforms) * 100)}%
//                 </span>
//               </div>

//               <div className="h-2 w-full rounded-full bg-gray-700">
//                 <div
//                   className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500"
//                   style={{
//                     width: `${(verificationCount / totalPlatforms) * 100}%`,
//                   }}
//                 ></div>
//               </div>

//               <p className="text-xs text-gray-300">
//                 {totalPlatforms - verificationCount} platforms remaining
//               </p>
//             </div>
//           </CardBody>
//         </Card>
//       </div>

//       {verificationCount > 0 && (
//         <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
//           <CardBody className="p-6">
//             <div className="flex items-start gap-3">
//               <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600/20">
//                 <TrendingUpIcon size={16} className="text-yellow-400" />
//               </div>

//               <div>
//                 <h4 className="mb-2 font-medium text-yellow-400">
//                   Ambassador Benefits
//                 </h4>

//                 <div className="grid grid-cols-1 gap-3 text-sm text-gray-200 md:grid-cols-2">
//                   <div className="flex items-center gap-2">
//                     <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                     <span>Higher reward tiers unlocked</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
//                     <span>Exclusive campaign access</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="h-2 w-2 rounded-full bg-purple-500"></div>
//                     <span>Priority support and updates</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="h-2 w-2 rounded-full bg-teal-500"></div>
//                     <span>Advanced analytics dashboard</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SocialsOverview;

"use client";

import {
  ShieldIcon,
  Users2Icon,
  RefreshCwIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";

const SocialsOverview = ({
  onRefresh,
  platforms,
  lastUpdated,
  totalPlatforms,
  verificationCount,
  isRefreshing = false,
}) => {
  const getVerificationStatus = () => {
    if (verificationCount === 0) {
      return { color: "warning", text: "No Verifications", icon: Users2Icon };
    }

    if (verificationCount < 2) {
      return {
        color: "primary",
        text: "Basic Verification",
        icon: ShieldCheckIcon,
      };
    }

    if (verificationCount < 3) {
      return {
        color: "success",
        text: "Advanced Verification",
        icon: ShieldCheckIcon,
      };
    }

    return {
      color: "success",
      text: "Full Verification",
      icon: ShieldCheckIcon,
    };
  };

  // Calculate verification score based on platform priority
  const calculateVerificationScore = () => {
    if (verificationCount === 0) return 0;

    const platformPriorities = {
      discord: 35, // High priority for community
      twitter: 35, // High priority for social reach
      telegram: 30, // Medium priority for crypto community
    };

    let score = 0;
    Object.entries(platforms).forEach(([key, platform]) => {
      if (platform.connected) {
        score += platformPriorities[key] || 20;
      }
    });

    return Math.min(100, score); // Cap at 100
  };

  // Get connected platform names for display
  const getConnectedPlatforms = () => {
    return Object.entries(platforms)
      .filter(([_, platform]) => platform.connected)
      .map(([_, platform]) => platform.name);
  };

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;
  const verificationScore = calculateVerificationScore();
  const connectedPlatforms = getConnectedPlatforms();

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
            <Users2Icon size={24} className="text-purple-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Social Verifications
            </h2>

            <div className="flex items-center gap-2">
              <Chip
                size="sm"
                variant="flat"
                color={verificationStatus.color}
                startContent={<StatusIcon size={12} />}
              >
                {verificationStatus.text}
              </Chip>

              {lastUpdated && (
                <span className="text-xs text-gray-100">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            onPress={onRefresh}
            isLoading={isRefreshing}
            startContent={<RefreshCwIcon size={16} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border border-green-500/20 bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600/20">
                  <ShieldIcon size={20} className="text-green-400" />
                </div>

                <h3 className="text-sm font-medium text-white">
                  Verification Score
                </h3>
              </div>

              <TrendingUpIcon size={16} className="text-green-400" />
            </div>

            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white">
                {verificationScore}
              </div>

              <p className="text-sm text-gray-200">Security Rating</p>

              {verificationScore > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full rounded-full bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-500"
                      style={{ width: `${verificationScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20">
                  <CheckCircleIcon size={20} className="text-purple-400" />
                </div>

                <h3 className="text-sm font-medium text-white">Connected</h3>
              </div>

              <div className="text-sm text-purple-400">
                {Math.round((verificationCount / totalPlatforms) * 100)}%
              </div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white">
                {verificationCount}
              </div>

              <p className="text-sm text-gray-200">
                of {totalPlatforms} platforms
              </p>

              {connectedPlatforms.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {connectedPlatforms.map((platformName, index) => (
                    <Chip
                      key={index}
                      size="sm"
                      variant="flat"
                      color="success"
                      className="text-xs"
                    >
                      {platformName}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600/20 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Users2Icon size={20} className="text-blue-400" />
                </div>

                <h3 className="text-sm font-medium text-white">Progress</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-200">Completion</span>

                <span className="font-medium text-white">
                  {Math.round((verificationCount / totalPlatforms) * 100)}%
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-gray-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500"
                  style={{
                    width: `${(verificationCount / totalPlatforms) * 100}%`,
                  }}
                ></div>
              </div>

              <p className="text-xs text-gray-300">
                {totalPlatforms - verificationCount === 0
                  ? "All platforms connected!"
                  : `${totalPlatforms - verificationCount} platforms remaining`}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {verificationCount > 0 && (
        <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600/20">
                <TrendingUpIcon size={16} className="text-yellow-400" />
              </div>

              <div className="flex flex-1 items-start justify-between">
                <div>
                  <h4 className="mb-3 font-medium text-yellow-400">
                    Ambassador Benefits Unlocked
                  </h4>

                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-200 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Enhanced verification status</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                      <span>Access to exclusive quests</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span>Higher reward multipliers</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                      <span>Priority community access</span>
                    </div>
                  </div>
                </div>

                {verificationScore >= 70 && (
                  <div className="rounded-lg border border-green-500/30 bg-green-900/20 p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon size={16} className="text-green-400" />

                      <span className="text-sm font-medium text-green-400">
                        Premium Ambassador Status Achieved!
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-200">
                      You've unlocked the highest tier of ambassador benefits
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SocialsOverview;
