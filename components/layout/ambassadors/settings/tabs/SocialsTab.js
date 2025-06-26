// "use client";

// import { Spinner } from "@heroui/react";
// import { Users2Icon } from "lucide-react";
// import React, { useState, useEffect } from "react";

// // Import social sub-components
// import SocialsOverview from "./socials/SocialsOverview";
// import SocialPlatformsList from "./socials/SocialPlatformsList";
// import SocialConnectedState from "./socials/SocialConnectedState";
// import SocialVerificationFlow from "./socials/SocialVerificationFlow";

// const SocialsTab = ({}) => {
//   const [socialState, setSocialState] = useState({
//     error: null,
//     totalReach: 0,
//     isLoading: true,
//     lastUpdated: null,
//     verifications: {},
//     verificationCount: 0,
//   });

//   const [activeVerification, setActiveVerification] = useState(null);

//   // Mock social platforms configuration
//   const socialPlatforms = {
//     twitter: {
//       name: "Twitter/X",
//       icon: "/auth/social/x.svg",
//       color: "bg-blue-600",
//       borderColor: "border-blue-500/20",
//       gradientFrom: "from-blue-900/20",
//       gradientTo: "to-cyan-900/20",
//       description: "Verify your Twitter/X account to showcase your reach",
//       requiredScopes: ["users.read", "tweet.read"],
//       verification: {
//         minFollowers: 100,
//         minAccountAge: 30, // days
//         requiresVerifiedEmail: true,
//       },
//     },
//     discord: {
//       name: "Discord",
//       icon: "/auth/social/discord.svg",
//       color: "bg-indigo-600",
//       borderColor: "border-indigo-500/20",
//       gradientFrom: "from-indigo-900/20",
//       gradientTo: "to-purple-900/20",
//       description: "Connect your Discord to verify community engagement",
//       requiredScopes: ["identify", "guilds.read"],
//       verification: {
//         minAccountAge: 7,
//         minServerCount: 1,
//       },
//     },
//     telegram: {
//       name: "Telegram",
//       icon: "/auth/social/telegram.svg",
//       color: "bg-sky-600",
//       borderColor: "border-sky-500/20",
//       gradientFrom: "from-sky-900/20",
//       gradientTo: "to-blue-900/20",
//       description: "Verify your Telegram for community outreach",
//       requiredScopes: ["identify"],
//       verification: {
//         requiresUsername: true,
//         minAccountAge: 14,
//       },
//     },
//     linkedin: {
//       name: "LinkedIn",
//       icon: "/auth/social/linkedin.svg",
//       color: "bg-blue-700",
//       borderColor: "border-blue-600/20",
//       gradientFrom: "from-blue-900/20",
//       gradientTo: "to-indigo-900/20",
//       description: "Professional network verification for business outreach",
//       requiredScopes: ["r_liteprofile", "r_emailaddress"],
//       verification: {
//         minConnections: 50,
//         requiresCompletedProfile: true,
//       },
//     },
//     youtube: {
//       name: "YouTube",
//       icon: "/auth/social/youtube.svg",
//       color: "bg-red-600",
//       borderColor: "border-red-500/20",
//       gradientFrom: "from-red-900/20",
//       gradientTo: "to-pink-900/20",
//       description: "Verify your YouTube channel for content creator status",
//       requiredScopes: ["youtube.readonly"],
//       verification: {
//         minSubscribers: 100,
//         minVideos: 5,
//         minChannelAge: 90,
//       },
//     },
//     instagram: {
//       name: "Instagram",
//       icon: "/auth/social/instagram.svg",
//       color: "bg-pink-600",
//       borderColor: "border-pink-500/20",
//       gradientFrom: "from-pink-900/20",
//       gradientTo: "to-purple-900/20",
//       description: "Connect Instagram for visual content verification",
//       requiredScopes: ["user_profile", "user_media"],
//       verification: {
//         minFollowers: 500,
//         minPosts: 10,
//         requiresBusinessAccount: false,
//       },
//     },
//   };

//   useEffect(() => {
//     loadSocialVerifications();
//   }, []);

//   const loadSocialVerifications = async () => {
//     setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Mock data - replace with actual API call
//       const mockVerifications = {
//         twitter: {
//           platform: "twitter",
//           verified: true,
//           profileData: {
//             verified: true,
//             id: "123456789",
//             followingCount: 892,
//             followerCount: 15420,
//             username: "cryptoambassador",
//             displayName: "Crypto Ambassador",
//             profileImage: "https://pbs.twimg.com/profile_images/sample.jpg",
//             bio: "Blockchain enthusiast | Neo X Ambassador | DeFi advocate",
//             accountCreated: "2020-03-15",
//             location: "Global",
//           },
//           verifiedAt: "2024-01-15T10:30:00Z",
//           lastUpdated: "2024-06-20T14:22:00Z",
//         },

//         discord: {
//           verified: true,
//           platform: "discord",
//           profileData: {
//             id: "987654321",
//             serverCount: 25,
//             username: "CryptoAmb#1234",
//             accountCreated: "2021-01-10",
//             displayName: "Crypto Ambassador",
//             avatar: "https://cdn.discordapp.com/avatars/sample.png",
//           },
//           verifiedAt: "2024-02-01T09:15:00Z",
//           lastUpdated: "2024-06-19T11:45:00Z",
//         },
//       };

//       const totalReach = Object.values(mockVerifications).reduce(
//         (total, verification) => {
//           if (verification.verified && verification.profileData.followerCount) {
//             return total + verification.profileData.followerCount;
//           }
//           return total;
//         },
//         0,
//       );

//       setSocialState({
//         isLoading: false,
//         error: null,
//         verifications: mockVerifications,
//         totalReach,
//         verificationCount: Object.keys(mockVerifications).length,
//         lastUpdated: new Date(),
//       });
//     } catch (error) {
//       console.error("Error loading social verifications:", error);
//       setSocialState((prev) => ({
//         ...prev,
//         isLoading: false,
//         error: "Failed to load social verifications",
//       }));
//     }
//   };

//   const handleStartVerification = (platformKey) => {
//     setActiveVerification(platformKey);
//   };

//   const handleVerificationSuccess = (platformKey, profileData) => {
//     setSocialState((prev) => ({
//       ...prev,
//       verifications: {
//         ...prev.verifications,
//         [platformKey]: {
//           platform: platformKey,
//           verified: true,
//           profileData,
//           verifiedAt: new Date().toISOString(),
//           lastUpdated: new Date().toISOString(),
//         },
//       },
//       verificationCount: prev.verificationCount + 1,
//       totalReach: prev.totalReach + (profileData.followerCount || 0),
//       lastUpdated: new Date(),
//     }));
//     setActiveVerification(null);
//   };

//   const handleVerificationError = (error) => {
//     console.error("Verification error:", error);
//     setActiveVerification(null);
//   };

//   const handleDisconnectSocial = async (platformKey) => {
//     try {
//       // Simulate API call to disconnect
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       const oldVerification = socialState.verifications[platformKey];
//       const followerLoss = oldVerification?.profileData?.followerCount || 0;

//       setSocialState((prev) => {
//         const newVerifications = { ...prev.verifications };
//         delete newVerifications[platformKey];

//         return {
//           ...prev,
//           verifications: newVerifications,
//           verificationCount: prev.verificationCount - 1,
//           totalReach: prev.totalReach - followerLoss,
//           lastUpdated: new Date(),
//         };
//       });
//     } catch (error) {
//       console.error("Error disconnecting social:", error);
//     }
//   };

//   const handleRefreshSocials = async () => {
//     loadSocialVerifications();
//   };

//   // Loading state
//   if (socialState.isLoading) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-lg font-medium text-white">
//           Loading Social Verifications
//         </h3>

//         <p className="text-sm text-gray-200">
//           Fetching your connected accounts...
//         </p>
//       </div>
//     );
//   }

//   // Show verification flow if active
//   if (activeVerification) {
//     return (
//       <SocialVerificationFlow
//         platform={socialPlatforms[activeVerification]}
//         platformKey={activeVerification}
//         onBack={() => setActiveVerification(null)}
//         onSuccess={handleVerificationSuccess}
//         onError={handleVerificationError}
//       />
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <SocialsOverview
//         totalReach={socialState.totalReach}
//         verificationCount={socialState.verificationCount}
//         totalPlatforms={Object.keys(socialPlatforms).length}
//         lastUpdated={socialState.lastUpdated}
//         onRefresh={handleRefreshSocials}
//         isRefreshing={socialState.isLoading}
//       />

//       {socialState.verificationCount > 0 && (
//         <SocialConnectedState
//           verifications={socialState.verifications}
//           platforms={socialPlatforms}
//           onDisconnect={handleDisconnectSocial}
//           onRefresh={handleRefreshSocials}
//         />
//       )}

//       <SocialPlatformsList
//         platforms={socialPlatforms}
//         verifications={socialState.verifications}
//         onStartVerification={handleStartVerification}
//       />

//       {socialState.error && (
//         <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
//           <div className="flex items-start gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
//               <Users2Icon size={16} className="text-red-400" />
//             </div>
//             <div>
//               <h4 className="mb-2 font-medium text-red-400">
//                 Error Loading Socials
//               </h4>
//               <p className="text-sm text-gray-300">{socialState.error}</p>
//               <button
//                 onClick={handleRefreshSocials}
//                 className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 hover:bg-red-600/30"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocialsTab;

// "use client";

// import React, { useState, useEffect } from "react";
// import { Spinner } from "@heroui/react";
// import { Users2Icon } from "lucide-react";

