// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   ArrowRight,
//   ShieldCheckIcon,
//   AlertCircleIcon,
//   CheckCircleIcon,
//   ExternalLinkIcon,
//   UsersIcon,
//   CalendarIcon,
//   RefreshCwIcon,
// } from "lucide-react";
// import { Card, CardBody, Button, Chip, Spinner } from "@heroui/react";
// import Image from "next/image";

// const SocialVerificationFlow = ({
//   platform,
//   platformKey,
//   onBack,
//   onSuccess,
//   onError,
// }) => {
//   const [verificationStep, setVerificationStep] = useState("authorize"); // authorize, verify, complete
//   const [isLoading, setIsLoading] = useState(false);
//   const [profileData, setProfileData] = useState(null);
//   const [verificationResults, setVerificationResults] = useState(null);
//   const [error, setError] = useState(null);

//   const handleStartAuthorization = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Simulate OAuth redirect URL generation
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // In real implementation, you would:
//       // 1. Call your backend to generate OAuth URL
//       // 2. Redirect user to platform's OAuth page
//       // 3. Handle the callback with the authorization code

//       // For demo, simulate successful authorization
//       setVerificationStep("verify");

//       // Simulate fetching profile data
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // Mock profile data based on platform
//       const mockProfiles = {
//         twitter: {
//           id: "123456789",
//           username: "cryptoambassador",
//           displayName: "Crypto Ambassador",
//           followerCount: 15420,
//           followingCount: 892,
//           verified: true,
//           profileImage: "https://pbs.twimg.com/profile_images/sample.jpg",
//           bio: "Blockchain enthusiast | Neo X Ambassador | DeFi advocate",
//           accountCreated: "2020-03-15",
//           location: "Global",
//         },
//         discord: {
//           id: "987654321",
//           username: "CryptoAmb#1234",
//           displayName: "Crypto Ambassador",
//           avatar: "https://cdn.discordapp.com/avatars/sample.png",
//           serverCount: 25,
//           accountCreated: "2021-01-10",
//         },
//         telegram: {
//           id: "456789123",
//           username: "cryptoambassador",
//           displayName: "Crypto Ambassador",
//           accountCreated: "2021-05-20",
//         },
//         linkedin: {
//           id: "linkedin123",
//           displayName: "Crypto Ambassador",
//           headline: "Blockchain Technology Advocate",
//           connectionCount: 1250,
//           profileImage: "https://media.licdn.com/sample.jpg",
//           accountCreated: "2019-08-10",
//         },
//         youtube: {
//           id: "UCsample123",
//           displayName: "Crypto Ambassador",
//           subscriberCount: 5420,
//           videoCount: 45,
//           profileImage: "https://yt3.ggpht.com/sample.jpg",
//           accountCreated: "2020-11-03",
//         },
//         instagram: {
//           id: "instagram123",
//           username: "cryptoambassador",
//           displayName: "Crypto Ambassador",
//           followerCount: 8950,
//           followingCount: 342,
//           mediaCount: 156,
//           profileImage: "https://instagram.com/sample.jpg",
//           accountCreated: "2021-02-14",
//         },
//       };

//       const mockProfile = mockProfiles[platformKey] || {};
//       setProfileData(mockProfile);

//       // Perform verification checks
//       const results = performVerificationChecks(mockProfile);
//       setVerificationResults(results);

//       setVerificationStep("complete");
//     } catch (err) {
//       setError(err.message || "Authorization failed");
//       onError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const performVerificationChecks = (profile) => {
//     const checks = [];
//     const requirements = platform.verification;

//     // Check follower count
//     if (requirements.minFollowers) {
//       const hasEnoughFollowers =
//         (profile.followerCount || 0) >= requirements.minFollowers;
//       checks.push({
//         requirement: `Minimum ${requirements.minFollowers} followers`,
//         passed: hasEnoughFollowers,
//         actual: profile.followerCount || 0,
//         icon: UsersIcon,
//       });
//     }

//     // Check subscriber count (YouTube)
//     if (requirements.minSubscribers) {
//       const hasEnoughSubscribers =
//         (profile.subscriberCount || 0) >= requirements.minSubscribers;
//       checks.push({
//         requirement: `Minimum ${requirements.minSubscribers} subscribers`,
//         passed: hasEnoughSubscribers,
//         actual: profile.subscriberCount || 0,
//         icon: UsersIcon,
//       });
//     }

