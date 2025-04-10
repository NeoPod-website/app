"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

import OTPMain from "./OTPMain";
import LoginMain from "./LoginMain";

const AuthMain = () => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);

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
    setError("");

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

      setError(err.message);
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
    setError("");

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

      router.push("/");
    } catch (err) {
      setError(err.message);

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
  ) : (
    <LoginMain
      email={email}
      setEmail={setEmail}
      isLoading={isLoading}
      isValidEmail={isValidEmail}
      handleEmailSubmit={handleEmailSubmit}
    />
  );
};

export default AuthMain;
