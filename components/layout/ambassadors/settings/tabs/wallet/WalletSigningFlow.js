// "use client";

// import {
//   ArrowLeft,
//   ArrowRight,
//   User2Icon,
//   PenToolIcon,
//   ShieldCheckIcon,
//   AlertCircleIcon,
// } from "lucide-react";
// import React from "react";
// import { addToast } from "@heroui/react";
// import { useEthersSigner } from "@/wagmi/ethersSigner";
// import { Button, Card, CardBody, Input, Chip } from "@heroui/react";

// import { getNetworkConfig } from "@/config/networks";

// import CopyToClipboard from "@/components/ui/CopyToClipboard";

// const WalletSigningFlow = ({
//   onBack,
//   address,
//   onSignatureError,
//   verificationState,
//   onSignatureSuccess,
//   updateVerificationState,
// }) => {
//   const signer = useEthersSigner();

//   const handleSignMessage = async (e) => {
//     e.preventDefault();

//     updateVerificationState({ isSigningMessage: true });

//     try {
//       // 1. Request sign message from backend
//       const requestRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/request-sign-message`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ wallet_address: address }),
//         },
//       );

//       if (!requestRes.ok) {
//         throw new Error("Failed to fetch sign message");
//       }

//       const messageData = await requestRes.json();
//       const message = messageData?.data?.message;

//       if (!message) {
//         throw new Error("No message received from server");
//       }

//       // 2. Sign the message
//       const signature = await signer.signMessage(message);
//       const nonce = message.split("Nonce: ")[1];

//       // 3. Verify signature with backend
//       const verifyRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/connect-wallet`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             wallet_address: address,
//             signature,
//             nonce,
//           }),
//           credentials: "include",
//         },
//       );

//       if (!verifyRes.ok) {
//         throw new Error("Signature verification failed");
//       }

//       const data = await verifyRes.json();

//       localStorage.removeItem("neo-jwt");
//       localStorage.setItem("neo-jwt", data.token);

//       addToast({
//         title: "Wallet Connected Successfully",
//         description: "Your wallet has been connected and verified.",
//         color: "success",
//       });

//       onSignatureSuccess();
//     } catch (err) {
//       addToast({
//         title: err.message || "Wallet verification failed",
//         color: "danger",
//       });

//       console.error("❌ Wallet verification failed:", err);
//       onSignatureError(err);
//     } finally {
//       updateVerificationState({ isSigningMessage: false });
//     }
//   };

//   const getCurrentNetwork = () => {
//     try {
//       return getNetworkConfig(verificationState.selectedNetwork);
//     } catch {
//       return getNetworkConfig("neo");
//     }
//   };

//   const currentNetwork = getCurrentNetwork();

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center gap-4">
//         <Button isIconOnly variant="flat" size="sm" onClick={onBack}>
//           <ArrowLeft size={16} />
//         </Button>

//         <div>
//           <h2 className="text-2xl font-bold text-white">
//             Verify Wallet Ownership
//           </h2>

//           <p className="text-gray-200">
//             Complete the verification process to secure your account
//           </p>
//         </div>
//       </div>

//       <Card className="border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-4 flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-white">
//               Verification Steps
//             </h3>

//             <Chip color="danger" variant="flat">
//               Step 2 of 2
//             </Chip>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
//                 <ShieldCheckIcon size={16} className="text-white" />
//               </div>

//               <span className="font-medium text-green-400">
//                 Wallet Connected
//               </span>
//             </div>

//             <div className="h-px flex-1 bg-gradient-to-r from-green-500 to-pink-400"></div>

//             <div className="flex items-center gap-2">
//               <div className="bg-blue-600 flex h-8 w-8 animate-pulse items-center justify-center rounded-full">
//                 <PenToolIcon size={16} className="text-white" />
//               </div>

//               <span className="font-medium text-pink-400">Sign Message</span>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-8">
//           <div className="mb-8 text-center">
//             <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20">
//               <PenToolIcon size={40} className="text-purple-400" />
//             </div>

//             <h3 className="mb-3 text-2xl font-bold text-white">
//               Sign Message to Verify Ownership
//             </h3>

//             <p className="mx-auto max-w-2xl text-gray-200">
//               This proves you control the wallet without sharing your private
//               key. It's a one-time, gasless signature that helps us authenticate
//               you safely.
//             </p>
//           </div>

