// "use client";

// import {
//   LinkIcon,
//   StarIcon,
//   UsersIcon,
//   ShieldIcon,
//   CalendarIcon,
//   ArrowRightIcon,
//   CheckCircleIcon,
// } from "lucide-react";
// import React from "react";
// import Image from "next/image";
// import { Card, CardBody, Button, Chip } from "@heroui/react";

// const SocialPlatformsList = ({
//   platforms,
//   verifications,
//   onStartVerification,
// }) => {
//   const getPlatformStatus = (platformKey) => {
//     const verification = verifications[platformKey];

//     if (verification?.verified) {
//       return { status: "verified", text: "Verified", color: "success" };
//     }

//     return { status: "unverified", text: "Not Connected", color: "default" };
//   };

//   const getRequirementIcon = (requirement) => {
//     if (
//       requirement.includes("followers") ||
//       requirement.includes("subscribers") ||
//       requirement.includes("connections")
//     ) {
//       return UsersIcon;
//     }
//     if (requirement.includes("age") || requirement.includes("days")) {
//       return CalendarIcon;
//     }
//     if (requirement.includes("verified") || requirement.includes("email")) {
//       return ShieldIcon;
//     }
//     return StarIcon;
//   };

//   const formatRequirements = (verification) => {
//     const requirements = [];

//     if (verification.minFollowers) {
//       requirements.push(`${verification.minFollowers}+ followers`);
//     }
//     if (verification.minSubscribers) {
//       requirements.push(`${verification.minSubscribers}+ subscribers`);
//     }
//     if (verification.minConnections) {
//       requirements.push(`${verification.minConnections}+ connections`);
//     }
//     if (verification.minAccountAge) {
//       requirements.push(`${verification.minAccountAge}+ days old`);
//     }
//     if (verification.minChannelAge) {
//       requirements.push(`${verification.minChannelAge}+ days old channel`);
//     }
//     if (verification.minVideos) {
//       requirements.push(`${verification.minVideos}+ videos`);
//     }
//     if (verification.minPosts) {
//       requirements.push(`${verification.minPosts}+ posts`);
//     }
//     if (verification.minServerCount) {
//       requirements.push(`${verification.minServerCount}+ servers`);
//     }
//     if (verification.requiresVerifiedEmail) {
//       requirements.push("Verified email");
//     }
//     if (verification.requiresUsername) {
//       requirements.push("Public username");
//     }
//     if (verification.requiresCompletedProfile) {
//       requirements.push("Complete profile");
//     }
//     if (verification.requiresBusinessAccount) {
//       requirements.push("Business account");
//     }

//     return requirements;
//   };

//   const getPriorityLevel = (platformKey) => {
//     const priorities = {
//       twitter: {
//         level: "High",
//         color: "danger",
//         description: "Essential for crypto ambassadors",
//       },
//       discord: {
//         level: "High",
//         color: "warning",
//         description: "Community engagement",
//       },
//       telegram: {
//         level: "Medium",
//         color: "primary",
//         description: "Crypto community reach",
//       },
//       linkedin: {
//         level: "Medium",
//         color: "secondary",
//         description: "Professional networking",
//       },
//       youtube: {
//         level: "Low",
//         color: "default",
//         description: "Content creation",
//       },
//       instagram: {
//         level: "Low",
//         color: "default",
//         description: "Visual content",
//       },
//     };
//     return (
//       priorities[platformKey] || {
//         level: "Low",
//         color: "default",
//         description: "Additional reach",
//       }
//     );
//   };