// // Import social sub-components
// import SocialsOverview from "./socials/SocialsOverview";
// import SocialPlatformsList from "./socials/SocialPlatformsList";
// import SocialConnectedState from "./socials/SocialConnectedState";
// import SocialVerificationFlow from "./socials/SocialVerificationFlow";

// const SocialsTab = ({ twitter, discord, telegram }) => {
//   const [socialState, setSocialState] = useState({
//     isLoading: false,
//     error: null,
//     lastUpdated: null,
//   });

//   const [activeVerification, setActiveVerification] = useState(null);

//   // Check if we're returning from OAuth (look for success message in URL)
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const success = urlParams.get("success");
//     const platform = urlParams.get("platform");
//     const error = urlParams.get("error");
//     const message = urlParams.get("message");

//     if (success === "true" && platform) {
//       // Show success message
//       setSocialState((prev) => ({
//         ...prev,
//         lastUpdated: new Date(),
//       }));

//       // Clean up URL
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, document.title, newUrl);

//       // Trigger a data refresh (in real app, parent would re-fetch user data)
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
//     } else if (error) {
//       setSocialState((prev) => ({
//         ...prev,
//         error: decodeURIComponent(error),
//       }));

//       // Clean up URL
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, document.title, newUrl);
//     }
//   }, []);

//   // Social platforms configuration
//   const socialPlatforms = {
//     discord: {
//       name: "Discord",
//       icon: "/icons/discord.svg",
//       color: "bg-indigo-600",
//       borderColor: "border-indigo-500/20",
//       gradientFrom: "from-indigo-900/20",
//       gradientTo: "to-purple-900/20",
//       description: "Connect your Discord to verify community engagement",
//       connected: !!(discord && discord.trim()),
//       value: discord, // Just the username/ID
//       verification: {
//         minAccountAge: 7,
//         minServerCount: 1,
//       },
//       requiredScopes: ["identify", "guilds", "email", "connections"],
//     },
//     twitter: {
//       name: "Twitter/X",
//       icon: "/icons/twitter.svg",
//       color: "bg-blue-600",
//       borderColor: "border-blue-500/20",
//       gradientFrom: "from-blue-900/20",
//       gradientTo: "to-cyan-900/20",
//       description: "Verify your Twitter/X account to showcase your reach",
//       connected: !!(twitter && twitter.trim()),
//       value: twitter, // Just the username/ID
//       verification: {
//         minFollowers: 100,
//         minAccountAge: 30,
//         requiresVerifiedEmail: true,
//       },
//       requiredScopes: ["users.read", "tweet.read"],
//     },
//     telegram: {
//       name: "Telegram",
//       icon: "/icons/telegram.svg",
//       color: "bg-sky-600",
//       borderColor: "border-sky-500/20",
//       gradientFrom: "from-sky-900/20",
//       gradientTo: "to-blue-900/20",
//       description: "Verify your Telegram for community outreach",
//       connected: !!(telegram && telegram.trim()),
//       value: telegram, // Just the username/ID
//       verification: {
//         requiresUsername: true,
//         minAccountAge: 14,
//       },
//       requiredScopes: ["identify"],
//     },
//   };

//   // Calculate stats
//   const connectedCount = Object.values(socialPlatforms).filter(
//     (p) => p.connected,
//   ).length;
//   const totalPlatforms = Object.keys(socialPlatforms).length;

//   // Calculate total reach from connected platforms (since we don't have follower data, just count connections)
//   const totalReach = connectedCount;

//   const handleStartVerification = (platformKey) => {
//     if (platformKey === "discord") {
//       // Redirect to backend Discord OAuth endpoint
//       window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/login`;
//     } else {
//       // For other platforms, you can implement similar backend redirects
//       console.log(`OAuth not implemented for ${platformKey} yet`);
//       setSocialState((prev) => ({
//         ...prev,
//         error: `OAuth not implemented for ${platformKey} yet`,
//       }));
//     }
//   };

//   const handleDisconnectSocial = async (platformKey) => {
//     try {
//       setSocialState((prev) => ({ ...prev, isLoading: true }));

//       let endpoint;
//       switch (platformKey) {
//         case "discord":
//           endpoint = "/auth/discord/disconnect";
//           break;
//         case "twitter":
//           endpoint = "/auth/twitter/disconnect";
//           break;
//         case "telegram":
//           endpoint = "/auth/telegram/disconnect";
//           break;
//         default:
//           throw new Error(`Disconnect not implemented for ${platformKey}`);
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to disconnect ${platformKey}`);
//       }

//       // Reload page to get updated user data
//       window.location.reload();
//     } catch (error) {
//       console.error(`Error disconnecting ${platformKey}:`, error);
//       setSocialState((prev) => ({
//         ...prev,
//         error: `Failed to disconnect ${platformKey}`,
//         isLoading: false,
//       }));
//     }
//   };

//   const handleRefreshSocials = () => {
//     window.location.reload();
//   };

//   // Don't render if socials data is not available yet (undefined means still loading)
//   if (
//     twitter === undefined ||
//     discord === undefined ||
//     telegram === undefined
//   ) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-lg font-medium text-white">
//           Loading Social Data
//         </h3>

//         <p className="text-sm text-gray-200">
//           Fetching your social connections...
//         </p>
//       </div>
//     );
//   }

//   // Show verification flow if active (this won't be used with real OAuth)
//   if (activeVerification) {
//     return (
//       <SocialVerificationFlow
//         platform={socialPlatforms[activeVerification]}
//         platformKey={activeVerification}
//         onBack={() => setActiveVerification(null)}
//         onSuccess={() => {}} // Not used with real OAuth
//         onError={() => setActiveVerification(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Overview Statistics */}
//       <SocialsOverview
//         totalReach={totalReach}
//         verificationCount={connectedCount}
//         totalPlatforms={totalPlatforms}
//         lastUpdated={socialState.lastUpdated}
//         onRefresh={handleRefreshSocials}
//         isRefreshing={socialState.isLoading}
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//       />

//       {/* Connected Social Accounts */}
//       {connectedCount > 0 && (
//         <SocialConnectedState
//           platforms={socialPlatforms}
//           onDisconnect={handleDisconnectSocial}
//           onRefresh={handleRefreshSocials}
//         />
//       )}

//       {/* Available Platforms to Connect */}
//       <SocialPlatformsList
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//       />

//       {/* Error Display */}
//       {socialState.error && (
//         <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
//           <div className="flex items-start gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
//               <Users2Icon size={16} className="text-red-400" />
//             </div>
//             <div>
//               <h4 className="mb-2 font-medium text-red-400">
//                 Error Loading Socials
//               </h4>
//               <p className="text-sm text-gray-300">{socialState.error}</p>
//               <button
//                 onClick={handleRefreshSocials}
//                 className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 hover:bg-red-600/30"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocialsTab;

// "use client";

// import React, { useState, useEffect } from "react";
// import { Spinner } from "@heroui/react";
// import { Users } from "lucide-react";

// // Import social sub-components
// import SocialConnectedState from "./social/SocialConnectedState";
// import SocialDisconnectedState from "./social/SocialDisconnectedState";
// import SocialConnectionFlow from "./social/SocialConnectionFlow";

// const SocialTab = ({ telegram, twitter, discord }) => {
//   const [connectionState, setConnectionState] = useState({
//     connecting: null, // 'twitter', 'discord', 'telegram', or null
//     error: null,
//     lastUpdated: null,
//     isLoading: false,
//   });

//   const [ready, setReady] = useState(false);

//   // Initialize component
//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Social media connection status
//   const connectedSocials = {
//     twitter: !!twitter,
//     discord: !!discord,
//     telegram: !!telegram,
//   };

//   const socialData = {
//     twitter: twitter || null,
//     discord: discord || null,
//     telegram: telegram || null,
//   };

//   const totalConnected = Object.values(connectedSocials).filter(Boolean).length;
//   const hasAnySocial = totalConnected > 0;

//   const updateConnectionState = (updates) => {
//     setConnectionState((prev) => ({ ...prev, ...updates }));
//   };

//   const handleSocialConnect = async (platform) => {
//     updateConnectionState({
//       connecting: platform,
//       error: null,
//       isLoading: true,
//     });

//     try {
//       // Start OAuth flow - redirect to backend OAuth endpoint
//       const authUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/connect/${platform}`;
//       window.location.href = authUrl;
//     } catch (error) {
//       console.error(`Error connecting ${platform}:`, error);
//       updateConnectionState({
//         connecting: null,
//         error: error.message || `Failed to connect ${platform}`,
//         isLoading: false,
//       });
//     }
//   };

//   const handleSocialDisconnect = async (platform) => {
//     updateConnectionState({ isLoading: true, error: null });

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/disconnect-social`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ platform }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to disconnect ${platform}`);
//       }

//       // Reload to refresh social data from server
//       window.location.reload();
//     } catch (error) {
//       console.error(`Error disconnecting ${platform}:`, error);
//       updateConnectionState({
//         error: error.message || `Failed to disconnect ${platform}`,
//         isLoading: false,
//       });
//     }
//   };

//   // Wait for component to be ready
//   if (!ready) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />
//         <h3 className="mb-2 text-lg font-medium text-white">
//           Loading Social Connections
//         </h3>
//         <p className="text-sm text-gray-200">
//           Preparing social media integration...
//         </p>
//       </div>
//     );
//   }