//           <form
//             onSubmit={handleSignMessage}
//             className="mx-auto max-w-xl space-y-6"
//           >
//             <div className="flex gap-3">
//               <div className="h-fit w-fit rounded-full border border-gray-600 bg-gray-800/50 p-2.5">
//                 <User2Icon size={20} className="text-gray-300" />
//               </div>

//               <Input
//                 readOnly
//                 type="text"
//                 variant="bordered"
//                 label="Your Wallet Address"
//                 value={address || "0x00000000000000000000000000000000000000"}
//                 classNames={{
//                   input: "text-white font-mono",
//                   label: "text-gray-300",
//                   inputWrapper:
//                     "bg-gray-800/50 border-gray-600 focus-within:!border-gray-600",
//                 }}
//                 endContent={
//                   <CopyToClipboard
//                     text={address || "0x00000000000000000000000000000000000000"}
//                     size={20}
//                   />
//                 }
//               />
//             </div>

//             <div className="bg-blue-900/20 rounded-xl border border-blue-500/20 p-4">
//               <div className="flex items-start gap-3">
//                 <AlertCircleIcon size={20} className="mt-0.5 text-pink-600" />

//                 <div>
//                   <p className="text-sm font-medium text-pink-600">
//                     What happens when you sign?
//                   </p>

//                   <ul className="mt-2 space-y-1 text-sm text-gray-200">
//                     <li>• No gas fees or blockchain transaction</li>
//                     <li>• Your private keys remain secure in your wallet</li>
//                     <li>• We verify you own this wallet address</li>
//                     <li>• Your account will be linked to this wallet</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               size="lg"
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white"
//               isLoading={verificationState.isSigningMessage}
//               endContent={
//                 !verificationState.isSigningMessage && <ArrowRight size={16} />
//               }
//               disabled={!address}
//             >
//               {verificationState.isSigningMessage
//                 ? "Verifying Signature..."
//                 : "Sign Message"}
//             </Button>

//             <p className="text-center text-sm text-gray-200">
//               By signing, you confirm ownership of this wallet address
//             </p>
//           </form>
//         </CardBody>
//       </Card>

//       <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="flex items-start gap-3">
//             <AlertCircleIcon size={20} className="mt-0.5 text-yellow-400" />

//             <div>
//               <h4 className="mb-2 font-medium text-yellow-400">Need Help?</h4>

//               <div className="space-y-1 text-sm text-gray-100">
//                 <p>• Make sure your wallet is unlocked and connected</p>
//                 <p>
//                   • Check that you're on the correct network (
//                   {currentNetwork.displayName})
//                 </p>
//                 <p>
//                   • If signing fails, try refreshing and reconnecting your
//                   wallet
//                 </p>
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default WalletSigningFlow;

// "use client";

// import {
//   ArrowLeft,
//   ArrowRight,
//   User2Icon,
//   PenToolIcon,
//   ShieldCheckIcon,
//   AlertCircleIcon,
// } from "lucide-react";
// import React from "react";
// import { addToast } from "@heroui/react";
// import { useEthersSigner } from "@/wagmi/ethersSigner";
// import { Button, Card, CardBody, Input, Chip } from "@heroui/react";

// import { getNetworkConfig } from "@/config/networks";
// import CopyToClipboard from "@/components/ui/CopyToClipboard";

// const WalletSigningFlow = ({
//   onBack,
//   address,
//   onSignatureError,
//   verificationState,
//   onSignatureSuccess,
//   updateVerificationState,
// }) => {
//   const signer = useEthersSigner();

//   const handleSignMessage = async (e) => {
//     e.preventDefault();

//     updateVerificationState({ isSigningMessage: true });

//     try {
//       // 1. Request sign message from backend
//       const requestRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/request-sign-message`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ wallet_address: address }),
//         },
//       );

//       if (!requestRes.ok) {
//         throw new Error("Failed to fetch sign message");
//       }

//       const messageData = await requestRes.json();
//       const message = messageData?.data?.message;

//       if (!message) {
//         throw new Error("No message received from server");
//       }

//       // 2. Sign the message
//       const signature = await signer.signMessage(message);
//       const nonce = message.split("Nonce: ")[1];

//       // 3. Verify signature with backend
//       const verifyRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/connect-wallet`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             wallet_address: address,
//             signature,
//             nonce,
//           }),
//           credentials: "include",
//         },
//       );