//   return (
//     <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//       <CardBody className="p-6">
//         <div className="mb-6 flex items-center gap-2">
//           <LinkIcon size={20} className="text-blue-400" />
//           <h3 className="text-lg font-semibold text-white">
//             Available Platforms
//           </h3>
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           {Object.entries(platforms).map(([platformKey, platform]) => {
//             const platformStatus = getPlatformStatus(platformKey);
//             const requirements = formatRequirements(platform.verification);
//             const priority = getPriorityLevel(platformKey);
//             const isVerified = platformStatus.status === "verified";

//             return (
//               <Card
//                 key={platformKey}
//                 className={`border transition-all ${platform.borderColor} bg-gradient-to-br ${platform.gradientFrom} ${platform.gradientTo} ${
//                   isVerified ? "opacity-75" : "hover:border-opacity-100"
//                 }`}
//               >
//                 <CardBody className="p-6">
//                   <div className="space-y-4">
//                     {/* Platform Header */}
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.color}/20`}
//                         >
//                           <Image
//                             width={24}
//                             height={24}
//                             src={platform.icon}
//                             alt={platform.name}
//                             className="rounded"
//                           />
//                         </div>
//                         <div>
//                           <h4 className="text-lg font-bold text-white">
//                             {platform.name}
//                           </h4>
//                           <div className="flex items-center gap-2">
//                             <Chip
//                               color={platformStatus.color}
//                               variant="flat"
//                               size="sm"
//                               startContent={
//                                 isVerified ? (
//                                   <CheckCircleIcon size={12} />
//                                 ) : null
//                               }
//                             >
//                               {platformStatus.text}
//                             </Chip>
//                             <Chip
//                               color={priority.color}
//                               variant="dot"
//                               size="sm"
//                             >
//                               {priority.level} Priority
//                             </Chip>
//                           </div>
//                         </div>
//                       </div>

//                       {!isVerified && (
//                         <Button
//                           color="primary"
//                           variant="flat"
//                           size="sm"
//                           endContent={<ArrowRightIcon size={16} />}
//                           onClick={() => onStartVerification(platformKey)}
//                         >
//                           Connect
//                         </Button>
//                       )}

//                       {isVerified && (
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/20">
//                           <CheckCircleIcon
//                             size={20}
//                             className="text-green-400"
//                           />
//                         </div>
//                       )}
//                     </div>

//                     {/* Description */}
//                     <p className="text-sm text-gray-300">
//                       {platform.description}
//                     </p>

//                     {/* Priority Info */}
//                     <div className="rounded-lg bg-gray-800/50 p-3">
//                       <p className="mb-1 text-xs text-gray-400">
//                         Why connect this platform?
//                       </p>
//                       <p className="text-sm text-gray-200">
//                         {priority.description}
//                       </p>
//                     </div>

//                     {/* Requirements */}
//                     {requirements.length > 0 && (
//                       <div className="space-y-2">
//                         <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
//                           Verification Requirements
//                         </p>
//                         <div className="grid grid-cols-1 gap-1">
//                           {requirements
//                             .slice(0, 3)
//                             .map((requirement, index) => {
//                               const RequirementIcon =
//                                 getRequirementIcon(requirement);
//                               return (
//                                 <div
//                                   key={index}
//                                   className="flex items-center gap-2 text-sm text-gray-300"
//                                 >
//                                   <RequirementIcon
//                                     size={14}
//                                     className="text-gray-400"
//                                   />
//                                   <span>{requirement}</span>
//                                 </div>
//                               );
//                             })}
//                           {requirements.length > 3 && (
//                             <p className="mt-1 text-xs text-gray-500">
//                               +{requirements.length - 3} more requirements
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* Scopes Info */}
//                     <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-3">
//                       <p className="mb-2 text-xs font-medium text-gray-400">
//                         Permissions Requested
//                       </p>
//                       <div className="flex flex-wrap gap-1">
//                         {platform.requiredScopes.map((scope, index) => (
//                           <Chip
//                             key={index}
//                             size="sm"
//                             variant="bordered"
//                             className="text-xs"
//                           >
//                             {scope}
//                           </Chip>
//                         ))}
//                       </div>
//                       <p className="mt-2 text-xs text-gray-500">
//                         Read-only access • No posting permissions • Secure OAuth
//                         flow
//                       </p>
//                     </div>

//                     {/* Verified Account Info */}
//                     {isVerified && (
//                       <div className="rounded-lg border border-green-500/20 bg-green-900/20 p-3">
//                         <div className="mb-2 flex items-center gap-2">
//                           <CheckCircleIcon
//                             size={16}
//                             className="text-green-400"
//                           />
//                           <p className="text-sm font-medium text-green-400">
//                             Successfully Verified
//                           </p>
//                         </div>
//                         <p className="text-xs text-gray-300">
//                           This account is connected and verified. You can view
//                           details in the connected accounts section above.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </CardBody>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Help Section */}
//         <div className="mt-8 rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6">
//           <div className="flex items-start gap-3">
//             <div className="bg-blue-600/20 flex h-8 w-8 items-center justify-center rounded-full">
//               <ShieldIcon size={16} className="text-blue-400" />
//             </div>
//             <div>
//               <h4 className="mb-2 font-medium text-blue-400">
//                 Verification Process
//               </h4>
//               <div className="space-y-2 text-sm text-gray-300">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
//                   <span>Click "Connect" to start OAuth verification</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
//                   <span>Authorize read-only access to your profile</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
//                   <span>We verify your account meets requirements</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
//                   <span>
//                     Account data is securely stored and linked to your profile
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default SocialPlatformsList;

"use client";

import {
  LinkIcon,
  StarIcon,
  UsersIcon,
  ShieldIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";
import Image from "next/image";
import { Card, CardBody, Button, Chip } from "@heroui/react";

const SocialPlatformsList = ({ platforms, onStartVerification }) => {
  const getPlatformStatus = (platform) => {
    if (platform.connected) {
      return { status: "verified", text: "Connected", color: "success" };
    }
    return { status: "unverified", text: "Not Connected", color: "default" };
  };

  const getRequirementIcon = (requirement) => {
    if (
      requirement.includes("followers") ||
      requirement.includes("subscribers") ||
      requirement.includes("connections") ||
      requirement.includes("servers")
    ) {
      return UsersIcon;
    }
    if (requirement.includes("age") || requirement.includes("days")) {
      return CalendarIcon;
    }
    if (requirement.includes("verified") || requirement.includes("email")) {
      return ShieldIcon;
    }
    return StarIcon;
  };

  const formatRequirements = (verification) => {
    const requirements = [];

    if (verification.minFollowers) {
      requirements.push(`${verification.minFollowers}+ followers`);
    }
    if (verification.minSubscribers) {
      requirements.push(`${verification.minSubscribers}+ subscribers`);
    }
    if (verification.minConnections) {
      requirements.push(`${verification.minConnections}+ connections`);
    }
    if (verification.minAccountAge) {
      requirements.push(`${verification.minAccountAge}+ days old`);
    }
    if (verification.minChannelAge) {
      requirements.push(`${verification.minChannelAge}+ days old channel`);
    }
    if (verification.minVideos) {
      requirements.push(`${verification.minVideos}+ videos`);
    }
    if (verification.minPosts) {
      requirements.push(`${verification.minPosts}+ posts`);
    }
    if (verification.minServerCount) {
      requirements.push(`${verification.minServerCount}+ servers`);
    }
    if (verification.requiresVerifiedEmail) {
      requirements.push("Verified email");
    }
    if (verification.requiresUsername) {
      requirements.push("Public username");
    }
    if (verification.requiresCompletedProfile) {
      requirements.push("Complete profile");
    }
    if (verification.requiresBusinessAccount) {
      requirements.push("Business account");
    }

    return requirements;
  };

  const getPriorityLevel = (platformKey) => {
    const priorities = {
      discord: {
        level: "High",
        color: "warning",
        description: "Community engagement & verification",
      },
      twitter: {
        level: "High",
        color: "danger",
        description: "Essential for crypto ambassadors",
      },
      telegram: {
        level: "Medium",
        color: "primary",
        description: "Crypto community reach",
      },
      linkedin: {
        level: "Medium",
        color: "secondary",
        description: "Professional networking",
      },
      youtube: {
        level: "Low",
        color: "default",
        description: "Content creation",
      },
      instagram: {
        level: "Low",
        color: "default",
        description: "Visual content",
      },
    };
    return (
      priorities[platformKey] || {
        level: "Low",
        color: "default",
        description: "Additional reach",
      }
    );
  };

  return (
    <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
      <CardBody className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <LinkIcon size={20} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Available Platforms
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Object.entries(platforms).map(([platformKey, platform]) => {
            const platformStatus = getPlatformStatus(platform);
            const requirements = formatRequirements(platform.verification);
            const priority = getPriorityLevel(platformKey);
            const isConnected = platformStatus.status === "verified";

            return (
              <Card
                key={platformKey}
                className={`border transition-all ${platform.borderColor} bg-gradient-to-br ${platform.gradientFrom} ${platform.gradientTo} ${
                  isConnected ? "opacity-75" : "hover:border-opacity-100"
                }`}
              >
                <CardBody className="p-6">
                  <div className="space-y-4">
                    {/* Platform Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.color}/20`}
                        >
                          <Image
                            width={24}
                            height={24}
                            src={platform.icon}
                            alt={platform.name}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">
                            {platform.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Chip
                              color={platformStatus.color}
                              variant="flat"
                              size="sm"
                              startContent={
                                isConnected ? (
                                  <CheckCircleIcon size={12} />
                                ) : null
                              }
                            >
                              {platformStatus.text}
                            </Chip>
                            <Chip
                              color={priority.color}
                              variant="dot"
                              size="sm"
                            >
                              {priority.level} Priority
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {!isConnected && (
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          endContent={<ArrowRightIcon size={16} />}
                          onClick={() => onStartVerification(platformKey)}
                        >
                          Connect
                        </Button>
                      )}

                      {isConnected && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/20">
                          <CheckCircleIcon
                            size={20}
                            className="text-green-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300">
                      {platform.description}
                    </p>

                    {/* Priority Info */}
                    <div className="rounded-lg bg-gray-800/50 p-3">
                      <p className="mb-1 text-xs text-gray-400">
                        Why connect this platform?
                      </p>
                      <p className="text-sm text-gray-200">
                        {priority.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    {requirements.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                          Verification Requirements
                        </p>
                        <div className="grid grid-cols-1 gap-1">
                          {requirements
                            .slice(0, 3)
                            .map((requirement, index) => {
                              const RequirementIcon =
                                getRequirementIcon(requirement);
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm text-gray-300"
                                >
                                  <RequirementIcon
                                    size={14}
                                    className="text-gray-400"
                                  />
                                  <span>{requirement}</span>
                                </div>
                              );
                            })}
                          {requirements.length > 3 && (
                            <p className="mt-1 text-xs text-gray-500">
                              +{requirements.length - 3} more requirements
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Scopes Info */}
                    <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-3">
                      <p className="mb-2 text-xs font-medium text-gray-400">
                        Permissions Requested
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {platform.requiredScopes.map((scope, index) => (
                          <Chip
                            key={index}
                            size="sm"
                            variant="bordered"
                            className="text-xs"
                          >
                            {scope}
                          </Chip>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Read-only access • No posting permissions • Secure OAuth
                        flow
                      </p>
                    </div>

                    {/* Connected Account Info */}
                    {isConnected && (
                      <div className="rounded-lg border border-green-500/20 bg-green-900/20 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <CheckCircleIcon
                            size={16}
                            className="text-green-400"
                          />
                          <p className="text-sm font-medium text-green-400">
                            Successfully Connected
                          </p>
                        </div>
                        <div className="space-y-1 text-xs text-gray-300">
                          <p>Connected as: {platform.value}</p>
                          <p>Platform: {platform.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600/20 flex h-8 w-8 items-center justify-center rounded-full">
              <ShieldIcon size={16} className="text-blue-400" />
            </div>
            <div>
              <h4 className="mb-2 font-medium text-blue-400">
                Verification Process
              </h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-400 h-1.5 w-1.5 rounded-full"></div>
                  <span>
                    Account data is securely stored and linked to your profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SocialPlatformsList;