//   // Show connection flow if currently connecting to a platform
//   if (connectionState.connecting) {
//     return (
//       <SocialConnectionFlow
//         platform={connectionState.connecting}
//         connectionState={connectionState}
//         onCancel={() =>
//           updateConnectionState({ connecting: null, isLoading: false })
//         }
//       />
//     );
//   }

//   // Show connected state if user has any social connections
//   if (hasAnySocial) {
//     return (
//       <SocialConnectedState
//         socialData={socialData}
//         connectedSocials={connectedSocials}
//         connectionState={connectionState}
//         onConnect={handleSocialConnect}
//         onDisconnect={handleSocialDisconnect}
//         updateConnectionState={updateConnectionState}
//         totalConnected={totalConnected}
//       />
//     );
//   }

//   // Default: No socials connected
//   return (
//     <SocialDisconnectedState
//       connectionState={connectionState}
//       onConnect={handleSocialConnect}
//       updateConnectionState={updateConnectionState}
//     />
//   );
// };

// export default SocialTab;

// "use client";

// import { Users } from "lucide-react";
// import { Spinner } from "@heroui/react";
// import React, { useState, useEffect } from "react";

// // Import social sub-components
// import SocialsOverview from "./socials/SocialsOverview";
// import SocialPlatformsList from "./socials/SocialPlatformsList";
// import SocialConnectedState from "./socials/SocialConnectedState";
// import SocialVerificationFlow from "./socials/SocialVerificationFlow";

// const SocialsTab = ({ telegram, twitter, discord }) => {
//   const [socialState, setSocialState] = useState({
//     isLoading: false,
//     error: null,
//     lastUpdated: null,
//   });

//   const [activeVerification, setActiveVerification] = useState(null);

//   // Check if we're returning from OAuth (look for success message in URL)
//   // useEffect(() => {
//   //   const urlParams = new URLSearchParams(window.location.search);
//   //   const success = urlParams.get("success");
//   //   const platform = urlParams.get("platform");
//   //   const error = urlParams.get("error");
//   //   const message = urlParams.get("message");

//   //   if (success === "true" && platform) {
//   //     // Show success message and update state
//   //     setSocialState((prev) => ({
//   //       ...prev,
//   //       lastUpdated: new Date(),
//   //       error: null,
//   //     }));

//   //     // Clean up URL
//   //     const newUrl = window.location.pathname;
//   //     window.history.replaceState({}, document.title, newUrl);

//   //     // Reload to get fresh data from server
//   //     setTimeout(() => {
//   //       window.location.reload();
//   //     }, 1500);
//   //   } else if (error) {
//   //     setSocialState((prev) => ({
//   //       ...prev,
//   //       error: decodeURIComponent(message || error),
//   //     }));

//   //     // Clean up URL
//   //     const newUrl = window.location.pathname;
//   //     window.history.replaceState({}, document.title, newUrl);
//   //   }
//   // }, []);

//   // Social platforms configuration
//   const socialPlatforms = {
//     discord: {
//       name: "Discord",
//       icon: "/auth/social/discord.svg",
//       color: "bg-indigo-600",
//       borderColor: "border-indigo-500/20",
//       gradientFrom: "from-indigo-900/20",
//       gradientTo: "to-purple-900/20",
//       description:
//         "Connect your Discord to verify community engagement and access exclusive channels",
//       connected: !!(discord && discord.trim()),
//       value: discord, // Discord username or ID
//       verification: {
//         minAccountAge: 7,
//         minServerCount: 1,
//         requiresUsername: true,
//       },
//       requiredScopes: ["identify", "guilds", "email"],
//       authEndpoints: {
//         login: "/auth/discord/login",
//         disconnect: "/auth/discord/disconnect",
//       },
//     },
//     twitter: {
//       name: "Twitter/X",
//       icon: "/auth/social/x.svg",
//       color: "bg-blue-600",
//       borderColor: "border-blue-500/20",
//       gradientFrom: "from-blue-900/20",
//       gradientTo: "to-cyan-900/20",
//       description:
//         "Verify your Twitter/X account to showcase your reach and engagement",
//       connected: !!(twitter && twitter.trim()),
//       value: twitter, // Twitter username
//       verification: {
//         minFollowers: 100,
//         minAccountAge: 30,
//         requiresVerifiedEmail: true,
//       },
//       requiredScopes: ["users.read", "tweet.read"],
//       authEndpoints: {
//         login: "/auth/twitter/login",
//         disconnect: "/auth/twitter/disconnect",
//       },
//     },
//     telegram: {
//       name: "Telegram",
//       icon: "/auth/social/telegram.svg",
//       color: "bg-sky-600",
//       borderColor: "border-sky-500/20",
//       gradientFrom: "from-sky-900/20",
//       gradientTo: "to-blue-900/20",
//       description:
//         "Verify your Telegram for community outreach and instant notifications",
//       connected: !!(telegram && telegram.trim()),
//       value: telegram, // Telegram username
//       verification: {
//         requiresUsername: true,
//         minAccountAge: 14,
//       },
//       requiredScopes: ["identify"],
//       authEndpoints: {
//         login: "/auth/telegram/login",
//         disconnect: "/auth/telegram/disconnect",
//       },
//     },
//   };

//   // Calculate stats
//   const connectedCount = Object.values(socialPlatforms).filter(
//     (p) => p.connected,
//   ).length;
//   const totalPlatforms = Object.keys(socialPlatforms).length;

//   // Calculate total reach from connected platforms
//   const totalReach = connectedCount * 1000; // Mock multiplier for demo

//   const handleStartVerification = (platformKey) => {
//     const platform = socialPlatforms[platformKey];
//     if (!platform) {
//       setSocialState((prev) => ({
//         ...prev,
//         error: `Platform ${platformKey} not found`,
//       }));
//       return;
//     }

//     // Start verification flow for the selected platform
//     setActiveVerification(platformKey);
//   };

//   const handleDisconnectSocial = async (platformKey) => {
//     const platform = socialPlatforms[platformKey];
//     if (!platform) {
//       setSocialState((prev) => ({
//         ...prev,
//         error: `Platform ${platformKey} not found`,
//       }));
//       return;
//     }

//     try {
//       setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.disconnect}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `Failed to disconnect ${platform.name}`,
//         );
//       }

//       // Reload page to get updated user data
//       window.location.reload();
//     } catch (error) {
//       console.error(`Error disconnecting ${platformKey}:`, error);
//       setSocialState((prev) => ({
//         ...prev,
//         error: `Failed to disconnect ${platform.name}: ${error.message}`,
//         isLoading: false,
//       }));
//     }
//   };

//   const handleRefreshSocials = () => {
//     setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));
//     // Reload to get fresh data
//     window.location.reload();
//   };

//   const handleCancelVerification = () => {
//     setActiveVerification(null);
//   };

//   const handleVerificationSuccess = (platformKey, profileData) => {
//     console.log(`Verification successful for ${platformKey}:`, profileData);
//     setActiveVerification(null);

//     // Update last updated time
//     setSocialState((prev) => ({
//       ...prev,
//       lastUpdated: new Date(),
//       error: null,
//     }));

//     // Reload to get fresh data
//     setTimeout(() => {
//       window.location.reload();
//     }, 1000);
//   };

//   const handleVerificationError = (error) => {
//     console.error("Verification error:", error);
//     setSocialState((prev) => ({
//       ...prev,
//       error: error.message || "Verification failed",
//     }));
//     setActiveVerification(null);
//   };

//   // Don't render if socials data is not available yet (undefined means still loading)
//   if (
//     twitter === undefined ||
//     discord === undefined ||
//     telegram === undefined
//   ) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />
//         <h3 className="mb-2 text-lg font-medium text-white">
//           Loading Social Data
//         </h3>
//         <p className="text-sm text-gray-200">
//           Fetching your social connections...
//         </p>
//       </div>
//     );
//   }

//   // Show verification flow if active
//   if (activeVerification) {
//     const platform = socialPlatforms[activeVerification];
//     return (
//       <SocialVerificationFlow
//         platform={platform}
//         platformKey={activeVerification}
//         onBack={handleCancelVerification}
//         onSuccess={handleVerificationSuccess}
//         onError={handleVerificationError}
//       />
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Overview Statistics */}
//       <SocialsOverview
//         totalReach={totalReach}
//         verificationCount={connectedCount}
//         totalPlatforms={totalPlatforms}
//         lastUpdated={socialState.lastUpdated}
//         onRefresh={handleRefreshSocials}
//         isRefreshing={socialState.isLoading}
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//       />

//       {/* Connected Social Accounts */}
//       {connectedCount > 0 && (
//         <SocialConnectedState
//           platforms={socialPlatforms}
//           onDisconnect={handleDisconnectSocial}
//           onRefresh={handleRefreshSocials}
//           isLoading={socialState.isLoading}
//         />
//       )}

//       {/* Available Platforms to Connect */}
//       <SocialPlatformsList
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//         isLoading={socialState.isLoading}
//       />

//       {/* Error Display */}
//       {socialState.error && (
//         <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
//           <div className="flex items-start gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
//               <Users size={16} className="text-red-400" />
//             </div>
//             <div>
//               <h4 className="mb-2 font-medium text-red-400">
//                 Social Connection Error
//               </h4>
//               <p className="text-sm text-gray-300">{socialState.error}</p>
//               <button
//                 onClick={() =>
//                   setSocialState((prev) => ({ ...prev, error: null }))
//                 }
//                 className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
//               >
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocialsTab;

// "use client";