//       if (!verifyRes.ok) {
//         throw new Error("Signature verification failed");
//       }

//       const data = await verifyRes.json();

//       localStorage.removeItem("neo-jwt");
//       localStorage.setItem("neo-jwt", data.token);

//       addToast({
//         title: "Wallet Connected Successfully",
//         description: "Your wallet has been connected and verified.",
//         color: "success",
//       });

//       onSignatureSuccess();
//     } catch (err) {
//       addToast({
//         title: err.message || "Wallet verification failed",
//         color: "danger",
//       });

//       console.error("❌ Wallet verification failed:", err);
//       onSignatureError(err);
//     } finally {
//       updateVerificationState({ isSigningMessage: false });
//     }
//   };

//   const getCurrentNetwork = () => {
//     try {
//       return getNetworkConfig(verificationState.selectedNetwork);
//     } catch {
//       return getNetworkConfig("neo");
//     }
//   };

//   const currentNetwork = getCurrentNetwork();

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center gap-4">
//         <Button isIconOnly variant="flat" size="sm" onClick={onBack}>
//           <ArrowLeft size={16} />
//         </Button>

//         <div>
//           <h2 className="text-2xl font-bold text-white">
//             Verify Wallet Ownership
//           </h2>
//           <p className="text-gray-200">
//             Complete the verification process to secure your account
//           </p>
//         </div>
//       </div>

//       <Card className="border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="mb-4 flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-white">
//               Verification Steps
//             </h3>
//             <Chip color="danger" variant="flat">
//               Step 2 of 2
//             </Chip>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
//                 <ShieldCheckIcon size={16} className="text-white" />
//               </div>
//               <span className="font-medium text-green-400">
//                 Wallet Connected
//               </span>
//             </div>

//             <div className="h-px flex-1 bg-gradient-to-r from-green-500 to-pink-400"></div>

//             <div className="flex items-center gap-2">
//               <div className="bg-blue-600 flex h-8 w-8 animate-pulse items-center justify-center rounded-full">
//                 <PenToolIcon size={16} className="text-white" />
//               </div>
//               <span className="font-medium text-pink-400">Sign Message</span>
//             </div>
//           </div>
//         </CardBody>
//       </Card>

//       <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
//         <CardBody className="p-8">
//           <div className="mb-8 text-center">
//             <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20">
//               <PenToolIcon size={40} className="text-purple-400" />
//             </div>

//             <h3 className="mb-3 text-2xl font-bold text-white">
//               Sign Message to Verify Ownership
//             </h3>

//             <p className="mx-auto max-w-2xl text-gray-200">
//               This proves you control the wallet without sharing your private
//               key. It's a one-time, gasless signature that helps us authenticate
//               you safely.
//             </p>
//           </div>

//           <form
//             onSubmit={handleSignMessage}
//             className="mx-auto max-w-xl space-y-6"
//           >
//             <div className="flex gap-3">
//               <div className="h-fit w-fit rounded-full border border-gray-600 bg-gray-800/50 p-2.5">
//                 <User2Icon size={20} className="text-gray-300" />
//               </div>

//               <Input
//                 readOnly
//                 type="text"
//                 variant="bordered"
//                 label="Your Wallet Address"
//                 value={address || "0x00000000000000000000000000000000000000"}
//                 classNames={{
//                   input: "text-white font-mono",
//                   label: "text-gray-300",
//                   inputWrapper:
//                     "bg-gray-800/50 border-gray-600 focus-within:!border-gray-600",
//                 }}
//                 endContent={
//                   <CopyToClipboard
//                     text={address || "0x00000000000000000000000000000000000000"}
//                     size={20}
//                   />
//                 }
//               />
//             </div>

//             <div className="bg-blue-900/20 rounded-xl border border-blue-500/20 p-4">
//               <div className="flex items-start gap-3">
//                 <AlertCircleIcon size={20} className="mt-0.5 text-pink-600" />

//                 <div>
//                   <p className="text-sm font-medium text-pink-600">
//                     What happens when you sign?
//                   </p>

