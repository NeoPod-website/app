"use client";

import React from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { ArrowRight, User2Icon } from "lucide-react";
import { addToast, Button, Input } from "@heroui/react";

import AuthMainContainer from "./AuthMainContainer";

import CopyToClipboard from "@/components/ui/CopyToClipboard";

import { useEthersSigner } from "@/wagmi/ethersSigner";

const WalletSignMain = ({ isLoading, setIsLoading }) => {
  const router = useRouter();
  const { status, address } = useAccount();

  const signer = useEthersSigner();

  const handleSignMessage = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const requestRed = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/request-sign-message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet_address: address }),
        },
      );

      if (!requestRed.ok) {
        throw new Error("Failed to fetch sign message");
      }

      const messageData = await requestRed.json();
      console.log(messageData);
      const message = messageData?.data?.message;

      // 2. Sign the message
      const signature = await signer.signMessage(message);

      const nonce = message.split("Nonce: ")[1];

      // // 3. Verify signature with backend
      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-signature`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet_address: address,
            signature,
            nonce,
          }),
        },
      );

      if (!verifyRes.ok) {
        throw new Error("Signature verification failed");
      }

      try {
        const existRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/wallet_address/${address}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (existRes.ok) {
          const loginRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                wallet_address: address,
                login_method: "wallet",
              }),
              credentials: "include",
            },
          );

          router.push("/");

          const userData = await loginRes.json();

          localStorage.setItem("token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData.data.user));
        } else if (existRes.status === 404) {
          router.push("/sign-up");

          return;
        } else {
          throw new Error("Failed to check wallet");
        }
      } catch (err) {
        addToast({
          title: "500: Server Error",
          description: err.message || "Something went wrong",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: err.message || "Wallet login failed",
        color: "danger",
      });

      console.error("❌ Wallet login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthMainContainer
      title="Sign Message to Verify Wallet Ownership"
      description="This proves you control the wallet without sharing your private key. It's a one-time, gasless signature that helps us authenticate you safely."
      margin="space-y-4"
    >
      <form onSubmit={handleSignMessage} className="space-y-5">
        <div className="flex gap-3">
          <div className="h-fit w-fit rounded-full border border-gray-300 bg-dark p-2.5">
            <User2Icon size={20} />
          </div>

          <Input
            label="Your Wallet Address"
            type="test"
            variant="bordered"
            readOnly
            value={address || "0x00000000000000000000000000000000000000"}
            className="bg-dark"
            classNames={{
              inputWrapper:
                "border-gray-300 focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            }}
            endContent={
              <CopyToClipboard
                text={address || "0x00000000000000000000000000000000000000"}
                size={20}
              />
            }
          />
        </div>

        <Button
          type="submit"
          className="h-12 bg-white p-4 text-base font-semibold text-black"
          fullWidth
          isLoading={isLoading}
          endContent={<ArrowRight size={16} />}
          isDisabled={status !== "connected"}
        >
          Sign Message
        </Button>
      </form>
    </AuthMainContainer>
  );
};

export default WalletSignMain;