// import { Users } from "lucide-react";
// import { Spinner, addToast } from "@heroui/react";
// import React, { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// // Import social sub-components
// import SocialsOverview from "./socials/SocialsOverview";
// import SocialPlatformsList from "./socials/SocialPlatformsList";
// import SocialConnectedState from "./socials/SocialConnectedState";
// import SocialVerificationFlow from "./socials/SocialVerificationFlow";

// const SocialsTab = ({
//   twitter,
//   discord,
//   telegram,
//   twitterUsername,
//   discordUsername,
//   telegramUsername,
// }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [socialState, setSocialState] = useState({
//     isLoading: false,
//     error: null,
//     lastUpdated: null,
//   });

//   const [activeVerification, setActiveVerification] = useState(null);

//   // Handle OAuth callback with Next.js hooks
//   useEffect(() => {
//     const success = searchParams.get("success");
//     const platform = searchParams.get("platform");
//     const error = searchParams.get("error");
//     const message = searchParams.get("message");

//     // Only process OAuth params if they exist
//     if (success === "true" && platform) {
//       // Show success toast using HeroUI
//       const successMessage = message
//         ? decodeURIComponent(message)
//         : `${platform} connected successfully!`;
//       addToast({
//         title: "Connection Successful",
//         description: successMessage,
//         color: "success",
//         timeout: 4000,
//       });

//       // Update state
//       setSocialState((prev) => ({
//         ...prev,
//         lastUpdated: new Date(),
//         error: null,
//       }));

//       // Clean URL by removing only OAuth params, keep tab=socials
//       const newParams = new URLSearchParams(searchParams);
//       newParams.delete("success");
//       newParams.delete("platform");
//       newParams.delete("message");
//       newParams.delete("error");

//       // Replace URL without causing refresh
//       router.replace(`/settings?${newParams.toString()}`, { scroll: false });

//       // Reload to get fresh data from server after a short delay
//       setTimeout(() => {
//         // window.location.reload();
//         router.refresh();
//       }, 2000);
//     } else if (error) {
//       // Show error toast using HeroUI
//       const errorMessage = message
//         ? decodeURIComponent(message)
//         : decodeURIComponent(error);
//       addToast({
//         title: "Connection Failed",
//         description: errorMessage,
//         color: "danger",
//         timeout: 6000,
//       });

//       // Update error state
//       setSocialState((prev) => ({
//         ...prev,
//         error: errorMessage,
//       }));

//       // Clean URL by removing only OAuth params, keep tab=socials
//       const newParams = new URLSearchParams(searchParams);
//       newParams.delete("success");
//       newParams.delete("platform");
//       newParams.delete("message");
//       newParams.delete("error");

//       // Replace URL without causing refresh
//       router.replace(`/settings?${newParams.toString()}`, { scroll: false });
//     }
//   }, [searchParams, router]);

//   // Social platforms configuration
//   const socialPlatforms = {
//     discord: {
//       name: "Discord",
//       icon: "/auth/social/discord.svg",
//       color: "bg-indigo-600",
//       borderColor: "border-indigo-500/20",
//       gradientFrom: "from-indigo-900/20",
//       gradientTo: "to-purple-900/20",
//       description:
//         "Connect your Discord to verify community engagement and access exclusive channels",
//       connected: !!(discord && discord.trim()),
//       value: discord,
//       username: discordUsername,
//       displayValue: discordUsername || discord,
//       verification: {
//         minAccountAge: 7,
//         minServerCount: 1,
//         requiresUsername: true,
//       },
//       requiredScopes: ["identify", "guilds", "email"],
//       authEndpoints: {
//         login: "/auth/discord/login",
//         disconnect: "/auth/discord/disconnect",
//       },
//     },
//     twitter: {
//       name: "Twitter/X",
//       icon: "/auth/social/x.svg",
//       color: "bg-blue-600",
//       borderColor: "border-blue-500/20",
//       gradientFrom: "from-blue-900/20",
//       gradientTo: "to-cyan-900/20",
//       description:
//         "Verify your Twitter/X account to showcase your reach and engagement",
//       connected: !!(twitter && twitter.trim()),
//       value: twitter,
//       username: twitterUsername,
//       displayValue: twitterUsername || twitter,
//       verification: {
//         minFollowers: 100,
//         minAccountAge: 30,
//         requiresVerifiedEmail: true,
//       },
//       requiredScopes: ["users.read", "tweet.read"],
//       authEndpoints: {
//         login: "/auth/twitter/login",
//         disconnect: "/auth/twitter/disconnect",
//       },
//     },
//     telegram: {
//       name: "Telegram",
//       icon: "/auth/social/telegram.svg",
//       color: "bg-sky-600",
//       borderColor: "border-sky-500/20",
//       gradientFrom: "from-sky-900/20",
//       gradientTo: "to-blue-900/20",
//       description:
//         "Verify your Telegram for community outreach and instant notifications",
//       connected: !!(telegram && telegram.trim()),
//       value: telegram,
//       username: telegramUsername,
//       displayValue: telegramUsername || telegram,
//       verification: {
//         requiresUsername: true,
//         minAccountAge: 14,
//       },
//       requiredScopes: ["identify"],
//       authEndpoints: {
//         login: "/auth/telegram/login",
//         disconnect: "/auth/telegram/disconnect",
//       },
//     },
//   };

//   // Calculate stats
//   const connectedCount = Object.values(socialPlatforms).filter(
//     (p) => p.connected,
//   ).length;
//   const totalPlatforms = Object.keys(socialPlatforms).length;

//   // Calculate total reach from connected platforms
//   const totalReach = connectedCount * 1000;

//   const handleStartVerification = (platformKey) => {
//     const platform = socialPlatforms[platformKey];
//     if (!platform) {
//       addToast({
//         title: "Error",
//         description: `Platform ${platformKey} not found`,
//         color: "danger",
//       });
//       setSocialState((prev) => ({
//         ...prev,
//         error: `Platform ${platformKey} not found`,
//       }));
//       return;
//     }

//     // Start verification flow for the selected platform
//     setActiveVerification(platformKey);
//   };

//   const handleDisconnectSocial = async (platformKey) => {
//     const platform = socialPlatforms[platformKey];
//     if (!platform) {
//       addToast({
//         title: "Error",
//         description: `Platform ${platformKey} not found`,
//         color: "danger",
//       });
//       setSocialState((prev) => ({
//         ...prev,
//         error: `Platform ${platformKey} not found`,
//       }));
//       return;
//     }

//     try {
//       setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

//       // Show loading toast
//       addToast({
//         title: "Disconnecting...",
//         description: `Disconnecting ${platform.name} from your account`,
//         color: "default",
//       });

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.disconnect}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `Failed to disconnect ${platform.name}`,
//         );
//       }

//       // Show success toast
//       addToast({
//         title: "Disconnected Successfully",
//         description: `${platform.name} has been disconnected from your account`,
//         color: "success",
//         timeout: 4000,
//       });

//       // Reload page to get updated user data
//       setTimeout(() => {
//         // window.location.reload();
//         router.refresh();
//       }, 1000);
//     } catch (error) {
//       console.error(`Error disconnecting ${platformKey}:`, error);

//       // Show error toast
//       addToast({
//         title: "Disconnection Failed",
//         description: `Failed to disconnect ${platform.name}: ${error.message}`,
//         color: "danger",
//         timeout: 6000,
//       });

//       setSocialState((prev) => ({
//         ...prev,
//         error: `Failed to disconnect ${platform.name}: ${error.message}`,
//         isLoading: false,
//       }));
//     }
//   };

//   const handleRefreshSocials = () => {
//     setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

//     // Show loading toast
//     addToast({
//       title: "Refreshing...",
//       description: "Updating your social connections",
//       color: "default",
//       timeout: 2000,
//     });

//     // Reload to get fresh data
//     setTimeout(() => {
//       // window.location.reload();
//       router.refresh();
//     }, 500);
//   };

//   const handleCancelVerification = () => {
//     setActiveVerification(null);
//   };

//   const handleVerificationSuccess = (platformKey, profileData) => {
//     console.log(`Verification successful for ${platformKey}:`, profileData);
//     setActiveVerification(null);

//     // Show success toast
//     addToast({
//       title: "Verification Complete",
//       description: `${platformKey} has been successfully verified`,
//       color: "success",
//       timeout: 4000,
//     });

//     // Update last updated time
//     setSocialState((prev) => ({
//       ...prev,
//       lastUpdated: new Date(),
//       error: null,
//     }));

//     // Reload to get fresh data
//     setTimeout(() => {
//       // window.location.reload();
//       router.refresh();
//     }, 1000);
//   };

//   const handleVerificationError = (error) => {
//     console.error("Verification error:", error);

//     // Show error toast
//     addToast({
//       title: "Verification Failed",
//       description: error.message || "Verification could not be completed",
//       color: "danger",
//       timeout: 6000,
//     });

//     setSocialState((prev) => ({
//       ...prev,
//       error: error.message || "Verification failed",
//     }));
//     setActiveVerification(null);
//   };

//   // Don't render if socials data is not available yet
//   if (
//     twitter === undefined ||
//     discord === undefined ||
//     telegram === undefined
//   ) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />
//         <h3 className="mb-2 text-lg font-medium text-white">
//           Loading Social Data
//         </h3>
//         <p className="text-sm text-gray-200">
//           Fetching your social connections...
//         </p>
//       </div>
//     );
//   }

//   // Show verification flow if active
//   if (activeVerification) {
//     const platform = socialPlatforms[activeVerification];