//                   <ul className="mt-2 space-y-1 text-sm text-gray-200">
//                     <li>• No gas fees or blockchain transaction</li>
//                     <li>• Your private keys remain secure in your wallet</li>
//                     <li>• We verify you own this wallet address</li>
//                     <li>• Your account will be linked to this wallet</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               size="lg"
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white"
//               isLoading={verificationState.isSigningMessage}
//               endContent={
//                 !verificationState.isSigningMessage && <ArrowRight size={16} />
//               }
//               isDisabled={!address}
//             >
//               {verificationState.isSigningMessage
//                 ? "Verifying Signature..."
//                 : "Sign Message"}
//             </Button>

//             <p className="text-center text-sm text-gray-200">
//               By signing, you confirm ownership of this wallet address
//             </p>
//           </form>
//         </CardBody>
//       </Card>

//       <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
//         <CardBody className="p-6">
//           <div className="flex items-start gap-3">
//             <AlertCircleIcon size={20} className="mt-0.5 text-yellow-400" />

//             <div>
//               <h4 className="mb-2 font-medium text-yellow-400">Need Help?</h4>

//               <div className="space-y-1 text-sm text-gray-100">
//                 <p>• Make sure your wallet is unlocked and connected</p>
//                 <p>
//                   • Check that you're on the correct network (
//                   {currentNetwork.displayName})
//                 </p>
//                 <p>
//                   • If signing fails, try refreshing and reconnecting your
//                   wallet
//                 </p>
//               </div>
//             </div>
//           </div>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default WalletSigningFlow;

"use client";

import {
  User2Icon,
  ArrowLeft,
  ArrowRight,
  PenToolIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
} from "lucide-react";
import { addToast } from "@heroui/react";
import React, { useCallback, useMemo } from "react";
import { useEthersSigner } from "@/wagmi/ethersSigner";
import { Button, Card, CardBody, Input, Chip } from "@heroui/react";

import { getNetworkConfig } from "@/config/networks";

import CopyToClipboard from "@/components/ui/CopyToClipboard";

// Constants moved outside component to prevent re-creation
const API_ENDPOINTS = {
  REQUEST_SIGN: "/auth/request-sign-message",
  CONNECT_WALLET: "/auth/connect-wallet",
};

const TOAST_MESSAGES = {
  SUCCESS: {
    title: "Wallet Connected Successfully",
    description: "Your wallet has been connected and verified.",
    color: "success",
  },
  ERROR: {
    color: "danger",
  },
};

const DEFAULT_ADDRESS = "0x00000000000000000000000000000000000000";