//     // Check connection count (LinkedIn)
//     if (requirements.minConnections) {
//       const hasEnoughConnections =
//         (profile.connectionCount || 0) >= requirements.minConnections;
//       checks.push({
//         requirement: `Minimum ${requirements.minConnections} connections`,
//         passed: hasEnoughConnections,
//         actual: profile.connectionCount || 0,
//         icon: UsersIcon,
//       });
//     }

//     // Check account age
//     if (requirements.minAccountAge) {
//       const accountAge = profile.accountCreated
//         ? Math.floor(
//             (new Date() - new Date(profile.accountCreated)) /
//               (1000 * 60 * 60 * 24),
//           )
//         : 0;
//       const isOldEnough = accountAge >= requirements.minAccountAge;
//       checks.push({
//         requirement: `Account age minimum ${requirements.minAccountAge} days`,
//         passed: isOldEnough,
//         actual: `${accountAge} days`,
//         icon: CalendarIcon,
//       });
//     }

//     // Check verified status
//     if (requirements.requiresVerifiedEmail && profile.verified !== undefined) {
//       checks.push({
//         requirement: "Verified account status",
//         passed: profile.verified,
//         actual: profile.verified ? "Verified" : "Not verified",
//         icon: ShieldCheckIcon,
//       });
//     }

//     // Check username requirement
//     if (requirements.requiresUsername) {
//       const hasUsername = Boolean(profile.username);
//       checks.push({
//         requirement: "Public username required",
//         passed: hasUsername,
//         actual: hasUsername ? profile.username : "No username",
//         icon: ShieldCheckIcon,
//       });
//     }

//     return {
//       checks,
//       allPassed: checks.every((check) => check.passed),
//       passedCount: checks.filter((check) => check.passed).length,
//       totalCount: checks.length,
//     };
//   };

//   const handleCompleteVerification = () => {
//     if (verificationResults?.allPassed && profileData) {
//       onSuccess(platformKey, profileData);
//     } else {
//       onError(new Error("Verification requirements not met"));
//     }
//   };

//   const formatNumber = (num) => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
//     if (num >= 1000) return (num / 1000).toFixed(1) + "K";
//     return num?.toString() || "0";
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Button isIconOnly variant="flat" size="sm" onClick={onBack}>
//           <ArrowLeft size={16} />
//         </Button>

//         <div>
//           <h2 className="text-2xl font-bold text-white">
//             Verify {platform.name} Account
//           </h2>
//           <p className="text-gray-200">
//             Connect and verify your {platform.name} account ownership
//           </p>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <Card className="border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-4 flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-white">
//               Verification Progress
//             </h3>
//             <Chip color="primary" variant="flat">
//               Step{" "}
//               {verificationStep === "authorize"
//                 ? "1"
//                 : verificationStep === "verify"
//                   ? "2"
//                   : "3"}{" "}
//               of 3
//             </Chip>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Step 1: Authorization */}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                   verificationStep !== "authorize"
//                     ? "bg-green-600"
//                     : "bg-blue-600 animate-pulse"
//                 }`}
//               >
//                 {verificationStep !== "authorize" ? (
//                   <CheckCircleIcon size={16} className="text-white" />
//                 ) : (
//                   <ExternalLinkIcon size={16} className="text-white" />
//                 )}
//               </div>
//               <span
//                 className={`font-medium ${
//                   verificationStep !== "authorize"
//                     ? "text-green-400"
//                     : "text-blue-400"
//                 }`}
//               >
//                 Authorize
//               </span>
//             </div>

//             <div className="h-px flex-1 bg-gradient-to-r from-blue-500 to-purple-400"></div>

//             {/* Step 2: Verify */}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                   verificationStep === "complete"
//                     ? "bg-green-600"
//                     : verificationStep === "verify"
//                       ? "bg-blue-600 animate-pulse"
//                       : "bg-gray-600"
//                 }`}
//               >
//                 {verificationStep === "complete" ? (
//                   <CheckCircleIcon size={16} className="text-white" />
//                 ) : (
//                   <ShieldCheckIcon size={16} className="text-white" />
//                 )}
//               </div>
//               <span
//                 className={`font-medium ${
//                   verificationStep === "complete"
//                     ? "text-green-400"
//                     : verificationStep === "verify"
//                       ? "text-purple-400"
//                       : "text-gray-400"
//                 }`}
//               >
//                 Verify
//               </span>
//             </div>

//             <div className="h-px flex-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>