//     return (
//       <SocialVerificationFlow
//         platform={platform}
//         platformKey={activeVerification}
//         onBack={handleCancelVerification}
//         onSuccess={handleVerificationSuccess}
//         onError={handleVerificationError}
//       />
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <SocialsOverview
//         totalReach={totalReach}
//         verificationCount={connectedCount}
//         totalPlatforms={totalPlatforms}
//         lastUpdated={socialState.lastUpdated}
//         onRefresh={handleRefreshSocials}
//         isRefreshing={socialState.isLoading}
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//       />

//       {connectedCount > 0 && (
//         <SocialConnectedState
//           platforms={socialPlatforms}
//           onDisconnect={handleDisconnectSocial}
//           onRefresh={handleRefreshSocials}
//           isLoading={socialState.isLoading}
//         />
//       )}

//       <SocialPlatformsList
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//         isLoading={socialState.isLoading}
//       />

//       {socialState.error && (
//         <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
//           <div className="flex items-start gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
//               <Users size={16} className="text-red-400" />
//             </div>

//             <div>
//               <h4 className="mb-2 font-medium text-red-400">
//                 Social Connection Error
//               </h4>

//               <p className="text-sm text-gray-300">{socialState.error}</p>

//               <button
//                 onClick={() =>
//                   setSocialState((prev) => ({ ...prev, error: null }))
//                 }
//                 className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
//               >
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocialsTab;

// "use client";

// import { Users } from "lucide-react";
// import { Spinner, addToast } from "@heroui/react";
// import React, { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// // Import social sub-components
// import SocialsOverview from "./socials/SocialsOverview";
// import SocialPlatformsList from "./socials/SocialPlatformsList";
// import SocialConnectedState from "./socials/SocialConnectedState";
// import SocialVerificationFlow from "./socials/SocialVerificationFlow";
// import TelegramVerificationFlow from "./socials/TelegramVerificationFlow";

// const SocialsTab = ({
//   telegram,
//   twitter,
//   discord,
//   twitterUsername,
//   discordUsername,
//   telegramUsername,
// }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [socialState, setSocialState] = useState({
//     isLoading: false,
//     error: null,
//     lastUpdated: null,
//   });

//   const [activeVerification, setActiveVerification] = useState(null);

//   // Handle OAuth callback (existing code - no changes)
//   useEffect(() => {
//     const success = searchParams.get("success");
//     const platform = searchParams.get("platform");
//     const error = searchParams.get("error");
//     const message = searchParams.get("message");

//     if (success === "true" && platform && platform !== "telegram") {
//       const successMessage = message
//         ? decodeURIComponent(message)
//         : `${platform} connected successfully!`;
//       addToast({
//         title: "Connection Successful",
//         description: successMessage,
//         color: "success",
//         timeout: 4000,
//       });

//       setSocialState((prev) => ({
//         ...prev,
//         lastUpdated: new Date(),
//         error: null,
//       }));

//       const newParams = new URLSearchParams(searchParams);
//       newParams.delete("success");
//       newParams.delete("platform");
//       newParams.delete("message");
//       newParams.delete("error");

//       router.replace(`/settings?${newParams.toString()}`, { scroll: false });

//       setTimeout(() => {
//         router.refresh();
//       }, 2000);
//     } else if (error && platform !== "telegram") {
//       const errorMessage = message
//         ? decodeURIComponent(message)
//         : decodeURIComponent(error);
//       addToast({
//         title: "Connection Failed",
//         description: errorMessage,
//         color: "danger",
//         timeout: 6000,
//       });

//       setSocialState((prev) => ({
//         ...prev,
//         error: errorMessage,
//       }));

//       const newParams = new URLSearchParams(searchParams);
//       newParams.delete("success");
//       newParams.delete("platform");
//       newParams.delete("message");
//       newParams.delete("error");

//       router.replace(`/settings?${newParams.toString()}`, { scroll: false });
//     }
//   }, [searchParams, router]);

//   // Simplified social platforms configuration
//   const socialPlatforms = {
//     discord: {
//       name: "Discord",
//       icon: "/auth/social/discord.svg",
//       color: "bg-indigo-600",
//       borderColor: "border-indigo-500/20",
//       gradientFrom: "from-indigo-900/20",
//       gradientTo: "to-purple-900/20",
//       description:
//         "Connect your Discord to verify server membership for quests",
//       connected: !!(discord && discord.trim()),
//       value: discord,
//       username: discordUsername,
//       displayValue: discordUsername || discord,
//       verification: {
//         minAccountAge: 7,
//         minServerCount: 1,
//         requiresUsername: true,
//       },
//       requiredScopes: ["identify", "guilds", "email"],
//       authEndpoints: {
//         login: "/auth/discord/login",
//         disconnect: "/auth/discord/disconnect",
//       },
//       verificationFlow: "oauth",
//     },
//     twitter: {
//       name: "Twitter/X",
//       icon: "/auth/social/x.svg",
//       color: "bg-blue-600",
//       borderColor: "border-blue-500/20",
//       gradientFrom: "from-blue-900/20",
//       gradientTo: "to-cyan-900/20",
//       description: "Verify your Twitter/X account for social engagement quests",
//       connected: !!(twitter && twitter.trim()),
//       value: twitter,
//       username: twitterUsername,
//       displayValue: twitterUsername || twitter,
//       verification: {
//         minFollowers: 100,
//         minAccountAge: 30,
//         requiresVerifiedEmail: true,
//       },
//       requiredScopes: ["users.read", "tweet.read"],
//       authEndpoints: {
//         login: "/auth/twitter/login",
//         disconnect: "/auth/twitter/disconnect",
//       },
//       verificationFlow: "oauth",
//     },
//     telegram: {
//       name: "Telegram",
//       icon: "/auth/social/telegram.svg",
//       color: "bg-sky-600",
//       borderColor: "border-sky-500/20",
//       gradientFrom: "from-sky-900/20",
//       gradientTo: "to-blue-900/20",
//       description:
//         "Connect your Telegram to verify group membership for quests",
//       connected: !!(telegram && telegram.trim()),
//       value: telegram,
//       username: telegramUsername,
//       displayValue: telegramUsername || telegram,
//       verification: {
//         requiresUsername: true,
//         minAccountAge: 1,
//       },
//       requiredScopes: ["basic_profile"],
//       authEndpoints: {
//         disconnect: "/telegram/disconnect",
//       },
//       verificationFlow: "bot_verification",
//       botUsername:
//         process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "neopod_bot",
//     },
//   };

//   // Calculate stats
//   const connectedCount = Object.values(socialPlatforms).filter(
//     (p) => p.connected,
//   ).length;
//   const totalPlatforms = Object.keys(socialPlatforms).length;
//   const totalReach = connectedCount * 1000;

//   const handleStartVerification = (platformKey) => {
//     const platform = socialPlatforms[platformKey];
//     if (!platform) {
//       addToast({
//         title: "Error",
//         description: `Platform ${platformKey} not found`,
//         color: "danger",
//       });
//       return;
//     }
//     setActiveVerification(platformKey);
//   };

//   const handleDisconnectSocial = async (platformKey) => {
//     const platform = socialPlatforms[platformKey];
//     if (!platform) {
//       addToast({
//         title: "Error",
//         description: `Platform ${platformKey} not found`,
//         color: "danger",
//       });
//       return;
//     }

//     try {
//       setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

//       addToast({
//         title: "Disconnecting...",
//         description: `Disconnecting ${platform.name} from your account`,
//         color: "default",
//       });

//       const endpoint =
//         platformKey === "telegram"
//           ? `${process.env.NEXT_PUBLIC_API_URL}/telegram/disconnect`
//           : `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.disconnect}`;

//       const response = await fetch(endpoint, {
//         method: platformKey === "telegram" ? "DELETE" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `Failed to disconnect ${platform.name}`,
//         );
//       }

//       addToast({
//         title: "Disconnected Successfully",
//         description: `${platform.name} has been disconnected from your account`,
//         color: "success",
//         timeout: 4000,
//       });

//       setTimeout(() => {
//         router.refresh();
//       }, 1000);
//     } catch (error) {
//       console.error(`Error disconnecting ${platformKey}:`, error);

//       addToast({
//         title: "Disconnection Failed",
//         description: `Failed to disconnect ${platform.name}: ${error.message}`,
//         color: "danger",
//         timeout: 6000,
//       });

//       setSocialState((prev) => ({
//         ...prev,
//         error: `Failed to disconnect ${platform.name}: ${error.message}`,
//         isLoading: false,
//       }));
//     }
//   };

//   const handleRefreshSocials = () => {
//     setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

//     addToast({
//       title: "Refreshing...",
//       description: "Updating your social connections",
//       color: "default",
//       timeout: 2000,
//     });

//     setTimeout(() => {
//       router.refresh();
//     }, 500);
//   };

//   const handleCancelVerification = () => {
//     setActiveVerification(null);
//   };

//   const handleVerificationSuccess = (platformKey, profileData) => {
//     console.log(`Verification successful for ${platformKey}:`, profileData);
//     setActiveVerification(null);

//     addToast({
//       title: "Verification Complete",
//       description: `${socialPlatforms[platformKey]?.name} has been successfully verified`,
//       color: "success",
//       timeout: 4000,
//     });

//     setSocialState((prev) => ({
//       ...prev,
//       lastUpdated: new Date(),
//       error: null,
//     }));

//     setTimeout(() => {
//       router.refresh();
//     }, 1000);
//   };

//   const handleVerificationError = (error) => {
//     console.error("Verification error:", error);

//     addToast({
//       title: "Verification Failed",
//       description: error.message || "Verification could not be completed",
//       color: "danger",
//       timeout: 6000,
//     });

