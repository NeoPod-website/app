"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import OTPMain from "./OTPMain";
import LoginMain from "./LoginMain";
import WalletSignMain from "./WalletSignMain";

import {
  setUserState,
  setLoginMethod,
  setEmail as setReduxEmail,
} from "@/redux/slice/userSlice";

const AuthMain = ({ inviteCode }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      addToast({
        title: "Please enter an email address",
        color: "default",
      });
      return;
    }

    if (!isValidEmail(email)) {
      addToast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        color: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/passwordless/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setTimeLeft(60);
      setShowOTPForm(true);
    } catch (err) {
      addToast({
        title: err.message || "Failed to send verification code",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      addToast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        color: "warning",
      });

      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/passwordless/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      addToast({
        title: "OTP Verified",
        description: "Your email has been verified.",
        color: "success",
      });

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/email/${email}`,
        );

        if (res.ok) {
          const loginRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },

              body: JSON.stringify({ email }),
              credentials: "include",
            },
          );

          router.push("/quests");

          const { token, data: loginData } = await loginRes.json();

          dispatch(
            setUserState({
              email,
              role: loginData.user.isAdmin ? "admin" : "ambassador",
              user: loginData.user,
              username: loginData.user.username,
              login_method: loginData.user.login_method,
              address: loginData.user.wallet_address,
            }),
          );

          localStorage.setItem("neo-jwt", token);

          setOtp("");
          setEmail("");
        } else {
          if (inviteCode) {
            router.push(`/sign-up?inviteCode=${inviteCode}`);
          } else {
            router.push("/sign-up");
          }

          dispatch(setReduxEmail(email));
          dispatch(setLoginMethod("email"));

          setOtp("");
          setEmail("");
        }
      } catch (err) {
        addToast({
          title: err.message || "500: Something went wrong 11",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: err.message || "Failed to send verification code",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return showOTPForm ? (
    <OTPMain
      otp={otp}
      email={email}
      setOtp={setOtp}
      timeLeft={timeLeft}
      isLoading={isLoading}
      setTimeLeft={setTimeLeft}
      setShowOTPForm={setShowOTPForm}
      handleOTPSubmit={handleOTPSubmit}
    />
  ) : showWalletForm ? (
    <WalletSignMain
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      setShowWalletForm={setShowWalletForm}
    />
  ) : (
    <LoginMain
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
      isValidEmail={isValidEmail}
      setShowWalletForm={setShowWalletForm}
      handleEmailSubmit={handleEmailSubmit}
    />
  );
};

export default AuthMain;