const WalletSigningFlow = ({
  onBack,
  address,
  onSignatureError,
  verificationState,
  onSignatureSuccess,
  updateVerificationState,
}) => {
  const signer = useEthersSigner();

  // Memoize network config to prevent unnecessary recalculations
  const currentNetwork = useMemo(() => {
    try {
      return getNetworkConfig(verificationState.selectedNetwork);
    } catch {
      return getNetworkConfig("neo");
    }
  }, [verificationState.selectedNetwork]);

  // Memoize display address to prevent re-renders
  const displayAddress = useMemo(() => address || DEFAULT_ADDRESS, [address]);

  // Memoize API URL to prevent string concatenation on every render
  const apiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL, []);

  const handleSignMessage = useCallback(
    async (e) => {
      e.preventDefault();

      updateVerificationState({ isSigningMessage: true });

      try {
        // 1. Request sign message from backend
        const requestRes = await fetch(
          `${apiBaseUrl}${API_ENDPOINTS.REQUEST_SIGN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet_address: address }),
          },
        );

        if (!requestRes.ok) {
          throw new Error("Failed to fetch sign message");
        }

        const messageData = await requestRes.json();
        const message = messageData?.data?.message;

        if (!message) {
          throw new Error("No message received from server");
        }

        // 2. Sign the message
        const signature = await signer.signMessage(message);
        const nonce = message.split("Nonce: ")[1];

        // 3. Verify signature with backend
        const verifyRes = await fetch(
          `${apiBaseUrl}${API_ENDPOINTS.CONNECT_WALLET}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              wallet_address: address,
              signature,
              nonce,
            }),
            credentials: "include",
          },
        );

        if (!verifyRes.ok) {
          throw new Error("Signature verification failed");
        }

        const data = await verifyRes.json();

        // Use a single localStorage operation
        localStorage.setItem("neo-jwt", data.token);

        addToast(TOAST_MESSAGES.SUCCESS);
        onSignatureSuccess();
      } catch (err) {
        const errorMessage = err.message || "Wallet verification failed";

        addToast({
          ...TOAST_MESSAGES.ERROR,
          title: errorMessage,
        });

        console.error("❌ Wallet verification failed:", err);
        onSignatureError(err);
      } finally {
        updateVerificationState({ isSigningMessage: false });
      }
    },
    [
      signer,
      address,
      apiBaseUrl,
      updateVerificationState,
      onSignatureSuccess,
      onSignatureError,
    ],
  );

  // Memoize button content to prevent re-creation
  const buttonContent = useMemo(() => {
    return verificationState.isSigningMessage
      ? "Verifying Signature..."
      : "Sign Message";
  }, [verificationState.isSigningMessage]);

  const buttonEndContent = useMemo(() => {
    return !verificationState.isSigningMessage ? (
      <ArrowRight size={16} />
    ) : null;
  }, [verificationState.isSigningMessage]);

  // Memoize help text to prevent re-creation
  const helpText = useMemo(
    () => (
      <div className="space-y-1 text-sm text-gray-100">
        <p>• Make sure your wallet is unlocked and connected</p>
        <p>
          • Check that you're on the correct network (
          {currentNetwork.displayName})
        </p>
        <p>• If signing fails, try refreshing and reconnecting your wallet</p>
      </div>
    ),
    [currentNetwork.displayName],
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button isIconOnly variant="flat" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Verify Wallet Ownership
          </h2>
          <p className="text-gray-200">
            Complete the verification process to secure your account
          </p>
        </div>
      </div>

      <Card className="border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Verification Steps
            </h3>
            <Chip color="danger" variant="flat">
              Step 2 of 2
            </Chip>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                <ShieldCheckIcon size={16} className="text-white" />
              </div>
              <span className="font-medium text-green-400">
                Wallet Connected
              </span>
            </div>

            <div className="h-px flex-1 bg-gradient-to-r from-green-500 to-pink-400"></div>

            <div className="flex items-center gap-2">
              <div className="bg-blue-600 flex h-8 w-8 animate-pulse items-center justify-center rounded-full">
                <PenToolIcon size={16} className="text-white" />
              </div>
              <span className="font-medium text-pink-400">Sign Message</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20">
              <PenToolIcon size={40} className="text-purple-400" />
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white">
              Sign Message to Verify Ownership
            </h3>

            <p className="mx-auto max-w-2xl text-gray-200">
              This proves you control the wallet without sharing your private
              key. It's a one-time, gasless signature that helps us authenticate
              you safely.
            </p>
          </div>

          <form
            onSubmit={handleSignMessage}
            className="mx-auto max-w-xl space-y-6"
          >
            <div className="flex gap-3">
              <div className="h-fit w-fit rounded-full border border-gray-600 bg-gray-800/50 p-2.5">
                <User2Icon size={20} className="text-gray-300" />
              </div>

              <Input
                readOnly
                type="text"
                variant="bordered"
                label="Your Wallet Address"
                value={displayAddress}
                classNames={{
                  input: "text-white font-mono",
                  label: "text-gray-300",
                  inputWrapper:
                    "bg-gray-800/50 border-gray-600 focus-within:!border-gray-600",
                }}
                endContent={<CopyToClipboard text={displayAddress} size={20} />}
              />
            </div>

            <div className="bg-blue-900/20 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-start gap-3">
                <AlertCircleIcon size={20} className="mt-0.5 text-pink-600" />

                <div>
                  <p className="text-sm font-medium text-pink-600">
                    What happens when you sign?
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-gray-200">
                    <li>• No gas fees or blockchain transaction</li>
                    <li>• Your private keys remain secure in your wallet</li>
                    <li>• We verify you own this wallet address</li>
                    <li>• Your account will be linked to this wallet</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white"
              isLoading={verificationState.isSigningMessage}
              endContent={buttonEndContent}
              isDisabled={!address}
            >
              {buttonContent}
            </Button>

            <p className="text-center text-sm text-gray-200">
              By signing, you confirm ownership of this wallet address
            </p>
          </form>
        </CardBody>
      </Card>

      <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircleIcon size={20} className="mt-0.5 text-yellow-400" />

            <div>
              <h4 className="mb-2 font-medium text-yellow-400">Need Help?</h4>
              {helpText}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default React.memo(WalletSigningFlow);