//     setSocialState((prev) => ({
//       ...prev,
//       error: error.message || "Verification failed",
//     }));
//     setActiveVerification(null);
//   };

//   // Loading state
//   if (
//     twitter === undefined ||
//     discord === undefined ||
//     telegram === undefined
//   ) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />
//         <h3 className="mb-2 text-lg font-medium text-white">
//           Loading Social Data
//         </h3>
//         <p className="text-sm text-gray-200">
//           Fetching your social connections...
//         </p>
//       </div>
//     );
//   }

//   // Show verification flow if active
//   if (activeVerification) {
//     const platform = socialPlatforms[activeVerification];

//     // Use custom Telegram verification flow
//     if (activeVerification === "telegram") {
//       return (
//         <TelegramVerificationFlow
//           platform={platform}
//           platformKey={activeVerification}
//           onBack={handleCancelVerification}
//           onSuccess={handleVerificationSuccess}
//           onError={handleVerificationError}
//         />
//       );
//     }

//     // Use standard OAuth flow for other platforms
//     return (
//       <SocialVerificationFlow
//         platform={platform}
//         platformKey={activeVerification}
//         onBack={handleCancelVerification}
//         onSuccess={handleVerificationSuccess}
//         onError={handleVerificationError}
//       />
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <SocialsOverview
//         totalReach={totalReach}
//         verificationCount={connectedCount}
//         totalPlatforms={totalPlatforms}
//         lastUpdated={socialState.lastUpdated}
//         onRefresh={handleRefreshSocials}
//         isRefreshing={socialState.isLoading}
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//       />

//       {connectedCount > 0 && (
//         <SocialConnectedState
//           platforms={socialPlatforms}
//           onDisconnect={handleDisconnectSocial}
//           onRefresh={handleRefreshSocials}
//           isLoading={socialState.isLoading}
//         />
//       )}

//       <SocialPlatformsList
//         platforms={socialPlatforms}
//         onStartVerification={handleStartVerification}
//         isLoading={socialState.isLoading}
//       />

//       {socialState.error && (
//         <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
//           <div className="flex items-start gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
//               <Users size={16} className="text-red-400" />
//             </div>

//             <div>
//               <h4 className="mb-2 font-medium text-red-400">
//                 Social Connection Error
//               </h4>

//               <p className="text-sm text-gray-300">{socialState.error}</p>

//               <button
//                 onClick={() =>
//                   setSocialState((prev) => ({ ...prev, error: null }))
//                 }
//                 className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
//               >
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocialsTab;

// "use client";

// import { Users } from "lucide-react";
// import { Spinner, addToast } from "@heroui/react";
// import React, { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// import SocialsOverview from "./socials/SocialsOverview";
// import SocialPlatformsList from "./socials/SocialPlatformsList";
// import SocialConnectedState from "./socials/SocialConnectedState";
// import SocialVerificationFlow from "./socials/SocialVerificationFlow";
// import TelegramVerificationFlow from "./socials/TelegramVerificationFlow";

// const SocialsTab = ({
//   twitter,
//   discord,
//   telegram,
//   twitterUsername,
//   discordUsername,
//   telegramUsername,
// }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [socialState, setSocialState] = useState({
//     error: null,
//     isLoading: false,
//     lastUpdated: null,
//     disconnectingPlatform: null, // Track which platform is being disconnected
//   });

//   const [activeVerification, setActiveVerification] = useState(null);

//   // Handle OAuth callback (existing code - no changes)
//   useEffect(() => {
//     const error = searchParams.get("error");
//     const success = searchParams.get("success");
//     const message = searchParams.get("message");
//     const platform = searchParams.get("platform");

//     if (success === "true" && platform && platform !== "telegram") {
//       const successMessage = message
//         ? decodeURIComponent(message)
//         : `${platform} connected successfully!`;

//       addToast({
//         title: "Connection Successful",
//         description: successMessage,
//         color: "success",
//         timeout: 4000,
//       });

//       setSocialState((prev) => ({
//         ...prev,
//         lastUpdated: new Date(),
//         error: null,
//       }));

//       const newParams = new URLSearchParams(searchParams);
//       newParams.delete("error");
//       newParams.delete("success");
//       newParams.delete("message");
//       newParams.delete("platform");

//       router.replace(`/settings?${newParams.toString()}`, { scroll: false });

//       setTimeout(() => {
//         router.refresh();
//       }, 2000);
//     } else if (error && platform !== "telegram") {
//       const errorMessage = message
//         ? decodeURIComponent(message)
//         : decodeURIComponent(error);

//       addToast({
//         title: "Connection Failed",
//         description: errorMessage,
//         color: "danger",
//         timeout: 6000,
//       });

//       setSocialState((prev) => ({
//         ...prev,
//         error: errorMessage,
//       }));

//       const newParams = new URLSearchParams(searchParams);
//       newParams.delete("error");
//       newParams.delete("success");
//       newParams.delete("message");
//       newParams.delete("platform");

//       router.replace(`/settings?${newParams.toString()}`, { scroll: false });
//     }
//   }, [searchParams, router]);

//   // Simplified social platforms configuration
//   const socialPlatforms = {
//     discord: {
//       name: "Discord",
//       icon: "/auth/social/discord.svg",
//       color: "bg-indigo-600",
//       borderColor: "border-indigo-500/20",
//       gradientFrom: "from-indigo-900/20",
//       gradientTo: "to-purple-900/20",
//       description:
//         "Connect your Discord to verify server membership for quests",
//       connected: !!(discord && discord.trim()),
//       value: discord,
//       username: discordUsername,
//       displayValue: discordUsername || discord,
//       verification: {
//         minAccountAge: 7,
//         minServerCount: 1,
//         requiresUsername: true,
//       },
//       requiredScopes: ["identify", "guilds", "email"],
//       authEndpoints: {
//         login: "/auth/discord/login",
//         disconnect: "/auth/discord/disconnect",
//       },
//       verificationFlow: "oauth",
//     },

//     twitter: {
//       name: "Twitter/X",
//       icon: "/auth/social/x.svg",
//       color: "bg-blue-600",
//       borderColor: "border-blue-500/20",
//       gradientFrom: "from-blue-900/20",
//       gradientTo: "to-cyan-900/20",
//       description: "Verify your Twitter/X account for social engagement quests",
//       connected: !!(twitter && twitter.trim()),
//       value: twitter,
//       username: twitterUsername,
//       displayValue: twitterUsername || twitter,
//       verification: {
//         minFollowers: 100,
//         minAccountAge: 30,
//         requiresVerifiedEmail: true,
//       },
//       requiredScopes: ["users.read", "tweet.read"],
//       authEndpoints: {
//         login: "/auth/twitter/login",
//         disconnect: "/auth/twitter/disconnect",
//       },
//       verificationFlow: "oauth",
//     },

//     telegram: {
//       name: "Telegram",
//       icon: "/auth/social/telegram.svg",
//       color: "bg-sky-600",
//       borderColor: "border-sky-500/20",
//       gradientFrom: "from-sky-900/20",
//       gradientTo: "to-blue-900/20",
//       description:
//         "Connect your Telegram to verify group membership for quests",
//       connected: !!(telegram && telegram.trim()),
//       value: telegram,
//       username: telegramUsername,
//       displayValue: telegramUsername || telegram,
//       verification: {
//         requiresUsername: true,
//         minAccountAge: 1,
//       },
//       requiredScopes: ["basic_profile"],
//       authEndpoints: {
//         disconnect: "/telegram/disconnect",
//       },
//       verificationFlow: "bot_verification",
//       botUsername:
//         process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "neopod_bot",
//     },
//   };

//   // Calculate stats
//   const connectedCount = Object.values(socialPlatforms).filter(
//     (p) => p.connected,
//   ).length;
//   const totalPlatforms = Object.keys(socialPlatforms).length;

//   const totalReach = connectedCount * 1000;

//   const handleStartVerification = (platformKey) => {
//     const platform = socialPlatforms[platformKey];

//     if (!platform) {
//       addToast({
//         title: "Error",
//         description: `Platform ${platformKey} not found`,
//         color: "danger",
//       });
//       return;
//     }

//     setActiveVerification(platformKey);
//   };

//   const handleDisconnectSocial = async (platformKey) => {
//     const platform = socialPlatforms[platformKey];

//     if (!platform) {
//       addToast({
//         title: "Error",
//         description: `Platform ${platformKey} not found`,
//         color: "danger",
//       });
//       return;
//     }

//     try {
//       // Set disconnecting platform to disable only that button
//       setSocialState((prev) => ({
//         ...prev,
//         disconnectingPlatform: platformKey,
//         error: null,
//       }));

//       const endpoint =
//         platformKey === "telegram"
//           ? `${process.env.NEXT_PUBLIC_API_URL}/telegram/disconnect`
//           : `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.disconnect}`;

//       const response = await fetch(endpoint, {
//         method: platformKey === "telegram" ? "DELETE" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `Failed to disconnect ${platform.name}`,
//         );
//       }

//       addToast({
//         title: "Disconnected Successfully",
//         description: `${platform.name} has been disconnected from your account`,
//         color: "success",
//         timeout: 4000,
//       });

//       // Clear disconnecting state immediately and refresh
//       setSocialState((prev) => ({
//         ...prev,
//         disconnectingPlatform: null,
//         lastUpdated: new Date(),
//       }));

//       setTimeout(() => {
//         router.refresh();
//       }, 1000);
//     } catch (error) {
//       console.error(`Error disconnecting ${platformKey}:`, error);