//             {/* Step 3: Complete */}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                   verificationStep === "complete"
//                     ? "bg-green-600"
//                     : "bg-gray-600"
//                 }`}
//               >
//                 <CheckCircleIcon size={16} className="text-white" />
//               </div>
//               <span
//                 className={`font-medium ${
//                   verificationStep === "complete"
//                     ? "text-green-400"
//                     : "text-gray-400"
//                 }`}
//               >
//                 Complete
//               </span>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {/* Authorization Step */}
//       {verificationStep === "authorize" && (
//         <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//           <CardBody className="p-8">
//             <div className="mb-8 text-center">
//               <div
//                 className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${platform.color}/20`}
//               >
//                 <Image
//                   width={40}
//                   height={40}
//                   src={platform.icon}
//                   alt={platform.name}
//                   className="rounded"
//                 />
//               </div>

//               <h3 className="mb-3 text-2xl font-bold text-white">
//                 Connect to {platform.name}
//               </h3>

//               <p className="mx-auto mb-6 max-w-2xl text-gray-200">
//                 {platform.description}
//               </p>
//             </div>

//             {/* Requirements Preview */}
//             <div className="bg-blue-900/20 mb-6 rounded-xl border border-blue-500/20 p-6">
//               <div className="flex items-start gap-3">
//                 <AlertCircleIcon size={20} className="mt-0.5 text-blue-400" />
//                 <div>
//                   <p className="mb-3 text-sm font-medium text-blue-400">
//                     Verification Requirements
//                   </p>
//                   <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                     {platform.verification.minFollowers && (
//                       <div className="text-sm text-gray-200">
//                         • {platform.verification.minFollowers}+ followers
//                       </div>
//                     )}
//                     {platform.verification.minSubscribers && (
//                       <div className="text-sm text-gray-200">
//                         • {platform.verification.minSubscribers}+ subscribers
//                       </div>
//                     )}
//                     {platform.verification.minConnections && (
//                       <div className="text-sm text-gray-200">
//                         • {platform.verification.minConnections}+ connections
//                       </div>
//                     )}
//                     {platform.verification.minAccountAge && (
//                       <div className="text-sm text-gray-200">
//                         • Account {platform.verification.minAccountAge}+ days
//                         old
//                       </div>
//                     )}
//                     {platform.verification.requiresVerifiedEmail && (
//                       <div className="text-sm text-gray-200">
//                         • Verified email address
//                       </div>
//                     )}
//                     {platform.verification.requiresUsername && (
//                       <div className="text-sm text-gray-200">
//                         • Public username
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Permissions Info */}
//             <div className="mb-6 rounded-xl bg-gray-800/50 p-4">
//               <p className="mb-2 text-sm font-medium text-gray-300">
//                 Permissions We'll Request:
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {platform.requiredScopes.map((scope, index) => (
//                   <Chip key={index} size="sm" variant="bordered">
//                     {scope}
//                   </Chip>
//                 ))}
//               </div>
//               <p className="mt-2 text-xs text-gray-500">
//                 Read-only access • No posting permissions • Secure OAuth 2.0
//               </p>
//             </div>

//             <Button
//               size="lg"
//               className={`w-full ${platform.color} font-semibold text-white`}
//               onClick={handleStartAuthorization}
//               isLoading={isLoading}
//               endContent={!isLoading && <ExternalLinkIcon size={16} />}
//             >
//               {isLoading ? "Connecting..." : `Connect ${platform.name} Account`}
//             </Button>
//           </CardBody>
//         </Card>
//       )}

//       {/* Verification Step */}
//       {verificationStep === "verify" && (
//         <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//           <CardBody className="p-8">
//             <div className="mb-8 text-center">
//               <Spinner size="lg" className="mb-4" color="purple" />
//               <h3 className="mb-2 text-xl font-bold text-white">
//                 Verifying Account
//               </h3>
//               <p className="text-gray-400">
//                 Checking your profile against requirements...
//               </p>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Complete Step */}
//       {verificationStep === "complete" &&
//         profileData &&
//         verificationResults && (
//           <div className="space-y-6">
//             {/* Profile Summary */}
//             <Card
//               className={`border ${platform.borderColor} bg-gradient-to-br ${platform.gradientFrom} ${platform.gradientTo} backdrop-blur-xl`}
//             >
//               <CardBody className="p-6">
//                 <div className="mb-4 flex items-center gap-4">
//                   <div className="relative">
//                     <div
//                       className={`flex h-16 w-16 items-center justify-center rounded-xl ${platform.color}/20`}
//                     >
//                       {profileData.profileImage || profileData.avatar ? (
//                         <Image
//                           width={48}
//                           height={48}
//                           src={profileData.profileImage || profileData.avatar}
//                           alt={profileData.displayName}
//                           className="rounded-xl"
//                         />
//                       ) : (
//                         <Image
//                           width={32}
//                           height={32}
//                           src={platform.icon}
//                           alt={platform.name}
//                           className="rounded"
//                         />
//                       )}
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-600">
//                       <CheckCircleIcon size={12} className="text-white" />
//                     </div>
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-white">
//                       {profileData.displayName}
//                     </h3>
//                     <p className="text-gray-300">
//                       @{profileData.username || profileData.id}
//                     </p>
//                     {profileData.bio && (
//                       <p className="mt-1 line-clamp-1 text-sm text-gray-400">
//                         {profileData.bio}
//                       </p>
//                     )}
//                   </div>

//                   <div className="text-right">
//                     <Chip
//                       color={
//                         verificationResults.allPassed ? "success" : "danger"
//                       }
//                       variant="flat"
//                       startContent={
//                         verificationResults.allPassed ? (
//                           <CheckCircleIcon size={12} />
//                         ) : (
//                           <AlertCircleIcon size={12} />
//                         )
//                       }
//                     >
//                       {verificationResults.allPassed
//                         ? "Verified"
//                         : "Requirements Not Met"}
//                     </Chip>
//                   </div>
//                 </div>

//                 {/* Profile Stats */}
//                 {(profileData.followerCount ||
//                   profileData.subscriberCount ||
//                   profileData.connectionCount) && (
//                   <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
//                     {profileData.followerCount && (
//                       <div className="text-center">
//                         <div className="text-lg font-bold text-white">
//                           {formatNumber(profileData.followerCount)}
//                         </div>
//                         <div className="text-xs text-gray-400">Followers</div>
//                       </div>
//                     )}
//                     {profileData.subscriberCount && (
//                       <div className="text-center">
//                         <div className="text-lg font-bold text-white">
//                           {formatNumber(profileData.subscriberCount)}
//                         </div>
//                         <div className="text-xs text-gray-400">Subscribers</div>
//                       </div>
//                     )}
//                     {profileData.connectionCount && (
//                       <div className="text-center">
//                         <div className="text-lg font-bold text-white">
//                           {formatNumber(profileData.connectionCount)}
//                         </div>
//                         <div className="text-xs text-gray-400">Connections</div>
//                       </div>
//                     )}
//                     {profileData.serverCount && (
//                       <div className="text-center">
//                         <div className="text-lg font-bold text-white">
//                           {profileData.serverCount}
//                         </div>
//                         <div className="text-xs text-gray-400">Servers</div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </CardBody>
//             </Card>

//             {/* Verification Results */}
//             <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//               <CardBody className="p-6">
//                 <div className="mb-6 flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-white">
//                     Verification Checks
//                   </h3>
//                   <Chip
//                     color={
//                       verificationResults.allPassed ? "success" : "warning"
//                     }
//                     variant="flat"
//                   >
//                     {verificationResults.passedCount}/
//                     {verificationResults.totalCount} Passed
//                   </Chip>
//                 </div>

//                 <div className="space-y-3">
//                   {verificationResults.checks.map((check, index) => {
//                     const IconComponent = check.icon;
//                     return (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between rounded-lg border border-gray-700/50 bg-gray-800/50 p-3"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                               check.passed ? "bg-green-600/20" : "bg-red-600/20"
//                             }`}
//                           >
//                             <IconComponent
//                               size={16}
//                               className={
//                                 check.passed ? "text-green-400" : "text-red-400"
//                               }
//                             />
//                           </div>
//                           <span className="text-white">
//                             {check.requirement}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <span className="text-sm text-gray-400">
//                             {check.actual}
//                           </span>
//                           {check.passed ? (
//                             <CheckCircleIcon
//                               size={16}
//                               className="text-green-400"
//                             />
//                           ) : (
//                             <AlertCircleIcon
//                               size={16}
//                               className="text-red-400"
//                             />
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </CardBody>
//             </Card>

//             {/* Action Buttons */}
//             <div className="flex gap-4">
//               <Button
//                 variant="flat"
//                 size="lg"
//                 onClick={onBack}
//                 startContent={<ArrowLeft size={16} />}
//               >
//                 Back
//               </Button>

//               {verificationResults.allPassed ? (
//                 <Button
//                   size="lg"
//                   color="success"
//                   className="flex-1 font-semibold"
//                   onClick={handleCompleteVerification}
//                   endContent={<CheckCircleIcon size={16} />}
//                 >
//                   Complete Verification
//                 </Button>
//               ) : (
//                 <div className="flex flex-1 gap-2">
//                   <Button
//                     variant="flat"
//                     size="lg"
//                     startContent={<RefreshCwIcon size={16} />}
//                     onClick={() => setVerificationStep("authorize")}
//                   >
//                     Try Again
//                   </Button>
//                   <Button
//                     size="lg"
//                     color="warning"
//                     className="flex-1"
//                     onClick={onBack}
//                   >
//                     Requirements Not Met
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//       {/* Error Display */}
//       {error && (
//         <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
//           <CardBody className="p-6">
//             <div className="flex items-start gap-3">
//               <AlertCircleIcon size={20} className="mt-0.5 text-red-400" />
//               <div>
//                 <h4 className="mb-2 font-medium text-red-400">
//                   Verification Error
//                 </h4>
//                 <p className="text-sm text-gray-300">{error}</p>
//                 <Button
//                   size="sm"
//                   variant="flat"
//                   color="danger"
//                   className="mt-3"
//                   onClick={() => {
//                     setError(null);
//                     setVerificationStep("authorize");
//                   }}
//                 >
//                   Try Again
//                 </Button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SocialVerificationFlow;

// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   ExternalLink,
//   ShieldCheck,
//   AlertCircle,
//   CheckCircle,
//   Users,
//   Calendar,
//   RefreshCw,
//   Globe,
// } from "lucide-react";
// import { Card, CardBody, Button, Chip } from "@heroui/react";

// const SocialVerificationFlow = ({
//   platform,
//   platformKey,
//   onBack,
//   onSuccess,
//   onError,
// }) => {
//   const [verificationStep, setVerificationStep] = useState("start"); // start, authorizing, complete
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [timeElapsed, setTimeElapsed] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (verificationStep === "authorizing") {
//       timer = setInterval(() => {
//         setTimeElapsed((prev) => prev + 1);
//       }, 1000);
//     }
//     return () => {
//       if (timer) clearInterval(timer);
//     };
//   }, [verificationStep]);

//   const handleStartAuthorization = async () => {
//     setIsLoading(true);
//     setError(null);
//     setVerificationStep("authorizing");

//     try {
//       // Redirect to backend OAuth endpoint
//       const authUrl = `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.login}`;

//       // Add current page info to return URL for better UX
//       const returnUrl = encodeURIComponent(
//         window.location.pathname + "?tab=socials",
//       );
//       const fullAuthUrl = `${authUrl}?returnUrl=${returnUrl}`;

//       console.log(`Redirecting to ${platform.name} OAuth:`, fullAuthUrl);

//       // Redirect to backend OAuth flow
//       window.location.href = fullAuthUrl;
//     } catch (err) {
//       console.error(`Error starting ${platform.name} OAuth:`, err);
//       setError(
//         err.message || `Failed to start ${platform.name} authentication`,
//       );
//       setVerificationStep("start");
//       setIsLoading(false);
//       onError(err);
//     }
//   };

//   const handleRetryAuthorization = () => {
//     setError(null);
//     setTimeElapsed(0);
//     setVerificationStep("start");
//     setIsLoading(false);
//   };

//   const formatRequirements = (verification) => {
//     const requirements = [];

//     if (verification.minFollowers) {
//       requirements.push({
//         text: `${verification.minFollowers}+ followers`,
//         icon: Users,
//       });
//     }
//     if (verification.minSubscribers) {
//       requirements.push({
//         text: `${verification.minSubscribers}+ subscribers`,
//         icon: Users,
//       });
//     }
//     if (verification.minConnections) {
//       requirements.push({
//         text: `${verification.minConnections}+ connections`,
//         icon: Users,
//       });
//     }
//     if (verification.minAccountAge) {
//       requirements.push({
//         text: `Account ${verification.minAccountAge}+ days old`,
//         icon: Calendar,
//       });
//     }
//     if (verification.minServerCount) {
//       requirements.push({
//         text: `Member of ${verification.minServerCount}+ servers`,
//         icon: Globe,
//       });
//     }
//     if (verification.requiresVerifiedEmail) {
//       requirements.push({
//         text: "Verified email address",
//         icon: ShieldCheck,
//       });
//     }
//     if (verification.requiresUsername) {
//       requirements.push({
//         text: "Public username required",
//         icon: ShieldCheck,
//       });
//     }

//     return requirements;
//   };

//   const requirements = formatRequirements(platform.verification);

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Button isIconOnly variant="flat" size="sm" onPress={onBack}>
//           <ArrowLeft size={16} />
//         </Button>

//         <div>
//           <h2 className="text-2xl font-bold text-white">
//             Connect {platform.name}
//           </h2>
//           <p className="text-gray-200">
//             Verify your {platform.name} account to enhance your ambassador
//             profile
//           </p>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <Card className="border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-4 flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-white">
//               Connection Progress
//             </h3>
//             <Chip color="primary" variant="flat">
//               {verificationStep === "start" && "Ready to Connect"}
//               {verificationStep === "authorizing" && "Authenticating..."}
//               {verificationStep === "complete" && "Complete"}
//             </Chip>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Step 1: Start */}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                   verificationStep !== "start" ? "bg-green-600" : "bg-blue-600"
//                 }`}
//               >
//                 {verificationStep !== "start" ? (
//                   <CheckCircle size={16} className="text-white" />
//                 ) : (
//                   <ShieldCheck size={16} className="text-white" />
//                 )}
//               </div>
//               <span
//                 className={`font-medium ${
//                   verificationStep !== "start"
//                     ? "text-green-400"
//                     : "text-blue-400"
//                 }`}
//               >
//                 Initialize
//               </span>
//             </div>

//             <div className="h-px flex-1 bg-gradient-to-r from-blue-500 to-purple-400"></div>

//             {/* Step 2: Authorize */}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                   verificationStep === "complete"
//                     ? "bg-green-600"
//                     : verificationStep === "authorizing"
//                       ? "bg-blue-600 animate-pulse"
//                       : "bg-gray-600"
//                 }`}
//               >
//                 {verificationStep === "complete" ? (
//                   <CheckCircle size={16} className="text-white" />
//                 ) : (
//                   <ExternalLink size={16} className="text-white" />
//                 )}
//               </div>
//               <span
//                 className={`font-medium ${
//                   verificationStep === "complete"
//                     ? "text-green-400"
//                     : verificationStep === "authorizing"
//                       ? "text-purple-400"
//                       : "text-gray-400"
//                 }`}
//               >
//                 Authorize
//               </span>
//             </div>

//             <div className="h-px flex-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>

//             {/* Step 3: Complete */}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-full ${
//                   verificationStep === "complete"
//                     ? "bg-green-600"
//                     : "bg-gray-600"
//                 }`}
//               >
//                 <CheckCircle size={16} className="text-white" />
//               </div>
//               <span
//                 className={`font-medium ${
//                   verificationStep === "complete"
//                     ? "text-green-400"
//                     : "text-gray-400"
//                 }`}
//               >
//                 Complete
//               </span>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {/* Start Step */}
//       {verificationStep === "start" && (
//         <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//           <CardBody className="p-8">
//             <div className="mb-8 text-center">
//               <div
//                 className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${platform.color}/20`}
//               >
//                 <img
//                   src={platform.icon}
//                   alt={platform.name}
//                   className="h-10 w-10 rounded"
//                 />
//               </div>

//               <h3 className="mb-3 text-2xl font-bold text-white">
//                 Connect to {platform.name}
//               </h3>

//               <p className="mx-auto mb-6 max-w-2xl text-gray-200">
//                 {platform.description}
//               </p>
//             </div>

//             {/* Requirements Preview */}
//             {requirements.length > 0 && (
//               <div className="bg-blue-900/20 mb-6 rounded-xl border border-blue-500/20 p-6">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle size={20} className="mt-0.5 text-blue-400" />
//                   <div>
//                     <p className="mb-3 text-sm font-medium text-blue-400">
//                       Verification Requirements
//                     </p>
//                     <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                       {requirements.map((req, index) => {
//                         const IconComponent = req.icon;
//                         return (
//                           <div
//                             key={index}
//                             className="flex items-center gap-2 text-sm text-gray-200"
//                           >
//                             <IconComponent
//                               size={14}
//                               className="text-blue-300"
//                             />
//                             <span>{req.text}</span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Permissions Info */}
//             <div className="mb-6 rounded-xl bg-gray-800/50 p-4">
//               <p className="mb-2 text-sm font-medium text-gray-300">
//                 Permissions We'll Request:
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {platform.requiredScopes.map((scope, index) => (
//                   <Chip key={index} size="sm" variant="bordered">
//                     {scope}
//                   </Chip>
//                 ))}
//               </div>
//               <p className="mt-2 text-xs text-gray-500">
//                 Read-only access • No posting permissions • Secure OAuth 2.0
//               </p>
//             </div>

//             {/* Security Notice */}
//             <div className="mb-6 rounded-xl border border-green-500/20 bg-green-900/20 p-4">
//               <div className="flex items-start gap-3">
//                 <ShieldCheck size={20} className="mt-0.5 text-green-400" />
//                 <div>
//                   <p className="mb-2 text-sm font-medium text-green-400">
//                     Secure Authentication
//                   </p>
//                   <div className="space-y-1 text-xs text-gray-300">
//                     <p>• Your credentials are never stored on our servers</p>
//                     <p>• Only basic profile information is accessed</p>
//                     <p>• You can disconnect at any time</p>
//                     <p>• Industry-standard OAuth 2.0 security</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Button
//               size="lg"
//               className={`w-full ${platform.color} font-semibold text-white`}
//               onPress={handleStartAuthorization}
//               isLoading={isLoading}
//               endContent={!isLoading && <ExternalLink size={16} />}
//             >
//               {isLoading ? "Connecting..." : `Connect ${platform.name} Account`}
//             </Button>
//           </CardBody>
//         </Card>
//       )}

//       {/* Authorizing Step */}
//       {verificationStep === "authorizing" && (
//         <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl">
//           <CardBody className="p-8">
//             <div className="text-center">
//               <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20">
//                 <ExternalLink
//                   size={40}
//                   className="animate-pulse text-purple-400"
//                 />
//               </div>

//               <h3 className="mb-3 text-2xl font-bold text-white">
//                 Complete Authentication
//               </h3>

//               <p className="mx-auto mb-6 max-w-2xl text-gray-200">
//                 You should have been redirected to {platform.name} in a new tab
//                 or window. Please complete the authentication process there and
//                 you'll be automatically redirected back here.
//               </p>

//               <div className="mb-6 flex items-center justify-center gap-2">
//                 <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
//                 <span className="text-sm text-gray-400">
//                   Waiting for authentication... {Math.floor(timeElapsed / 60)}:
//                   {(timeElapsed % 60).toString().padStart(2, "0")}
//                 </span>
//               </div>

//               <div className="mx-auto max-w-lg space-y-4">
//                 <Button
//                   size="lg"
//                   variant="flat"
//                   className="w-full"
//                   startContent={<ExternalLink size={16} />}
//                   onPress={() => {
//                     const authUrl = `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.login}`;
//                     window.open(authUrl, "_blank");
//                   }}
//                 >
//                   Open {platform.name} Authentication
//                 </Button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Troubleshooting */}
//       <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="flex items-start gap-3">
//             <AlertCircle size={20} className="mt-0.5 text-yellow-400" />

//             <div>
//               <h4 className="mb-2 font-medium text-yellow-400">
//                 Having trouble connecting?
//               </h4>

//               <div className="space-y-2 text-sm text-gray-100">
//                 <p>• Make sure pop-ups are enabled for this site</p>
//                 <p>
//                   • Check if you're logged into {platform.name} in another tab
//                 </p>
//                 <p>• Clear your browser cache and try again</p>
//                 <p>• Ensure you have a stable internet connection</p>
//                 <p>• Try using a different browser if issues persist</p>
//               </div>

//               <div className="mt-4 flex gap-2">
//                 <Button
//                   size="sm"
//                   variant="flat"
//                   color="warning"
//                   startContent={<RefreshCw size={16} />}
//                   onPress={handleRetryAuthorization}
//                 >
//                   Try Again
//                 </Button>
//                 <Button size="sm" variant="flat" onPress={onBack}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       {/* Error Display */}
//       {error && (
//         <Card className="border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl">
//           <CardBody className="p-6">
//             <div className="flex items-start gap-3">
//               <AlertCircle size={20} className="mt-0.5 text-red-400" />
//               <div>
//                 <h4 className="mb-2 font-medium text-red-400">
//                   Connection Failed
//                 </h4>
//                 <p className="text-sm text-gray-300">{error}</p>
//                 <div className="mt-3 flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="flat"
//                     color="danger"
//                     startContent={<RefreshCw size={16} />}
//                     onPress={handleRetryAuthorization}
//                   >
//                     Retry Connection
//                   </Button>
//                   <Button size="sm" variant="flat" onPress={onBack}>
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
//       )}

//       {/* Auto-refresh notice */}
//       <div className="text-center">
//         <p className="text-sm text-gray-400">
//           This page will automatically refresh once the connection is complete.
//           If it doesn't, please refresh manually or click "Try Again" above.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SocialVerificationFlow;

"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Users,
  Calendar,
  Globe,
} from "lucide-react";
import { Card, CardBody, Button, Chip } from "@heroui/react";

const SocialVerificationFlow = ({ platform, platformKey, onBack }) => {
  const formatRequirements = (verification) => {
    const requirements = [];

    if (verification.minFollowers) {
      requirements.push({
        text: `${verification.minFollowers}+ followers`,
        icon: Users,
      });
    }
    if (verification.minSubscribers) {
      requirements.push({
        text: `${verification.minSubscribers}+ subscribers`,
        icon: Users,
      });
    }
    if (verification.minConnections) {
      requirements.push({
        text: `${verification.minConnections}+ connections`,
        icon: Users,
      });
    }
    if (verification.minAccountAge) {
      requirements.push({
        text: `Account ${verification.minAccountAge}+ days old`,
        icon: Calendar,
      });
    }
    if (verification.minServerCount) {
      requirements.push({
        text: `Member of ${verification.minServerCount}+ servers`,
        icon: Globe,
      });
    }
    if (verification.requiresVerifiedEmail) {
      requirements.push({
        text: "Verified email address",
        icon: ShieldCheck,
      });
    }
    if (verification.requiresUsername) {
      requirements.push({
        text: "Public username required",
        icon: ShieldCheck,
      });
    }

    return requirements;
  };

  const requirements = formatRequirements(platform.verification);

  // Build OAuth URL with return path
  const returnUrl = encodeURIComponent("/settings?tab=socials");
  const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.login}?returnUrl=${returnUrl}`;
  // const oauthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.X_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.X_REDIRECT_URI)}&scope=users.read&state=abc&code_challenge=challenge&code_challenge_method=plain`;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button isIconOnly variant="flat" size="sm" onPress={onBack}>
          <ArrowLeft size={16} />
        </Button>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Connect {platform.name}
          </h2>
          <p className="text-gray-200">
            Ready to connect your {platform.name} account to your ambassador
            profile
          </p>
        </div>
      </div>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-8">
          <div className="mb-8 text-center">
            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${platform.color}/20`}
            >
              <img
                src={platform.icon}
                alt={platform.name}
                className="h-10 w-10 rounded"
              />
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white">
              Connect to {platform.name}
            </h3>

            <p className="mx-auto mb-6 max-w-2xl text-gray-200">
              {platform.description}
            </p>
          </div>

          {requirements.length > 0 && (
            <div className="bg-blue-900/20 mb-6 rounded-xl border border-blue-500/20 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 text-blue-400" />
                <div>
                  <p className="mb-3 text-sm font-medium text-blue-400">
                    Verification Requirements
                  </p>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {requirements.map((req, index) => {
                      const IconComponent = req.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-200"
                        >
                          <IconComponent size={14} className="text-blue-300" />
                          <span>{req.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 rounded-xl bg-gray-800/50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-300">
              Permissions We'll Request:
            </p>
            <div className="flex flex-wrap gap-2">
              {platform.requiredScopes.map((scope, index) => (
                <Chip key={index} size="sm" variant="bordered">
                  {scope}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Read-only access • No posting permissions • Secure OAuth 2.0
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-900/20 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 text-green-400" />
              <div>
                <p className="mb-2 text-sm font-medium text-green-400">
                  Secure Authentication
                </p>
                <div className="space-y-1 text-xs text-gray-300">
                  <p>• Your credentials are never stored on our servers</p>
                  <p>• Only basic profile information is accessed</p>
                  <p>• You can disconnect at any time</p>
                  <p>• Industry-standard OAuth 2.0 security</p>
                </div>
              </div>
            </div>
          </div>

          <Link href={oauthUrl} className="block">
            <Button
              size="lg"
              className={`w-full ${platform.color} font-semibold text-white`}
              endContent={<ExternalLink size={16} />}
            >
              Connect {platform.name} Account
            </Button>
          </Link>
        </CardBody>
      </Card>

      <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            What happens next?
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/20">
                <span className="text-xs font-bold text-purple-400">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Redirect to {platform.name}
                </p>
                <p className="text-xs text-gray-400">
                  You'll be securely redirected to {platform.name}'s
                  authorization page
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/20">
                <span className="text-xs font-bold text-purple-400">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Grant Permission
                </p>
                <p className="text-xs text-gray-400">
                  Authorize our app to access your basic profile information
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600/20">
                <span className="text-xs font-bold text-purple-400">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Return Here</p>
                <p className="text-xs text-gray-400">
                  You'll be redirected back to this page with your account
                  connected
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 text-yellow-400" />

            <div>
              <h4 className="mb-2 font-medium text-yellow-400">
                Need help connecting?
              </h4>

              <div className="space-y-1 text-sm text-gray-100">
                <p>• Make sure pop-ups are enabled for this site</p>
                <p>• Ensure you're logged into {platform.name}</p>
                <p>• Check your internet connection</p>
                <p>• Try using a different browser if issues persist</p>
              </div>

              <div className="mt-4">
                <Button size="sm" variant="flat" onPress={onBack}>
                  Back to Social Connections
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SocialVerificationFlow;