//       addToast({
//         title: "Disconnection Failed",
//         description: `Failed to disconnect ${platform.name}: ${error.message}`,
//         color: "danger",
//         timeout: 6000,
//       });

//       // Clear disconnecting state on error too
//       setSocialState((prev) => ({
//         ...prev,
//         error: `Failed to disconnect ${platform.name}: ${error.message}`,
//         disconnectingPlatform: null,
//       }));
//     }
//   };

//   const handleRefreshSocials = async () => {
//     // Prevent infinite loading with proper async handling
//     if (socialState.isLoading) return; // Prevent multiple refreshes

//     setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

//     addToast({
//       title: "Refreshing...",
//       description: "Updating your social connections",
//       color: "default",
//       timeout: 2000,
//     });

//     try {
//       // Use router.refresh() which returns a promise
//       await new Promise((resolve) => {
//         router.refresh();
//         // Give the refresh time to complete
//         setTimeout(resolve, 1500);
//       });

//       // 🔥 FIX 5: Update state with completion
//       setSocialState((prev) => ({
//         ...prev,
//         isLoading: false,
//         lastUpdated: new Date(),
//       }));

//       addToast({
//         title: "Refreshed",
//         description: "Social connections updated successfully",
//         color: "success",
//         timeout: 2000,
//       });
//     } catch (error) {
//       console.error("Refresh error:", error);
//       setSocialState((prev) => ({
//         ...prev,
//         isLoading: false,
//         error: "Failed to refresh social connections",
//       }));
//     }
//   };

//   const handleCancelVerification = () => {
//     setActiveVerification(null);
//   };

//   const handleVerificationSuccess = (platformKey) => {
//     setActiveVerification(null);

//     addToast({
//       title: "Verification Complete",
//       description: `${socialPlatforms[platformKey]?.name} has been successfully verified`,
//       color: "success",
//       timeout: 4000,
//     });

//     setSocialState((prev) => ({
//       ...prev,
//       lastUpdated: new Date(),
//       error: null,
//     }));

//     setTimeout(() => {
//       router.refresh();
//     }, 1000);
//   };

//   const handleVerificationError = (error) => {
//     console.error("Verification error:", error);

//     addToast({
//       title: "Verification Failed",
//       description: error.message || "Verification could not be completed",
//       color: "danger",
//       timeout: 6000,
//     });

//     setSocialState((prev) => ({
//       ...prev,
//       error: error.message || "Verification failed",
//     }));
//     setActiveVerification(null);
//   };

//   // Loading state
//   if (
//     twitter === undefined ||
//     discord === undefined ||
//     telegram === undefined
//   ) {
//     return (
//       <div className="mx-auto mt-10 text-center">
//         <Spinner size="lg" className="mb-4" color="white" />

//         <h3 className="mb-2 text-lg font-medium text-white">
//           Loading Social Data
//         </h3>

//         <p className="text-sm text-gray-200">
//           Fetching your social connections...
//         </p>
//       </div>
//     );
//   }

//   // Show verification flow if active
//   if (activeVerification) {
//     const platform = socialPlatforms[activeVerification];

//     // Use custom Telegram verification flow
//     if (activeVerification === "telegram") {
//       return (
//         <TelegramVerificationFlow
//           platform={platform}
//           platformKey={activeVerification}
//           onBack={handleCancelVerification}
//           onSuccess={handleVerificationSuccess}
//           onError={handleVerificationError}
//         />
//       );
//     }

//     // Use standard OAuth flow for other platforms
//     return (
//       <SocialVerificationFlow
//         platform={platform}
//         platformKey={activeVerification}
//         onBack={handleCancelVerification}
//         onSuccess={handleVerificationSuccess}
//         onError={handleVerificationError}
//       />
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <SocialsOverview
//         totalReach={totalReach}
//         platforms={socialPlatforms}
//         totalPlatforms={totalPlatforms}
//         onRefresh={handleRefreshSocials}
//         verificationCount={connectedCount}
//         isRefreshing={socialState.isLoading}
//         lastUpdated={socialState.lastUpdated}
//         onStartVerification={handleStartVerification}
//       />

//       {connectedCount > 0 && (
//         <SocialConnectedState
//           platforms={socialPlatforms}
//           onRefresh={handleRefreshSocials}
//           isLoading={socialState.isLoading}
//           onDisconnect={handleDisconnectSocial}
//           disconnectingPlatform={socialState.disconnectingPlatform}
//         />
//       )}

//       <SocialPlatformsList
//         platforms={socialPlatforms}
//         isLoading={socialState.isLoading}
//         onStartVerification={handleStartVerification}
//       />

//       {socialState.error && (
//         <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
//           <div className="flex items-start gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
//               <Users size={16} className="text-red-400" />
//             </div>

//             <div>
//               <h4 className="mb-2 font-medium text-red-400">
//                 Social Connection Error
//               </h4>

//               <p className="text-sm text-gray-300">{socialState.error}</p>

//               <button
//                 onClick={() =>
//                   setSocialState((prev) => ({ ...prev, error: null }))
//                 }
//                 className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
//               >
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocialsTab;

"use client";

import { Users } from "lucide-react";
import { Spinner, addToast } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import SocialsOverview from "./socials/SocialsOverview";
import SocialPlatformsList from "./socials/SocialPlatformsList";
import SocialConnectedState from "./socials/SocialConnectedState";
import SocialVerificationFlow from "./socials/SocialVerificationFlow";
import TelegramVerificationFlow from "./socials/TelegramVerificationFlow";

const SocialsTab = ({
  twitter,
  discord,
  telegram,
  twitterUsername,
  discordUsername,
  telegramUsername,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [socialState, setSocialState] = useState({
    error: null,
    isLoading: false,
    lastUpdated: null,
    disconnectingPlatform: null, // Track which platform is being disconnected
  });

  const [activeVerification, setActiveVerification] = useState(null);

  // Handle OAuth callback
  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    const message = searchParams.get("message");
    const platform = searchParams.get("platform");

    if (success === "true" && platform && platform !== "telegram") {
      const successMessage = message
        ? decodeURIComponent(message)
        : `${platform} connected successfully!`;

      addToast({
        title: "Connection Successful",
        description: successMessage,
        color: "success",
        timeout: 4000,
      });

      setSocialState((prev) => ({
        ...prev,
        lastUpdated: new Date(),
        error: null,
      }));

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("error");
      newParams.delete("success");
      newParams.delete("message");
      newParams.delete("platform");

      router.replace(`/settings?${newParams.toString()}`, { scroll: false });

      setTimeout(() => {
        router.refresh();
      }, 2000);
    } else if (error && platform !== "telegram") {
      const errorMessage = message
        ? decodeURIComponent(message)
        : decodeURIComponent(error);

      addToast({
        title: "Connection Failed",
        description: errorMessage,
        color: "danger",
        timeout: 6000,
      });

      setSocialState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("error");
      newParams.delete("success");
      newParams.delete("message");
      newParams.delete("platform");

      router.replace(`/settings?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // Simplified social platforms configuration
  const socialPlatforms = {
    twitter: {
      name: "Twitter/X",
      icon: "/auth/social/x.svg",
      color: "bg-black",
      borderColor: "border-blue-500/20",
      gradientFrom: "from-blue-900/30",
      gradientTo: "to-cyan-900/30",
      description: "Verify your Twitter/X account for social engagement quests",
      connected: !!(twitter && twitter.trim()),
      value: twitter,
      username: twitterUsername,
      displayValue: twitterUsername || twitter,
      verification: {
        // ✅ ENFORCED REQUIREMENTS (FREE - no API calls needed)
        requiresValidUserId: true, // ✅ OAuth provides valid user ID
        requiresValidUsername: true, // ✅ OAuth provides valid username
        requiresMinimumAge: true, // ✅ Basic age check using Twitter ID snowflake
        requiresQualityUsername: true, // ✅ Username pattern validation

        // ⭐ BASIC DETECTION (from OAuth data only)
        detectsAccountAge: true, // ⭐ Estimated age from Twitter ID
        detectsUsernameQuality: true, // ⭐ Username quality scoring
      },
      requiredScopes: ["basic_profile", "account_verification"],
      authEndpoints: {
        login: "/socials/twitter/login",
        disconnect: "/socials/twitter/disconnect",
      },
      verificationFlow: "oauth",

      // ✅ UPDATED: Minimal requirements for UI display (free validation only)
      detailedRequirements: {
        required: [
          {
            name: "Valid Twitter Account",
            description: "Must be a legitimate Twitter/X account",
            icon: "CheckCircleIcon",
            status: "required",
          },
          {
            name: "Proper Username Format",
            description: "Username must follow Twitter's format guidelines",
            icon: "UserIcon",
            status: "required",
          },
          {
            name: "Account Age Check",
            description: "Account must not be brand new (7+ days estimated)",
            icon: "CalendarIcon",
            status: "required",
          },
          {
            name: "Quality Username",
            description: "Username should not follow spam/bot patterns",
            icon: "ShieldCheckIcon",
            status: "required",
          },
        ],
        optional: [
          {
            name: "Established Account",
            description: "Older accounts receive higher verification scores",
            icon: "TrendingUpIcon",
            status: "bonus",
          },
          {
            name: "Quality Username Score",
            description: "Well-formed usernames get bonus verification points",
            icon: "StarIcon",
            status: "bonus",
          },
        ],
        limitations: [
          {
            name: "Limited Validation",
            description: "Full profile validation requires Twitter API access",
            icon: "AlertCircleIcon",
            status: "info",
          },
        ],
      },

      // ✅ UPDATED: Simplified scoring (no API data)
      scoringInfo: {
        baseRequirements: 70, // Higher base since we can't validate much
        bonusFeatures: {
          establishedAccount: 20, // Based on estimated age
          qualityUsername: 10, // Based on username patterns
        },
        maxScore: 100,
        note: "Limited validation due to Twitter API restrictions",
      },
    },

    telegram: {
      name: "Telegram",
      icon: "/auth/social/telegram.svg",
      color: "bg-sky-600",
      borderColor: "border-indigo-500/20",
      gradientFrom: "from-indigo-900/30",
      gradientTo: "to-purple-900/30",
      description:
        "Connect your Telegram to verify group membership for quests",
      connected: !!(telegram && telegram.trim()),
      value: telegram,
      username: telegramUsername,
      displayValue: telegramUsername || telegram,
      verification: {
        // ✅ ENFORCED REQUIREMENTS
        requiresUsername: true, // ✅ Backend validates username exists
        requiresValidUsername: true, // ✅ Backend validates username format
        requiresFirstName: true, // ✅ Backend validates profile completeness
        requiresHumanAccount: true, // ✅ Backend blocks bot accounts

        // ⭐ BONUS REQUIREMENTS (detected but not required)
        detectsPremium: true, // ⭐ Detects premium accounts for higher scoring
        detectsLanguage: true, // ⭐ Detects user language for regional verification
      },
      requiredScopes: [
        "basic_profile",
        "username_access",
        "group_verification",
      ],
      authEndpoints: {
        disconnect: "/socials/telegram/disconnect",
      },
      verificationFlow: "bot_verification",
      botUsername:
        process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "neopod_bot",

      // ✅ NEW: Detailed requirements for UI display
      detailedRequirements: {
        required: [
          {
            name: "Public Username",
            description: "Must have a public @username set",
            icon: "UserIcon",
            status: "required",
          },
          {
            name: "Valid Username Format",
            description: "Username must be 5-32 characters, start with letter",
            icon: "CheckIcon",
            status: "required",
          },
          {
            name: "Complete Profile",
            description: "Must have first name set in profile",
            icon: "UserCircleIcon",
            status: "required",
          },
          {
            name: "Human Account",
            description: "Bot accounts are not eligible",
            icon: "ShieldCheckIcon",
            status: "required",
          },
        ],
        optional: [
          {
            name: "Premium Account",
            description:
              "Telegram Premium accounts get higher verification score",
            icon: "StarIcon",
            status: "bonus",
          },
          {
            name: "Profile Language",
            description: "Helps with regional quest matching",
            icon: "GlobeIcon",
            status: "detected",
          },
        ],
      },
    },

    discord: {
      name: "Discord",
      icon: "/auth/social/discord.svg",
      color: "bg-purple-600",
      borderColor: "border-sky-500/20",
      gradientFrom: "from-sky-900/30",
      gradientTo: "to-blue-900/30",
      description:
        "Connect your Discord to verify server membership for quests",
      connected: !!(discord && discord.trim()),
      value: discord,
      username: discordUsername,
      displayValue: discordUsername || discord,
      verification: {
        minAccountAge: 7,
        minServerCount: 1,
        requiresUsername: true,
      },
      requiredScopes: ["identify", "guilds", "email"],
      authEndpoints: {
        login: "/socials/discord/login",
        disconnect: "/socials/discord/disconnect",
      },
      verificationFlow: "oauth",
    },
  };

  // Calculate stats
  const connectedCount = Object.values(socialPlatforms).filter(
    (p) => p.connected,
  ).length;
  const totalPlatforms = Object.keys(socialPlatforms).length;

  const handleStartVerification = (platformKey) => {
    const platform = socialPlatforms[platformKey];

    if (!platform) {
      addToast({
        title: "Error",
        description: `Platform ${platformKey} not found`,
        color: "danger",
      });
      return;
    }

    setActiveVerification(platformKey);
  };

  const handleDisconnectSocial = async (platformKey) => {
    const platform = socialPlatforms[platformKey];
    if (!platform) {
      addToast({
        title: "Error",
        description: `Platform ${platformKey} not found`,
        color: "danger",
      });
      return;
    }

    try {
      // 🔥 FIX 1: Set disconnecting platform to disable only that button
      setSocialState((prev) => ({
        ...prev,
        disconnectingPlatform: platformKey,
        error: null,
      }));

      const endpoint =
        platformKey === "telegram"
          ? `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/disconnect`
          : `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.disconnect}`;

      const response = await fetch(endpoint, {
        method: platformKey === "telegram" ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to disconnect ${platform.name}`,
        );
      }

      addToast({
        title: "Disconnected Successfully",
        description: `${platform.name} has been disconnected from your account`,
        color: "success",
        timeout: 4000,
      });

      // 🔥 FIX 2: Clear disconnecting state immediately and refresh
      setSocialState((prev) => ({
        ...prev,
        disconnectingPlatform: null,
        lastUpdated: new Date(),
      }));

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(`Error disconnecting ${platformKey}:`, error);

      addToast({
        title: "Disconnection Failed",
        description: `Failed to disconnect ${platform.name}: ${error.message}`,
        color: "danger",
        timeout: 6000,
      });

      // 🔥 FIX 3: Clear disconnecting state on error too
      setSocialState((prev) => ({
        ...prev,
        error: `Failed to disconnect ${platform.name}: ${error.message}`,
        disconnectingPlatform: null,
      }));
    }
  };

  const handleRefreshSocials = async () => {
    // 🔥 FIX 4: Prevent infinite loading with proper async handling
    if (socialState.isLoading) return; // Prevent multiple refreshes

    setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

    addToast({
      title: "Refreshing...",
      description: "Updating your social connections",
      color: "default",
      timeout: 2000,
    });

    try {
      // Use router.refresh() which returns a promise
      await new Promise((resolve) => {
        router.refresh();
        // Give the refresh time to complete
        setTimeout(resolve, 1500);
      });

      // 🔥 FIX 5: Update state with completion
      setSocialState((prev) => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date(),
      }));

      addToast({
        title: "Refreshed",
        description: "Social connections updated successfully",
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      console.error("Refresh error:", error);
      setSocialState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to refresh social connections",
      }));
    }
  };

  const handleCancelVerification = () => {
    setActiveVerification(null);
  };

  const handleVerificationSuccess = (platformKey, profileData) => {
    console.log(`Verification successful for ${platformKey}:`, profileData);
    setActiveVerification(null);

    addToast({
      title: "Verification Complete",
      description: `${socialPlatforms[platformKey]?.name} has been successfully verified`,
      color: "success",
      timeout: 4000,
    });

    setSocialState((prev) => ({
      ...prev,
      lastUpdated: new Date(),
      error: null,
    }));

    setTimeout(() => {
      router.refresh();
    }, 1000);
  };

  const handleVerificationError = (error) => {
    console.error("Verification error:", error);

    addToast({
      title: "Verification Failed",
      description: error.message || "Verification could not be completed",
      color: "danger",
      timeout: 6000,
    });

    setSocialState((prev) => ({
      ...prev,
      error: error.message || "Verification failed",
    }));
    setActiveVerification(null);
  };

  // Loading state
  if (
    twitter === undefined ||
    discord === undefined ||
    telegram === undefined
  ) {
    return (
      <div className="mx-auto mt-10 text-center">
        <Spinner size="lg" className="mb-4" color="white" />
        <h3 className="mb-2 text-lg font-medium text-white">
          Loading Social Data
        </h3>
        <p className="text-sm text-gray-200">
          Fetching your social connections...
        </p>
      </div>
    );
  }

  // Show verification flow if active
  if (activeVerification) {
    const platform = socialPlatforms[activeVerification];

    // Use custom Telegram verification flow
    if (activeVerification === "telegram") {
      return (
        <TelegramVerificationFlow
          platform={platform}
          platformKey={activeVerification}
          onBack={handleCancelVerification}
          onSuccess={handleVerificationSuccess}
          onError={handleVerificationError}
        />
      );
    }

    // Use standard OAuth flow for other platforms
    return (
      <SocialVerificationFlow
        platform={platform}
        platformKey={activeVerification}
        onBack={handleCancelVerification}
        onSuccess={handleVerificationSuccess}
        onError={handleVerificationError}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SocialsOverview
        platforms={socialPlatforms}
        verificationCount={connectedCount}
        totalPlatforms={totalPlatforms}
        lastUpdated={socialState.lastUpdated}
        onRefresh={handleRefreshSocials}
        isRefreshing={socialState.isLoading}
      />

      {connectedCount > 0 && (
        <SocialConnectedState
          platforms={socialPlatforms}
          onDisconnect={handleDisconnectSocial}
          onRefresh={handleRefreshSocials}
          isLoading={socialState.isLoading}
          disconnectingPlatform={socialState.disconnectingPlatform}
        />
      )}

      <SocialPlatformsList
        platforms={socialPlatforms}
        onStartVerification={handleStartVerification}
        isLoading={socialState.isLoading}
      />

      {socialState.error && (
        <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
              <Users size={16} className="text-red-400" />
            </div>

            <div>
              <h4 className="mb-2 font-medium text-red-400">
                Social Connection Error
              </h4>

              <p className="text-sm text-gray-300">{socialState.error}</p>

              <button
                onClick={() =>
                  setSocialState((prev) => ({ ...prev, error: null }))
                }
                className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialsTab;
